# Condense this parliamentary evidence session

Upload `transcript.txt` with this prompt. Read the entire transcript before writing.

The goal is a substantially shorter, accurate, plain-English dialogue for a general
reader. It should still be detailed enough to preserve the important arguments,
qualifications, disagreements and practical examples.

Requirements:

- Use casual, natural language and contractions such as “isn’t” and “we’re”.
- Preserve who said what. Never transfer a claim from one witness to another.
- Do not invent facts, motives, consensus, quotations or speaker identities.
- Paraphrase rather than quote. The result is not a verbatim transcript.
- Keep meaningful challenges and disagreements instead of smoothing them away.
- You may merge repetitive committee questions into a clearly labelled
  `Committee Member` voice, but never merge different witnesses.
- Use `Chair` for the chair when that makes the dialogue easier to follow.
- Give the session 2–8 short chapters, each with a one-sentence takeaway.
- Aim for roughly 20–80 dialogue turns, depending on the source length. Never
  exceed 100 turns; condense harder instead.
- Keep every turn under 700 characters. Split a long answer into several
  consecutive turns by the same speaker rather than writing one long turn.
- Use only speaker labels declared in the `speakers` array.
- Return raw JSON only: no Markdown fence, introduction or commentary.

Official metadata:

- Parliament oral-evidence ID: 18091
- Required source hash: `0295f70426adf66dd7343e5b285493c8888a2b784fe810e0b54fea9d58b0493b`
- Committee: Communications and Digital Committee
- Subject: The Online Safety Act: implementation and impact
- Meeting date: 15 September 2026
- Transcript status: uncorrected
- Source: https://committees.parliament.uk/oralevidence/18091/html/

Witness metadata:

- Name not supplied: Director, Online Safety Strategy Delivery, Ofcom
- Name not supplied: Enforcement Director, Ofcom
- Name not supplied: Group Director, Online Safety, Ofcom

Speaker labels detected in the transcript:

- The Chair
- Oliver Griffiths
- Suzanne Cater
- Mark Bunting
- Baroness Caine of Kentish Town
- Lord Storey
- Viscount Colville of Culross
- Baroness Fleet
- Baroness Elliott of Whitburn Bay
- Lord Kirkhope of Harrogate
- Lord Knight of Weymouth
- Lord Tarassenko

Return exactly this structure:

{
  "schema_version": 1,
  "source_id": 18091,
  "source_sha256": "0295f70426adf66dd7343e5b285493c8888a2b784fe810e0b54fea9d58b0493b",
  "title": "A concise, engaging title",
  "label": "15 September 2026 · A short picker label",
  "summary": "One paragraph explaining what the hearing covered and its main conclusion.",
  "speakers": [
    {
      "label": "Chair",
      "name": "The chair's real name",
      "role": "Chair of the committee",
      "kind": "chair"
    },
    {
      "label": "Witness Name",
      "name": "Witness Name",
      "role": "Their role and organisation",
      "kind": "witness"
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

Allowed speaker kinds are `chair`, `member`, and `witness`. If you use the composite
label `Committee Member`, set both its label and name to `Committee Member`, give it
kind `member`, and explain in its role that it combines repetitive questions.
