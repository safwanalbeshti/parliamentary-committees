# Condense this parliamentary evidence session

You've been given the original transcript of a parliamentary committee meeting. Produce a condensed version that a general reader can understand easily, while preserving a clear, verifiable connection to the original transcript.

The goal is not to condense as aggressively as possible. Preserve enough detail for the reader to understand the substance of the discussion, the reasoning behind important claims, and meaningful disagreements.

Present the result mainly as a shorter, natural dialogue between the people who took part. Use natural spoken English rather than formal parliamentary language. The dialogue should feel conversational and readable, but don't make serious speakers sound artificially chatty or informal.

Think carefully about what the discussion means before rewriting it. Use contractions naturally, such as "isn't" instead of "is not".

## Writing for a lay reader

Assume the reader has no background in politics, law, economics, science, technology, or the meeting's subject.

For every line, ask: could an ordinary reader with no specialist knowledge explain back what this sentence actually means? If not, rewrite it more concretely.

Follow these rules:

* Replace unnecessary jargon with the everyday idea it represents. Do not merely replace one piece of jargon with slightly simpler jargon.
  Example:
  `regulatory interoperability`
  -> `making sure different countries' rules can work together without conflicting`
* Keep specialist terms when knowing the term itself is useful. If you retain an unfamiliar technical, legal, political, economic, or parliamentary term, add it to the glossary.
* Briefly identify unfamiliar institutions where that helps immediate understanding.
  Example:
  `Ofgem, the energy regulator, ...`
* Remove specialist metaphors and state their literal meaning instead.
  Example:
  `there's little connective tissue between these initiatives`
  -> `there's very little coordination between these different initiatives`
  Do the same with phrases such as `the AI stack`, `joined-up government`, or `move the dial` when their meaning would not be obvious to a general reader.
* Avoid jargon-heavy strings of abstract nouns. Rewrite them around people, organisations, actions, or concrete outcomes.
  Example:
  `an independent evaluator ecosystem for model testing`
  -> `independent organisations that test AI models`
* When someone proposes a technical, legal, economic, or institutional measure, explain what people would actually do.
  Example:
  `tabletop crisis exercises`
  -> make clear that officials would practise responding together to a simulated crisis.
* Prefer concrete wording about who does what, what changes, and why it matters.
  Avoid vague phrases such as `drive implementation`, `strengthen frameworks`, or `enable coordination` unless the dialogue makes clear what those actions mean in practice.
* Do not over-explain ordinary concepts. The result should remain natural rather than becoming a textbook.

## Condensation and accuracy

The condensed version should feel like a readable conversation rather than meeting minutes.

Committee questions may be shortened substantially if their main purpose is simply to introduce the next issue. Witness answers may be reorganised slightly for clarity, but:

* Preserve who said what. Never transfer or combine claims between speakers.
* Preserve the speaker's actual position and level of certainty.
* Never turn speculation or qualified claims into stronger factual claims.
* Do not invent facts, motives, consensus, quotations, recommendations, or identities.
* Preserve disagreements, challenges, uncertainty, and qualifications whenever they materially affect the meaning.
* Do not simplify away important distinctions between genuinely different ideas.
* Keep the main reasoning, evidence, examples, and concrete proposals needed to understand the discussion.

You may remove:

* greetings and thanks;
* procedural remarks with no substantive content;
* verbal filler;
* repeated versions of the same point;
* long question preambles that do not affect the answer;
* tangents that add little to understanding;
* repeated examples when one strong example is enough.

Do not remove useful explanation merely to make the transcript shorter.

## Evidence and traceability to the original transcript

Every condensed dialogue turn must be traceable to what the speaker actually said in the original transcript.

