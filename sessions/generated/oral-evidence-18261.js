/*
 * Generated from UK Parliament oral evidence 18261.
 * Source status: Published. Source hash: b2ed3ba3256c76fced910d769124587202154288968213bbc54585ed2d105db8
 * Contains Parliamentary information licensed under the Open Parliament Licence v3.0.
 */
window.COMMITTEE_SESSIONS = window.COMMITTEE_SESSIONS || [];
window.COMMITTEE_SESSIONS.push({
  "id": "oral-evidence-18261",
  "label": "4 November 2026 · Professor Tony Kenyon, Dr Tanya Mangoma",
  "committee": "Science and Technology Committee (Commons)",
  "date": "4 November 2026",
  "sourceUrl": "https://committees.parliament.uk/oralevidence/18261/html/",
  "sourceLabel": "Official published transcript",
  "summary": "Experts explained two complementary routes to much lower‑energy computing: neuromorphic systems that process information like a brain (event‑driven, memory and compute together) and silicon photonics that use light to move and process data with far less power. Both are already real but face the same practical barriers: scaling from lab demos to reliable, mid‑volume manufacturing, limited access to major foundries, and insufficient patient capital. The witnesses asked for focused UK action—national pilot lines, clearer Government engagement with global foundries, procurement as an early customer, and £100m‑scale funding to accelerate deployment.",
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
    "Dr Tanya Mangoma": {
      "name": "Dr Tanya Mangoma",
      "role": "Chief Product Officer, Analogue Insight",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness1"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    },
    "Professor Tony Kenyon": {
      "name": "Professor Tony Kenyon",
      "role": "Director, Neuroware IKC; Professor, UCL; neuromorphic spin‑out founder",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness2"
      ],
      "color": "#4c7b5d",
      "soft": "#dff0dd"
    },
    "Professor Callum Littlejohns": {
      "name": "Professor Callum Littlejohns",
      "role": "Deputy Director, CORNERSTONE photonics innovation centre",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness3"
      ],
      "color": "#9b543e",
      "soft": "#f2e0d7"
    },
    "Dr Josh Silverstone": {
      "name": "Dr Josh Silverstone",
      "role": "Founder and CEO, Hartley Ultrafast (photonic neuromorphic company)",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness1"
      ],
      "color": "#287079",
      "soft": "#d9eeee"
    },
    "Tom Collins": {
      "name": "Tom Collins",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member1"
      ],
      "color": "#b17b2e",
      "soft": "#f5e8c4"
    },
    "Maya Ellis": {
      "name": "Maya Ellis",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member2"
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
        "member3"
      ],
      "color": "#5c676d",
      "soft": "#e5e8e8"
    },
    "Freddie van Mierlo": {
      "name": "Freddie van Mierlo",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member4"
      ],
      "color": "#315f72",
      "soft": "#d7edf0"
    },
    "Martin Wrigley": {
      "name": "Martin Wrigley",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member5"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    },
    "Daniel Zeichner": {
      "name": "Daniel Zeichner",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member6"
      ],
      "color": "#4c7b5d",
      "soft": "#dff0dd"
    }
  },
  "transcript": "# Low-energy computing\n\n## What neuromorphic computing does and why it matters\n> Neuromorphic systems mimic brain principles—co‑located memory and compute, event‑driven spikes—to cut energy and speed up decision‑making at the edge.\n\nChair: We want practical industry views on low‑energy computing. Tanya, please explain the analogue neuromorphic technology you use.\nDr Tanya Mangoma: Analogue Insight designs chips for companies. We focus on analogue and mixed‑signal work that natively implements spiking neural networks—so devices behave more like brain circuits than digital emulations.\nChair: What do you mean by 'spiking'?\nDr Tanya Mangoma: Spiking neural networks use timing: units emit events or spikes only when needed. That makes them event‑based, training and adapting in real time, and hugely more energy efficient for certain tasks.\nProfessor Tony Kenyon: Neuromorphic systems take lessons from brains, not always copying them exactly. For example, brain‑like devices can be paired with photonics to exploit very high data rates while keeping energy low.\nProfessor Tony Kenyon: A useful distinction: signals (environmental changes), the data we digitise, and the information we care about. The brain produces much less data by only reporting important events—event cameras for vision are a clear example.\nDr Tanya Mangoma: That matters for data centres: currently energy is often spent moving and storing data. Neuromorphic devices co‑locate memory and compute, reducing movement and cutting energy dramatically.\n\n\n## UK strengths, barriers and practical asks\n> The UK has strong research, materials IP and prototypes (SpiNNaker, memristor work), but lacks access to major foundries, patient capital and end‑to‑end scale‑up—so witnesses ask for coordination, pilot facilities and government help engaging foundries.\n\nMaya Ellis: How is the political and market reception? Where are the barriers—funding, appetite or something else?\nDr Tanya Mangoma: We have the IP and materials research, but to commercialise we need foundries to accept new processes. Big foundries (TSMC, GlobalFoundries) control recipes. UK teams can’t easily get those doors opened.\nProfessor Tony Kenyon: It often takes about $100m to move a lab technology to commercial silicon. The UK lacks sufficient patient capital and a risk culture like Silicon Valley. Government procurement as a first customer would materially help.\nDaniel Zeichner: Do we have industrial capacity in the UK to manufacture at scale?\nProfessor Tony Kenyon: No country except Taiwan covers every piece. The UK can own parts of the chain: design, niche manufacturing (Pragmatic, Paragraf), photonics clusters and silicon carbide in Wales—but mass production will need international partnerships.\nDr Tanya Mangoma: We already have SpiNNaker and small foundries that could make chips for edge applications. The problem is lack of coordination and an end‑to‑end plan to move lab IP into fabs.\nKit Malthouse: Why don’t big foundries pick up UK IP if it’s that good?\nDr Tanya Mangoma: We met TSMC in 2025. They asked who in the UK would lead such engagement. Universities alone don’t have the authority; Government needs to present a clear partner and route to scale.\nProfessor Tony Kenyon: The UK Semiconductor Centre could be that coordinating body, and extended programmes—sustained five‑year funding, centres for doctoral training, national testbeds—would help build an ecosystem.\nChair: DSIT pledged £20m to neuromorphic computing to 2030—will that deliver sovereign capability?\nProfessor Tony Kenyon: No. It can seed activity but is far short of the sums and scale needed to deliver sovereign manufacturing capability.\nDr Tanya Mangoma: Agreed. Going lab to fab realistically needs much more capital and Government help to unlock foundry engagement.\n\n\n## Silicon photonics: light as the path to lower energy\n> Silicon photonics uses light on tiny chips to move and process data with far lower energy; it’s already being deployed but needs mid‑scale pilot manufacturing to bridge lab demos to mass production.\n\nDr Josh Silverstone: Photonics is the technology of light. At Hartley we build photonic neuromorphic devices to do AI inference extremely fast—valuable where time matters: finance, defence, robotics, fusion control and satellite comms.\nProfessor Callum Littlejohns: Silicon photonics integrates light devices onto chips. It can transmit vast data volumes at much lower energy than electronics, and is already being used in data‑centre links; its role is growing as AI demands explode.\nFreddie van Mierlo: How ready is the tech?\nProfessor Callum Littlejohns: It’s being deployed now. Big commercial deals and investments are happening. The bottleneck is scale‑up: proving you can manufacture many reliable wafers and packages, then moving to mass foundries.\nTom Collins: Is a UK pilot line realistic?\nProfessor Callum Littlejohns: Yes. A national pilot line would produce tens of thousands of wafers a year (we model 10–20k) and prove designs at volume so companies can pitch to global foundries. It’s a mid‑scale, shared facility.\nDr Josh Silverstone: GlobalFoundries and other mid‑sized fabs can make these designs; their existing capacity far exceeds what a startup needs. But without a UK pilot capability, companies struggle to scale and are vulnerable to being deprioritised abroad.\n\n\n## Policy choices, timescales and risks\n> Witnesses want Government to coordinate, back pilot facilities, use procurement as bridge, and enable stronger engagement with foundries; accelerating timelines to 2–3 years would need ~£100m of patient capital.\n\nMartin Wrigley: What prevents big firms like Nvidia from buying UK IP and taking it offshore?\nProfessor Tony Kenyon: Nothing in practice stops acquisitions. The country’s interest is to anchor companies and talent—shared infrastructure helps do that so purchases are more likely to leave R&D and jobs here.\nDr Tanya Mangoma: Start‑ups that secure IP and commercial customers fast—examples like Fractile—are best protected. But Government can help by creating a clear route to scale and by using diplomatic weight with foundries.\nChair: What concrete asks should we recommend?\nProfessor Callum Littlejohns: Build a national pilot line (shared, fee‑accessed), fund testbeds and doctoral training, include neuromorphic and photonics in AI hardware strategy, and use procurement to be an early customer where appropriate.\nDr Josh Silverstone: If the goal is to compress the timeline to 2–3 years for some high‑impact products, expect to mobilise an extra ~£100m of capital for companies and infrastructure; at present many are working on ~£10m rounds.\nTom Collins: If the pilot line is built quickly, when might it deliver economic impact?\nProfessor Callum Littlejohns: A facility built in three to four years could start creating meaningful GVA by the early‑to‑mid 2030s; our modelling shows sizeable economic returns if scaled properly.\nChair: Thank you. The Committee will consider these asks: co‑ordination, pilot facilities, procurement pull and larger, patient capital to translate strong UK research into sovereign capability where sensible.\n",
  "inquiry": "Low-energy computing",
  "glossary": [
    {
      "term": "neuromorphic computing",
      "definition": "Hardware and systems designed to work like biological brains: memory and compute together, event‑driven processing, and low energy use."
    },
    {
      "term": "spiking neural networks",
      "definition": "A kind of neural network that processes information as discrete 'spikes' over time, enabling event‑based, real‑time learning."
    },
    {
      "term": "event camera",
      "definition": "A vision sensor that only reports changes (events) in the scene, producing much less data than full frame cameras."
    },
    {
      "term": "foundry",
      "definition": "A factory that mass‑manufactures semiconductor chips from designs provided by other companies."
    },
    {
      "term": "TSMC",
      "definition": "Taiwan Semiconductor Manufacturing Company, the world’s largest contract chipmaker (foundry)."
    },
    {
      "term": "ReRAM",
      "definition": "Resistive RAM, a type of non‑volatile memory that can store data without constant power."
    },
    {
      "term": "memristor",
      "definition": "A device whose electrical resistance depends on past currents—used as memory and for brain‑like computing."
    },
    {
      "term": "silicon photonics",
      "definition": "Using silicon to build tiny devices that move and process data with light, saving energy versus electrons."
    },
    {
      "term": "pilot line",
      "definition": "A shared mid‑scale manufacturing facility to prove a technology at hundreds to thousands of wafers before mass production."
    },
    {
      "term": "sovereign capability",
      "definition": "National ability to design, make and control critical technology without exposing key parts to foreign disruption."
    }
  ]
});
