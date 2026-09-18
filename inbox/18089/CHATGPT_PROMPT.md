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
- Aim for roughly 20–80 dialogue turns, depending on the source length.
- Use only speaker labels declared in the `speakers` array.
- Return raw JSON only: no Markdown fence, introduction or commentary.

Official metadata:

- Parliament oral-evidence ID: 18089
- Required source hash: `373a11fd3c75a42efc55d6870a42bb2de0a7a05225910dbe607358dab1a7a1f9`
- Committee: Constitution Committee
- Subject: The UK’s constitutional safeguards
- Meeting date: 16 September 2026
- Transcript status: uncorrected
- Source: https://committees.parliament.uk/oralevidence/18089/html/

Witness metadata:

- Lord Young of Old Windsor: former Principal Private Secretary, The Royal Household

Speaker labels detected in the transcript:

- The Chair
- Lord Young of Old Windsor
- Lord Murphy of Torfaen
- Lord Burnett of Maldon
- Lord Beith
- Lord Jones of Penybont
- Baroness Hamwee
- Lord Griffiths of Burry Port
- Lord Bellamy
- Baroness Laing of Elderslie
- Lord Cryer

Return exactly this structure:

{
  "schema_version": 1,
  "source_id": 18089,
  "source_sha256": "373a11fd3c75a42efc55d6870a42bb2de0a7a05225910dbe607358dab1a7a1f9",
  "title": "A concise, engaging title",
  "label": "16 September 2026 · A short picker label",
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
