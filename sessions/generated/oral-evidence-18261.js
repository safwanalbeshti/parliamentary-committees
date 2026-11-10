/*
 * Generated from UK Parliament oral evidence 18261.
 * Source status: Published. Source hash: bba152e3aaba003e1e8fe01d609c0620333bc9bff6fbeced9ecb66e9113074e3
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
  "summary": "Industry experts explained two related routes to much lower-energy computing—neuromorphic (brain-inspired) chips and silicon photonics (using light on chips). They described clear benefits for data centres and fast edge applications, but said the UK’s research strengths are fragmented, scaling requires large capital and foundry access, and government action is needed on pilot manufacturing lines, procurement and international partnerships to turn lab tech into industry.",
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
    "Professor Tony Kenyon": {
      "name": "Professor Tony Kenyon",
      "role": "Director, NeuroWare IKC; Professor, UCL; spin-out founder",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness1"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    },
    "Dr Tanya Mangoma": {
      "name": "Dr Tanya Mangoma",
      "role": "Chief Product Officer, Analogue Insight",
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
      "role": "Founder & CEO, Hartley Ultrafast",
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
  "transcript": "# Low-energy computing\n\n## What neuromorphic and photonic computing are\n> Neuromorphic chips mimic brain-like, event-driven processing; silicon photonics uses light on chips—both aim to do computing with far less energy.\n\nChair: We're exploring low-energy computing. Tanya, please explain the analogue neuromorphic technology you work on.\nDr Tanya Mangoma: Analogue Insight designs chips from concept to silicon. Neuromorphic here means using analogue components or materials that behave like spiking neural networks so you don't simulate the brain in software—you build hardware that naturally behaves similarly.\nChair: What's a 'spike'?\nDr Tanya Mangoma: Spiking neural networks add time into computation. Instead of static trained models, they operate event-by-event and can learn or adapt in real time—this is more like how brains process signals.\nProfessor Tony Kenyon: It's partly emulation: we take lessons from the brain but also combine them with other tech, for example photonics, to do different things at much higher speeds—like engineering borrowing ideas from birds for flight.\nFreddie van Mierlo: Josh and Callum, what is silicon photonics in plain terms?\nDr Josh Silverstone: Photonics is the technology of light, like electronics is electricity. Silicon photonics puts light-based components onto chips to move or process data with lower energy, and we use it to accelerate AI inference.\nProfessor Callum Littlejohns: Silicon photonics integrates optical components on tiny chips; it's already used for high-bandwidth, low-energy data links and can underpin future low-energy computing.\n\n\n## Where these approaches could help now\n> Both approaches could cut huge energy costs in data centres and enable very fast, low-power edge devices for sensing and action.\n\nChair: What are the biggest benefits for the UK?\nDr Tanya Mangoma: The main benefit is lower energy use for AI. Neuromorphic systems also shine at 'sense, detect, act'—edge cases like drones, autonomous vehicles and cyber-security where you must sense and respond very quickly.\nProfessor Tony Kenyon: Another gain is avoiding data generation. The brain focuses on important signals; event cameras only report changes, so you don't digitise whole frames. Not generating data in the first place saves enormous energy and storage costs.\nChair: You've mentioned the brain uses about 20 W while similar data-centre tasks could use on the order of 1 MW—so brain-style compute is dramatically more efficient?\nDr Tanya Mangoma: Yes. Conventional data centres spend a lot of energy moving and storing volatile memory. Neuromorphic designs co-locate memory and compute, and spiking timing reduces what must be transmitted—both cut energy.\nProfessor Tony Kenyon: We also work on devices called memristors that can act as sensors, memory and compute at once—imagine an artificial retina where sensing and processing are on the same plane, saving area and power.\n\n\n## Main barriers: scaling, foundries, money and coordination\n> The UK has strong research, but taking lab IP to mass product needs large capital, pilot manufacturing, foundry access, and a better coordinated national strategy.\n\nMaya Ellis: What is the political and funding landscape—does the UK have appetite and support?\nDr Tanya Mangoma: We have a lot of IP from UK universities, but commercialization stalls because foundries lock in manufacturing 'recipes' and won't just accept new materials. We lack authority to get TSMC or GlobalFoundries to adopt UK innovations.\nProfessor Tony Kenyon: Two big gaps: capital and risk appetite. A rule of thumb is ~$100m to go from lab to commercial chip; UK investors are more risk-averse than in the US, so securing patient capital is hard.\nDaniel Zeichner: Do we have the industrial capacity in the UK to manufacture at scale?\nProfessor Tony Kenyon: No country except perhaps Taiwan has the full advanced stack. The UK can own parts—design, niche foundries, packaging—and should form international partnerships for fabrication.\nDr Tanya Mangoma: We do have smaller UK foundries—Pragmatic, Paragraf—that can make certain chips for edge use. So there are niches where we could manufacture sovereignly, but there's no end-to-end programme to scale them.\nKit Malthouse: Why does so much value sit with big foundries like TSMC and not with designers here? How do we capture value?\nDr Tanya Mangoma: We can't be the next TSMC; the path is to get our IP into those foundries' systems—Government can help broker that relationship. For domestic value, supporting start-ups that productise the IP (eg Fractile) is another route.\nProfessor Tony Kenyon: Government could also act as early customer via procurement, fund shared prototyping facilities, extend NeuroWare's remit and commission a national neuromorphic strategy and testbeds.\nChair: Has anyone managed to get TSMC to engage?\nDr Tanya Mangoma: We went to Taiwan with UKRI and spoke to TSMC; they asked who in the UK would take responsibility. That's why a central UK body—eg the UK Semiconductor Centre—needs to have authority to make those asks.\nMartin Wrigley: What's to stop big companies like Nvidia buying UK teams and exporting the IP?\nProfessor Tony Kenyon: They can buy companies, which often benefits investors. Public policy tools and anchoring infrastructure can help keep activity and jobs in the UK, but buyouts happen.\n\n\n## Photonics readiness and concrete policy asks\n> Silicon photonics is already deployed; the UK should fund a pilot manufacturing line, use procurement smartly, and back training and international partnerships to scale quickly.\n\nFreddie van Mierlo: How ready is photonics? Where could the UK lead?\nProfessor Callum Littlejohns: Integrated photonics is being deployed now in data-centre interconnects and sensing. The UK is strong in research and early prototypes but lacks scale-up facilities to prove manufacturability at mid volumes.\nDr Josh Silverstone: Hartley uses photonics and analogue systems to speed inference for low-latency markets. We partner with GlobalFoundries for fabrication; even small numbers of wafers for our products are tiny compared with global fab volumes.\nTom Collins: What would a pilot line look like and how soon?\nProfessor Callum Littlejohns: A pilot line might do 10,000–20,000 wafers a year, take around three to four years to set up, and could create substantial UK economic impact by the mid-2030s. It bridges the gap between lab prototypes and mass manufacture.\nDr Josh Silverstone: Faster timelines—two to three years—are possible but would need substantially more capital: roughly another order of magnitude on top of current early funding, so hundreds of millions, not tens.\nProfessor Tony Kenyon: Other asks: sustained funding (NeuroWare is five years), centres for doctoral training in neuromorphic areas, national testbeds, and government procurement as first customer in defence or other sectors.\nDaniel Zeichner: Would the Government's £20m to 2030 deliver sovereign capability?\nProfessor Tony Kenyon: No; that level seeds activity but won't build sovereign commercial capability—we need more and longer-term investment and a clear strategy.\nChair: Final point: timescale for impact?\nDr Josh Silverstone: Five to seven years for meaningful commercial impact is realistic; two to three years could be possible with a major capital push (on the order of £100m).\nChair: Thank you all. You've given clear recommendations: a pilot line, government brokerage with foundries, procurement pull, sustained funding, and training to turn UK research into sovereign, exportable industry.\n",
  "inquiry": "Low-energy computing",
  "glossary": [
    {
      "term": "neuromorphic computing",
      "definition": "Hardware designed to work more like a brain—often co‑locating memory and compute and using event-driven signals to save energy."
    },
    {
      "term": "spiking neural networks",
      "definition": "A type of neural network that processes information as timed events or 'spikes', allowing event-based, low-energy computation."
    },
    {
      "term": "silicon photonics",
      "definition": "Using light (photons) on silicon chips to move and process data with much lower energy than electrons over some links."
    },
    {
      "term": "foundry",
      "definition": "A company that mass-manufactures semiconductor chips from designs (eg, TSMC or GlobalFoundries)."
    },
    {
      "term": "ReRAM",
      "definition": "A form of non-volatile resistive memory that can store data without constant power and could be used in neuromorphic chips."
    },
    {
      "term": "memristor",
      "definition": "A device whose resistance depends on past signals, so it can act as memory and compute in one element."
    },
    {
      "term": "pilot line",
      "definition": "A medium-scale manufacturing facility where companies prove a chip can be made reliably before mass production."
    },
    {
      "term": "event camera",
      "definition": "A sensor that reports only changes in a scene, creating far less data than conventional video frames."
    },
    {
      "term": "AI Hardware Plan",
      "definition": "UK government plan that recognises hardware needs for AI and directs support across chips and related technologies."
    },
    {
      "term": "sovereign capability",
      "definition": "The ability of the UK to design, produce or control key technologies domestically for security and resilience."
    }
  ]
});
