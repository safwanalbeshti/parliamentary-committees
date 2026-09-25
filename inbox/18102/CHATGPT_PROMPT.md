# Condense this parliamentary evidence session

You've been given the transcript of a parliamentary committee meeting. Produce a
condensed version that a general reader can understand easily.

The goal is not to condense as aggressively as possible. Preserve enough detail for
the reader to understand the substance of the discussion, the reasoning behind
important claims, and meaningful disagreements.

Present the result mainly as a shorter, natural dialogue between the people who took
part. Use natural spoken English rather than formal parliamentary language. The
dialogue should feel conversational and readable, but don't make serious speakers
sound artificially chatty or informal.

Think carefully about what the discussion means before rewriting it. Use contractions
naturally, such as "isn't" instead of "is not".

## Writing for a lay reader

Assume the reader has no background in politics, law, economics, science, technology,
or the meeting's subject.

For every line, ask: could an ordinary reader with no specialist knowledge explain
back what this sentence actually means? If not, rewrite it more concretely.

Follow these rules:

* Replace unnecessary jargon with the everyday idea it represents. Do not merely
  replace one piece of jargon with slightly simpler jargon.
  Example:
  `regulatory interoperability`
  -> `making sure different countries' rules can work together without conflicting`
* Keep specialist terms when knowing the term itself is useful. If you retain an
  unfamiliar technical, legal, political, economic, or parliamentary term, add it to
  the glossary.
* Briefly identify unfamiliar institutions where that helps immediate understanding.
  Example:
  `Ofgem, the energy regulator, ...`
* Remove specialist metaphors and state their literal meaning instead.
  Example:
  `there's little connective tissue between these initiatives`
  -> `there's very little coordination between these different initiatives`
  Do the same with phrases such as `the AI stack`, `joined-up government`, or
  `move the dial` when their meaning would not be obvious to a general reader.
* Avoid jargon-heavy strings of abstract nouns. Rewrite them around people,
  organisations, actions, or concrete outcomes.
  Example:
  `an independent evaluator ecosystem for model testing`
  -> `independent organisations that test AI models`
* When someone proposes a technical, legal, economic, or institutional measure,
  explain what people would actually do.
  Example:
  `tabletop crisis exercises`
  -> make clear that officials would practise responding together to a simulated
  crisis.
* Prefer concrete wording about who does what, what changes, and why it matters.
  Avoid vague phrases such as `drive implementation`, `strengthen frameworks`, or
  `enable coordination` unless the dialogue makes clear what those actions mean in
  practice.
* Do not over-explain ordinary concepts. The result should remain natural rather than
  becoming a textbook.

## Condensation and accuracy

The condensed version should feel like a readable conversation rather than meeting
minutes.

Committee questions may be shortened substantially if their main purpose is simply to
introduce the next issue. Witness answers may be reorganised slightly for clarity,
but:

* Preserve who said what. Never transfer or combine claims between speakers.
* Preserve the speaker's actual position and level of certainty.
* Never turn speculation or qualified claims into stronger factual claims.
* Do not invent facts, motives, consensus, quotations, recommendations, or identities.
* Preserve disagreements, challenges, uncertainty, and qualifications whenever they
  materially affect the meaning.
* Do not simplify away important distinctions between genuinely different ideas.
* Keep the main reasoning, evidence, examples, and concrete proposals needed to
  understand the discussion.

You may remove:

* greetings and thanks;
* procedural remarks with no substantive content;
* verbal filler;
* repeated versions of the same point;
* long question preambles that do not affect the answer;
* tangents that add little to understanding;
* repeated examples when one strong example is enough.

Do not remove useful explanation merely to make the transcript shorter.

## Speaker rules

* Keep every named speaker's real name exactly as the transcript gives it.
* Never replace a named committee member with `Committee Member`.
* Use `Committee Member` only if the transcript genuinely leaves a speaker unnamed.
* Never merge different speakers.
* Use `Chair` for the chair when that makes the dialogue easier to follow.
* The people listed under `Witness metadata` below are the only witnesses and must
  have kind `witness`.
* Every other valid speaker is either the chair (`chair`) or a committee member
  (`member`).
* A committee member is never a witness.
* Use only genuine speakers from the transcript. Ignore automatically detected labels
  that are clearly fragments of spoken prose.

## Structural requirements

