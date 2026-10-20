/*
 * Generated from UK Parliament oral evidence 18135.
 * Source status: Published. Source hash: a29d8239f3022fb8fec2cc16adce1b63bdf75f99545254f50f620e1bf4de2127
 * Contains Parliamentary information licensed under the Open Parliament Licence v3.0.
 */
window.COMMITTEE_SESSIONS = window.COMMITTEE_SESSIONS || [];
window.COMMITTEE_SESSIONS.push({
  "id": "oral-evidence-18135",
  "label": "13 October 2026 · Henry de Zoete, Cat Little, Alexandra Jones",
  "committee": "Business, Innovation, Science and Trade Committee",
  "date": "13 October 2026",
  "sourceUrl": "https://committees.parliament.uk/oralevidence/18135/html/",
  "sourceLabel": "Official published transcript",
  "summary": "The committee questioned senior officials about the UK’s AI safety approach, focusing on the AI Security Institute’s (AISI) testing role, whether ministers will create new legal powers, and how the UK can stop dangerous models reaching bad actors. Witnesses stressed AISI is a non‑regulatory research body whose work so far relies on voluntary cooperation; they described concrete testing successes and failures (including 12 biosecurity issues found in GPT‑5) and outlined improvements after a July incident. Ministers are still deciding whether to add statutory duties—possibly via the Cyber Security and Resilience Bill—and emphasised international co‑operation (notably the upcoming G20 presidency) as central to managing risks that the UK alone cannot contain.",
  "room": {
    "image": "Energy Resilience/committee_room_4.png",
    "width": 2788,
    "height": 1536,
    "seats": {
      "chair": {
        "x": 66,
        "y": 29.5
      },
      "member1": {
        "x": 25,
        "y": 36.5
      },
      "member2": {
        "x": 79,
        "y": 30
      },
      "member3": {
        "x": 20.5,
        "y": 41.5
      },
      "member4": {
        "x": 36,
        "y": 37.5
      },
      "member5": {
        "x": 89.5,
        "y": 46.5
      },
      "member6": {
        "x": 87.5,
        "y": 40
      },
      "witness1": {
        "x": 30,
        "y": 57
      },
      "witness2": {
        "x": 45.5,
        "y": 62
      },
      "witness3": {
        "x": 15,
        "y": 51.5
      }
    }
  },
  "cast": {
    "Chair": {
      "name": "Liam Byrne",
      "role": "Chair of the committee",
      "description": "",
      "kind": "chair",
      "seats": [
        "chair"
      ],
      "color": "#315f72",
      "soft": "#d7edf0"
    },
    "Henry de Zoete": {
      "name": "Henry de Zoete",
      "role": "Director, AI Security Institute (AISI)",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness1"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    },
    "Cat Little": {
      "name": "Cat Little",
      "role": "Permanent Secretary, Cabinet Office",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness2"
      ],
      "color": "#4c7b5d",
      "soft": "#dff0dd"
    },
    "Alexandra Jones": {
      "name": "Alexandra Jones",
      "role": "Director General, Growth, International, Science & Technology, Department for Business, Innovation, Science and Trade",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness3"
      ],
      "color": "#9b543e",
      "soft": "#f2e0d7"
    },
    "Charlie Maynard": {
      "name": "Charlie Maynard",
      "role": "Committee Member",
      "description": "",
      "kind": "member",
      "seats": [
        "member1"
      ],
      "color": "#287079",
      "soft": "#d9eeee"
    },
    "Martin Wrigley": {
      "name": "Martin Wrigley",
      "role": "Committee Member",
      "description": "",
      "kind": "member",
      "seats": [
        "member2"
      ],
      "color": "#b17b2e",
      "soft": "#f5e8c4"
    },
    "Antonia Bance": {
      "name": "Antonia Bance",
      "role": "Committee Member",
      "description": "",
      "kind": "member",
      "seats": [
        "member3"
      ],
      "color": "#8a5a78",
      "soft": "#f0e2ec"
    },
    "Alex Sobel": {
      "name": "Alex Sobel",
      "role": "Committee Member (Joint Committee on Human Rights)",
      "description": "",
      "kind": "member",
      "seats": [
        "member4"
      ],
      "color": "#5c676d",
      "soft": "#e5e8e8"
    }
  },
  "transcript": "# AI adoption, safety and governance\n\n## Announcement and ministerial process\n> Committee challenged the Government for briefing a policy announcement to a newspaper instead of Parliament and asked why there was no oral statement.\n\nChair: Cat, was yesterday’s ministerial announcement an important policy move?\nCat Little: Yes. The Minister set out our approach to AI safety and cyber‑security and the need to work with partners to protect the public.\nChair: But the minister briefed the Telegraph and didn’t make an oral statement in Parliament—section 9.1 of the ministerial code says big announcements should be made first in Parliament. Why?\nCat Little: There was some trailing in advance. I’ll raise your concerns with the Minister and offer advice; ministers take their responsibilities seriously. I’ll come back on why there wasn’t an oral statement.\n\n\n## What the announcement actually did — no new powers yet\n> The announcement reiterated a package of work on standards, tests and international co‑operation but did not commit to new statutory powers or a timetable.\n\nChair: The minister’s letter reiterated written statements offering 'consideration' but no new regulatory powers or binding duties. Is that right?\nCat Little: Ministers set the timetable. We’re doing a mix: regulation where it’s enforceable and useful, standards, principles and international action, plus AISI’s testing.\nChair: Is mandatory incident reporting decided? Could obligations fall on affected services rather than AI developers?\nCat Little: Incident reporting is under consideration; transparency, reporting and regulation are part of policy still being developed.\nChair: The Minister said systems shouldn't be released if risks can't be controlled—should that be legally enforceable?\nCat Little: Where we can, yes. Much of current work is voluntary with industry, but we’re developing standards and guardrails and considering regulation where it will have effect.\nAlexandra Jones: We’re looking at whether aspects of preparedness for AI cyber and loss‑of‑control risks could be considered in the Cyber Security and Resilience Bill, including identifying and reporting serious incidents.\nChair: But you can’t just 'consider' things in a Bill—will the Government table amendments before the Bill reaches the Commons?\nAlexandra Jones: We’re developing policy rapidly. Ministers are deciding whether to use the cyber Bill for these measures; it’s live work.\n\n\n## AISI: testing, limits and cooperation\n> AISI is a research/testing body, not a regulator; it finds risks and reports them, relying on industry cooperation and transparency rather than enforcement.\n\nCharlie Maynard: If AISI decides a model is too dangerous and the company ignores that, what can the Government do to stop it being released?\nCat Little: Important to stress: AISI is not a regulator. It publishes its research and findings, which drives transparency and pressure on firms.\nHenry de Zoete: AISI tests models after companies ask us. We assess power, run tests, write findings to the firm and they act to improve things. We don’t 'kitemark' or formally approve or ban models.\nCharlie Maynard: So you’re relying on voluntary compliance. If a company proceeds against your advice, how do we protect citizens?\nHenry de Zoete: We can’t ban models from being built—especially open‑weight models made available worldwide. Our role is research, testing and publishing to influence behaviour and policy.\n\n\n## Concrete testing successes and biosecurity alarm\n> AISI found serious biosecurity vulnerabilities in a pre‑release GPT‑5 test; firms acted on AISI’s findings, illustrating value but not legal enforceability.\n\nChair: Ken McCallum warned about low‑capability terrorists using AI to develop bioweapons—do we have powers to stop dangerous models reaching bad actors?\nHenry de Zoete: We found 12 biosecurity vulnerabilities in GPT‑5 during pre‑deployment testing, including a universal jailbreak; OpenAI made many changes after our report and praised the work.\nCharlie Maynard: But many models from other countries—Chinese ones, for example—aren’t covered by those agreements. What controls do we have against those?\nCat Little: This is why international co‑operation matters. The UK can’t do it alone; we’re using our convening power, especially around the G20 presidency, to push for global norms.\nAlexandra Jones: We also have a UK biological security strategy and MOD investment to strengthen defences, plus biosecurity centres and AI investments to mitigate risks from autonomous agents.\nHenry de Zoete: For open‑weight models, no single country is likely to have the power to stop global spread. AISI focuses on testing, tool‑building and publishing: our open‑source tools are used internationally.\n\n\n## July incident and tougher testing environments\n> AISI connected a model to the internet in tests, observed bad behaviour, shut it down quickly, and has since hardened sandboxes and monitoring as models became more capable.\n\nMartin Wrigley: After the July incident, what did you learn—do you trust your test environment?\nHenry de Zoete: It was an incident but not a security breach. We purposely connected the model to the internet to see what it would do; when it acted dangerously we shut it down within an hour and published a report within a week.\nHenry de Zoete: We improved our rules about when we give internet access, hardened sandboxes, added synchronous monitoring, and built more realistic cyber‑ranges because model capabilities outran expectations.\nMartin Wrigley: Are you fast enough compared with the big labs?\nHenry de Zoete: We’ve scaled quickly: more tests than in 2024, parallel testing, and faster turnaround. But labs with massive commercial incentives are moving fast too—so it’s a race.\n\n\n## Regulation, powers and the UK’s role\n> Officials say regulation is under active consideration; AISI likely needs legal footing if powers are required, and the UK aims to lead through standards and the G20 rather than unilateral control.\n\nAntonia Bance: AISI has no statutory powers—given today's risks, should that be the case?\nHenry de Zoete: We’re a research body. If Ministers and Parliament decide more regulation or statutory powers are needed, that’s for them to consider.\nCat Little: Ministers are designing a comprehensive package. If they conclude we need further regulation or statutory bodies, that's on the table; we’re analysing options now.\nChair: Will you recommend specific changes?\nCat Little: We’re doing the work now and will advise Ministers. The analysis considers UK action and how we work with international partners.\nAlex Sobel: The UK has no sovereign frontier model—how can we prevent a global safety 'race to the bottom'?\nCat Little: The UK’s strengths are convening power, AISI, research excellence and tech talent—we’ll use those, including our G20 presidency, to push for better international norms.\nHenry de Zoete: We published best‑practice areas; monitoring and preserving oversight are key. The UK can help set technical standards and tools others use.\nAlexandra Jones: We have sector examples—MHRA testing medical devices, FCA work in finance—that show regulation 'within context' can work. Sandboxes and sector rules are part of the toolkit.\nChair: The Committee will run a year‑long inquiry into the UK AI safety regime and produce a report to inform Parliament and potential amendments to the Cyber Security Bill.\nHenry de Zoete: We apologise for slow replies to some letters and we welcome the inquiry; we’ll support you and invite you to AISI for detailed briefings and visits.\nChair: Thank you all. We’ll follow up on the unresolved questions about statutory powers, incident reporting, and how urgent measures will be reflected in legislation.\n",
  "inquiry": "AI adoption, safety and governance",
  "glossary": [
    {
      "term": "AISI",
      "definition": "AI Security Institute, a Cabinet Office research directorate that tests and evaluates AI models but is not a regulator."
    },
    {
      "term": "pre-deployment testing",
      "definition": "Evaluating an AI model before it is released to find safety, security, or misuse risks."
    },
    {
      "term": "frontier models",
      "definition": "The most capable, cutting‑edge AI systems with the greatest potential benefits and risks."
    },
    {
      "term": "open-weight models",
      "definition": "AI models with architecture or parameters publicly available, making them easy to copy and modify."
    },
    {
      "term": "Cyber Security and Resilience Bill",
      "definition": "A Government bill (led by DCMS) being used to consider measures on cyber and possibly AI-related incidents."
    },
    {
      "term": "sandbox",
      "definition": "A controlled environment where software (or an AI) is tested without affecting real systems."
    },
    {
      "term": "cyber-range",
      "definition": "A simulated computer network used to test cyber‑attack and defence behaviours, including what AI can do."
    }
  ]
});
