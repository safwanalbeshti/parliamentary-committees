/*
 * Generated from UK Parliament oral evidence 18214.
 * Source status: Uncorrected. Source hash: 4ef915462fc55e6b299cea552c45e162e90a82407431fa80a34348024e008b12
 * Contains Parliamentary information licensed under the Open Parliament Licence v3.0.
 */
window.COMMITTEE_SESSIONS = window.COMMITTEE_SESSIONS || [];
window.COMMITTEE_SESSIONS.push({
  "id": "oral-evidence-18214",
  "label": "28 October 2026 · Peter Bingham",
  "committee": "Environment and Climate Change Committee",
  "date": "28 October 2026",
  "sourceUrl": "https://committees.parliament.uk/oralevidence/18214/html/",
  "sourceLabel": "Official uncorrected transcript",
  "summary": "Ofgem’s engineering director, Peter Bingham, told the Lords committee that Britain is moving to a renewables-led system and recognised the supply risks that brings. He explained the current reliability standard for electricity, how capacity modelling treats imports, and why long-duration storage and network connections remain priorities. Ofgem has launched initial schemes for long-duration energy storage and interconnectors, will learn from the first round, and plans further consultations and close work with government and networks to remove barriers.",
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
      "name": "Baroness Sheehan",
      "role": "Chair of the committee",
      "description": "",
      "kind": "chair",
      "seats": [
        "chair"
      ],
      "color": "#315f72",
      "soft": "#d7edf0"
    },
    "Peter Bingham": {
      "name": "Peter Bingham",
      "role": "Director for Engineering and Technology, Ofgem",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness1"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    },
    "Lord Ashcombe": {
      "name": "Lord Ashcombe",
      "role": "Member of the committee",
      "description": "",
      "kind": "member",
      "seats": [
        "member1"
      ],
      "color": "#4c7b5d",
      "soft": "#dff0dd"
    },
    "Lord Redwood": {
      "name": "Lord Redwood",
      "role": "Member of the committee",
      "description": "",
      "kind": "member",
      "seats": [
        "member2"
      ],
      "color": "#9b543e",
      "soft": "#f2e0d7"
    },
    "Lord Krebs": {
      "name": "Lord Krebs",
      "role": "Member of the committee",
      "description": "",
      "kind": "member",
      "seats": [
        "member3"
      ],
      "color": "#287079",
      "soft": "#d9eeee"
    },
    "Earl Russell": {
      "name": "Earl Russell",
      "role": "Member of the committee",
      "description": "",
      "kind": "member",
      "seats": [
        "member4"
      ],
      "color": "#b17b2e",
      "soft": "#f5e8c4"
    },
    "Baroness Whitaker": {
      "name": "Baroness Whitaker",
      "role": "Member of the committee",
      "description": "",
      "kind": "member",
      "seats": [
        "member5"
      ],
      "color": "#8a5a78",
      "soft": "#f0e2ec"
    },
    "Lord Rooker": {
      "name": "Lord Rooker",
      "role": "Member of the committee",
      "description": "",
      "kind": "member",
      "seats": [
        "member6"
      ],
      "color": "#5c676d",
      "soft": "#e5e8e8"
    },
    "Lord Trees": {
      "name": "Lord Trees",
      "role": "Member of the committee",
      "description": "",
      "kind": "member",
      "seats": [
        "member1"
      ],
      "color": "#315f72",
      "soft": "#d7edf0"
    },
    "Baroness McIntosh of Pickering": {
      "name": "Baroness McIntosh of Pickering",
      "role": "Member of the committee",
      "description": "",
      "kind": "member",
      "seats": [
        "member2"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    }
  },
  "transcript": "# Dunkelflaute and the risks of electricity intermittency\n\n## Who is speaking for system engineering?\n> Ofgem has engineers in-house to judge technical risks and advise on network and storage planning.\n\nChair: Please introduce yourself for the record.\nPeter Bingham: I'm Peter Bingham, Director for Engineering and Technology at Ofgem. I lead engineers who assess and regulate the technical side of the electricity system.\n\n\n## How we judge reliability today\n> Electricity reliability is planned to a probabilistic standard, not a single 'one-in-X' worst case; NESO runs many scenarios to set required capacity.\n\nLord Ashcombe: How big a risk is rising reliance on weather-dependent generation to security of supply?\nPeter Bingham: We recognise the risk. Renewables are intermittent, so we need dispatchable sources and storage to fill gaps and keep supply secure.\nLord Ashcombe: Is there an equivalent to gas's 'one-in-20-year' standard for electricity? What worst-case probability do you plan for?\nPeter Bingham: Electricity planning uses the government's three-hour loss of load expectation, a probabilistic standard. NESO models tens of thousands of scenarios—different weather, generation and interconnector conditions—to decide needed capacity.\nLord Ashcombe: So there's no explicit 'one-in-50' or similar metric for electricity?\nPeter Bingham: No. The approach is statistical: you have distributions of demand and supply and plan to cover the range where it’s value for money to do so.\n\n\n## Long-duration storage: current steps and limits\n> Ofgem has opened mechanisms for long-duration storage but the first round focused on more mature technologies; work and consultations will follow for ultra-long solutions.\n\nLord Krebs: Why aren't you focused on ultra-long-duration storage (100+ hours) given Dunkelflaute risks?\nPeter Bingham: The first LDES window sought technologies offering eight hours or more—some projects in the draft set reach about 30 hours. The scheme didn't exclude longer-duration tech, but it emphasised more mature technologies.\nLord Krebs: That sounds like 'watch this space'. What scale would be needed to cover days of low renewables?\nPeter Bingham: Scale needs will be in the SSEP. There are many options—storage, hydrogen, CCUS, unabated gas, interconnection and demand response. Government will choose pathways and then mechanisms to deliver them.\nEarl Russell: Is special thinking or a special mechanism needed for ultra-long storage?\nPeter Bingham: Possibly. These projects are capital-intensive and nascent. There may be a case for dedicated support—similar to how CfD auctions had buckets for emergent tech—to seed such technologies.\nBaroness Whitaker: Who will ensure storage choices are value for money and don't push up consumer bills?\nPeter Bingham: SSEP pathways trade off affordability, security and emissions. Ofgem wants government to pick the lowest-cost pathway. LDES exists to lower market barriers; we will learn from the first window and consult on future design.\nBaroness Whitaker: When will we see final determinations from the first LDES round?\nPeter Bingham: We expect to announce results this year; I'll confirm timings in writing so the committee can include them in its report.\n\n\n## Interconnectors: benefits, limits and vulnerabilities\n> Interconnectors lower costs and add diversity, but they're derated in planning and not a guaranteed backup if widespread shortages occur.\n\nLord Rooker: Interconnectors supplied 15% of power in 2025 and more are coming—how reliable are they in a Dunkelflaute or if cables are damaged?\nPeter Bingham: Interconnectors give access to a wider market, let us export surplus renewables, and add diversity. NESO derates their contribution in capacity modelling so we don't rely on full import flows in tight scenarios.\nLord Rooker: But what if Europe faces the same weather and can't export? Or cables are disrupted?\nPeter Bingham: That’s why domestic capacity and the capacity market are designed to fill gaps. Interconnectors are reliable historically, but not infallible; planning assumes contingencies.\nLord Trees: Can we check whether imports are actually low-carbon? Some bills claim 'low-carbon UK-only' supply.\nPeter Bingham: Electricity traded across markets doesn't carry a colour label in that trading. UK suppliers can offer green-labelled UK-produced power, but imports are traded on European markets without that distinction.\nBaroness McIntosh of Pickering: Would it help to land interconnectors on brownfield sites in London to strengthen London’s supply directly?\nPeter Bingham: There’s no regulatory barrier—developers choose landing sites and technical feasibility matters. If it’s feasible, it could make sense operationally.\nLord Ashcombe: Do we have enough capacity domestically without interconnectors at winter peak?\nPeter Bingham: It depends on renewable output; modelling accounts for low import scenarios. You can’t cover every imaginable extreme, but the plan aims for a reliable, diverse mix.\n\n\n## Regulatory blockers, standards and next steps\n> Ofgem sees grid connections as the main barrier, will push faster network investment, learn from LDES, and follow up on technical standard changes.\n\nEarl Russell: What regulatory barriers remain to deploying storage and low-carbon dispatchable power?\nPeter Bingham: The dominant challenge is grid infrastructure and connections. Ofgem’s role is to fund and enable transmission companies to build at pace and to remove regulatory bottlenecks.\nEarl Russell: What specific planning or regulatory actions are you taking?\nPeter Bingham: After the SSEP, the Central Strategic Network Plan (CSNP) will set network investment needs. Ofgem will make sure funding and regulatory settings allow prompt delivery.\nLord Redwood: You approved some changes to voltage tolerances in the SQSS—can you write to us summarising recent NESO standard changes?\nPeter Bingham: Yes. I wasn't familiar with all the specific documents you mentioned but we did approve widening some voltage tolerances recently; I will write with more detail on developments in standards.\nChair: Thank you. Please confirm LDES determinations timing and the details on the SQSS changes in writing.\nPeter Bingham: I will. And we will share what we learn from the first LDES window and consult on future windows and design changes.\nChair: Thank you for your time and answers today.\n",
  "inquiry": "Dunkelflaute and the risks of electricity intermittency",
  "glossary": [
    {
      "term": "Dunkelflaute",
      "definition": "A weather period with very low wind and solar generation, creating sustained low renewable output."
    },
    {
      "term": "interconnectors",
      "definition": "High-voltage cables linking the UK electricity system to other countries so power can be imported or exported."
    },
    {
      "term": "LDES",
      "definition": "Long-duration energy storage: technologies that can store electricity for many hours or days."
    },
    {
      "term": "NESO",
      "definition": "National Electricity System Operator: the organisation that models demand, plans capacity and runs scenarios for the grid."
    },
    {
      "term": "loss of load expectation",
      "definition": "A probabilistic reliability standard showing how often a system might fail to meet demand under planning assumptions."
    },
    {
      "term": "cap and floor",
      "definition": "A regulatory support model Ofgem uses to give certain projects revenue certainty, with limits on what they can earn and lose."
    },
    {
      "term": "SSEP",
      "definition": "Strategic Spatial Energy Plan: government-led plan setting the country’s needs for generation, storage and networks."
    },
    {
      "term": "CSNP",
      "definition": "Central Strategic Network Plan: the planned national transmission network plan that follows the SSEP."
    },
    {
      "term": "SQSS",
      "definition": "Security and Quality of Supply Standard: technical rules for operating the transmission system safely."
    }
  ]
});
