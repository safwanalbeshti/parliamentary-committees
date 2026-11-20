---
name: condense-two-versions
description: Write a "More condensed" and a "Less condensed" plain-English retelling of one committee session (inbox/<id>/), in the style Safwan approved for session 18214, then validate and build it. Use when asked to condense, re-condense or write two versions of a session by hand.
---

# Condense a session into two versions

You're writing two plain-English retellings of one UK parliamentary evidence
session, for the viewer's **More condensed / Less condensed** toggle. The
reference is session 18214 (Ofgem on Dunkelflaute): read
`inbox/18214/condensation.json` (More condensed) and
`inbox/18214/condensation.detailed.json` (Less condensed) before you start.
Both were approved. Match their voice, density and glossary restraint.

## Inputs and outputs

- Read `inbox/<id>/transcript.txt` in full, once, and `inbox/<id>/metadata.json`.
- The JSON shape, speaker rules (real names, `chair` / `member` / `witness` kinds,
  witnesses only from the metadata) and the `source_id` / `source_sha256` values
  come from `inbox/<id>/CHATGPT_PROMPT.md`. Follow its schema and speaker rules
  exactly. Where its style advice differs from this file, this file wins.
- Write `inbox/<id>/condensation.json` (More condensed) and
  `inbox/<id>/condensation.detailed.json` (Less condensed).
- If the session already has a condensation, say before overwriting it that its
  wording will change. Safwan may have read or quoted it.

## Order of work

1. Write the **Less condensed** version first, straight from the transcript.
2. Derive the **More condensed** version by cutting the Less condensed one down.
   Don't write it from scratch. This keeps the two consistent.
3. Use **identical chapter titles and takeaways, in the same order** in both.
   The toggle keeps the reader in the same chapter, so the chapters must line up.

## Target sizes

Scale these from the transcript's word count (18214 had about 4,950 words of
hearing):

| Version | Words in dialogue | Turns (for a ~5,000-word hearing) | Glossary |
|---|---|---|---|
| Less condensed | about 22% of the hearing (18214: ~1,090) | ~45 | 2–4 terms |
| More condensed | about 10% of the hearing (18214: ~520) | ~27 | 1–3 terms |

Use 4–6 chapters, following the hearing's real topics.

- **Less condensed:** keep the main follow-ups, the numbers, the caveats and the
  moments where a member pushes back. Drop greetings, procedure, repetition and
  asides that change nothing.
- **More condensed:** roughly one exchange per question line. Cut follow-ups and
  minor asides, and minor speakers if needed, but **keep the pushback** that
  shows where members weren't satisfied (18214 kept "You're still not telling
  me…" and "we'll tell you next year").

## Rules that come from Safwan's feedback

