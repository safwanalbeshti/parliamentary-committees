/*
 * Energy Security and Net Zero Committee — Energy resilience inquiry (HC 171)
 * Oral evidence, Wednesday 3 June 2026 — Panel II (Q177–206).
 * Condensed from: Energy Resilience/full_transcript_5.txt
 * Plain-English dialogue source: Energy Resilience/condensed_5.txt
 */
window.COMMITTEE_SESSIONS = window.COMMITTEE_SESSIONS || [];

window.COMMITTEE_SESSIONS.push({
  id: "energy-resilience-5",
  label: "Session 5 · Defending the grid",
  committee: "Energy Security and Net Zero Committee",
  date: "3 June 2026",
  inquiry: "Energy resilience",
  sourceUrl: "https://committees.parliament.uk/oralevidence/17674/html/",
  sourceLabel: "Official transcript (HC 171)",
  summary:
    "The regulator (Ofgem) and the system operator (NESO) face MPs’ questions on whether Britain’s grid could withstand attack: the North Hyde fire’s lessons about hidden dependencies, 30,000 weather scenarios modelled daily, supply-chain risk, AI on both sides of the cyber fight, tightening gas margins, and a skills shortage on the cyber frontline. Bottom line: the system is strong, but energy resilience is now part of national defence.",

  room: {
    image: "Energy Resilience/committee_room_5.png",
    width: 2764,
    height: 1536,
    seats: {
      chair: { x: 36, y: 23 },
      billington: { x: 66, y: 24.5 },
      young: { x: 72, y: 29 },
      collinge: { x: 11.5, y: 33 },
      crichton: { x: 16, y: 42 },
      petterson: { x: 57.5, y: 54 },
      okin: { x: 76, y: 49.5 },
    },
  },

  cast: {
    Chair: {
      name: "Bill Esterson",
      role: "Chair, Energy Security and Net Zero Committee",
      description: "Steers the questioning and sums up what the committee has heard.",
      kind: "chair",
      seats: ["chair"],
      color: "#315f72",
      soft: "#d7edf0",
    },
    "Deborah Petterson": {
      name: "Deborah Petterson",
      role: "Witness — Director of Resilience, NESO",
      description: "Dr Petterson leads whole-energy-system resilience at the National Energy System Operator.",
      kind: "witness",
      seats: ["petterson"],
      color: "#b17b2e",
      soft: "#f5e8c4",
    },
    "Stuart Okin": {
      name: "Stuart Okin",
      role: "Witness — Director for Cyber Regulation, Ofgem",
      description: "Covers cyber-security regulation and emerging technologies such as AI and quantum at the energy regulator.",
      kind: "witness",
      seats: ["okin"],
      color: "#287079",
      soft: "#d9eeee",
    },
    "Lizzi Collinge": {
      name: "Lizzi Collinge",
      role: "Member of the Committee (MP)",
      kind: "member",
      seats: ["collinge"],
      color: "#8a5a78",
      soft: "#f0e2ec",
    },
    "Ms Polly Billington": {
      name: "Polly Billington",
      role: "Member of the Committee (MP)",
      kind: "member",
      seats: ["billington"],
      color: "#4c7b5d",
      soft: "#e2efe0",
    },
    "Claire Young": {
      name: "Claire Young",
      role: "Member of the Committee (MP)",
      kind: "member",
      seats: ["young"],
      color: "#b17b2e",
      soft: "#f5e8c4",
    },
    "Torcuil Crichton": {
      name: "Torcuil Crichton",
      role: "Member of the Committee (MP)",
      kind: "member",
      seats: ["crichton"],
      color: "#9b543e",
      soft: "#f5e6dd",
    },
  },

  transcript: `
# Energy Resilience: Defending the Grid

## Meet the regulators
> Ofgem polices cyber-security; NESO runs the grid and advises on whole-system risk.

Chair: Stuart, Deborah, could you briefly explain what you do?

Stuart Okin: I oversee cyber-security regulation and emerging technologies such as artificial intelligence at Ofgem, the energy regulator.

Deborah Petterson: I lead resilience work at NESO, the National Energy System Operator. We run Britain’s electricity system, plan how it’ll develop, and independently advise the Government about risks to the whole energy system.

## Are we in emergency mode?
> The threat is real and growing; about 40 inspections and £30 million in fines show enforcement has teeth.

Lizzi Collinge: We’ve seen countries such as Ukraine have their energy infrastructure deliberately attacked. Should Britain be treating energy resilience more like an emergency?

Deborah Petterson: The threat’s serious, and the industry understands that. Energy companies regularly practise dealing with storms, cyber-attacks, equipment failures and other emergencies. The system currently meets the level of risk Ministers have decided we should prepare for, but that doesn’t mean we can relax.

Stuart Okin: The risks have grown quickly over the past few years. Energy companies, regulators, government departments and the security services are putting much more effort into cyber resilience. It’s something we have to keep working on because the threat keeps changing.

Lizzi Collinge: Do you get enough support and information from the Government?

Stuart Okin: Generally, yes. The responsibilities are divided between several organisations. The Department for Energy decides which companies provide essential services and what level of threat they should prepare for. Ofgem checks whether those companies are properly protecting themselves. The National Cyber Security Centre provides technical expertise.

Lizzi Collinge: How do you check that companies are actually doing what they should?

Stuart Okin: We inspect them, require assessments and audits, and ask them to prove that their protections are appropriate. We’ve carried out around 40 detailed inspections and imposed roughly £30 million in fines where companies didn’t take enough action.

## North Hyde and hidden dependencies
> A substation nobody called “critical” took out Heathrow — the UK needs a map of what depends on what.

Lizzi Collinge: Cyber-attacks aren’t the only danger. What about old equipment, like the North Hyde substation where the fire affected Heathrow?

Stuart Okin: That incident’s still being investigated, so I can’t discuss the details. We’ve also checked whether National Grid has other equipment in a similar condition, and we’re considering whether future standards need to change.

Deborah Petterson: North Hyde showed how complicated these incidents can be. At first, nobody knew whether it was an accident or deliberate sabotage, so energy companies, government departments, police, counter-terrorism officers, intelligence agencies and the fire brigade all had to respond together.

Lizzi Collinge: And the effects went far beyond the substation itself.

Deborah Petterson: Exactly. North Hyde wasn’t officially classed as critical national infrastructure, but the outage affected Heathrow, trains, the Underground, traffic lights, hospitals, GP surgeries and data centres. It happened during the night, which made the disruption easier to manage, but it showed that a relatively ordinary piece of energy infrastructure can support many services that are critical.

Lizzi Collinge: So we need to understand how all these systems depend on one another.

Deborah Petterson: Yes. Energy supports transport, healthcare, communications, defence and practically everything else. Modern electricity systems also depend heavily on digital networks and telecommunications. We need a detailed map showing how those systems connect so we can identify where protection would have the greatest benefit.

Lizzi Collinge: Are we doing that?

Deborah Petterson: NESO and the Cabinet Office are both working on it. We’re also reviewing how the country decides which assets count as critical infrastructure. The old system was built around a smaller number of large power stations. Today, we have a much more distributed network involving renewable generators, batteries, digital systems and communications links.

## Weather and climate
> NESO models about 30,000 weather patterns a day and plans for weather Britain hasn’t seen yet.

Lizzi Collinge: What about extreme weather? Is the energy system prepared for climate change?

Stuart Okin: Ofgem has created a resilience hub that looks across cyber threats, weather and other risks. A more varied and decentralised energy system can improve resilience because we aren’t relying on a few large sources. However, it also creates more equipment and digital connections that attackers might target.

Deborah Petterson: Weather’s both a source of energy and a risk. NESO models about 30,000 weather patterns every day. We look at cold, grey days with little wind, but also periods with excessive wind or sunshine when the system might produce more electricity than it can easily use.

Lizzi Collinge: But historical weather records might not tell us what future weather will look like.

Deborah Petterson: That’s right. We’ve brought in Met Office expertise so our planning includes weather conditions Britain hasn’t experienced yet but could face in 10 or 20 years. That includes sea-level rise, heat and wildfire risk.

Lizzi Collinge: Wildfires are becoming relevant to Britain now?

Deborah Petterson: Yes. We’ve seen a very large increase in wildfires. We’re learning from countries such as Australia and the United States, which have much more experience protecting energy systems from them. We’re also practising for the kinds of summers we may face in future, not just the weather we’ve had in the past.

## Supply chains and responsibility
> Don’t depend on one supplier or country; big operators face tough rules while 1,400 smaller ones get a baseline.

Lizzi Collinge: Britain imports a lot of energy equipment. Should we manufacture more of it here so we’re less dependent on other countries?

Stuart Okin: That’s ultimately a decision for Ministers. There’s a balance between security and cost. We should look at the country, company and people involved in supplying a component, and use intelligence to judge the risk. Producing something domestically might reduce certain risks, but it could also cost more.

Deborah Petterson: The main thing is not to depend on a single supplier or country. The risk also depends on what the item does. A simple piece of metal is very different from equipment that collects data or connects to a network. With digital equipment, you need to ask who can access it, where the data goes and whether someone abroad could interfere with it.

Lizzi Collinge: Who should be responsible for resilience? Is it mainly the Government, or should companies and the public carry more of the responsibility?

Stuart Okin: Large operators that provide essential services have to take responsibility for protecting their systems, and regulators should hold them accountable. Smaller companies are different. There are around 1,400 energy licence holders that aren’t considered critical infrastructure, and we’re consulting on a basic cyber-security standard for them.

Lizzi Collinge: So smaller businesses wouldn’t be expected to meet exactly the same standards as National Grid?

Stuart Okin: Correct. They’d have a baseline level of protection, while the most important operators would face much more demanding requirements.

## A distributed grid
> More entry points but no single fatal target — and telecoms are the weak link in any recovery.

Ms Polly Billington: The electricity system’s becoming more complicated and decentralised. Old infrastructure is being connected to new digital technology. How does the new energy cyber-security strategy deal with that?

Stuart Okin: One important area is the supply chain. A company may protect its own systems well but still be exposed through a supplier. The strategy includes new standards and guidance for suppliers, and the Government’s Cyber Security and Resilience Bill is expected to bring parts of the supply chain directly under regulation.

Deborah Petterson: A distributed system creates more possible entry points for attackers, but it also gives us greater resilience. Ukraine’s experience shows the value of having many smaller energy sources instead of a few targets whose loss could cripple the whole system.

Ms Polly Billington: Smaller wind, solar and battery operators may not think of themselves as part of national security.

Deborah Petterson: They need to start doing so. As the saying goes, with great power comes great responsibility. If a company wants to be part of the country’s energy supply, it has to take the security implications seriously. We’re building stronger relationships with those newer parts of the energy industry.

Ms Polly Billington: Energy and telecommunications increasingly depend on each other, but they have different regulators. Can NESO look across both sectors?

Deborah Petterson: Yes. Our responsibility covers any risk that could affect the energy system. Since electricity depends on telecommunications and digital systems, we can investigate those connections too.

Ms Polly Billington: Why are telecommunications so important during a major outage?

Deborah Petterson: Restoring electricity requires control rooms, engineers and companies to communicate. During the major outage in Spain and Portugal, telecommunications became a weak point in the recovery process. We’re now testing whether the industry’s operational telephone systems would keep working during a crisis.

Stuart Okin: A major exercise on that issue is happening this month.

## Measuring success and AI
> Judge resilience by exercises, not attack counts; AI helps attackers and defenders alike.

Claire Young: How will you know whether the cyber-security strategy is successful? A lack of attacks doesn’t necessarily mean the system’s safe.

Deborah Petterson: That’s one of the difficulties with resilience. It’s hard to measure disasters that didn’t happen.

Stuart Okin: We shouldn’t judge success by counting attacks. We should judge it through exercises and testing. Companies should actively try to find weaknesses rather than trying to produce a perfect-looking test result.

Claire Young: So finding a problem during an exercise isn’t considered a failure?

Stuart Okin: No. Finding a problem’s useful. The important question is what the company does about it and how quickly it fixes it. We’ll hold operators accountable for that.

Claire Young: How does artificial intelligence change the threat?

Stuart Okin: AI can help run the energy system, improve weather forecasting and identify technical problems. But attackers can use it too. It can help them find vulnerabilities, produce malicious software and operate at greater speed.

Claire Young: What can companies do about that?

Stuart Okin: One important measure is being able to operate without normal digital systems. Companies may need to disconnect a compromised system and run in a manual or partly manual mode. We check whether important operators can do that.

Deborah Petterson: AI could also help fix long-standing software problems. A lot of cyber risk comes from badly written or outdated code. AI may expose more flaws in the short term, creating a large amount of patching work, but repairing those flaws could ultimately leave the system stronger.

Claire Young: Do companies know what kind of attacker they’re expected to defend against?

Stuart Okin: Yes. We plan around a professional attacker who can exploit known weaknesses, remain hidden for a long time and move from one part of a network to another. That might be a state-backed group or another sophisticated organisation.

Claire Young: But AI could give less skilled people abilities that were once limited to nation states.

Deborah Petterson: Exactly. The distinction between different types of attacker’s becoming less useful. What matters is the capability they have and the harm they can cause. Energy operators need to be ready for cyber-attacks, physical attacks and combinations of the two.

Stuart Okin: We should also remember that energy companies are the last line of defence, not the first. Britain also has intelligence, military and offensive cyber capabilities working to stop threats before they reach those companies.

Claire Young: Is government and regulatory oversight strong enough?

Stuart Okin: It has improved significantly over the past two or three years. There are still gaps, particularly around supply chains, but the new legislation’s meant to address them.

Deborah Petterson: Regulation should focus on the result we need, such as keeping electricity flowing or restoring it within a certain time. It shouldn’t try to predict every possible attack. Threats change too quickly for extremely detailed rules.

Claire Young: Does the Government listen when NESO identifies a problem?

Deborah Petterson: After the North Hyde review, the Government accepted all our recommendations. We also warned that Britain could face a growing risk to gas supplies in five to 10 years, and the Energy Secretary launched a consultation on how to deal with it.

Stuart Okin: That’s why new laws shouldn’t be too prescriptive. If the rules specify every technical step, they can become outdated almost immediately. They need to set clear outcomes while allowing the methods to change.

Claire Young: How much money’s being spent on cyber-security?

Stuart Okin: Around £2 billion was allocated during the previous regulatory period, although that included control-room improvements and ongoing operations as well as cyber upgrades. About £1.2 billion has been allocated for security in the next period. Earlier investment also created around 2,000 jobs in the sector.

## Should we lose sleep?
> “My job’s to lose sleep on the public’s behalf” — confidence without complacency.

Torcuil Crichton: Deborah, you’ve spent years looking at national-security threats. Should the public be losing sleep over this?

Deborah Petterson: My job’s to lose sleep on the public’s behalf. The threats and the intentions of hostile actors are serious, but Britain has strong institutions, skilled engineers and close links between the energy industry and the security services. People should feel confident, but we shouldn’t be complacent.

Stuart Okin: You could spend all day reading threat reports and become extremely depressed. But we also have to be realistic about cost. We can’t build a bunker around every substation. We have to decide which protections are proportionate to the risk.

Deborah Petterson: Britain’s electricity grid is extremely reliable and includes a lot of built-in redundancy. But the system’s usually balancing three goals: affordability, clean energy and resilience. Ministers have to decide how much weight to give each one as circumstances change.

Torcuil Crichton: Does improving resilience always make energy more expensive?

Deborah Petterson: Not necessarily. NESO is creating a team to study cascading risks, where one failure triggers others. We want to find investments that improve security while also supporting affordable and clean energy.

## Gas margins
> Diverse gas sources meet the 11-day cold-spell test today, but margins may tighten within a decade.

Torcuil Crichton: What’s the situation with gas? Britain gets it from the North Sea, Norway, Europe and ships carrying liquefied natural gas.

Deborah Petterson: Having several sources is one of our strengths. Britain isn’t heavily dependent on Middle Eastern gas. Most imported liquefied natural gas has recently come from countries such as the United States and Canada.

Torcuil Crichton: But what if there’s a very cold winter and bad weather prevents ships from reaching British ports?

Deborah Petterson: That’s included in our modelling. The standard test is whether Britain could supply enough gas during an extremely cold period lasting about 11 days while also losing its largest piece of gas infrastructure. We currently meet that standard, but our assessment found a possible risk emerging in five to 10 years.

Torcuil Crichton: What’s the best answer: more storage, more imports or more North Sea production?

Deborah Petterson: There isn’t one simple answer. Resilience comes from having a mixture: British and Norwegian production, liquefied natural gas, storage and pipelines to Europe. The North Sea’s declining, so the balance will have to change, but relying completely on any single source would create a vulnerability.

## Skills and allies
> A third of cyber-engineering posts go unfilled; lessons come from Australia, Ukraine, Norway and beyond.

Ms Polly Billington: The strategy says Britain doesn’t have enough people with both engineering and cyber-security skills. Who’s responsible for fixing that?

Stuart Okin: Government, regulators and the industry all have a part to play. The Government runs national skills programmes. Ofgem can allow funding for training through the regulatory system. Energy companies can offer apprenticeships and train their own staff.

Ms Polly Billington: When everybody’s responsible, there’s a danger that nobody takes responsibility.

Stuart Okin: That’s fair. The shortage’s real. One estimate suggested that about one in three relevant posts wasn’t being filled. There are plenty of applicants for some roles, but not enough people with the right combination of skills.

Deborah Petterson: We also need routes for people who want to retrain later in their careers, not just programmes for young people. AI tools may eventually help people develop some of these skills more quickly, but they won’t remove the need for trained professionals.

Ms Polly Billington: So is Britain’s cyber-security frontline dangerously short-staffed?

Stuart Okin: It’s a risk we need to keep working on, but it isn’t a reason to panic. Around 2,000 roles have been created and filled in recent years, and Britain has strong universities and apprenticeship programmes.

Ms Polly Billington: How does working with other countries improve our resilience?

Deborah Petterson: It lets us learn from problems they’ve already faced. Australia carries out large, live exercises involving its whole energy sector. New Zealand has experience isolating parts of its system so they can operate independently. Canada has developed close intelligence-sharing partnerships with energy companies.

Ms Polly Billington: And what can Britain learn from European countries?

Deborah Petterson: Latvia’s dealing with drone threats. Norway treats civilian infrastructure and national defence as closely connected. Ukraine has direct experience protecting substations from missiles, drones and sabotage. Those lessons are extremely valuable.

Ms Polly Billington: You’re also looking at natural threats, aren’t you?

Deborah Petterson: Yes. Space weather, such as intense solar activity, can disrupt electricity and digital systems. Britain has worked with international partners to improve forecasts, guidance and emergency procedures. New Zealand’s further ahead in some areas, so we can learn from what worked and what didn’t.

Stuart Okin: Cyber-security standards and supply chains also have to be international. No country controls the entire production chain for energy equipment. We need common standards and close co-operation with European and Five Eyes partners.

## Energy as defence
> The grid is mission-critical defence infrastructure — whatever budget line it sits on.

Chair: How important is closer integration with Europe’s energy market?

Stuart Okin: The political decision belongs to the Government. From a cyber-security perspective, closer integration should be manageable, although Britain would need to be involved in the relevant European committees and standards work.

Chair: And from the point of view of keeping energy flowing?

Deborah Petterson: Britain’s physically connected to 10 European countries. Our control room speaks with European partners every day. Whatever the formal political arrangement is, the practical co-operation’s already constant.

Chair: You’ve talked about energy resilience almost as if it’s part of national defence.

Deborah Petterson: Energy is essential to defence. A country can’t protect itself without electricity, fuel, communications and functioning infrastructure. NATO also recognises resilient energy networks as part of a nation’s responsibility to defend itself.

Chair: So even if spending on the grid isn’t officially called defence spending, it should be viewed in similar terms?

Deborah Petterson: Yes. I’d describe the energy system as mission-critical infrastructure for defence. The military should be extremely interested in whether the grid can withstand attacks, recover from failures and continue operating during a national emergency.

Chair: So the basic message is that Britain’s energy system is highly reliable, but the risks are becoming more connected and complicated.

Deborah Petterson: That’s right. We have a strong system, but electricity, gas, telecommunications, transport, healthcare and defence increasingly rely on one another. We need to understand those links, practise for failures and invest where one improvement can protect several sectors at once.

Stuart Okin: And we need rules that make companies take responsibility without freezing today’s technology into law. The threat will keep changing, so testing, learning and fixing weaknesses have to become permanent habits.

Chair: Thank you both. That brings the session to an end.
`,
});
