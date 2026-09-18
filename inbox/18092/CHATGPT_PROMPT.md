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

- Parliament oral-evidence ID: 18092
- Required source hash: `4d98da8435ccfedbc5ff93e554c3b38b46ad2d33a1f128ae458786fafe988b13`
- Committee: Environment, Food and Rural Affairs Committee
- Subject: Climate adaptation and emergency response
- Meeting date: 15 September 2026
- Transcript status: published
- Source: https://committees.parliament.uk/oralevidence/18092/html/

Witness metadata:

- Name not supplied: Minister for Building Safety, Fire and Resilience, Ministry of Housing, Communities and Local Government
- Name not supplied: Parliamentary Under-Secretary of State, Department for Environment, Food and Rural Affairs
- Name not supplied: Director for Fire, Ministry of Housing, Communities and Local Government
- Name not supplied: Interim Director for Strategy, Governance and Climate, Ministry of Housing, Communities and Local Government

Speaker labels detected in the transcript:

- Environmental Audit Committee member present
- Chair
- Jenny Riddell-Carpenter
- Baroness Blake of Leeds
- Peter Lee
- Gabrielle Edwards
- Henry Tufnell
- Josh Newbury
- Sarah Bool
- Charlie Dewhirst
- Terry Jermy
- Sarah Dyke
- Mr Toby Perkins

Return exactly this structure:

{
  "schema_version": 1,
  "source_id": 18092,
  "source_sha256": "4d98da8435ccfedbc5ff93e554c3b38b46ad2d33a1f128ae458786fafe988b13",
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
