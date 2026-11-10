/*
 * Generated from UK Parliament oral evidence 18262.
 * Source status: Published. Source hash: bba152e3aaba003e1e8fe01d609c0620333bc9bff6fbeced9ecb66e9113074e3
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
  "summary": "Researchers and start-ups explained two related routes to much lower‑energy computing—neuromorphic chips that work like brains, and silicon photonics that move and process data with light—and set out technical promise, UK strengths (research, specific clusters and prototype foundries) and key barriers: the gap from lab to manufacturing, limited patient capital, and lack of coordinated government action to get UK IP into commercial foundries. They recommended a national pilot‑line, clearer Government procurement and targeted investment to turn existing UK IP into companies and sovereign capability.",
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
      "role": "Professor, neuromorphic hardware researcher (first panel witness)",
      "description": "",
      "kind": "member",
      "seats": [
        "member1"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    },
    "Dr Tanya Mangoma": {
      "name": "Dr Tanya Mangoma",
      "role": "Chief Product Officer, Analogue Insight (first panel witness)",
      "description": "",
      "kind": "member",
      "seats": [
        "member2"
      ],
      "color": "#4c7b5d",
      "soft": "#dff0dd"
    },
    "Tom Collins": {
      "name": "Tom Collins",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member3"
      ],
      "color": "#9b543e",
      "soft": "#f2e0d7"
    },
    "Maya Ellis": {
      "name": "Maya Ellis",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member4"
      ],
      "color": "#287079",
      "soft": "#d9eeee"
    },
    "Kit Malthouse": {
      "name": "Kit Malthouse",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member5"
      ],
      "color": "#b17b2e",
      "soft": "#f5e8c4"
    },
    "Daniel Zeichner": {
      "name": "Daniel Zeichner",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member6"
      ],
      "color": "#8a5a78",
      "soft": "#f0e2ec"
    },
    "Martin Wrigley": {
      "name": "Martin Wrigley",
      "role": "Committee member",
      "description": "",
      "kind": "member",
      "seats": [
        "member1"
      ],
      "color": "#5c676d",
      "soft": "#e5e8e8"
    },
    "Professor Callum Littlejohns": {
      "name": "Professor Callum Littlejohns",
      "role": "Deputy Director, CORNERSTONE photonics innovation centre",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness1"
      ],
      "color": "#315f72",
      "soft": "#d7edf0"
    },
    "Dr Josh Silverstone": {
      "name": "Dr Josh Silverstone",
      "role": "Founder & CEO, Hartley Ultrafast (photonics-based neuromorphic computing)",
      "description": "",
      "kind": "witness",
      "seats": [
        "witness2"
      ],
      "color": "#6f5c91",
      "soft": "#ebe2f5"
    }
  },
  "transcript": "# Low-energy computing\n\n## What neuromorphic computing and silicon photonics are\n> Neuromorphic chips mimic brain-like, event-driven processing to cut energy; silicon photonics moves and processes data with light and can underpin low-energy systems.\n\nChair: Today we want to understand how neuromorphic computing and silicon photonics could deliver lower‑energy computing and what stops them scaling.\nDr Tanya Mangoma: Neuromorphic computing can be analogue: chips that naturally behave like spiking neural networks so you don't emulate the brain in software but let the hardware do it.\nProfessor Tony Kenyon: It's true these systems take lessons from the brain. We can emulate some brain behaviours and combine them with other tech—photonics, for example—to do things brains don't do, like very high‑speed data links.\nDr Tanya Mangoma: Spiking networks add time as part of the signal: they are event‑based, train and adapt in real time and only generate outputs when something important happens.\nProfessor Callum Littlejohns: Photonics is the technology of light. Silicon photonics puts light-based components on a chip, letting you carry large volumes of data with much less energy than electronics.\n\n\n## Why energy and edge speed matter\n> Neuromorphic approaches and photonics together can dramatically cut energy use and make very fast 'sense-and-act' systems practical at the edge.\n\nChair: As an example: the human brain runs on about 20 W whereas doing the same class of tasks in big digital systems can cost many kilowatts to megawatts. That energy gap is the prize.\nDr Tanya Mangoma: Current data centres move a lot of data between memory and processors; neuromorphic chips co‑locate memory and compute so you stop moving data and save energy.\nProfessor Tony Kenyon: Also, devices like event cameras only produce data when the scene changes. Couple that with neuromorphic processors and you avoid generating whole images—huge data and energy savings.\nDr Josh Silverstone: Hartley uses photonics for ultrafast inference where time matters—finance, defence, networks and robotics—cases where lower latency and energy are both critical.\nProfessor Callum Littlejohns: If data centres' energy use is projected to spike, photonics and neuromorphic techniques are among the best candidates to slow or reverse that trend.\n\n\n## UK strengths and real examples\n> The UK has world‑class research and specific assets—SpiNNaker, memristor and ReRAM IP, clusters in silicon carbide and photonics, and small foundries—that can be turned into companies.\n\nDr Tanya Mangoma: The UK invented a lot of the core IP: SpiNNaker from Manchester, materials and analogue design in several universities, plus small foundries like Pragmatic and companies such as Paragraf.\nProfessor Tony Kenyon: My spin‑out is commercialising memristor‑style memories. Memristors can combine light sensitivity, memory and computation on one plane—an artificial retina is one example.\nProfessor Callum Littlejohns: CORNERSTONE helps take silicon photonics from lab prototypes to real chips; the UK ranks highly in photonics research and already makes components used in industry.\nDr Josh Silverstone: Bristol has real expertise. My firm applies lessons from photonic quantum work to classical photonic compute; the people and ideas exist here to build ambitious companies.\n\n\n## The manufacturing and investment bottlenecks\n> The main barriers are the gap from lab to manufacturable product, access to foundry processes, and a lack of patient capital and coordinated government action.\n\nMaya Ellis: Where are the political and market barriers—why isn't the UK turning IP into products faster?\nDr Tanya Mangoma: You need a foundry recipe to make chips at scale. Global foundries (TSMC, UMC, GlobalFoundries) control those recipes and the UK lacks the political and commercial pull to get our IP accepted.\nProfessor Tony Kenyon: A rule of thumb: going from lab tech to commercial product can cost around $100 million. The UK needs patient capital and greater risk appetite to bridge that 'valley of death'.\nKit Malthouse: Why does most of the value sit with big foundries rather than designers in the UK?\nDr Tanya Mangoma: We can't realistically become the next TSMC. The way to capture value is to get our IP into those foundries or to use UK pilot foundries for edge devices, then scale via partnerships.\nTom Collins: Is there already manufacturing in the UK that could be scaled?\nProfessor Callum Littlejohns: Yes—lab facilities and small volume manufacturing exist. The missing piece is a pilot line: a shared mid‑scale facility to prove manufacture at hundreds or thousands of wafers, not just one.\nDr Josh Silverstone: GlobalFoundries and others can make our designs today; their capacity dwarfs what start‑ups need. But to build an ecosystem here we need UK pilot facilities and the capital to push products to market.\nProfessor Tony Kenyon: DSIT pledged about £20m to neuromorphic computing to 2030—useful but far short of the sums needed to build sovereign commercial capability.\n\n\n## Policy asks, timelines and risks\n> Witnesses ask for a national pilot line, stronger government engagement with foundries, procurement support, and more patient capital to shorten timelines and anchor industry in the UK.\n\nDaniel Zeichner: What practical steps would bridge the scale‑up gap?\nProfessor Tony Kenyon: Publish a national neuromorphic strategy, fund shared prototyping/testbeds and use procurement as an early customer in defence, healthcare or robotics to give firms market certainty.\nProfessor Callum Littlejohns: We recommend a national silicon photonics pilot line: 10,000–20,000 wafers a year capacity, built in 3–4 years, to let firms prove manufacturing and attract global partners.\nDr Josh Silverstone: With more capital—order of £100m for some programmes—timelines for product delivery could shrink from five‑seven years to two‑three years for certain roadmaps.\nMartin Wrigley: What's to stop big firms like Nvidia buying all the British IP?\nDr Tanya Mangoma: They can buy companies; the best defence is to back UK firms so they scale here. Infrastructure and a pilot line help anchor companies and talent in the UK.\nKit Malthouse: You asked for Government intervention to open doors at TSMC—do you mean diplomatic weight not just money?\nDr Tanya Mangoma: Yes: someone with authority to get foundries to test UK IP and to make partnerships. University teams can't do that alone.\nChair: To summarise: the technology exists and could reduce energy use and deliver edge capability; the UK has research strengths; the obstacles are scale‑up, capital, foundry access and co‑ordination; asks are a pilot line, stronger Government facilitation with foundries and procurement pull.\nProfessor Callum Littlejohns: If the Government commits to pilot infrastructure and works with industry on milestones, we can both keep jobs here and make the UK an attractive place for global partners to invest.\nDr Josh Silverstone: Ambition matters: with the people, some funding and pilot facilities, the UK can build companies that own value and deliver low‑energy, fast computing for important sectors.\n",
  "inquiry": "Low-energy computing",
  "glossary": [
    {
      "term": "neuromorphic computing",
      "definition": "Computer hardware that is designed to operate more like a brain, combining memory and processing and often working with event-based signals."
    },
    {
      "term": "spiking neural network",
      "definition": "A neural network that processes information as time-stamped events or 'spikes', enabling event-driven, lower‑energy operation."
    },
    {
      "term": "photonics",
      "definition": "Technology that uses light (photons) to carry information or do computation, like fibre optics or on‑chip optical circuits."
    },
    {
      "term": "silicon photonics",
      "definition": "Integrating photonics (light) on silicon chips so optical signalling and some processing can happen on a small chip."
    },
    {
      "term": "foundry",
      "definition": "A factory that mass-manufactures semiconductor chips for many customers, e.g. TSMC or GlobalFoundries."
    },
    {
      "term": "ReRAM",
      "definition": "A type of non-volatile resistive memory that can store data without constant power, useful for co-located memory/compute designs."
    },
    {
      "term": "memristor",
      "definition": "A device whose resistance depends on past electrical signals; can act as memory and a compute element in neuromorphic designs."
    },
    {
      "term": "pilot line",
      "definition": "A shared, mid-scale manufacturing facility used to prove you can make a device reliably at volumes between lab and mass production."
    },
    {
      "term": "event camera",
      "definition": "A camera that only reports changes in the scene (events) rather than full frames, greatly reducing data generated."
    }
  ]
});
