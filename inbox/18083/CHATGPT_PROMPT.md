# Condense this parliamentary evidence session

You've been given the transcript of a parliamentary committee meeting. Come up with
a condensed version that a layman can understand. Ideally, it consists of a much
shorter (though not very short) dialogue in which things are explained in layman
terms. The characters speak to each other in a casual way rather than an overly
formal way. Think hard about what the conversation is about before producing this
condensed natural dialogue, so as to make sure that you are not misunderstanding
what it was about. Make sure contractions are used (e.g. "isn't" instead of
"is not"), and don't omit the speaker's name.

Assume the reader has no background in politics, law, economics or this meeting's
subject. Do not let any specialist term through unexplained: wherever the
transcript uses jargon, an acronym, an institution's name, or a term with a
special meaning (e.g. "statutory instrument", "interconnector", "Section 35
order", "the usual channels"), either swap it for everyday words or have the
speaker explain it naturally in passing the first time it appears — for example
"Ofgem, the energy regulator, …" or "a statutory instrument — a law ministers
can pass without a full vote in Parliament — …". Prefer concrete, everyday
phrasing over abstract wording throughout. A typical citizen should be able to
follow every line without looking anything up.

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
- Keep every named speaker's real name exactly as the transcript gives it. Never
  replace a named committee member with a generic label such as `Committee
  Member`. Use `Committee Member` only for a speaker the transcript itself
  leaves unnamed, and never merge different witnesses.
- Use `Chair` for the chair when that makes the dialogue easier to follow.
- The people listed under "Witness metadata" below are the only witnesses: give
  exactly them kind `witness`. Every other speaker is the chair (kind `chair`)
  or a committee member (kind `member`). A committee member is never a witness.

Structural requirements (the JSON is checked automatically):

- Give the session 2–8 short chapters, each with a one-sentence takeaway.
- Aim for roughly 20–80 dialogue turns, depending on the source length. Never
  exceed 100 turns; condense harder instead.
- Keep every turn under 700 characters. Split a long answer into several
  consecutive turns by the same speaker rather than writing one long turn.
- Use only speaker labels declared in the `speakers` array.
- Return raw JSON only: no Markdown fence, introduction or commentary.

Official metadata:

- Parliament oral-evidence ID: 18083
- Required source hash: `da15ced900a17d5346892c56612602e5e5a6d994e401bb380175917b0114cbe4`
- Committee: European Affairs Committee
- Subject: UK-EU Agreement on Gibraltar
- Meeting date: 15 September 2026
- Transcript status: uncorrected
- Source: https://committees.parliament.uk/oralevidence/18083/html/

Witness metadata:

- Hon Fabian Picardo KC MP: Chief Minister, Government of Gibraltar

Speaker labels detected in the transcript:

- The Chair
- Fabian Picardo
- Baroness Suttie
- The Duke of Wellington
- Baroness Smith of Newnham
- Lord Jackson of Peterborough
- Lord Brennan of Canton
- Lord Grantchester
- Lord Elliott of Mickle Fell
- Lord Barrow
- Baroness Ashton of Upholland
- Lord Tugendhat
- Lord Moynihan of Chelsea

Return exactly this structure:

{
  "schema_version": 1,
  "source_id": 18083,
  "source_sha256": "da15ced900a17d5346892c56612602e5e5a6d994e401bb380175917b0114cbe4",
  "title": "A concise, engaging title",
  "label": "15 September 2026 · A short picker label",
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
      "term": "<a term used in your dialogue that a layman would not know>",
      "definition": "<one plain sentence explaining it, max 200 characters>"
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

Every value written above in <angle brackets> is a description of what to write,
not text to copy: replace it with the real thing from the transcript. Never emit a
name containing the words "actual name" or "real name".

The `glossary` lists terms that still appear in YOUR dialogue and that a general
reader would not know — acronyms, institutions, and technical or parliamentary
vocabulary (for example "UNIDO", "statutory instrument", "Ofgem"). Give 0–25
entries, each defined in one plain sentence. Write the term exactly as it appears
in your dialogue. Do not include everyday words.

Allowed speaker kinds are `chair`, `member`, and `witness`. If you use the label
`Committee Member` for speakers the transcript leaves unnamed, set both its label
and name to `Committee Member`, give it kind `member`, and explain in its role that
it stands in for unnamed questioners.