**1. One question per turn.** A member's turn asks at most one question: never
two question marks, and never "X, and what about Y?". If they asked several
things in the hearing, split them into separate turns with the witness's answer
in between, or drop the minor ones. An either/or question ("Did none apply, or
does the scheme not suit them?") counts as one question.

**2. It must not read like AI.** These people are talking, not writing a report.
- Keep each speaker's voice and their real stance, including irritation,
  hedging and admitted ignorance ("It's not my area of expertise").
- Keep human moments that carry meaning, such as a dry joke or a member openly
  saying an answer wasn't good enough.
- Avoid stock AI phrasing: "plays a crucial role", "key", "landscape",
  "navigate", "robust", "it's important to note", "not just X but Y", tidy rule
  of three lists, summary sentences that restate the turn, and em-dash
  constructions. Use plain full stops and commas.
- Use contractions naturally. Prefer short sentences. Vary turn length the way
  real speech varies; a turn can be one line.
- Titles and chapter titles are plain phrases or questions a person would say,
  e.g. "How rare a blackout are we planning for?", not "Who is speaking for
  system engineering?".

**3. Explain things in the sentence, concretely.** A reader with no background
should understand every line without hovering.
- Explain a term where it first appears, in everyday words. "Cap and floor
  scheme" becomes "a scheme that guarantees storage projects a minimum income in
  return for capping their earnings". "Three-hour loss of load expectation"
  becomes "supply shouldn't fall short of demand for more than three hours a
  year, on average".
- Name what an organisation does the first time it appears ("NESO, which runs
  the grid").
- Replace acronyms with what they stand for when the acronym adds nothing
  ("the national energy plan", not "the SSEP").
- Say who does what and what changes. Don't use vague verbs such as "drive",
  "enable" or "strengthen frameworks".

**4. Tooltips only for terms that need them.** The glossary is for a term the
reader can't guess, that stays in the dialogue because the name itself is
useful (e.g. "Dunkelflaute"). Usually that's 1–4 terms.
- Never gloss everyday words, or a term the sentence already explains.
- Never gloss a term the viewer already defines in `BASE_GLOSSARY` in `app.js`
  (e.g. select committee, oral evidence, statutory instrument, white paper,
  civil servant).
- Definitions are one plain sentence with something concrete in it, e.g. "One
  gigawatt hour is roughly what 130,000 homes use in a day". Check any figure
  you put in a definition.
- Each glossary term must appear word for word in that version's dialogue. A
  term cut from the More condensed version comes out of its glossary too.

**5. Never invent anything.** GPT-5 mini made up a closing exchange for 18214,
with the Chair asking for written follow-ups and the witness replying "I will".
Don't do that.
- Only include promises, agreements or requests that happen in the transcript,
  and keep them with the speaker who made them.
- Keep numbers exactly as spoken. If a member gives a figure, it stays theirs
  ("As I understand it, …").
- Don't strengthen hedged claims, and don't let a witness answer a question
  they actually dodged. A dodged question can stay dodged; the reader should
  see that.
- Before writing the files, check each version against the transcript for who
  said what.

**6. Keep the hearing's order.** Don't move exchanges between topics. If a
member returns to an earlier topic later in the hearing, you may join the two
moments into one short passage where it first came up. A separate chapter for a
thread, as 18214 does for Lord Redwood's questions, is also fine.

## Check, build and look at it

From the repository root:

```bash
python3 - <<'EOF'
import json, sys
sys.path.insert(0, "scripts")
import parliament_pipeline as p
from pathlib import Path
packet = Path("inbox/<id>")
titles = []
for name in ("condensation.json", p.DETAILED_FILE):
    errors, warnings, d = p.validate_packet(packet, name)
    if not d:
        print(name, "errors:", errors)
        continue
    turns = [t for c in d["chapters"] for t in c["turns"]]
    text = " ".join(t["text"] for t in turns)
    titles.append([c["title"] for c in d["chapters"]])
    print(name, "errors:", errors, "warnings:", warnings,
          "turns:", len(turns),
          "words:", sum(len(t["text"].split()) for t in turns))
    print("  multi-question turns:", [t["text"] for t in turns if t["text"].count("?") > 1])
    print("  em-dashes:", text.count("—"),
          "| glossary terms missing from dialogue:",
          [g["term"] for g in d.get("glossary", []) if g["term"].lower() not in text.lower()])
print("chapter titles match:", len(titles) == 2 and titles[0] == titles[1])
EOF
```

Fix anything it reports. Both versions need: no errors, no multi-question
turns, no em-dashes, no glossary terms missing from the dialogue, and matching
chapter titles. Then:

```bash
python3 scripts/parliament_pipeline.py build --id <id>
python3 scripts/parliament_pipeline.py build
python3 -m unittest discover -s tests
```

Run the full `build` too, because the session's `index.html` tag only updates
on a full build. Open the session in the local viewer (launch config
`committee-viewer`, URL `#s=oral-evidence-<id>&t=1`), reload, and check that
both toggle buttons load and that there are no console errors. Then report the
turn and word counts for each version.

Don't commit or push unless asked. Safwan reviews changes himself.
