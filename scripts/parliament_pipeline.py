#!/usr/bin/env python3
"""Prepare and publish plain-English UK Parliament committee sessions.

The pipeline is fully automatic:

1. ``sync`` discovers and normalises new oral-evidence transcripts.
2. ``condense`` sends each new transcript to the DeepSeek API and saves the
   returned dialogue as condensation.json in the packet directory.
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
CONDENSE_API_URL = os.environ.get("CONDENSE_API_URL", "https://api.deepseek.com/chat/completions")
CONDENSE_MODEL = os.environ.get("CONDENSE_MODEL", "deepseek-chat")
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
    witnesses = metadata.get("witnesses") or []
    candidates = metadata.get("speaker_candidates") or []
    witness_lines = "\n".join(
        f"- {entry['name']}: {entry['role']}"
        + (f", {entry['organisation']}" if entry["organisation"] else "")
        for entry in witnesses
    )
    candidate_lines = "\n".join(f"- {name}" for name in candidates)
    status = metadata["transcript_status"]
    return f"""# Condense this parliamentary evidence session

You've been given the transcript of a parliamentary committee meeting. Come up with
a condensed version that a layman can understand. Ideally, it consists of a much
shorter (though not very short) dialogue in which things are explained in layman
terms. The characters speak to each other in a casual way rather than an overly
formal way. Think hard about what the conversation is about before producing this
condensed natural dialogue, so as to make sure that you are not misunderstanding
what it was about. Make sure contractions are used (e.g. "isn't" instead of
"is not"), and don't omit the speaker's name.

Here is an example of what the dialogue should read like:

> Deborah: That even something not officially labelled "critical national
> infrastructure" can still cause huge disruption. That one fire affected Heathrow,
> transport, hospitals, GP surgeries, data centres, and more.
>
> Chair: So energy is connected to everything else.
>
> Deborah: Exactly. Energy underpins transport, health, telecoms, defence, and
> daily life. We need better maps of how all these systems depend on each other.
>
> Committee Member: What about extreme weather?

Accuracy requirements:

- Preserve who said what. Never transfer a claim from one witness to another.
- Do not invent facts, motives, consensus, quotations or speaker identities.
- Keep meaningful challenges and disagreements instead of smoothing them away.
- You may merge repetitive committee questions into a clearly labelled
  `Committee Member` voice, but never merge different witnesses.
- Use `Chair` for the chair when that makes the dialogue easier to follow.

Structural requirements (the JSON is checked automatically):

- Give the session 2–8 short chapters, each with a one-sentence takeaway.
- Aim for roughly 20–80 dialogue turns, depending on the source length. Never
  exceed 100 turns; condense harder instead.
- Keep every turn under 700 characters. Split a long answer into several
  consecutive turns by the same speaker rather than writing one long turn.
- Use only speaker labels declared in the `speakers` array.
- Return raw JSON only: no Markdown fence, introduction or commentary.

Official metadata:

- Parliament oral-evidence ID: {metadata['parliament_oral_evidence_id']}
- Required source hash: `{metadata['source_sha256']}`
- Committee: {metadata['committee']}
- Subject: {metadata['title']}
- Meeting date: {metadata['meeting_date_display']}
- Transcript status: {status}
- Source: {metadata['source_url']}

Witness metadata:

{witness_lines or "- No structured witness names were supplied by the API; use the transcript header."}

Speaker labels detected in the transcript:

{candidate_lines or "- None detected automatically; inspect the transcript carefully."}

Return exactly this structure:

{{
  "schema_version": 1,
  "source_id": {metadata['parliament_oral_evidence_id']},
  "source_sha256": "{metadata['source_sha256']}",
  "title": "A concise, engaging title",
  "label": "{metadata['meeting_date_display']} · A short picker label",
  "summary": "One paragraph explaining what the hearing covered and its main conclusion.",
  "speakers": [
    {{
      "label": "Chair",
      "name": "The chair's real name",
      "role": "Chair of the committee",
      "kind": "chair"
    }},
    {{
      "label": "Witness Name",
      "name": "Witness Name",
      "role": "Their role and organisation",
      "kind": "witness"
    }}
  ],
  "chapters": [
    {{
      "title": "Short chapter title",
      "takeaway": "One plain-English sentence capturing the chapter's main point.",
      "turns": [
        {{
          "speaker": "Chair",
          "text": "The condensed, conversational line."
        }}
      ]
    }}
  ]
}}