* Give every condensed turn an `evidence` array containing one or more excerpts from the original transcript that support its content.
* Each evidence entry must contain a `source_turn` (the original speaking turn's number, counting from 1 in transcript order, including turns omitted from the condensed version) and a `quote` (a verbatim, continuous excerpt from that turn).
* Evidence quotations must reproduce the original wording exactly. Never paraphrase, silently correct, or invent text inside an evidence quotation.
* Choose excerpts that substantiate the meaningful claims, reasoning, and qualifications in the condensed turn. Use multiple excerpts where necessary.
* Every substantive claim in the condensed dialogue must be supported by its associated evidence. Don't add interpretations that go beyond what the cited passages establish.
* Evidence should normally come from the same speaker as the condensed turn. Don't use one speaker's words as evidence that another speaker said or believed something.
* The evidence excerpts need not reproduce entire original answers. Include enough original wording to make the connection clear and independently verifiable.
* Keep evidence separate from the condensed dialogue so readers can read the conversation naturally while still being able to inspect its original basis.

You may also preserve short, particularly meaningful **direct quotations within the condensed dialogue itself**.

* Use direct quotations when the speaker's exact phrasing is especially revealing, memorable, significant, or useful for understanding their position.
* Mark these quotations explicitly with double quotation marks (`“...”`) within the dialogue text.
* Everything inside these quotation marks must be the speaker's exact words from the original transcript, with no unmarked omissions or alterations.
* The rest of the dialogue can be rewritten naturally, provided its meaning is supported by the evidence.
* Avoid excessive direct quotation. Most dialogue should remain a clear, natural paraphrase, with occasional original wording where it adds value.
* Every direct quotation must also be present verbatim in the associated evidence.

The aim is for a reader to encounter an accessible, condensed conversation, but also to be able to inspect the original words behind any dialogue turn. The evidence is a source record, not additional dialogue.

## Speaker rules

* Keep every named speaker's real name exactly as the transcript gives it.
* Never replace a named committee member with `Committee Member`.
* Use `Committee Member` only if the transcript genuinely leaves a speaker unnamed.
* Never merge different speakers.
* Use `Chair` for the chair when that makes the dialogue easier to follow.
* Witnesses are the people invited to give evidence, usually listed at the start of the transcript or of each panel. Give them kind `witness`. The people under `Witness metadata` below are Parliament's official list of witnesses; where it says "Name not supplied", use the name the transcript gives for that role.
* Every other valid speaker is either the chair (`chair`) or a committee member (`member`).
* A committee member is never a witness.
* Use only genuine speakers from the transcript. Ignore text that looks like a speaker label but is clearly a fragment of spoken prose.

## Structural requirements

The JSON is checked automatically.

* Give the session 2-8 short chapters.
* Give each chapter a one-sentence takeaway.
* Aim for roughly 20-80 dialogue turns depending on the source length.
* Keep every turn's `text` under 700 characters. Evidence excerpts don't count towards this limit.
* Make every turn's `text` at least 10 characters. Turn a bare reply such as "Yes." into a short sentence, for example "Yes, that's right."
* Split a long answer into several consecutive turns by the same speaker rather than writing one very long turn.
* Every dialogue turn must have a non-empty `evidence` array.
* Use only speaker labels declared in the `speakers` array.
* Include every speaker who appears in the condensed dialogue in the `speakers` array.
* Do not include speakers who never appear in the condensed dialogue unless required by the schema.
* Return only valid raw JSON matching the schema below, with no Markdown fence or surrounding text.

## Official metadata

* Parliament oral-evidence ID: 18312
* Required source hash: `4c5976afc5e660fdc349623df9da6784c9e69fe49b9428c8dce0491820206a81`
* Committee: National Security Strategy (Joint Committee)
* Subject: Space resilience
* Meeting date: 16 November 2026
* Transcript status: published
* Source: https://committees.parliament.uk/oralevidence/18312/html/

## Witness metadata

* Dr Michelle Howard: Defence and Space Policy Advisor at The D Group, and Head of Defence, Space4Earth Capital
* Major General Paul Tedman: Former Commander, UK Space Command, and Managing Director for European Space, Anduril Industries
* Name not supplied: Director, Policy and Public Affairs, ADS Group

## Speaker labels detected in the transcript

These are automatically detected and may contain errors. Use only labels that are clearly real speakers in the source transcript.

* The Chair
* Nathan Mathiot
* Dr Michelle Howard
* Major General Paul Tedman
* Helen Maguire
* Lord Sedwill
* Lord Godson
* Lord Watts

## Output structure

Return exactly this structure:

```json
{
  "schema_version": 1,
  "source_id": 18312,
  "source_sha256": "4c5976afc5e660fdc349623df9da6784c9e69fe49b9428c8dce0491820206a81",
  "title": "A concise, engaging title",
  "label": "16 November 2026 · A short picker label",
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
          "text": "The condensed, conversational line, optionally including a short “verbatim quotation” from the original speaker.",
          "evidence": [
            {
              "source_turn": 12,
              "quote": "<an exact, verbatim excerpt from original speaking turn 12>"
            },
            {
              "source_turn": 14,
              "quote": "<another exact excerpt if needed to support the condensed line>"
            }
          ]
        }
      ]
    }
  ]
}
```

Replace every `<...>` placeholder with source-derived content. Never output the placeholder text itself. The `source_turn` numbers above are illustrative; replace them with the correct original turn numbers.

## Glossary rules

The `glossary` contains unfamiliar specialist terms that still appear in your condensed dialogue. Use it for things such as:

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
* Keep a specialist term when knowing the term itself is useful to the reader, then explain it in the glossary.
* Do not use the glossary as an excuse to leave unnecessarily obscure writing in the dialogue.

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

If you use `Committee Member` for a speaker whom the transcript genuinely leaves unnamed:

* set both `label` and `name` to `Committee Member`;
* give them kind `member`;
* explain in `role` that the label represents an unnamed committee questioner.
