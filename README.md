# Parliamentary Committees, in Plain English

A small static site that retells parliamentary committee evidence sessions as short,
plain-English dialogues you can step through — set inside an illustrated committee room,
with a spotlight on whoever is speaking.

## Running it

No build step and no server needed: open `index.html` in a browser.
(Everything, including the transcripts, loads from plain `<script>` tags, so it works
from `file://` as well as any static host.)

## Project layout

- `index.html`, `styles.css`, `app.js` — the viewer.
- `sessions/*.js` — one file per session: metadata, cast, room image + seat map, and the
  condensed transcript. These are what the app actually loads.
- `assets/generic-committee-room.svg` — reusable, original block-style room artwork
  for automatically prepared sessions.
- `scripts/parliament_pipeline.py` — free transcript discovery, packet preparation,
  condensation validation and session compilation.
- `inbox/<oral-evidence-id>/` — generated review packets awaiting a human-created
  ChatGPT condensation.
- `.github/workflows/` — daily discovery, pull-request validation and GitHub Pages
  publication.
- `Energy Resilience/` — source material per session *n*:
  - `full_transcript_n.txt` — the official oral-evidence transcript (reference only).
  - `condensed_n.txt` — the plain-English dialogue distilled from it (see `PROMPT.txt`
    for the prompt used). The same text is embedded in the matching `sessions/*.js`.
  - `committee_room_n.png` — the room illustration used as that session's stage.

Currently included: sessions 4 and 5 of the Energy Security and Net Zero Committee's
*Energy resilience* inquiry (HC 171, 3 June 2026) — panel I (Braw / Oakshett / Skinner)
and panel II (Petterson / Okin).

## Automatic daily updates

The **Discover, condense and publish** GitHub Action runs every night (23:17 UTC):

1. Queries the official UK Parliament Committees API for recent oral evidence.
2. Downloads the documents, strips formatting, and deduplicates by evidence ID and a
   SHA-256 hash of the cleaned transcript, writing `inbox/<id>/` packets.
3. Sends each new transcript to the model API (GPT-5 mini) with the packet's prompt and saves
   the plain-English dialogue as `condensation.json`. A failed validation is retried
   once with the validator's error list; a packet that still fails is left
   uncondensed and a GitHub issue flags it for manual attention.
4. Validates every condensation (source hash, speaker declarations, chapter
   structure, turn lengths; it warns when a claimed speaker name is not found in the
   official transcript), generates `sessions/generated/oral-evidence-<id>.js`,
   updates `index.html`, commits, and deploys through GitHub Pages.

If Parliament changes a transcript later, the hash changes and the session is
re-condensed from the new source. An existing condensation is never silently kept
when its source has moved.

At roughly five meetings a day, GPT-5 mini usage costs on the order of $2/month.

### Condensing a packet by hand

Any packet can still be condensed manually (for example if the API repeatedly fails):
upload `inbox/<id>/CHATGPT_PROMPT.md` and `transcript.txt` to any capable chatbot,
save the raw JSON answer as `inbox/<id>/condensation.json`, check it with
`python3 scripts/parliament_pipeline.py validate --id <id>`, and commit. The
`condense` command skips packets whose condensation already matches the source hash.

### Running the pipeline locally

Check the last seven publication days:

```sh
python3 scripts/parliament_pipeline.py sync --lookback-days 7
```

Condense packets that need it (requires `CONDENSE_API_KEY` in the environment;
`--dry-run` lists them, `--max-packets N` limits spend):

```sh
python3 scripts/parliament_pipeline.py condense
```

Limit a trial run to one API item without writing a packet:

```sh
python3 scripts/parliament_pipeline.py sync --lookback-days 2 --max-items 1 --dry-run
```

Validate all condensations:

```sh
python3 scripts/parliament_pipeline.py validate
```

Compile all approved condensations:

```sh
python3 scripts/parliament_pipeline.py build
```

Preview which GitHub issues are needed:

```sh
python3 scripts/parliament_pipeline.py issues --dry-run
```

The pipeline uses only Python's standard library.

### One-time GitHub setup

This folder is not currently a Git repository. To activate the workflows:

1. Create a **public** GitHub repository. Public repositories allow the intended
   GitHub Actions and GitHub Pages workflow to run without usage charges on standard
   runners.
2. Initialise this folder as a Git repository, commit it, and push its `main` branch.
3. In the repository's **Settings → Pages**, choose **GitHub Actions** as the source.
4. In **Settings → Actions → General**, ensure workflows can read and write repository
   contents and create issues.
5. In **Settings → Secrets and variables → Actions**, add a `CONDENSE_API_KEY`
   secret (an OpenAI API key from [platform.openai.com](https://platform.openai.com);
   set the `CONDENSE_API_URL`/`CONDENSE_MODEL` environment variables to use a
   different chat-completions provider).
6. Run **Discover, condense and publish** manually once and inspect the first
   sessions before relying on its nightly 23:17 UTC schedule.

The first run checks the previous seven days. Increase `lookback_days` manually if you
want to backfill older transcripts.

## Features

- **Spotlight stage** — the room illustration with a moving spotlight and nameplate over
  the current speaker. Real MPs and witnesses are mapped to the people in the picture.
- **Auto-play** — play/pause with reading-speed pacing and a speed picker. Space toggles
  play, ←/→ step, Home/End jump.
- **Chapters** — defined inline in the transcript with `##` headings and `>` takeaways;
  shown as a banner under the stage, a clickable list, and ticks on the progress bar.
- **Who's who** — cast panel with real names and roles; click a person to jump to their
  next remark.
- **Provenance** — header disclaimer plus About tab linking to the official transcript.
- **Sessions** — picker in the header; deep links (`#s=<id>&t=<turn>`) and per-session
  resume via localStorage.

## Adding a new session

1. Copy a file in `sessions/` and rename it (`id` must be unique).
2. Update `label`, `committee`, `date`, `sourceUrl`, `summary`, the `cast`, the `room`
   (image path, image pixel size, seats) and the `transcript` template literal.
3. Add a `<script src="sessions/your-file.js"></script>` tag to `index.html`
   above the `app.js` tag.

### Transcript format

```
# Session title
## Chapter name
> One-line takeaway for the chapter (optional)
Speaker Name: What they said, in plain English.
```

Plain `Name: text` lines (the `condensed_n.txt` format) and bold `**Name:** text` lines
both work. Speaker labels must match keys in the session's `cast` object exactly
(e.g. `Ms Polly Billington` vs `Polly Billington` are different keys); unknown speakers
still render, with default styling.

### Seats

Each session's `room.seats` maps seat names to percent coordinates over that session's
image (x/y at the person's head). Cast entries reference seats by name; an entry with
several seats rotates between them turn by turn. To calibrate a new image, temporarily
draw dots at the coordinates (any quick DevTools overlay works) and nudge until they sit
on the right people.

## Notes

- The dialogue is a paraphrased condensation of a public evidence session, not a
  verbatim record; the in-app About tab says so and links to the official source.
- Witness names and roles come from the official transcript header. The seat
  assignments for individual MPs are best-effort matches to the illustration.
- Automatically generated sessions use the reusable block-style room rather than
  Parliamentary video or photography.
- Transcript and metadata reuse is attributed under the Open Parliament Licence v3.0;
  see `NOTICE.md`.
