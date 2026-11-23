#!/usr/bin/env python3
"""Prepare and publish plain-English UK Parliament committee sessions.

The pipeline is fully automatic:

1. ``sync`` discovers and normalises new oral-evidence transcripts.
2. ``condense`` sends each new transcript to a chat-completions API
   (GPT-6 Luna by default) and saves the
   dialogue it returns as condensation.json in the packet directory.
3. ``validate`` checks the JSON and ``build`` turns it into a site session.

A packet can still be condensed by hand (upload CHATGPT_PROMPT.md and
transcript.txt to any chatbot and save the JSON answer); ``condense`` skips
packets that already have a valid condensation.

Only the Python standard library is required.
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import hashlib
import html
from html.parser import HTMLParser
import io
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
from typing import Any, Iterable
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET
import zipfile


API_BASE = "https://committees-api.parliament.uk/api"
SOURCE_BASE = "https://committees.parliament.uk/oralevidence"
USER_AGENT = "plain-english-committee-viewer/1.0"
CONDENSE_API_URL = os.environ.get(
    "CONDENSE_API_URL", "https://api.openai.com/v1/chat/completions"
)
CONDENSE_MODEL = os.environ.get("CONDENSE_MODEL", "gpt-6-sol")
OPENAI_API_BASE = os.environ.get("CONDENSE_API_BASE", "https://api.openai.com/v1")
PROMPT_TEMPLATE = Path(__file__).with_name("condense_prompt.md")
ROOT = Path(__file__).resolve().parents[1]

INDEX_START = "    <!-- GENERATED_SESSIONS_START -->"
INDEX_END = "    <!-- GENERATED_SESSIONS_END -->"

# The original committee-room illustration (and its calibrated seat positions)
# is reused for every automatically generated session.
GENERIC_ROOM = {
    "image": "Energy Resilience/committee_room_4.png",
    "width": 2788,
    "height": 1536,
    "seats": {
        "chair": {"x": 66, "y": 29.5},
        "member1": {"x": 25, "y": 36.5},
        "member2": {"x": 79, "y": 30},
        "member3": {"x": 20.5, "y": 41.5},
        "member4": {"x": 36, "y": 37.5},
        "member5": {"x": 89.5, "y": 46.5},
        "member6": {"x": 87.5, "y": 40},
        "witness1": {"x": 30, "y": 57},
        "witness2": {"x": 45.5, "y": 62},
        "witness3": {"x": 15, "y": 51.5},
    },
}

MEMBER_SEATS = [f"member{i}" for i in range(1, 7)]
WITNESS_SEATS = [f"witness{i}" for i in range(1, 4)]

PALETTE = [
    ("#315f72", "#d7edf0"),
    ("#6f5c91", "#ebe2f5"),
    ("#4c7b5d", "#dff0dd"),
    ("#9b543e", "#f2e0d7"),
    ("#287079", "#d9eeee"),
    ("#b17b2e", "#f5e8c4"),
    ("#8a5a78", "#f0e2ec"),
    ("#5c676d", "#e5e8e8"),
]


class PipelineError(RuntimeError):
    """A user-actionable pipeline failure."""


class BillingError(PipelineError):
    """The model API refused a request because the account is out of funds."""


# OpenAI error codes meaning "no money left to spend", from
# https://developers.openai.com/api/docs/guides/error-codes
BILLING_ERROR_CODES = {
    "billing_hard_limit_reached",
    "credit_balance_exhausted",
    "insufficient_quota",
    "organization_spend_limit_exceeded",
    "project_spend_limit_exceeded",
}
BILLING_PHRASES = ("quota", "credit", "billing", "spend limit", "hard limit")


def is_billing_error(status: int | None, codes: set[str], message: str) -> bool:
    """True when the API refused because the account has no money (or budget) left."""
    lowered = message.lower()
    return status == 402 or bool(codes & BILLING_ERROR_CODES) or any(p in lowered for p in BILLING_PHRASES)
BILLING_ALERT_MARKER = "condense-billing-alert"
BILLING_ALERT_TITLE = "Model API credit has run out — condensation is paused"


class TranscriptParser(HTMLParser):
    """Turn Parliament's span-heavy generated HTML into readable paragraphs."""

    BLOCKS = {
        "p",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "tr",
        "blockquote",
    }
    SKIP = {"script", "style", "svg"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._pieces: list[str] = []
        self.lines: list[str] = []
        self._skip_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        if tag in self.SKIP:
            self._skip_depth += 1
        if tag in self.BLOCKS and self._pieces:
            self._flush()
        if tag == "br" and self._pieces:
            self._pieces.append("\n")

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag in self.SKIP and self._skip_depth:
            self._skip_depth -= 1
            return
        if tag in self.BLOCKS:
            self._flush()

    def handle_data(self, data: str) -> None:
        if not self._skip_depth:
            self._pieces.append(data)

    def _flush(self) -> None:
        raw = html.unescape("".join(self._pieces))
        raw = raw.replace("\xa0", " ").replace("\u200b", "")
        raw = re.sub(r"[ \t\r\f\v]+", " ", raw)
        raw = re.sub(r" *\n *", "\n", raw)
        text = raw.strip()
        if text and (not self.lines or self.lines[-1] != text):
            self.lines.append(text)
        self._pieces.clear()

    def result(self) -> str:
        self._flush()
        return "\n\n".join(self.lines).strip() + "\n"


def read_json(path: Path, default: Any = None) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise PipelineError(f"Could not read JSON from {path}: {exc}") from exc


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def write_json(path: Path, value: Any) -> None:
    write_text(path, json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def request_json(url: str, attempts: int = 3) -> dict[str, Any]:
    request = Request(url, headers={"Accept": "application/json", "User-Agent": USER_AGENT})
    last_error: Exception | None = None
    for attempt in range(attempts):
        try:
            with urlopen(request, timeout=45) as response:
                return json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
            if attempt + 1 < attempts:
                time.sleep(1 + attempt)
    raise PipelineError(f"Could not fetch {url}: {last_error}")


def iso_date(value: str | None) -> str:
    if not value:
        return ""
    return value[:10]


def friendly_date(value: str | None) -> str:
    raw = iso_date(value)
    if not raw:
        return ""
    try:
        parsed = dt.date.fromisoformat(raw)
    except ValueError:
        return raw
    return f"{parsed.day} {parsed.strftime('%B %Y')}"


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def decode_document_data(document: dict[str, Any]) -> bytes:
    encoded = document.get("data")
    if not isinstance(encoded, str) or not encoded:
        raise PipelineError("The Parliament document response did not contain base64 data.")
    try:
        return base64.b64decode(encoded, validate=True)
    except ValueError as exc:
        raise PipelineError(f"Could not decode the Parliament document: {exc}") from exc


def normalise_html_document(document: dict[str, Any]) -> str:
    try:
        source_html = decode_document_data(document).decode("utf-8")
    except UnicodeDecodeError as exc:
        raise PipelineError(f"Could not decode the Parliament HTML as UTF-8: {exc}") from exc
    parser = TranscriptParser()
    parser.feed(source_html)
    transcript = parser.result()
    if len(transcript) < 500:
        raise PipelineError("The normalised transcript was unexpectedly short.")
    return transcript


def normalise_docx_document(document: dict[str, Any]) -> str:
    try:
        archive = zipfile.ZipFile(io.BytesIO(decode_document_data(document)))
        xml_source = archive.read("word/document.xml")
    except (zipfile.BadZipFile, KeyError) as exc:
        raise PipelineError(f"Could not read the Parliament Word document: {exc}") from exc
    try:
        root = ET.fromstring(xml_source)
    except ET.ParseError as exc:
        raise PipelineError(f"Could not parse the Parliament Word document: {exc}") from exc

    namespace = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    paragraphs: list[str] = []
    for paragraph in root.iter(namespace + "p"):
        pieces: list[str] = []
        for node in paragraph.iter():
            if node.tag == namespace + "t" and node.text:
                pieces.append(node.text)
            elif node.tag == namespace + "tab":
                pieces.append(" ")
            elif node.tag in {namespace + "br", namespace + "cr"}:
                pieces.append("\n")
        text = re.sub(r"[ \t\r\f\v]+", " ", "".join(pieces))
        text = re.sub(r" *\n *", "\n", text).strip()
        if text and (not paragraphs or paragraphs[-1] != text):
            paragraphs.append(text)
    transcript = "\n\n".join(paragraphs).strip() + "\n"
    if len(transcript) < 500:
        raise PipelineError("The normalised Word transcript was unexpectedly short.")
    return transcript


def normalise_document(document: dict[str, Any]) -> str:
    file_format = str(document.get("fileDataFormat") or "").casefold()
    file_name = str(document.get("fileName") or "").casefold()
    if file_format == "html" or file_name.endswith((".html", ".htm")):
        return normalise_html_document(document)
    if file_format == "originalformat" and file_name.endswith(".docx"):
        return normalise_docx_document(document)
    raise PipelineError(
        f"Unsupported Parliament document format: "
        f"{document.get('fileDataFormat') or document.get('fileName') or 'unknown'}."
    )


def transcript_status(transcript: str) -> str:
    opening = transcript[:4000].lower()
    if "uncorrected oral evidence" in opening or "uncorrected transcript" in opening:
        return "uncorrected"
    if "corrected oral evidence" in opening or "corrected transcript" in opening:
        return "corrected"
    return "published"


def speaker_candidates(transcript: str) -> list[str]:
    found: list[str] = []
    seen: set[str] = set()
    pattern = re.compile(
        r"^(?:Q\d+(?:\s*[–—-]\s*\d+)?\s+)?"
        r"([A-Z][^:\n]{1,78}|The Chair|Chair):\s+\S"
    )
    for paragraph in transcript.split("\n\n"):
        line = " ".join(paragraph.split())
        match = pattern.match(line)
        if not match:
            continue
        name = match.group(1).strip()
        lowered = name.casefold()
        if lowered in {"questions", "witnesses", "members present"} or lowered.endswith(
            "oral evidence"
        ):
            continue
        key = lowered
        if key not in seen:
            seen.add(key)
            found.append(name)
    return found


def witness_metadata(item: dict[str, Any]) -> list[dict[str, str]]:
    result: list[dict[str, str]] = []
    for witness in item.get("witnesses") or []:
        organisations = witness.get("organisations") or []
        roles = [part.get("role", "").strip() for part in organisations if part.get("role")]
        names = [part.get("name", "").strip() for part in organisations if part.get("name")]
        result.append(
            {
                "name": str(witness.get("name") or "Name not supplied").strip(),
                "role": "; ".join(roles),
                "organisation": "; ".join(names),
            }
        )
    return result


def make_metadata(item: dict[str, Any], transcript: str) -> dict[str, Any]:
    evidence_id = int(item["id"])
    businesses = item.get("committeeBusinesses") or []
    committees = item.get("committees") or []
    titles = [entry.get("title", "").strip() for entry in businesses if entry.get("title")]
    committee_names = [
        entry.get("name", "").strip() for entry in committees if entry.get("name")
    ]
    document = item.get("document") or {}
    return {
        "schema_version": 1,
        "parliament_oral_evidence_id": evidence_id,
        "activity_id": item.get("activityId"),
        "document_id": document.get("documentId"),
        "meeting_date": iso_date(item.get("meetingDate")),
        "meeting_date_display": friendly_date(item.get("meetingDate")),
        "publication_date": item.get("publicationDate"),
        "title": " / ".join(titles) or f"Oral evidence {evidence_id}",
        "committee": " / ".join(committee_names) or "Parliamentary committee",
        "committees": [
            {
                "id": entry.get("id"),
                "name": entry.get("name"),
                "house": entry.get("house"),
            }
            for entry in committees
        ],
        "businesses": [
            {
                "id": entry.get("id"),
                "title": entry.get("title"),
                "type": (entry.get("type") or {}).get("name"),
            }
            for entry in businesses
        ],
        "witnesses": witness_metadata(item),
        "speaker_candidates": speaker_candidates(transcript),
        "transcript_status": transcript_status(transcript),
        "source_url": f"{SOURCE_BASE}/{evidence_id}/html/",
        "api_url": f"{API_BASE}/OralEvidence/{evidence_id}",
        "source_sha256": sha256_text(transcript),
        "licence": "Open Parliament Licence v3.0",
        "packet_status": "awaiting-condensation",
    }


def prompt_for(metadata: dict[str, Any]) -> str:
    """The condensation prompt: scripts/condense_prompt.md with this session's details."""
    witnesses = metadata.get("witnesses") or []
    candidates = metadata.get("speaker_candidates") or []
    witness_lines = "\n".join(
        f"* {entry['name']}: {entry['role']}"
        + (f", {entry['organisation']}" if entry.get("organisation") else "")
        for entry in witnesses
    )
    candidate_lines = "\n".join(f"* {name}" for name in candidates)

    # Parliament's own transcript formatting sometimes turns a line of speech into
    # a "speaker". Name those explicitly rather than hoping the model spots them.
    strays = [name for name in candidates if len(name.split()) > 6]
    stray_note = (
        "\n" + "\n".join(f"`{name}` is not a speaker and must be ignored." for name in strays) + "\n"
        if strays
        else ""
    )
    official = "\n".join(
        [
            f"* Parliament oral-evidence ID: {metadata['parliament_oral_evidence_id']}",
            f"* Required source hash: `{metadata['source_sha256']}`",
            f"* Committee: {metadata['committee']}",
            f"* Subject: {metadata['title']}",
            f"* Meeting date: {metadata.get('meeting_date_display') or 'see the transcript heading'}",
            f"* Transcript status: {metadata.get('transcript_status', 'published')}",
            f"* Source: {metadata['source_url']}",
        ]
    )
    replacements = {
        "{{OFFICIAL_METADATA}}": official,
        "{{WITNESS_METADATA}}": witness_lines
        or "* No structured witness names were supplied by the API; use the transcript header.",
        "{{SPEAKER_LABELS}}": candidate_lines
        or "* None detected automatically; inspect the transcript carefully.",
        "{{STRAY_NOTE}}": stray_note,
        "{{SOURCE_ID}}": str(metadata["parliament_oral_evidence_id"]),
        "{{SOURCE_SHA256}}": str(metadata["source_sha256"]),
        "{{MEETING_DATE}}": metadata.get("meeting_date_display") or "<meeting date from the transcript>",
    }
    text = PROMPT_TEMPLATE.read_text(encoding="utf-8")
    for placeholder, value in replacements.items():
        text = text.replace(placeholder, value)
    return text


def condensation_template(metadata: dict[str, Any]) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "source_id": metadata["parliament_oral_evidence_id"],
        "source_sha256": metadata["source_sha256"],
        "title": "",
        "label": f"{metadata['meeting_date_display']} · ",
        "summary": "",
        "speakers": [],
        "chapters": [],
    }


def fetch_oral_evidence(
    start: dt.date, end: dt.date, max_items: int | None = None
) -> list[dict[str, Any]]:
    take = 50
    skip = 0
    items: list[dict[str, Any]] = []
    while True:
        params = urlencode(
            {
                "StartDate": start.isoformat(),
                "EndDate": end.isoformat(),
                "ShowOnWebsiteOnly": "true",
                "Skip": skip,
                "Take": take,
            }
        )
        payload = request_json(f"{API_BASE}/OralEvidence?{params}")
        page = payload.get("items") or []
        items.extend(page)
        if max_items is not None and len(items) >= max_items:
            items = items[:max_items]
            break
        total = int(payload.get("totalResults") or len(items))
        if not page or len(items) >= total:
            break
        skip += len(page)
    return sorted(
        items,
        key=lambda entry: (entry.get("publicationDate") or "", int(entry.get("id") or 0)),
    )


def preferred_document_format(item: dict[str, Any]) -> str:
    formats = {
        str(entry.get("fileDataFormat") or "")
        for entry in (item.get("document") or {}).get("files") or []
    }
    if "Html" in formats:
        return "Html"
    if "OriginalFormat" in formats:
        return "OriginalFormat"
    raise PipelineError("This oral-evidence item has neither HTML nor Word source files.")


def fetch_document(evidence_id: int, file_format: str) -> dict[str, Any]:
    return request_json(
        f"{API_BASE}/OralEvidence/{evidence_id}/Document/{quote(file_format, safe='')}"
    )


def write_packet(root: Path, metadata: dict[str, Any], transcript: str) -> Path:
    packet = root / "inbox" / str(metadata["parliament_oral_evidence_id"])
    existing = read_json(packet / "metadata.json", {})
    condensation_exists = (packet / "condensation.json").exists()
    old_hash = existing.get("source_sha256") if isinstance(existing, dict) else None
    if old_hash and old_hash != metadata["source_sha256"]:
        metadata["packet_status"] = (
            "source-updated-needs-review" if condensation_exists else "source-updated"
        )
    write_json(packet / "metadata.json", metadata)
    write_text(packet / "transcript.txt", transcript)
    write_text(packet / "CHATGPT_PROMPT.md", prompt_for(metadata))
    write_json(packet / "condensation.template.json", condensation_template(metadata))
    return packet


def sync(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    today = dt.date.today()
    start = today - dt.timedelta(days=args.lookback_days)
    items = fetch_oral_evidence(start, today, args.max_items)
    discoveries: list[dict[str, Any]] = []
    failures: list[dict[str, Any]] = []
    unchanged = 0

    archived = archived_ids(root)
    for item in items:
        evidence_id = int(item["id"])
        if str(evidence_id) in archived:
            unchanged += 1
            continue
        packet = root / "inbox" / str(evidence_id)
        existing = read_json(packet / "metadata.json", {})
        try:
            file_format = preferred_document_format(item)
            document = fetch_document(evidence_id, file_format)
            transcript = normalise_document(document)
        except PipelineError as exc:
            failures.append({"id": evidence_id, "error": str(exc)})
            continue
        metadata = make_metadata(item, transcript)
        metadata["source_document_format"] = document.get("fileDataFormat")
        change = "new"
        if isinstance(existing, dict) and existing:
            if existing.get("source_sha256") == metadata["source_sha256"]:
                condensation = read_json(packet / "condensation.json", {})
                if (
                    isinstance(condensation, dict)
                    and condensation.get("source_sha256") == metadata["source_sha256"]
                ):
                    metadata["packet_status"] = "approved"
                else:
                    metadata["packet_status"] = existing.get(
                        "packet_status", "awaiting-condensation"
                    )
                if not args.dry_run:
                    write_packet(root, metadata, transcript)
                unchanged += 1
                continue
            change = "updated"

        discoveries.append(
            {
                "id": evidence_id,
                "change": change,
                "title": metadata["title"],
                "committee": metadata["committee"],
                "source_sha256": metadata["source_sha256"],
            }
        )
        if not args.dry_run:
            write_packet(root, metadata, transcript)

    report = {
        "checked_from": start.isoformat(),
        "checked_to": today.isoformat(),
        "api_items": len(items),
        "unchanged": unchanged,
        "discoveries": discoveries,
        "failures": failures,
    }
    if args.report:
        write_json(Path(args.report), report)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


def require_string(
    value: Any, field: str, errors: list[str], minimum: int = 1, maximum: int = 10_000
) -> str:
    if not isinstance(value, str):
        errors.append(f"{field} must be a string.")
        return ""
    text = value.strip()
    if len(text) < minimum:
        errors.append(f"{field} must contain at least {minimum} characters.")
    if len(text) > maximum:
        errors.append(f"{field} must contain no more than {maximum} characters.")
    return text


_QUOTE_FOLD = str.maketrans({
    "\u2018": "'", "\u2019": "'", "\u201b": "'", "\u2032": "'",
    "\u201c": '"', "\u201d": '"', "\u201f": '"', "\u2033": '"',
    "\u2010": "-", "\u2011": "-", "\u2012": "-", "\u2013": "-", "\u2014": "-",
    "\u2015": "-", "\u2212": "-", "\u00a0": " ", "\u2009": " ", "\u202f": " ",
})


def evidence_source_text(transcript: str) -> str:
    """The transcript as shown beside the dialogue; evidence offsets index into it."""
    text = transcript.lstrip("\ufeff").replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def _fold(text: str) -> tuple[str, list[int]]:
    """Lower-case, unify quotes/dashes and collapse whitespace, keeping an index map."""
    out: list[str] = []
    index: list[int] = []
    previous_space = True
    for position, char in enumerate(text.translate(_QUOTE_FOLD)):
        if char.isspace():
            # Spacing around dashes varies ("word—word" vs "word - word").
            if previous_space or (out and out[-1] == "-"):
                continue
            out.append(" ")
            index.append(position)
            previous_space = True
            continue
        if char == "-" and out and out[-1] == " ":
            out.pop()
            index.pop()
        out.append(char.lower())
        index.append(position)
        previous_space = False
    return "".join(out), index


def locate_quote(
    quote: str, folded_source: str, index: list[int], after: int = 0
) -> tuple[int, int] | None:
    """Find a quote in the transcript, tolerating curly quotes, dashes, spacing and
    ellipses. Returns character offsets into the unfolded source, or None."""
    folded_quote, _ = _fold(quote)
    folded_quote = folded_quote.strip().strip("\"'").strip()
    pieces = [
        piece.strip(" .,;:")
        for piece in re.split(r"\.\.\.|\u2026|\[[^\]]*\]", folded_quote)
    ]
    pieces = [piece for piece in pieces if len(piece) >= 4]
    if not pieces:
        return None

    def find(start_at: int) -> tuple[int, int] | None:
        cursor = start_at
        first = None
        for piece in pieces:
            at = folded_source.find(piece, cursor)
            if at < 0 or (first is not None and at - cursor > 600):
                return None
            first = at if first is None else first
            cursor = at + len(piece)
        assert first is not None
        return first, cursor

    span = find(after) or find(0)
    if span is None:
        return None
    start, end = span
    return index[start], index[end - 1] + 1


def match_evidence(
    condensation: dict[str, Any], transcript: str
) -> tuple[list[dict[str, Any]], list[str]]:
    """Map every turn's evidence quotes to transcript offsets for the viewer."""
    source = evidence_source_text(transcript)
    folded, index = _fold(source)
    turns: list[dict[str, Any]] = []
    missing: list[str] = []
    for chapter_index, chapter in enumerate(condensation.get("chapters") or []):
        for turn_index, turn in enumerate(chapter.get("turns") or []):
            ranges: list[list[int]] = []
            not_found: list[str] = []
            for entry in turn.get("evidence") or []:
                quote_text = str(entry.get("quote") or "")
                span = locate_quote(quote_text, folded, index)
                if span is None:
                    not_found.append(quote_text)
                    missing.append(
                        f"chapters[{chapter_index}].turns[{turn_index}] evidence not found "
                        f"in the transcript: {quote_text[:70]!r}"
                    )
                else:
                    ranges.append(list(span))
            ranges.sort()
            turns.append({"key": turn["text"][:60], "ranges": ranges, "missing": not_found})
    return turns, missing


def validate_packet(packet: Path) -> tuple[list[str], list[str], dict[str, Any] | None]:
    errors: list[str] = []
    warnings: list[str] = []
    metadata = read_json(packet / "metadata.json")
    if not isinstance(metadata, dict):
        return (["metadata.json is missing or invalid."], warnings, None)
    condensation = read_json(packet / "condensation.json")
    if not isinstance(condensation, dict):
        return (["condensation.json is missing or invalid."], warnings, None)

    if condensation.get("schema_version") != 1:
        errors.append("schema_version must be 1.")
    if condensation.get("source_id") != metadata.get("parliament_oral_evidence_id"):
        errors.append("source_id does not match metadata.json.")
    if condensation.get("source_sha256") != metadata.get("source_sha256"):
        errors.append(
            "source_sha256 does not match the current transcript. Regenerate or review "
            "the condensation using the latest CHATGPT_PROMPT.md."
        )

    require_string(condensation.get("title"), "title", errors, 5, 140)
    require_string(condensation.get("label"), "label", errors, 5, 100)
    require_string(condensation.get("summary"), "summary", errors, 80, 1_500)

    speakers = condensation.get("speakers")
    speaker_map: dict[str, dict[str, Any]] = {}
    if not isinstance(speakers, list) or not speakers:
        errors.append("speakers must be a non-empty array.")
        speakers = []
    for index, speaker in enumerate(speakers):
        prefix = f"speakers[{index}]"
        if not isinstance(speaker, dict):
            errors.append(f"{prefix} must be an object.")
            continue
        label = require_string(speaker.get("label"), f"{prefix}.label", errors, 1, 80)
        name = require_string(speaker.get("name"), f"{prefix}.name", errors, 1, 100)
        # Guard against the prompt's own placeholders, or a line of dialogue,
        # being emitted as a speaker's name.
        if name:
            lowered_name = name.casefold()
            if "<" in name or "real name" in lowered_name or "actual name" in lowered_name:
                errors.append(
                    f"{prefix}.name is a template placeholder, not a name: {name!r}."
                )
            elif len(name.split()) > 6:
                errors.append(
                    f"{prefix}.name looks like a sentence, not a name: {name!r}."
                )
        require_string(speaker.get("role"), f"{prefix}.role", errors, 2, 240)
        if speaker.get("kind") not in {"chair", "member", "witness"}:
            errors.append(f"{prefix}.kind must be chair, member, or witness.")
        if label in speaker_map:
            errors.append(f"Speaker label {label!r} is duplicated.")
        elif label:
            speaker_map[label] = speaker
        if name and name != "Committee Member":
            transcript = (packet / "transcript.txt").read_text(encoding="utf-8")
            if name.casefold() not in transcript.casefold():
                warnings.append(
                    f"Speaker name {name!r} was not found verbatim in transcript.txt; "
                    "check the spelling and attribution."
                )

    official_witnesses = [
        str(entry.get("name") or "").casefold()
        for entry in metadata.get("witnesses") or []
        if entry.get("name") and entry["name"] != "Name not supplied"
    ]
    if official_witnesses:
        for speaker in speakers:
            if not isinstance(speaker, dict):
                continue
            name = str(speaker.get("name") or "").casefold()
            listed = bool(name) and any(
                name in witness or witness in name for witness in official_witnesses
            )
            if speaker.get("kind") == "witness" and not listed:
                warnings.append(
                    f"{speaker.get('name')!r} is declared a witness but is not in "
                    "the official witness list."
                )
            elif speaker.get("kind") == "member" and listed:
                warnings.append(
                    f"{speaker.get('name')!r} is an official witness but is "
                    "declared a member."
                )

    # The glossary is optional: sessions condensed before it existed simply fall
    # back to the viewer's built-in parliamentary terms.
    glossary = condensation.get("glossary")
    if glossary is not None:
        if not isinstance(glossary, list):
            errors.append("glossary must be an array when present.")
        elif len(glossary) > 25:
            errors.append("glossary must contain no more than 25 entries.")
        else:
            seen_terms: set[str] = set()
            for index, entry in enumerate(glossary):
                entry_prefix = f"glossary[{index}]"
                if not isinstance(entry, dict):
                    errors.append(f"{entry_prefix} must be an object.")
                    continue
                term = require_string(entry.get("term"), f"{entry_prefix}.term", errors, 1, 80)
                require_string(
                    entry.get("definition"), f"{entry_prefix}.definition", errors, 15, 300
                )
                if term and term.casefold() in seen_terms:
                    errors.append(f"{entry_prefix}.term {term!r} is duplicated.")
                elif term:
                    seen_terms.add(term.casefold())

    chapters = condensation.get("chapters")
    if not isinstance(chapters, list) or not chapters:
        errors.append("chapters must be a non-empty array.")
        chapters = []
    if len(chapters) > 12:
        errors.append("chapters must contain no more than 12 chapters.")

    turn_count = 0
    has_evidence = False
    used_speakers: set[str] = set()
    for chapter_index, chapter in enumerate(chapters):
        prefix = f"chapters[{chapter_index}]"
        if not isinstance(chapter, dict):
            errors.append(f"{prefix} must be an object.")
            continue
        require_string(chapter.get("title"), f"{prefix}.title", errors, 2, 100)
        require_string(chapter.get("takeaway"), f"{prefix}.takeaway", errors, 15, 300)
        turns = chapter.get("turns")
        if not isinstance(turns, list) or not turns:
            errors.append(f"{prefix}.turns must be a non-empty array.")
            continue
        for turn_index, turn in enumerate(turns):
            turn_prefix = f"{prefix}.turns[{turn_index}]"
            turn_count += 1
            if not isinstance(turn, dict):
                errors.append(f"{turn_prefix} must be an object.")
                continue
            speaker = require_string(
                turn.get("speaker"), f"{turn_prefix}.speaker", errors, 1, 80
            )
            text = require_string(turn.get("text"), f"{turn_prefix}.text", errors, 10, 900)
            if speaker and speaker not in speaker_map:
                errors.append(f"{turn_prefix} uses undeclared speaker {speaker!r}.")
            if speaker:
                used_speakers.add(speaker)
            if "\n" in text:
                errors.append(f"{turn_prefix}.text must be one paragraph.")
            if "**" in text:
                warnings.append(f"{turn_prefix}.text contains Markdown bold markers.")
            evidence = turn.get("evidence")
            if evidence is not None:
                has_evidence = True
                if not isinstance(evidence, list) or not evidence:
                    errors.append(f"{turn_prefix}.evidence must be a non-empty array.")
                else:
                    for evidence_index, entry in enumerate(evidence):
                        entry_prefix = f"{turn_prefix}.evidence[{evidence_index}]"
                        if not isinstance(entry, dict):
                            errors.append(f"{entry_prefix} must be an object.")
                            continue
                        require_string(entry.get("quote"), f"{entry_prefix}.quote", errors, 3, 6000)
                        source_turn = entry.get("source_turn")
                        if source_turn is not None and (
                            not isinstance(source_turn, int) or source_turn < 1
                        ):
                            errors.append(f"{entry_prefix}.source_turn must be a positive integer.")

    if has_evidence and not errors and (packet / "transcript.txt").exists():
        _, missing = match_evidence(
            condensation, (packet / "transcript.txt").read_text(encoding="utf-8")
        )
        warnings.extend(missing)

    if turn_count < 6:
        errors.append("The condensation must contain at least 6 dialogue turns.")
    if turn_count > 180:
        errors.append("The condensation must contain no more than 180 dialogue turns.")
    unused = sorted(set(speaker_map) - used_speakers)
    if unused:
        warnings.append("Declared but unused speakers: " + ", ".join(unused))
    return errors, warnings, condensation


def archived_ids(root: Path) -> set[str]:
    """Sessions taken off the website. Their packets stay in inbox/ untouched, but
    sync, condense, build and issues all leave them alone (see archive.json)."""
    data = read_json(root / "archive.json", {})
    return {str(value) for value in (data.get("archived") or [])} if isinstance(data, dict) else set()


def iter_packets(root: Path, include_archived: bool = False) -> Iterable[Path]:
    inbox = root / "inbox"
    if not inbox.exists():
        return []
    hidden = set() if include_archived else archived_ids(root)
    return sorted(
        (
            path
            for path in inbox.iterdir()
            if path.is_dir()
            and path.name.isdigit()
            and path.name not in hidden
            and (path / "metadata.json").exists()
        ),
        key=lambda path: int(path.name),
    )


def validate_command(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    packets = (
        [root / "inbox" / str(args.id)]
        if args.id is not None
        else [packet for packet in iter_packets(root) if (packet / "condensation.json").exists()]
    )
    if not packets:
        print("No condensation.json files found.")
        return 0
    failed = False
    for packet in packets:
        errors, warnings, _ = validate_packet(packet)
        print(f"{packet.relative_to(root)}:")
        for warning in warnings:
            print(f"  warning: {warning}")
        for error in errors:
            print(f"  error: {error}")
        if not errors and not warnings:
            print("  valid")
        failed = failed or bool(errors)
    return 1 if failed else 0


def condense_payload(messages: list[dict[str, str]]) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "model": CONDENSE_MODEL,
        "messages": messages,
        "response_format": {"type": "json_object"},
    }
    # OpenAI's reasoning models reject max_tokens; reasoning tokens also count
    # against the limit, hence the generous default (evidence makes answers long).
    limit = int(os.environ.get("CONDENSE_MAX_TOKENS", "48000"))
    if "openai.com" in CONDENSE_API_URL:
        payload["max_completion_tokens"] = limit
    else:
        payload["max_tokens"] = limit
    return payload


def condense_messages(packet: Path) -> list[dict[str, str]]:
    metadata = read_json(packet / "metadata.json")
    transcript = (packet / "transcript.txt").read_text(encoding="utf-8")
    return [
        {"role": "system", "content": prompt_for(metadata)},
        {"role": "user", "content": transcript},
    ]


def chat_completion(api_key: str, messages: list[dict[str, str]]) -> str:
    payload = condense_payload(messages)
    payload["stream"] = False
    body = json.dumps(payload).encode("utf-8")
    request = Request(
        CONDENSE_API_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "User-Agent": USER_AGENT,
        },
    )
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            # Long transcripts can take several minutes to condense.
            with urlopen(request, timeout=1200) as response:
                payload = json.loads(response.read().decode("utf-8"))
            return str(payload["choices"][0]["message"]["content"])
        except HTTPError as exc:
            error_body: dict[str, Any] = {}
            try:
                error_body = json.loads(exc.read().decode("utf-8"))["error"]
                detail = str(error_body["message"])
            except Exception:
                detail = str(exc.reason)
            codes = {str(error_body.get("code") or ""), str(error_body.get("type") or "")}
            if is_billing_error(exc.code, codes, detail):
                raise BillingError(
                    f"The condensation API rejected the request ({exc.code}): {detail} "
                    "Check the account balance."
                ) from exc
            if exc.code in {401, 403}:
                raise PipelineError(
                    f"The condensation API rejected the request ({exc.code}): {detail} "
                    "Check the CONDENSE_API_KEY secret and the account balance."
                ) from exc
            last_error = exc
        except (URLError, TimeoutError, json.JSONDecodeError, KeyError, IndexError) as exc:
            last_error = exc
        if attempt < 2:
            time.sleep(10 * (attempt + 1))
    raise PipelineError(f"The condensation API call failed: {last_error}")


def extract_json_object(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", cleaned)
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start < 0 or end <= start:
        raise PipelineError("The model response did not contain a JSON object.")
    try:
        value = json.loads(cleaned[start : end + 1])
    except json.JSONDecodeError as exc:
        raise PipelineError(f"The model response was not valid JSON: {exc}") from exc
    if not isinstance(value, dict):
        raise PipelineError("The model response was not a JSON object.")
    return value


def needs_condensation(packet: Path) -> bool:
    metadata = read_json(packet / "metadata.json", {})
    condensation = read_json(packet / "condensation.json", {})
    return not (
        isinstance(condensation, dict)
        and condensation.get("source_sha256") == metadata.get("source_sha256")
    )


def condense_packet(packet: Path, api_key: str) -> tuple[list[str], list[str]]:
    """Condense one packet, retrying once with the validator's error list."""
    metadata = read_json(packet / "metadata.json")
    messages = condense_messages(packet)
    target = packet / "condensation.json"
    errors: list[str] = []
    warnings: list[str] = []
    for attempt in range(2):
        answer = chat_completion(api_key, messages)
        try:
            condensation = extract_json_object(answer)
        except PipelineError as exc:
            errors, warnings = [str(exc)], []
        else:
            # The model occasionally mistypes these; they are ours, not its.
            condensation["schema_version"] = 1
            condensation["source_id"] = metadata["parliament_oral_evidence_id"]
            condensation["source_sha256"] = metadata["source_sha256"]
            write_json(target, condensation)
            errors, warnings, _ = validate_packet(packet)
        if not errors:
            return [], warnings
        if attempt == 0:
            messages.extend(
                [
                    {"role": "assistant", "content": answer},
                    {
                        "role": "user",
                        "content": "Your JSON failed validation:\n"
                        + "\n".join(f"- {error}" for error in errors)
                        + "\nReturn the complete corrected JSON object, raw JSON only.",
                    },
                ]
            )
    if target.exists():
        target.unlink()
    return errors, warnings


def condense_command(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    packets = (
        [root / "inbox" / str(args.id)]
        if args.id is not None
        else [packet for packet in iter_packets(root) if needs_condensation(packet)]
    )
    if args.max_packets is not None:
        packets = packets[: args.max_packets]
    if args.dry_run:
        for packet in packets:
            print(f"Would condense {packet.name}")
        print(f"{len(packets)} packet(s) need condensation.")
        return 0
    if not packets:
        print("Every packet already has a current condensation.")
        return 0
    api_key = os.environ.get("CONDENSE_API_KEY", "")
    if not api_key:
        raise PipelineError("Set the CONDENSE_API_KEY environment variable.")
    condensed = 0
    failed = 0
    for packet in packets:
        print(f"Condensing {packet.name} …", flush=True)
        try:
            errors, warnings = condense_packet(packet, api_key)
        except BillingError as exc:
            alert_file = os.environ.get("BILLING_ALERT_FILE")
            if alert_file:
                Path(alert_file).write_text(str(exc), encoding="utf-8")
            raise
        except PipelineError as exc:
            if "CONDENSE_API_KEY" in str(exc) or "account balance" in str(exc):
                raise
            errors, warnings = [str(exc)], []
        for warning in warnings:
            print(f"  warning: {warning}")
        if errors:
            failed += 1
            for error in errors:
                print(f"  error: {error}", file=sys.stderr)
        else:
            condensed += 1
            print("  done")
    print(f"{condensed} condensed, {failed} failed, {len(packets)} attempted.")
    return 1 if failed and not condensed else 0


# ---------- Batch tier: submit tonight, collect on a later run ----------

BATCH_DIR = "batches"
BATCH_TERMINAL = {"completed", "failed", "expired", "cancelled"}
MAX_BATCH_ATTEMPTS = 2


def openai_request(
    api_key: str,
    method: str,
    path: str,
    payload: Any = None,
    raw: bytes | None = None,
    content_type: str | None = None,
) -> bytes:
    headers = {"Authorization": f"Bearer {api_key}", "User-Agent": USER_AGENT}
    data = None
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    elif raw is not None:
        data = raw
        headers["Content-Type"] = content_type or "application/octet-stream"
    request = Request(OPENAI_API_BASE.rstrip("/") + path, data=data, headers=headers, method=method)
    try:
        with urlopen(request, timeout=600) as response:
            return response.read()
    except HTTPError as exc:
        text = exc.read().decode("utf-8", "replace")
        try:
            error = json.loads(text)["error"]
        except Exception:
            error = {"message": text[:300] or str(exc.reason)}
        message = str(error.get("message") or exc.reason)
        codes = {str(error.get("code") or ""), str(error.get("type") or "")}
        if is_billing_error(exc.code, codes, message):
            raise BillingError(
                f"The model API rejected the request ({exc.code}): {message} Check the account balance."
            ) from exc
        raise PipelineError(f"Model API {method} {path} failed ({exc.code}): {message}") from exc


def upload_batch_file(api_key: str, jsonl: str) -> str:
    boundary = "pipeline-" + hashlib.sha256(jsonl.encode("utf-8")).hexdigest()[:24]
    head = (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"purpose\"\r\n\r\nbatch\r\n"
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"condense.jsonl\"\r\n"
        "Content-Type: application/jsonl\r\n\r\n"
    ).encode("utf-8")
    body = head + jsonl.encode("utf-8") + f"\r\n--{boundary}--\r\n".encode("utf-8")
    response = json.loads(
        openai_request(
            api_key, "POST", "/files", raw=body, content_type=f"multipart/form-data; boundary={boundary}"
        )
    )
    return str(response["id"])


def read_batch_state(root: Path) -> tuple[list[dict[str, Any]], dict[str, int]]:
    pending = read_json(root / BATCH_DIR / "pending.json", [])
    attempts = read_json(root / BATCH_DIR / "attempts.json", {})
    return (pending if isinstance(pending, list) else []), (attempts if isinstance(attempts, dict) else {})


def write_batch_state(root: Path, pending: list[dict[str, Any]], attempts: dict[str, int]) -> None:
    write_json(root / BATCH_DIR / "pending.json", pending)
    write_json(root / BATCH_DIR / "attempts.json", dict(sorted(attempts.items())))


def in_flight_ids(root: Path) -> set[str]:
    pending, _ = read_batch_state(root)
    return {str(pid) for entry in pending for item in entry.get("items", []) for pid in item.get("packets", [])}


def build_batch_requests(packets: list[Path]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """One request per distinct transcript: Parliament sometimes publishes the same
    session under two IDs, and both packets then share one condensation."""
    groups: dict[str, list[Path]] = {}
    for packet in packets:
        metadata = read_json(packet / "metadata.json", {})
        groups.setdefault(str(metadata.get("source_sha256") or packet.name), []).append(packet)
    requests: list[dict[str, Any]] = []
    items: list[dict[str, Any]] = []
    for source_sha, members in groups.items():
        lead = members[0]
        requests.append(
            {
                "custom_id": lead.name,
                "method": "POST",
                "url": "/v1/chat/completions",
                "body": condense_payload(condense_messages(lead)),
            }
        )
        items.append(
            {"custom_id": lead.name, "packets": [member.name for member in members], "source_sha256": source_sha}
        )
    return requests, items


def apply_condensation(packet: Path, answer: str) -> tuple[list[str], list[str]]:
    """Write a model answer as the packet's condensation if it validates; otherwise
    keep whatever was there before."""
    metadata = read_json(packet / "metadata.json")
    target = packet / "condensation.json"
    previous = target.read_text(encoding="utf-8") if target.exists() else None
    try:
        condensation = extract_json_object(answer)
    except PipelineError as exc:
        return [str(exc)], []
    condensation["schema_version"] = 1
    condensation["source_id"] = metadata["parliament_oral_evidence_id"]
    condensation["source_sha256"] = metadata["source_sha256"]
    write_json(target, condensation)
    errors, warnings, _ = validate_packet(packet)
    if errors:
        if previous is None:
            target.unlink()
        else:
            write_text(target, previous)
    return errors, warnings


def write_billing_alert(detail: str) -> None:
    alert_file = os.environ.get("BILLING_ALERT_FILE")
    if alert_file:
        Path(alert_file).write_text(detail, encoding="utf-8")


def batch_errors(api_key: str, batch: dict[str, Any]) -> dict[str, str]:
    """Per-request failures, which OpenAI keeps in a separate error file."""
    if not batch.get("error_file_id"):
        return {}
    content = openai_request(api_key, "GET", f"/files/{batch['error_file_id']}/content")
    found: dict[str, str] = {}
    for line in content.decode("utf-8").splitlines():
        if not line.strip():
            continue
        record = json.loads(line)
        body = ((record.get("response") or {}).get("body") or {})
        error = record.get("error") or (body.get("error") if isinstance(body, dict) else None) or {}
        if isinstance(error, dict):
            found[str(record.get("custom_id"))] = f"{error.get('code') or ''}: {error.get('message') or ''}".strip(": ")
        else:
            found[str(record.get("custom_id"))] = str(error)
    return found


def batch_submit_command(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    pending, attempts = read_batch_state(root)
    busy = in_flight_ids(root)
    if args.ids:
        wanted = [value.strip() for value in args.ids.split(",") if value.strip()]
        packets = [root / "inbox" / value for value in wanted if value not in busy]
        missing = [packet.name for packet in packets if not (packet / "metadata.json").exists()]
        if missing:
            raise PipelineError("No packet for: " + ", ".join(missing))
    else:
        packets = [
            packet
            for packet in iter_packets(root)
            if needs_condensation(packet)
            and packet.name not in busy
            and attempts.get(packet.name, 0) < MAX_BATCH_ATTEMPTS
        ]
    requests, items = build_batch_requests(packets)
    if args.dry_run or not requests:
        for item in items:
            print(f"Would submit {item['custom_id']} (packets {', '.join(item['packets'])})")
        print(f"{len(requests)} request(s) for {len(packets)} packet(s) {'would be' if args.dry_run else 'were'} submitted.")
        return 0
    api_key = os.environ.get("CONDENSE_API_KEY", "")
    if not api_key:
        raise PipelineError("Set the CONDENSE_API_KEY environment variable.")
    jsonl = "".join(json.dumps(request, ensure_ascii=False) + "\n" for request in requests)
    try:
        file_id = upload_batch_file(api_key, jsonl)
        batch = json.loads(
            openai_request(
                api_key,
                "POST",
                "/batches",
                payload={
                    "input_file_id": file_id,
                    "endpoint": "/v1/chat/completions",
                    "completion_window": "24h",
                    "metadata": {"purpose": "condense parliamentary transcripts"},
                },
            )
        )
    except BillingError as exc:
        # Don't fail the run: results collected earlier must still be published.
        # The billing-alert step opens an issue from this file instead.
        write_billing_alert(str(exc))
        print(f"Not submitted: {exc}", file=sys.stderr)
        return 0
    pending.append(
        {
            "batch_id": batch["id"],
            "input_file_id": file_id,
            "model": CONDENSE_MODEL,
            "submitted_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
            "items": items,
        }
    )
    for item in items:
        for packet_id in item["packets"]:
            attempts[packet_id] = attempts.get(packet_id, 0) + 1
    write_batch_state(root, pending, attempts)
    print(f"Submitted batch {batch['id']}: {len(requests)} request(s) covering {len(packets)} packet(s).")
    return 0


def batch_collect_command(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    pending, attempts = read_batch_state(root)
    if not pending:
        print("No batches are waiting.")
        return 0
    api_key = os.environ.get("CONDENSE_API_KEY", "")
    if not api_key:
        raise PipelineError("Set the CONDENSE_API_KEY environment variable.")
    still_waiting: list[dict[str, Any]] = []
    written = failed = 0
    for entry in pending:
        batch = json.loads(openai_request(api_key, "GET", f"/batches/{entry['batch_id']}"))
        status = str(batch.get("status"))
        if status not in BATCH_TERMINAL:
            counts = batch.get("request_counts") or {}
            print(f"Batch {entry['batch_id']} is {status} ({counts.get('completed', 0)}/{counts.get('total', '?')} done).")
            still_waiting.append(entry)
            continue
        results: dict[str, dict[str, Any]] = {}
        if batch.get("output_file_id"):
            content = openai_request(api_key, "GET", f"/files/{batch['output_file_id']}/content")
            for line in content.decode("utf-8").splitlines():
                if line.strip():
                    record = json.loads(line)
                    results[str(record.get("custom_id"))] = record
        print(f"Batch {entry['batch_id']} {status}: {len(results)} result(s).")
        request_errors = batch_errors(api_key, batch)
        for item in entry.get("items", []):
            record = results.get(item["custom_id"])
            answer = None
            problem = None
            if record is None:
                problem = request_errors.get(item["custom_id"]) or f"no result (batch {status})"
            elif record.get("error"):
                problem = str(record["error"])
            else:
                response = record.get("response") or {}
                if response.get("status_code") != 200:
                    problem = f"HTTP {response.get('status_code')}: {str(response.get('body'))[:200]}"
                else:
                    answer = response["body"]["choices"][0]["message"]["content"] or ""
                    usage = response["body"].get("usage") or {}
                    print(
                        f"  {item['custom_id']}: {usage.get('prompt_tokens')} in, "
                        f"{usage.get('completion_tokens')} out"
                    )
            for packet_id in item["packets"]:
                packet = root / "inbox" / packet_id
                if answer is None:
                    failed += 1
                    print(f"  {packet_id}: failed — {problem}", file=sys.stderr)
                    if is_billing_error(None, set(), str(problem)):
                        # Running out of money isn't the transcript's fault, so
                        # this doesn't use up one of its attempts.
                        attempts.pop(packet_id, None)
                        write_billing_alert(f"A batch request was refused: {problem}")
                    continue
                errors, warnings = apply_condensation(packet, answer)
                for warning in warnings:
                    print(f"  {packet_id} warning: {warning}")
                if errors:
                    failed += 1
                    for error in errors:
                        print(f"  {packet_id} error: {error}", file=sys.stderr)
                else:
                    written += 1
                    attempts.pop(packet_id, None)
                    print(f"  {packet_id}: condensed")
    write_batch_state(root, still_waiting, attempts)
    print(f"{written} condensed, {failed} failed, {len(still_waiting)} batch(es) still running.")
    return 0


GLOSSARY_PROMPT = """You are given the plain-English dialogue from a UK parliamentary
committee session. List the terms in it that a general reader would not know:
acronyms, institutions, and technical or parliamentary vocabulary.

Rules:

- Write each term exactly as it appears in the dialogue.
- Define each in one plain sentence a layman understands (under 200 characters).
- Skip everyday words, and anything the dialogue already explains in passing.
- At most 25 entries. Fewer is fine; an empty list is fine.
- Return raw JSON only, in this shape:
  {"glossary": [{"term": "...", "definition": "..."}]}
"""


def dialogue_text(condensation: dict[str, Any]) -> str:
    lines: list[str] = []
    for chapter in condensation.get("chapters") or []:
        for turn in chapter.get("turns") or []:
            lines.append(f"{turn.get('speaker')}: {turn.get('text')}")
    return "\n".join(lines)


def needs_glossary(packet: Path) -> bool:
    condensation = read_json(packet / "condensation.json", {})
    return isinstance(condensation, dict) and not condensation.get("glossary")


def gloss_command(args: argparse.Namespace) -> int:
    """Add a glossary to condensations made before glossaries existed.

    This reads only the finished dialogue, so the condensed text is untouched.
    """
    root = Path(args.root).resolve()
    packets = (
        [root / "inbox" / str(args.id)]
        if args.id is not None
        else [
            packet
            for packet in iter_packets(root)
            if (packet / "condensation.json").exists() and needs_glossary(packet)
        ]
    )
    if args.max_packets is not None:
        packets = packets[: args.max_packets]
    if args.dry_run:
        for packet in packets:
            print(f"Would write a glossary for {packet.name}")
        print(f"{len(packets)} packet(s) need a glossary.")
        return 0
    if not packets:
        print("Every condensation already has a glossary.")
        return 0

    api_key = os.environ.get("CONDENSE_API_KEY", "")
    if not api_key:
        raise PipelineError("Set the CONDENSE_API_KEY environment variable.")

    written = 0
    failed = 0
    for packet in packets:
        print(f"Glossing {packet.name} …", flush=True)
        target = packet / "condensation.json"
        condensation = read_json(target)
        if not isinstance(condensation, dict):
            failed += 1
            print(f"  error: {target.name} is missing or invalid.", file=sys.stderr)
            continue
        try:
            answer = chat_completion(
                api_key,
                [
                    {"role": "system", "content": GLOSSARY_PROMPT},
                    {"role": "user", "content": dialogue_text(condensation)},
                ],
            )
            payload = extract_json_object(answer)
        except PipelineError as exc:
            if "CONDENSE_API_KEY" in str(exc) or "account balance" in str(exc):
                raise
            failed += 1
            print(f"  error: {exc}", file=sys.stderr)
            continue

        entries = [
            {"term": str(entry["term"]).strip(), "definition": str(entry["definition"]).strip()}
            for entry in payload.get("glossary") or []
            if isinstance(entry, dict) and entry.get("term") and entry.get("definition")
        ][:25]

        condensation["glossary"] = entries
        write_json(target, condensation)

        errors, _ = validate_packet(packet)[:2]
        if errors:
            failed += 1
            for error in errors:
                print(f"  error: {error}", file=sys.stderr)
        else:
            written += 1
            print(f"  {len(entries)} term(s)")

    print(f"{written} glossed, {failed} failed, {len(packets)} attempted.")
    return 1 if failed and not written else 0


def seat_for(kind: str, counters: dict[str, int]) -> str:
    if kind == "chair":
        return "chair"
    pool = WITNESS_SEATS if kind == "witness" else MEMBER_SEATS
    index = counters[kind]
    counters[kind] += 1
    return pool[index % len(pool)]


def session_javascript(
    metadata: dict[str, Any], condensation: dict[str, Any], evidence_url: str | None = None
) -> str:
    counters = {"chair": 0, "member": 0, "witness": 0}
    cast: dict[str, Any] = {}
    # A speaker who never actually speaks would sit in Who's who with nothing to
    # jump to, so the cast only carries people who appear in the dialogue.
    speaking = {
        turn["speaker"]
        for chapter in condensation["chapters"]
        for turn in chapter["turns"]
    }
    for index, speaker in enumerate(
        [item for item in condensation["speakers"] if item["label"] in speaking]
    ):
        kind = speaker["kind"]
        color, soft = PALETTE[index % len(PALETTE)]
        cast[speaker["label"]] = {
            "name": speaker["name"],
            "role": speaker["role"],
            "description": "",
            "kind": kind,
            "seats": [seat_for(kind, counters)],
            "color": color,
            "soft": soft,
        }

    # Naming comes from official metadata, never from the model: the inquiry
    # (business) title names the meeting, the witnesses name the session.
    inquiry = " / ".join(
        str(entry.get("title") or "").strip()
        for entry in metadata.get("businesses") or []
        if entry.get("title")
    )
    witness_names = [
        entry["name"]
        for entry in metadata.get("witnesses") or []
        if entry.get("name") and entry["name"] != "Name not supplied"
    ] or [
        speaker["name"]
        for speaker in condensation["speakers"]
        if speaker.get("kind") == "witness"
    ]
    session_label = metadata["meeting_date_display"] + " · " + (
        ", ".join(witness_names) if witness_names else "Oral evidence"
    )

    transcript_lines = [f"# {inquiry or metadata['committee']}"]
    for chapter in condensation["chapters"]:
        transcript_lines.extend(
            [
                "",
                f"## {chapter['title']}",
                f"> {chapter['takeaway']}",
                "",
            ]
        )
        transcript_lines.extend(
            f"{turn['speaker']}: {turn['text']}" for turn in chapter["turns"]
        )
        transcript_lines.append("")
    transcript = "\n".join(transcript_lines).strip() + "\n"

    status_label = metadata.get("transcript_status", "published").capitalize()
    session = {
        "id": f"oral-evidence-{metadata['parliament_oral_evidence_id']}",
        "label": session_label,
        "committee": metadata["committee"],
        "date": metadata["meeting_date_display"],
        "sourceUrl": metadata["source_url"],
        "sourceLabel": f"Official {status_label.lower()} transcript",
        "summary": condensation["summary"],
        "room": GENERIC_ROOM,
        "cast": cast,
        "transcript": transcript,
    }
    if inquiry:
        session["inquiry"] = inquiry
    if evidence_url:
        session["evidence"] = evidence_url

    glossary = [
        {"term": str(entry["term"]).strip(), "definition": str(entry["definition"]).strip()}
        for entry in condensation.get("glossary") or []
        if isinstance(entry, dict) and entry.get("term") and entry.get("definition")
    ]
    if glossary:
        session["glossary"] = glossary
    serialised = json.dumps(session, ensure_ascii=False, indent=2)
    return f"""/*
 * Generated from UK Parliament oral evidence {metadata['parliament_oral_evidence_id']}.
 * Source status: {status_label}. Source hash: {metadata['source_sha256']}
 * Contains Parliamentary information licensed under the Open Parliament Licence v3.0.
 */
window.COMMITTEE_SESSIONS = window.COMMITTEE_SESSIONS || [];
window.COMMITTEE_SESSIONS.push({serialised});
"""


def generated_tag(path: Path, root: Path) -> str:
    relative = path.relative_to(root).as_posix()
    # Content-hashed URL so browsers pick up re-condensed sessions immediately.
    digest = hashlib.sha256(path.read_bytes()).hexdigest()[:8]
    return f'    <script src="{relative}?v={digest}"></script>'


def update_index(root: Path, generated_files: list[Path], check: bool) -> bool:
    index_path = root / "index.html"
    original = index_path.read_text(encoding="utf-8")
    if INDEX_START not in original or INDEX_END not in original:
        raise PipelineError(
            "index.html is missing the generated-session marker comments."
        )
    before, remainder = original.split(INDEX_START, 1)
    _, after = remainder.split(INDEX_END, 1)
    tags = "\n".join(generated_tag(path, root) for path in generated_files)
    block = INDEX_START + ("\n" + tags if tags else "") + "\n" + INDEX_END
    updated = before + block + after
    changed = updated != original
    if changed and not check:
        write_text(index_path, updated)
    return changed


def build_command(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    packets = [
        packet for packet in iter_packets(root) if (packet / "condensation.json").exists()
    ]
    if args.id is not None:
        packets = [root / "inbox" / str(args.id)]
    generated_files: list[Path] = []
    failed = False

    for packet in packets:
        errors, warnings, condensation = validate_packet(packet)
        for warning in warnings:
            print(f"warning [{packet.name}]: {warning}")
        if errors:
            failed = True
            for error in errors:
                print(f"error [{packet.name}]: {error}", file=sys.stderr)
            continue
        assert condensation is not None
        metadata = read_json(packet / "metadata.json")
        output = root / "sessions" / "generated" / f"oral-evidence-{packet.name}.js"
        evidence_url = None
        evidence_path = root / "sessions" / "generated" / "evidence" / f"oral-evidence-{packet.name}.json"
        has_evidence = any(
            turn.get("evidence") for chapter in condensation["chapters"] for turn in chapter["turns"]
        )
        if has_evidence:
            turns, _ = match_evidence(
                condensation, (packet / "transcript.txt").read_text(encoding="utf-8")
            )
            evidence_content = json.dumps(
                {
                    "source": evidence_source_text(
                        (packet / "transcript.txt").read_text(encoding="utf-8")
                    ),
                    "turns": turns,
                },
                ensure_ascii=False,
                separators=(",", ":"),
            ) + "\n"
            digest = hashlib.sha256(evidence_content.encode("utf-8")).hexdigest()[:8]
            evidence_url = f"{evidence_path.relative_to(root).as_posix()}?v={digest}"
            existing = evidence_path.read_text(encoding="utf-8") if evidence_path.exists() else None
            if existing != evidence_content:
                if args.check:
                    failed = True
                    print(f"error [{packet.name}]: {evidence_path.relative_to(root)} is out of date.")
                else:
                    write_text(evidence_path, evidence_content)
                    print(f"Wrote {evidence_path.relative_to(root)}")
        elif evidence_path.exists() and not args.check:
            evidence_path.unlink()
        content = session_javascript(metadata, condensation, evidence_url)
        generated_files.append(output)
        current = output.read_text(encoding="utf-8") if output.exists() else None
        if current != content:
            if args.check:
                failed = True
                print(f"error [{packet.name}]: {output.relative_to(root)} is out of date.")
            else:
                write_text(output, content)
                print(f"Wrote {output.relative_to(root)}")

    if args.id is None:
        all_generated = sorted(
            (root / "sessions" / "generated").glob("oral-evidence-*.js")
            if (root / "sessions" / "generated").exists()
            else []
        )
        generated_dir = root / "sessions" / "generated"
        for archived_id in sorted(archived_ids(root)):
            for stale in (
                generated_dir / f"oral-evidence-{archived_id}.js",
                generated_dir / "evidence" / f"oral-evidence-{archived_id}.json",
            ):
                if stale.exists():
                    if args.check:
                        failed = True
                        print(f"error: {stale.relative_to(root)} belongs to an archived session.")
                    else:
                        stale.unlink()
                        print(f"Removed archived {stale.relative_to(root)}")
        all_generated = [path for path in all_generated if path.exists()]
        approved_ids = {path.name for path in generated_files}
        active_generated = [path for path in all_generated if path.name in approved_ids]
        if update_index(root, active_generated, args.check):
            if args.check:
                failed = True
                print("error: index.html generated session tags are out of date.")
            else:
                print("Updated index.html generated session tags.")

    return 1 if failed else 0


def issue_body(metadata: dict[str, Any], repository: str, branch: str) -> str:
    evidence_id = metadata["parliament_oral_evidence_id"]
    base = f"https://github.com/{repository}/blob/{quote(branch, safe='')}/inbox/{evidence_id}"
    marker = (
        f"<!-- parliament-oral-evidence-id:{evidence_id} "
        f"source-sha:{metadata['source_sha256']} -->"
    )
    updated = metadata.get("packet_status", "").startswith("source-updated")
    change_note = (
        "\n⚠️ Parliament has changed this source transcript. Review any existing "
        "condensation against the new version.\n"
        if updated
        else ""
    )
    return f"""{marker}

## Condensation needed

**Committee:** {metadata['committee']}  
**Subject:** {metadata['title']}  
**Meeting:** {metadata['meeting_date_display']}  
**Source status:** {metadata['transcript_status']}  
**Official source:** {metadata['source_url']}
{change_note}
### What to do

1. Download [`CHATGPT_PROMPT.md`]({base}/CHATGPT_PROMPT.md) and
   [`transcript.txt`]({base}/transcript.txt).
2. Upload both files to ChatGPT and ask it to follow the prompt.
3. Save the raw JSON answer as `inbox/{evidence_id}/condensation.json`.
4. Run:

   `python3 scripts/parliament_pipeline.py validate --id {evidence_id}`

5. Commit the condensation. The publishing workflow will validate it, generate the
   website session and deploy the site.

The required source hash is `{metadata['source_sha256']}`.
"""


def issues_command(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve()
    repository = os.environ.get("GITHUB_REPOSITORY", "")
    if not repository and not args.dry_run:
        raise PipelineError("GITHUB_REPOSITORY is required to open issues.")
    branch = os.environ.get("GITHUB_REF_NAME") or "main"

    existing_issues: list[dict[str, Any]] = []
    if not args.dry_run:
        result = subprocess.run(
            [
                "gh",
                "issue",
                "list",
                "--state",
                "all",
                "--limit",
                "1000",
                "--json",
                "body,number,state",
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        existing_issues = json.loads(result.stdout)
        for label, color, description in [
            ("automation", "6f42c1", "Created by an automated workflow"),
            (
                "awaiting-condensation",
                "d4c5f9",
                "Needs a human-reviewed ChatGPT condensation",
            ),
            (
                "source-updated",
                "b60205",
                "Parliament changed a previously downloaded transcript",
            ),
        ]:
            subprocess.run(
                [
                    "gh",
                    "label",
                    "create",
                    label,
                    "--color",
                    color,
                    "--description",
                    description,
                    "--force",
                ],
                check=True,
            )

    opened = 0
    closed = 0
    busy = in_flight_ids(root)
    for packet in iter_packets(root):
        if packet.name in busy:
            continue
        metadata = read_json(packet / "metadata.json")
        if not isinstance(metadata, dict):
            continue
        marker = (
            f"parliament-oral-evidence-id:{metadata['parliament_oral_evidence_id']} "
            f"source-sha:{metadata['source_sha256']}"
        )
        matching = [
            issue
            for issue in existing_issues
            if marker in str(issue.get("body") or "")
        ]
        approved = (packet / "condensation.json").exists() and (
            read_json(packet / "condensation.json", {}).get("source_sha256")
            == metadata.get("source_sha256")
        )
        if approved:
            if args.close_approved and not args.dry_run:
                for issue in matching:
                    if str(issue.get("state") or "").casefold() != "open":
                        continue
                    subprocess.run(
                        [
                            "gh",
                            "issue",
                            "close",
                            str(issue["number"]),
                            "--comment",
                            "A matching condensation has been validated and published.",
                        ],
                        check=True,
                    )
                    closed += 1
            continue
        if matching:
            continue
        body = issue_body(metadata, repository or "OWNER/REPOSITORY", branch)
        title = (
            f"[Condense] {metadata['committee']} — {metadata['title']} "
            f"({metadata['meeting_date_display']})"
        )
        labels = ["automation", "awaiting-condensation"]
        if metadata.get("packet_status", "").startswith("source-updated"):
            labels.append("source-updated")
        if args.dry_run:
            print(f"Would open: {title}")
        else:
            command = ["gh", "issue", "create", "--title", title, "--body", body]
            for label in labels:
                command.extend(["--label", label])
            subprocess.run(command, check=True)
            print(f"Opened: {title}")
        opened += 1
    print(f"{opened} issue(s) {'would be opened' if args.dry_run else 'opened'}.")
    if args.close_approved:
        print(f"{closed} completed issue(s) closed.")
    return 0


def billing_alert_body(detail: str, repository: str) -> str:
    return (
        "The nightly run could not condense new transcripts because the model API "
        "refused the request for lack of funds:\n\n"
        f"> {detail}\n\n"
        "**To fix:** add credit at "
        "https://platform.openai.com/settings/organization/billing (or raise the "
        "spend limit at https://platform.openai.com/settings/organization/limits).\n\n"
        "Nothing is lost: every transcript still waiting will be condensed on the next "
        "nightly run after the top-up, or straight away if you re-run "
        f"https://github.com/{repository}/actions/workflows/update-site.yml by hand. "
        "This issue closes itself once a run condenses successfully.\n\n"
        f"<!-- {BILLING_ALERT_MARKER} -->"
    )


def billing_alert_command(args: argparse.Namespace) -> int:
    """Open one issue when funds run out; close it once condensing works again."""
    alert_path = Path(args.alert_file)
    out_of_funds = alert_path.exists()
    if not out_of_funds and args.condense_outcome != "success":
        print("Condensation did not succeed for a non-billing reason; leaving alerts alone.")
        return 0
    repository = os.environ.get("GITHUB_REPOSITORY", "")
    if args.dry_run:
        print("Would open a billing alert." if out_of_funds else "Would close any billing alert.")
        return 0
    if not repository:
        raise PipelineError("GITHUB_REPOSITORY is required to manage the billing alert.")
    result = subprocess.run(
        ["gh", "issue", "list", "--state", "open", "--label", "automation",
         "--limit", "500", "--json", "number,body"],
        check=True, capture_output=True, text=True,
    )
    open_alerts = [
        issue for issue in json.loads(result.stdout)
        if BILLING_ALERT_MARKER in str(issue.get("body") or "")
    ]
    if out_of_funds:
        if open_alerts:
            print(f"Billing alert #{open_alerts[0]['number']} is already open.")
            return 0
        detail = alert_path.read_text(encoding="utf-8").strip()
        subprocess.run(
            ["gh", "label", "create", "automation", "--color", "6f42c1",
             "--description", "Created by an automated workflow", "--force"],
            check=True,
        )
        command = ["gh", "issue", "create", "--title", BILLING_ALERT_TITLE,
                   "--body", billing_alert_body(detail, repository),
                   "--label", "automation"]
        owner = os.environ.get("GITHUB_REPOSITORY_OWNER")
        if owner:
            # Assigning the owner makes GitHub email them, not just list the issue.
            command.extend(["--assignee", owner])
        subprocess.run(command, check=True)
        print("Opened a billing alert.")
        return 0
    for issue in open_alerts:
        subprocess.run(
            ["gh", "issue", "close", str(issue["number"]), "--comment",
             "Condensation succeeded again, so the credit has been topped up."],
            check=True,
        )
        print(f"Closed billing alert #{issue['number']}.")
    return 0


def parser() -> argparse.ArgumentParser:
    main = argparse.ArgumentParser(description=__doc__)
    main.add_argument(
        "--root",
        default=str(ROOT),
        help="Project root (defaults to the directory above this script).",
    )
    commands = main.add_subparsers(dest="command", required=True)

    sync_parser = commands.add_parser("sync", help="Find and prepare recent transcripts.")
    sync_parser.add_argument("--lookback-days", type=int, default=21)
    sync_parser.add_argument("--max-items", type=int)
    sync_parser.add_argument("--dry-run", action="store_true")
    sync_parser.add_argument("--report")
    sync_parser.set_defaults(function=sync)

    condense_parser = commands.add_parser(
        "condense",
        help="Condense packets that lack a current condensation via the model API.",
    )
    condense_parser.add_argument("--id", type=int)
    condense_parser.add_argument("--max-packets", type=int)
    condense_parser.add_argument("--dry-run", action="store_true")
    condense_parser.set_defaults(function=condense_command)

    submit_parser = commands.add_parser(
        "batch-submit",
        help="Send packets needing condensation to the model's Batch tier (half price).",
    )
    submit_parser.add_argument(
        "--ids", help="Comma-separated packet IDs to (re)condense, even if already condensed."
    )
    submit_parser.add_argument("--dry-run", action="store_true")
    submit_parser.set_defaults(function=batch_submit_command)

    collect_parser = commands.add_parser(
        "batch-collect", help="Fetch finished batches and write their condensations."
    )
    collect_parser.set_defaults(function=batch_collect_command)

    gloss_parser = commands.add_parser(
        "gloss",
        help="Write a glossary for condensations that lack one (dialogue only).",
    )
    gloss_parser.add_argument("--id", type=int)
    gloss_parser.add_argument("--max-packets", type=int)
    gloss_parser.add_argument("--dry-run", action="store_true")
    gloss_parser.set_defaults(function=gloss_command)

    validate_parser = commands.add_parser(
        "validate", help="Validate one or all condensation files."
    )
    validate_parser.add_argument("--id", type=int)
    validate_parser.set_defaults(function=validate_command)

    build_parser = commands.add_parser(
        "build", help="Validate and compile approved condensations."
    )
    build_parser.add_argument("--id", type=int)
    build_parser.add_argument("--check", action="store_true")
    build_parser.set_defaults(function=build_command)

    issues_parser = commands.add_parser(
        "issues", help="Open GitHub issues for packets needing condensation."
    )
    issues_parser.add_argument("--dry-run", action="store_true")
    issues_parser.add_argument(
        "--close-approved",
        action="store_true",
        help="Close matching open issues after a valid condensation has been added.",
    )
    issues_parser.set_defaults(function=issues_command)

    billing_parser = commands.add_parser(
        "billing-alert",
        help="Open a GitHub issue when the model API is out of funds; close it after.",
    )
    billing_parser.add_argument("--alert-file", required=True)
    billing_parser.add_argument("--condense-outcome", default="")
    billing_parser.add_argument("--dry-run", action="store_true")
    billing_parser.set_defaults(function=billing_alert_command)
    return main


def main(argv: list[str] | None = None) -> int:
    args = parser().parse_args(argv)
    if getattr(args, "lookback_days", 1) < 1:
        raise PipelineError("--lookback-days must be at least 1.")
    try:
        return int(args.function(args))
    except PipelineError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