Allowed speaker kinds are `chair`, `member`, and `witness`. If you use the composite
label `Committee Member`, set both its label and name to `Committee Member`, give it
kind `member`, and explain in its role that it combines repetitive questions.
"""


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

    for item in items:
        evidence_id = int(item["id"])
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

    chapters = condensation.get("chapters")
    if not isinstance(chapters, list) or not chapters:
        errors.append("chapters must be a non-empty array.")
        chapters = []
    if len(chapters) > 12:
        errors.append("chapters must contain no more than 12 chapters.")

    turn_count = 0
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

    if turn_count < 6:
        errors.append("The condensation must contain at least 6 dialogue turns.")
    if turn_count > 180:
        errors.append("The condensation must contain no more than 180 dialogue turns.")
    unused = sorted(set(speaker_map) - used_speakers)
    if unused:
        warnings.append("Declared but unused speakers: " + ", ".join(unused))
    return errors, warnings, condensation


def iter_packets(root: Path) -> Iterable[Path]:
    inbox = root / "inbox"
    if not inbox.exists():
        return []
    return sorted(
        (
            path
            for path in inbox.iterdir()
            if path.is_dir()
            and path.name.isdigit()
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


def chat_completion(api_key: str, messages: list[dict[str, str]]) -> str:
    body = json.dumps(
        {
            "model": CONDENSE_MODEL,
            "messages": messages,
            "max_tokens": int(os.environ.get("CONDENSE_MAX_TOKENS", "16000")),
            "response_format": {"type": "json_object"},
            "stream": False,
        }
    ).encode("utf-8")
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
            if exc.code in {401, 402, 403}:
                raise PipelineError(
                    f"The condensation API rejected the request ({exc.code}). "
                    "Check the DEEPSEEK_API_KEY secret and the account balance."
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
    transcript = (packet / "transcript.txt").read_text(encoding="utf-8")
    messages = [
        {"role": "system", "content": prompt_for(metadata)},
        {"role": "user", "content": transcript},
    ]
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
    api_key = os.environ.get("DEEPSEEK_API_KEY", "")
    if not api_key:
        raise PipelineError("Set the DEEPSEEK_API_KEY environment variable.")
    condensed = 0
    failed = 0
    for packet in packets:
        print(f"Condensing {packet.name} …", flush=True)
        try:
            errors, warnings = condense_packet(packet, api_key)
        except PipelineError as exc:
            if "DEEPSEEK_API_KEY" in str(exc) or "account balance" in str(exc):
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


def seat_for(kind: str, counters: dict[str, int]) -> str:
    if kind == "chair":
        return "chair"
    pool = WITNESS_SEATS if kind == "witness" else MEMBER_SEATS
    index = counters[kind]
    counters[kind] += 1
    return pool[index % len(pool)]


def session_javascript(metadata: dict[str, Any], condensation: dict[str, Any]) -> str:
    counters = {"chair": 0, "member": 0, "witness": 0}
    cast: dict[str, Any] = {}
    for index, speaker in enumerate(condensation["speakers"]):
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

    transcript_lines = [f"# {condensation['title']}"]
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
        "label": condensation["label"],
        "committee": metadata["committee"],
        "date": metadata["meeting_date_display"],
        "sourceUrl": metadata["source_url"],
        "sourceLabel": f"Official {status_label.lower()} transcript",
        "summary": condensation["summary"],
        "room": GENERIC_ROOM,
        "cast": cast,
        "transcript": transcript,
    }
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
    return f'    <script src="{relative}"></script>'


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
        content = session_javascript(metadata, condensation)
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
    for packet in iter_packets(root):
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
        help="Condense packets that lack a current condensation via the DeepSeek API.",
    )
    condense_parser.add_argument("--id", type=int)
    condense_parser.add_argument("--max-packets", type=int)
    condense_parser.add_argument("--dry-run", action="store_true")
    condense_parser.set_defaults(function=condense_command)

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
