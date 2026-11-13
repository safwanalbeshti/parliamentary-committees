/*
 * Generated from UK Parliament oral evidence 18262.
 * Source status: Published. Source hash: b2ed3ba3256c76fced910d769124587202154288968213bbc54585ed2d105db8
 * Contains Parliamentary information licensed under the Open Parliament Licence v3.0.
 */
window.COMMITTEE_SESSIONS = window.COMMITTEE_SESSIONS || [];
window.COMMITTEE_SESSIONS.push({
  "id": "oral-evidence-18262",
  "label": "4 November 2026 · Professor Callum Littlejohns, Dr Josh Silverstone",
  "committee": "Science and Technology Committee (Commons)",
  "date": "4 November 2026",
  "sourceUrl": "https://committees.parliament.uk/oralevidence/18262/html/",
  "sourceLabel": "Official published transcript",
  "summary": "Industry experts explained how brain-like (‘neuromorphic’) computing and silicon photonics can cut energy use, speed up time‑critical AI and let devices compute at the edge. They gave concrete examples (event cameras, memristors, integrated photonic chips), said the UK has world-class research but lacks the scale, foundry access and patient capital to commercialise it, and set out practical asks: a pilot manufacturing line, Government help to get university IP into big foundries, and procurement or diplomacy to anchor the sector.",
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
      "name": "Dame Chi Onwurah",
      "role": "Chair of the committee",
      "description": "",
      "kind": "chair",
      "seats": [
        "chair"
      ],
      "color": "#315f72",
      "soft": "#d7edf0"
    },
    "Professor Callum Littlejohns": {
      "name": "Professor Callum Littlejohns",
      "role": "Deputy Director, CORNERSTONE (silicon photonics innovation centre)",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness1"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    },
    "Dr Josh Silverstone": {
      "name": "Dr Josh Silverstone",
      "role": "Founder & CEO, Hartley Ultrafast (photonics-based neuromorphic computing)",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness2"
      ],
      "color": "#4c7b5d",
      "soft": "#dff0dd"
    },
    "Professor Tony Kenyon": {
      "name": "Professor Tony Kenyon",
      "role": "Professor, UCL; director, Neuroware IKC",
      "description": "",
      "kind": "member",
      "seats": [
        "member1"
      ],
      "color": "#9b543e",
      "soft": "#f2e0d7"
    },
    "Dr Tanya Mangoma": {
      "name": "Dr Tanya Mangoma",
      "role": "Chief Product Officer, Analogue Insight; analogue neuromorphic designer",
      "description": "",
      "kind": "member",
      "seats": [
        "member2"
      ],
      "color": "#287079",
      "soft": "#d9eeee"
    },
    "Maya Ellis": {
      "name": "Maya Ellis",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member3"
      ],
      "color": "#b17b2e",
      "soft": "#f5e8c4"
    },
    "Freddie van Mierlo": {
      "name": "Freddie van Mierlo",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member4"
      ],
      "color": "#8a5a78",
      "soft": "#f0e2ec"
    },
    "Kit Malthouse": {
      "name": "Kit Malthouse",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member5"
      ],
      "color": "#5c676d",
      "soft": "#e5e8e8"
    },
    "Tom Collins": {
      "name": "Tom Collins",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member6"
      ],
      "color": "#315f72",
      "soft": "#d7edf0"
    },
    "Daniel Zeichner": {
      "name": "Daniel Zeichner",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member1"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    },
    "Martin Wrigley": {
      "name": "Martin Wrigley",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member2"
      ],
      "color": "#4c7b5d",
      "soft": "#dff0dd"
    }
  },
  "transcript": "# Low-energy computing\n\n## What the technologies are and why they matter\n> Neuromorphic chips emulate brain-style, event-driven processing and silicon photonics uses light to move lots of data with low energy.\n\nChair: We’re looking at low-energy computing — neuromorphic computing and silicon photonics — and how they might be turned into real products.\nDr Tanya Mangoma: Analogue neuromorphic uses hardware that behaves like spiking neural networks, so it’s event-driven and can learn or adapt in real time rather than only in big offline training runs.\nProfessor Tony Kenyon: Neuromorphic borrows from the brain: it co-locates memory and compute and pays attention only to useful signals. Combined with photonics, it lets us handle some problems at much higher speed.\nFreddie van Mierlo: Quickly — what is silicon photonics in plain terms?\nProfessor Callum Littlejohns: Photonics is light-based technology; silicon photonics puts light paths on small chips so you can transmit huge volumes of data using much less energy than electrons over wires.\nDr Josh Silverstone: I build photonic neuromorphic systems for time-critical tasks — finance, defence, robotics — where nanoseconds and power efficiency matter.\n\n\n## Concrete benefits and examples\n> These approaches promise orders-of-magnitude energy savings and new, fast edge capabilities — examples include event cameras, memristor sensors and integrated photonic chips.\n\nChair: People often compare brains (about 20 W) to data centres (hundreds of kilowatts to megawatts) — can these technologies really narrow that gap?\nDr Tanya Mangoma: Yes. Data centre energy is often spent moving and storing volatile data. Neuromorphic chips combine memory and compute, cut data movement and use spikes to send only important information.\nProfessor Tony Kenyon: An event camera only reports pixels that change, so you avoid digitising an entire image. If you scale that idea to other sensors, you avoid generating vast amounts of useless data.\nProfessor Tony Kenyon: Memristors can be light-sensitive, store information and compute locally — imagine an artificial retina where sensing, memory and processing sit on the same plane.\nProfessor Callum Littlejohns: Silicon photonics already moves hundreds of gigabits per second on tiny chips. That reduces energy per bit and is essential as AI demand balloons.\nDr Josh Silverstone: Our focus is latency-sensitive inference: fusion control, satellite links, robotics — places where faster, more efficient answers are commercially valuable today.\n\n\n## Main barriers: scale, foundries, investment and coordination\n> The UK has top research and early companies but lacks mid-scale manufacturing, easy foundry access, patient capital and a co‑ordinating strategy to commercialise.\n\nMaya Ellis: You say the UK has IP and research — why hasn’t it turned into big commercial firms?\nDr Tanya Mangoma: A big bottleneck is foundries. Big global fabs (TSMC, UMC, GlobalFoundries) control the manufacturing 'recipes'. UK research can’t get easy access to those recipes to commercialise.\nProfessor Tony Kenyon: There’s also a funding and risk‑appetite gap. A rule of thumb from the witnesses: roughly $100m is often needed to move from lab tech to commercial silicon — that needs patient private capital plus public support.\nKit Malthouse: Why does value sit with foundries and not with designers like we have in the UK?\nDr Tanya Mangoma: You can capture value by getting your IP into mass manufacture at the big foundries — but you need Government or a national body to open those doors and negotiate access.\nProfessor Tony Kenyon: We also need an ecosystem: pilot lines, testbeds, design tools, packaging and importantly procurement pull from Government to be early customers.\nDaniel Zeichner: Does the UK have the industrial capacity to manufacture at commercial scale?\nProfessor Tony Kenyon: No single country does the full advanced stack — it’s global. But the UK can own parts: design, materials, pilot manufacture and niche foundries for edge chips.\nDr Tanya Mangoma: Smaller UK foundries like Pragmatic and Paragraf can make chips for edge use-cases. That gives a form of sovereignty if we coordinate and fund scale-up.\nTom Collins: Is ASML-level equipment needed here? That’s a decades-long, hugely expensive effort.\nProfessor Tony Kenyon: ASML's extreme‑ultraviolet machines are unique and cost hundreds of millions — we don’t need to chase that for photonics. Photonics works at larger device scales and needs different tools.\n\n\n## Practical asks: pilot lines, diplomacy, procurement and capital\n> Witnesses asked for a UK pilot manufacturing line, Government to help negotiate foundry access, more patient capital and procurement to anchor demand.\n\nKit Malthouse: Who should be the 'guiding mind' inside Government to coordinate this — UKRI, the UK Semiconductor Centre?\nDr Tanya Mangoma: The UK Semiconductor Centre exists for this. We need it to take authority to negotiate with big foundries and make university IP accessible for manufacture.\nProfessor Callum Littlejohns: Our survey of ~100 UK photonics companies points at a clear gap: proving manufacturability at pilot scale. A national pilot line would let companies go from 1 prototype to thousands of wafers.\nDaniel Zeichner: What scale for a pilot line?\nProfessor Callum Littlejohns: Industry estimates: roughly 10,000–20,000 wafers a year; building one might take 3–4 years and could generate significant economic impact by the mid-2030s.\nDr Josh Silverstone: To compress timelines to 2–3 years for productisation would need roughly £100m of capital for ventures like ours — we’ve currently raised about £10m to date.\nChair: Is £20m government funding to 2030 enough to deliver sovereign capability?\nProfessor Tony Kenyon: No — £20m seeds activity but won’t deliver sovereign commercial capability. Moving lab tech to foundry-scale needs far more sustained funding and patient private investment.\nMartin Wrigley: What about the risk of big companies like Nvidia buying the tech and moving value overseas?\nDr Tanya Mangoma: That can happen. The defence is to back UK firms (eg Fractile) to use the IP so the value sits with home companies, and to create infrastructure that anchors jobs and R&D here.\nProfessor Callum Littlejohns: Infrastructure can anchor multinational investment — Microsoft bought a UK photonics spin-out but built nearby facilities to keep talent and R&D local.\nChair: So the short asks are: a time‑bound feasibility for a pilot line, Government help to open foundry doors, more patient capital and procurement to be early customer?\nProfessor Tony Kenyon: Yes, and include neuromorphic in national strategies, fund testbeds, and consider doctoral training and workforce development for the field.\nDr Josh Silverstone: Also, aim higher on ambition: if we want global companies formed here, be willing to back big projects and international partnerships rather than only tiny bets.\nChair: Thank you — this gives the Committee concrete policy levers to consider.\n",
  "inquiry": "Low-energy computing",
  "glossary": [
    {
      "term": "Neuromorphic computing",
      "definition": "Hardware and chips that are designed to work like biological brains, often with memory and computing co-located."
    },
    {
      "term": "Spiking neural network",
      "definition": "A neural model that encodes signals as time-based spikes, allowing event-driven, low-energy processing."
    },
    {
      "term": "Silicon photonics",
      "definition": "Using light (photons) on silicon chips to move and process data more efficiently than electrons alone."
    },
    {
      "term": "Foundry",
      "definition": "A factory (eg TSMC, GlobalFoundries) that mass-manufactures semiconductor chips from customers' designs."
    },
    {
      "term": "Memristor",
      "definition": "A device whose electrical behaviour depends on past signals; can act as memory and computation in one."
    },
    {
      "term": "Pilot line",
      "definition": "A shared mid-scale manufacturing facility that proves a design can be made reliably before mass production."
    },
    {
      "term": "ReRAM",
      "definition": "Resistive random-access memory, a type of non-volatile memory useful for co-locating memory and compute."
    },
    {
      "term": "Event camera",
      "definition": "A sensor that only outputs changes in a scene, producing far less data than full-frame cameras."
    }
  ]
});