The JSON is checked automatically.

* Give the session 2-8 short chapters.
* Give each chapter a one-sentence takeaway.
* Aim for roughly 20-80 dialogue turns depending on the source length.
* Keep every turn under 700 characters.
* Split a long answer into several consecutive turns by the same speaker rather than
  writing one very long turn.
* Use only speaker labels declared in the `speakers` array.
* Include every speaker who appears in the condensed dialogue in the `speakers` array.
* Do not include speakers who never appear in the condensed dialogue unless required
  by the schema.
* Return only valid raw JSON matching the schema below, with no Markdown fence or
  surrounding text.

## Official metadata

* Parliament oral-evidence ID: 18102
* Required source hash: `3b00da099f6a0a50404a9f2027ae97d679432f12f4937f407f592c00984a4b4d`
* Committee: Northern Ireland Scrutiny Committee
* Subject: Article 2 of the Protocol/Windsor Framework
* Meeting date: 17 September 2026
* Transcript status: uncorrected
* Source: https://committees.parliament.uk/oralevidence/18102/html/

## Witness metadata

* Name not supplied: Leader, Ulster Unionist Party

## Speaker labels detected in the transcript

These are automatically detected and may contain errors. Use only labels that are
clearly real speakers in the source transcript.

* The Chair
* Jon Burrows
* Lord Dodds of Duncairn
* Baroness Foster of Aghadrumsee
* Baroness Ludford
* Unfortunately, people have taken a view on this
* Baroness Ritchie of Downpatrick
* Baroness Sanderson of Welton
* Lord Elliott of Ballinamallard
* Baroness Ritchie
* Lord Dodds

`Unfortunately, people have taken a view on this` is not a speaker and must be ignored.

## Output structure

Return exactly this structure:

{
  "schema_version": 1,
  "source_id": 18102,
  "source_sha256": "3b00da099f6a0a50404a9f2027ae97d679432f12f4937f407f592c00984a4b4d",
  "title": "A concise, engaging title",
  "label": "17 September 2026 · A short picker label",
  "summary": "One paragraph explaining what the hearing covered and its main conclusion.",
  "speakers": [
    {
      "label": "Chair",
      "name": "<the chair's actual name from the transcript>",
      "role": "Chair of the committee",
      "kind": "chair"
    },
    {
      "label": "<witness's actual name>",
      "name": "<witness's actual name>",
      "role": "<their role and organisation>",
      "kind": "witness"
    }
  ],
  "glossary": [
    {
      "term": "<a specialist term that still appears in your dialogue>",
      "definition": "<one plain-English sentence explaining it, max 200 characters>"
    }
  ],
  "chapters": [
    {
      "title": "Short chapter title",
      "takeaway": "One plain-English sentence capturing the chapter's main point.",
      "turns": [
        {
          "speaker": "Chair",
          "text": "The condensed, conversational line."
        }
      ]
    }
  ]
}

Replace every `<...>` placeholder with source-derived content. Never output the
placeholder text itself.

## Glossary rules

The `glossary` contains unfamiliar specialist terms that still appear in your
condensed dialogue. Use it for things such as:

* technical vocabulary;
* parliamentary or legal terms;
* economic or policy terms;
* acronyms;
* unfamiliar institutions;
* named regulatory systems.

Rules:

* Give 0-25 glossary entries.
* Include only terms that actually appear in the condensed dialogue.
* Write each term exactly as it appears in the dialogue.
* List each term once; never repeat a term.
* Give one plain-English sentence per definition.
* Keep each definition under 200 characters.
* Do not include ordinary everyday words.
* If jargon can be replaced cleanly without losing useful meaning, replace it.
* Keep a specialist term when knowing the term itself is useful to the reader, then
  explain it in the glossary.
* Do not use the glossary as an excuse to leave unnecessarily obscure writing in the
  dialogue.

Examples of terms that may belong in the glossary include:

* UNIDO
* statutory instrument
* Ofgem
* interoperability
* full-stack
* capacity building
* agentic AI

## Speaker kinds

Allowed speaker kinds are:

* `chair`
* `member`
* `witness`

If you use `Committee Member` for a speaker whom the transcript genuinely leaves
unnamed:

* set both `label` and `name` to `Committee Member`;
* give them kind `member`;
* explain in `role` that the label represents an unnamed committee questioner.
