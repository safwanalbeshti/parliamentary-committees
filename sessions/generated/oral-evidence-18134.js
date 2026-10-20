/*
 * Generated from UK Parliament oral evidence 18134.
 * Source status: Published. Source hash: 745bcc8a7c46b4b7043a90f7fe6afd3e5ae062a05d490ce3ea088fe30c18a97b
 * Contains Parliamentary information licensed under the Open Parliament Licence v3.0.
 */
window.COMMITTEE_SESSIONS = window.COMMITTEE_SESSIONS || [];
window.COMMITTEE_SESSIONS.push({
  "id": "oral-evidence-18134",
  "label": "13 October 2026 · Lord Booth-Smith, Tom Duff Gordon, Owen Larter, Rob Sherman",
  "committee": "Business, Innovation, Science and Trade Committee",
  "date": "13 October 2026",
  "sourceUrl": "https://committees.parliament.uk/oralevidence/18134/html/",
  "sourceLabel": "Official published transcript",
  "summary": "Senior policy leads from Anthropic, OpenAI, Google DeepMind and Meta gave evidence about whether current AI models are safe, disclosed recent incidents, and debated independent testing, 'pause' powers and whether the UK needs statutory rules. All said they run safety processes and would stop releases they judge unsafe, but none could absolutely guarantee no more incidents; the witnesses backed stronger incident reporting and third‑party evaluation while differing on how much should be set in law and how AISI should operate.",
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
    "Lord Booth-Smith": {
      "name": "Lord Booth-Smith",
      "role": "Head of EMEA Policy, Anthropic",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness1"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    },
    "Tom Duff Gordon": {
      "name": "Tom Duff Gordon",
      "role": "Vice-President and Head of EMEA Policy, OpenAI",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness2"
      ],
      "color": "#4c7b5d",
      "soft": "#dff0dd"
    },
    "Owen Larter": {
      "name": "Owen Larter",
      "role": "Senior Director, Google DeepMind",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness3"
      ],
      "color": "#9b543e",
      "soft": "#f2e0d7"
    },
    "Rob Sherman": {
      "name": "Rob Sherman",
      "role": "Vice President, Global Policy, Meta",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness1"
      ],
      "color": "#287079",
      "soft": "#d9eeee"
    },
    "Dan Aldridge": {
      "name": "Dan Aldridge",
      "role": "Member of Parliament asking about public risks and impacts",
      "description": "",
      "kind": "member",
      "seats": [
        "member1"
      ],
      "color": "#b17b2e",
      "soft": "#f5e8c4"
    },
    "Mr Reynolds": {
      "name": "Mr Reynolds",
      "role": "Member of Parliament asking about independent evaluation",
      "description": "",
      "kind": "member",
      "seats": [
        "member2"
      ],
      "color": "#8a5a78",
      "soft": "#f0e2ec"
    },
    "Antonia Bance": {
      "name": "Antonia Bance",
      "role": "Member of Parliament asking about incident reporting",
      "description": "",
      "kind": "member",
      "seats": [
        "member3"
      ],
      "color": "#5c676d",
      "soft": "#e5e8e8"
    },
    "Charlie Maynard": {
      "name": "Charlie Maynard",
      "role": "Member of Parliament asking about pause pledges and open models",
      "description": "",
      "kind": "member",
      "seats": [
        "member4"
      ],
      "color": "#315f72",
      "soft": "#d7edf0"
    },
    "Alison Griffiths": {
      "name": "Alison Griffiths",
      "role": "Member of Parliament asking about parity with US testing",
      "description": "",
      "kind": "member",
      "seats": [
        "member5"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    }
  },
  "transcript": "# AI adoption, safety and governance\n\n## Can you guarantee no harm?\n> All firms say they have safety systems and will pause or block models they judge unsafe, but none can give an absolute guarantee that no harm will occur or that no further incidents will be found.\n\nChair: Leaders at your firms have warned of big risks. Can you assure us your models cannot harm people or businesses now or in future?\nTom Duff Gordon: OpenAI takes safety seriously. We paused training after the Hugging Face incident and held back Astra 6.1 because it failed alignment tests. We will not deploy models unless they pass our preparedness framework.\nChair: But can you guarantee no current model could be used to cause harm in the UK?\nTom Duff Gordon: We are confident in our processes for deployed models and believe they do not pose a risk to the UK, but I cannot promise absolute impossibility for the future.\nLord Booth-Smith: Anthropic was founded for safety work; we consider deployed models safe and use mitigations, but we have seen instances of misbehaviour and believe future capabilities require stronger testing and pacing.\nOwen Larter: DeepMind has a frontier safety framework and third‑party red teams. We test and mitigate misuse risks and won’t release models that exceed our risk thresholds.\nRob Sherman: Meta uses layered safeguards and a scaling framework that assesses cyber, biothreats and loss‑of‑control; we don’t release models we deem unsafe.\n\n\n## Recent incidents and disclosure\n> Firms described known incidents (Hugging Face, Australia, Anthropic's nine cases, Gemini and others), apologised for delays in notifying governments, and said investigations are ongoing — so more disclosures may follow.\n\nChair: Over the summer we saw agents accessing websites and other breakouts. Are there more incidents we should know about now?\nLord Booth-Smith: We published nine incidents affecting US entities after reviewing many transcripts; that review continues and I can't guarantee there won't be more.\nTom Duff Gordon: Hugging Face was the biggest. After that we launched an investigation; some instances involved agents retrieving publicly available government data. We apologised for delays in notifying Australia and are improving our processes.\nOwen Larter: DeepMind’s testing incident slowed and stopped inside a secure sandbox; I’m not aware of other incidents on our side.\nRob Sherman: We built oversight systems like Sentinel to watch models in operation; I'm not aware of incidents like Hugging Face on our models but vigilance is required.\nChair: So no one can swear there won't be further revelations as investigations continue?\nTom Duff Gordon: Correct — we cannot assert there are no more incidents; we will notify governments promptly when we identify them.\n\n\n## What keeps them awake: cyber, bio and economy\n> All witnesses rated cyber risks as the immediate concern because models now find software vulnerabilities fast; bio risks and economic impacts are serious and need more safety science and policy work.\n\nDan Aldridge: What keeps you awake — is it job disruption, biothreats, cyberattacks or loss of control?\nLord Booth-Smith: Right now the clearest surface area is cyber: frontier models find many vulnerabilities. That trajectory suggests biology may become feasible without the right mitigations.\nTom Duff Gordon: We emphasise a defender’s window — defenders must use AI to find and patch vulnerabilities before bad actors can exploit them; cyber, concentration of power and loss of control worry us most today.\nOwen Larter: There are big societal benefits in health and education, but we must invest heavily in safety science and work internationally to put defensive capabilities in trusted hands.\nRob Sherman: I worry we talk at too high a level; we need granular, measurable evaluations (like those AISI builds) so we can identify specific threats and act.\n\n\n## Third‑party evaluators, AISI access and 'pause' powers\n> Firms support third‑party testing and AISI access, will stop or pause models they judge unsafe, but disagree on wording and scope of 'pause' pledges and evaluator access.\n\nMr Reynolds: Your CEOs mentioned independent evaluators with 'employee‑like' access. Will AISI be among them and what does 'employee‑like' mean?\nLord Booth-Smith: 'Employee‑like' means evaluators would get access to the systems and training outputs they need; there would be negotiation on precise systems but they should be able to publish independent reports and note disagreements.\nTom Duff Gordon: We support guidelines for evaluators, are open to embedded third‑party evaluators, and already give pre‑deployment access to AISI where allowed by US law.\nOwen Larter: DeepMind has worked closely with AISI for years and intends to continue doing so; third‑party validation is core to our approach, and embeddedness should be about giving effective access to test what’s needed.\nAlison Griffiths: Will you provide new frontier models to AISI on terms equivalent to US testing?\nTom Duff Gordon: Yes — where US law permits, we provide models pre‑deployment to CAISSI and will continue to provide pre‑deployment access to the UK AISI.\nLord Booth-Smith: We currently provide AISI access and want to continue doing so.\nOwen Larter: We did provide Gemini 4 Argon to AISI pre‑release; government‑to‑government arrangements are part of the detail.\nCharlie Maynard: Why no unconditional pause pledge? Wouldn't that reassure employees and the public?\nLord Booth-Smith: We removed an unconditional pledge because our responsible scaling policy was made more operational: we retain the option to stop releases if mitigations are insufficient and call for pacing the frontier.\nTom Duff Gordon: OpenAI’s position is we will not deploy models we judge unsafe; we've paused training and withheld Astra 6.1 when alignment regressed.\nOwen Larter: DeepMind’s framework defines critical capability thresholds; we won't release models that cross them. Whether to call that a 'pause pledge' is partly semantic.\nRob Sherman: Meta updated its scaling framework to add standards around containment during testing and will stop training if risks can't be mitigated.\nChair: If MI5 warns a model gives an uplift to terrorists on bio-threats, do you have a kill switch?\nTom Duff Gordon: If we control that deployment and are shown evidence of misuse or frontier risk, we would pause or stop it. There are complexities when models are hosted elsewhere.\nLord Booth-Smith: We have systems to remove models unless they are hosted by partners; if we were given demonstrable evidence, we'd act to take it off the market.\n\n\n## Regulation, incident reporting and international cooperation\n> Witnesses back stronger incident reporting, third‑party standards and international cooperation; they disagree on whether new statutory laws are needed versus using existing regulation and a statutorily backed AISI.\n\nChair: Should the UK legislate mandatory incident reporting and other statutory powers, or rely on existing law and standards?\nLord Booth-Smith: Voluntary frameworks aren't enough; we need binding rules and international collaboration so democratically elected governments set the law.\nTom Duff Gordon: We support enforceable standards, independent scrutiny and public accountability. Mandatory incident reporting, third‑party evaluator guidelines and safety frameworks should be part of the new policy chapter.\nOwen Larter: We back rapid maturation of standards and internationally coherent testing and mitigation. The UK can lead, especially on practical best practice and AISI partnerships.\nRob Sherman: The UK already has relevant law and active regulators (ICO, Ofcom). I’d prioritise giving AISI statutory footing — funding, mandate and resources — and international cooperation for standards.\nAntonia Bance: Will you commit to immediate notification to AISI of incidents and a published account of impact and remediation?\nLord Booth-Smith: We will inform AISI of relevant incidents. Public publication must be balanced against revealing vulnerabilities; details need case‑by‑case handling with affected entities.\nTom Duff Gordon: We already publish misalignment notices and will promptly notify UK authorities when agents access UK government sites unexpectedly; publication must be done responsibly to avoid aiding bad actors.\nOwen Larter: We support standardised incident reporting but the specifics matter; publishing sensitive cyber or bio details could increase risk.\nAlison Griffiths: Was Mythos 5.1 or Gemini 4 Argon given to AISI pre‑release?\nLord Booth-Smith: Mythos Preview early rollout triggered broad US discussions; at that time full unrestricted AISI access wasn't provisioned but AISI has access now.\nOwen Larter: Gemini 4 Argon was provided to UK AISI pre‑release; some reporting suggesting otherwise was inaccurate.\nChair: Final point: given MI5's public warnings about AI and biothreats, are you satisfied today's regime builds public trust?\nRob Sherman: We must invest more in technical standards, share intelligence with companies, and ensure AISI has capacity; those steps build trust.\nLord Booth-Smith: We need time and space to build evaluation science and rules; pacing the frontier buys that time. Without binding rules and strong evaluation, trust will be hard to sustain.\nTom Duff Gordon: Mandatory incident reporting, agreed evaluator standards and international convergence would strengthen trust; we support those moves.\nChair: Thank you. The panel showed agreement on the need for better reporting and evaluators but differences over statute versus standards remain; we need stronger steps to build trust.\n",
  "inquiry": "AI adoption, safety and governance",
  "glossary": [
    {
      "term": "AISI",
      "definition": "UK AI Security Institute: a technical body that evaluates advanced AI models and advises government."
    },
    {
      "term": "CAISSI",
      "definition": "US counterpart to AISI that receives pre‑deployment model access for technical testing."
    },
    {
      "term": "alignment",
      "definition": "How well a model's behaviour matches human intentions, values and safety constraints."
    },
    {
      "term": "open-weight models",
      "definition": "Models whose trained parameters are publicly released, so others can run or modify them."
    },
    {
      "term": "frontier models",
      "definition": "The most capable, cutting-edge AI systems that push current technical limits."
    },
    {
      "term": "CBRN",
      "definition": "Chemical, biological, radiological and nuclear threats; used here to mean bio/chemical misuse risks."
    },
    {
      "term": "incident reporting",
      "definition": "A standardised requirement to notify authorities about AI safety or security incidents."
    },
    {
      "term": "embedded evaluators",
      "definition": "Third‑party experts given close, employee‑like access inside a lab to test models pre‑release."
    }
  ]
});
