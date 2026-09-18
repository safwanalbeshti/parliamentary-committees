/*
 * Energy Security and Net Zero Committee — Energy resilience inquiry (HC 171)
 * Oral evidence, Wednesday 3 June 2026 — Panel I (Q137–176).
 * Condensed from: Energy Resilience/full_transcript_4.txt
 * Plain-English dialogue source: Energy Resilience/condensed_4.txt
 */
window.COMMITTEE_SESSIONS = window.COMMITTEE_SESSIONS || [];

window.COMMITTEE_SESSIONS.push({
  id: "energy-resilience-4",
  label: "Session 4 · Threats at sea",
  committee: "Energy Security and Net Zero Committee",
  date: "3 June 2026",
  // Inquiry: Energy resilience, HC 171. Replace with the exact evidence page if you like.
  sourceUrl: "https://committees.parliament.uk/",
  sourceLabel: "Official transcript (HC 171)",
  summary:
    "Three witnesses — a security scholar, a maritime lawyer and an offshore-industry representative — walk MPs through the threats to the UK’s offshore energy infrastructure: deniable sabotage by hostile states, the limits of the law beyond 12 nautical miles, scarce repair ships and crews, and why drones grab headlines while cyber-attacks do the daily damage. Their shared message: detecting a threat is not the same as being ready to respond.",

  room: {
    image: "Energy Resilience/committee_room_4.png",
    width: 2788,
    height: 1536,
    // Percent coordinates of each person in the illustration (x, y at head height).
    seats: {
      chair: { x: 66, y: 29.5 },
      downie: { x: 25, y: 36.5 },
      chope: { x: 79, y: 30 },
      crichton: { x: 20.5, y: 41.5 },
      collinge: { x: 36, y: 37.5 },
      young: { x: 89.5, y: 46.5 },
      billington: { x: 87.5, y: 40 },
      oakshett: { x: 30, y: 57 },
      braw: { x: 45.5, y: 62 },
      skinner: { x: 15, y: 51.5 },
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
    "Elisabeth Braw": {
      name: "Elisabeth Braw",
      role: "Witness — Senior Fellow, Atlantic Council",
      description: "Security scholar and author of “Undersea War”, on hostile-state threats to cables and pipelines.",
      kind: "witness",
      seats: ["braw"],
      color: "#6f5c91",
      soft: "#ebe2f5",
    },
    "Chloe Oakshett": {
      name: "Chloe Oakshett",
      role: "Witness — maritime lawyer, Addleshaw Goddard",
      description: "Also Director of the Scottish Maritime Cluster; explains what the law can and cannot do at sea.",
      kind: "witness",
      seats: ["oakshett"],
      color: "#4c7b5d",
      soft: "#dff0dd",
    },
    "Graham Skinner": {
      name: "Graham Skinner",
      role: "Witness — Offshore Energies UK",
      description: "Health, Safety & Security Policy Manager for the offshore energy industry body.",
      kind: "witness",
      seats: ["skinner"],
      color: "#9b543e",
      soft: "#f2e0d7",
    },
    "Sir Christopher Chope": {
      name: "Sir Christopher Chope",
      role: "Member of the Committee (MP)",
      kind: "member",
      seats: ["chope"],
      color: "#5c676d",
      soft: "#e5e8e8",
    },
    "Graeme Downie": {
      name: "Graeme Downie",
      role: "Member of the Committee (MP)",
      kind: "member",
      seats: ["downie"],
      color: "#287079",
      soft: "#d9eeee",
    },
    "Claire Young": {
      name: "Claire Young",
      role: "Member of the Committee (MP)",
      kind: "member",
      seats: ["young"],
      color: "#b17b2e",
      soft: "#f5e8c4",
    },
    "Lizzi Collinge": {
      name: "Lizzi Collinge",
      role: "Member of the Committee (MP)",
      kind: "member",
      seats: ["collinge"],
      color: "#8a5a78",
      soft: "#f0e2ec",
    },
    "Polly Billington": {
      name: "Polly Billington",
      role: "Member of the Committee (MP)",
      kind: "member",
      seats: ["billington"],
      color: "#4c7b5d",
      soft: "#e2efe0",
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
# Energy Resilience: Threats at Sea

## How worried should we be?
> Hostile states can weaken a country through deniable sabotage — and a varied energy mix blunts the damage.

Chair: We’re looking at how well the UK’s energy system could cope with sabotage, cyberattacks or other serious disruption. Elisabeth, how worried should we be?

Elisabeth Braw: We should take the threat seriously. Countries such as Russia don’t always need to use open military force. They can weaken another country through sabotage, cyberattacks or suspicious activity that’s difficult to prove was ordered by a government.

Chair: So an incident might look accidental even when it isn’t?

Elisabeth Braw: Exactly. That uncertainty is useful to an attacker. The UK’s infrastructure has held up well so far, and we haven’t seen a UK undersea cable mysteriously cut in circumstances clearly pointing to a hostile state. But the wider situation has changed. Some governments now seem willing to interfere with another country’s infrastructure without worrying about being publicly accused.

Chair: We’ve seen Russian submarines spending time near North Sea pipelines. Is that the sort of activity you mean?

Elisabeth Braw: Yes. The UK can announce that it has spotted them, but Russia doesn’t seem embarrassed by that. The activity continues. Publicly naming the vessels isn’t necessarily enough to stop them.

Chair: Does having several different sources of energy make us safer?

Elisabeth Braw: It does. If the UK depended almost entirely on one type of energy, an attacker could concentrate on that. A mixture of oil, gas, wind, electricity cables and other sources means that damaging one part of the system is less likely to bring down everything.

## The law at sea
> Strong powers inside 12 nautical miles, limited ones beyond — so a faster response matters more than new law.

Chair: Chloe, how much can the UK legally do to protect offshore infrastructure?

Chloe Oakshett: Within 12 nautical miles of the coast, the UK has strong legal control. Beyond that, many important cables, pipelines and offshore installations are in the UK’s exclusive economic zone, where our powers are more limited.

Chair: What does that mean in practice?

Chloe Oakshett: Ships generally have a right to move freely at sea. An offshore installation may have a 500-metre safety zone around it, but you can’t put a fence around that zone. You also need ships, aircraft or other resources available to enforce it.

Chair: Couldn’t the international law simply be changed?

Chloe Oakshett: Not quickly. Changing the law of the sea would require complicated international negotiations. It’s more realistic to improve the UK’s ability to react. We should know what ships, crews and emergency powers are available if a cable is cut or an installation is damaged.

Chair: So the law can’t prevent every incident, but we can prepare to respond faster.

Chloe Oakshett: That’s right. The UK already has emergency powers, including powers under the Civil Contingencies Act. The question is whether we’ve planned clearly enough to use them at sea.

## How prepared is industry?
> Sixty years of offshore safety culture helps, but nobody has agreed what level of resilience is expected.

Chair: Graham, how prepared is the offshore energy industry?

Graham Skinner: The industry has dealt with serious offshore risks for around 60 years. We already prepare for things such as ships drifting towards installations, equipment failures and dangerous weather. That safety culture also helps us deal with security threats.

Chair: But are there gaps?

Graham Skinner: Yes. We’re fairly confident about the threats we understand today. What’s less clear is how those threats might escalate. For example, what happens if suspicious surveillance becomes physical interference? What happens if several installations are threatened at once?

Chair: What would improve the situation?

Graham Skinner: Government and industry need to work more closely and agree what level of resilience is expected. Companies also need enough commercial stability to invest in security. You can’t keep demanding expensive protective measures from businesses while making it difficult for them to plan financially.

Chair: You also think the UK needs a range of energy sources?

Graham Skinner: Yes. We shouldn’t treat this as a simple argument between different technologies. A resilient country needs several ways of producing and importing energy. Our industry’s position is that oil and gas will still be needed for some time alongside newer sources.

## Sharing intelligence
> Designate offshore energy as critical national infrastructure, and copy Norway’s and Taiwan’s reporting models — without overburdening small firms.

Sir Christopher Chope: The private operators in the North Sea sometimes seem separated from the Government and intelligence services. The Government may know about a threat, but the companies operating the equipment don’t always receive that information. How do we fix that?

Graham Skinner: There’s a coordination problem. One useful step would be to formally designate offshore energy installations as critical national infrastructure. That could give operators better access to existing security arrangements and advice.

Sir Christopher Chope: Are there examples from other countries?

Graham Skinner: Norway has a maritime security forum that brings together the security services, energy companies, shipping businesses and fishermen. They share an overall picture of what’s happening at sea instead of keeping everything in separate organisations.

Elisabeth Braw: Taiwan also offers a useful lesson. It has experienced several suspicious cable incidents. In the past, a cable would be damaged, the authorities would investigate and the suspected ship would already be gone.

Sir Christopher Chope: What changed?

Elisabeth Braw: Cable operators were required to report suspicious changes immediately. During one incident, the coastguard was already dealing with a suspicious vessel when it received a real-time message that a cable had just been cut. That meant the authorities were effectively present at the scene instead of arriving much later.

Sir Christopher Chope: So the UK needs a direct hotline?

Elisabeth Braw: Yes, and the information needs to travel both ways. Operators should quickly report unusual activity, but the Government should also warn operators when intelligence suggests a threat.

Chloe Oakshett: We need to be careful, though. Asking a small company to collect and store sensitive information can make that company a target itself.

Sir Christopher Chope: Can you give an example?

Chloe Oakshett: A small fishing business might see something suspicious, but its first priority will be keeping the crew safe, not confronting a possible hostile state. Small businesses don’t have the security resources of the Government or a defence company.

Elisabeth Braw: That’s fair, but there still needs to be a simple way for people to report what they’ve seen.

Chloe Oakshett: Yes, but it has to reflect reality. We shouldn’t create several complicated hotlines and then assume every fisherman or small operator will know which one to use.

## People, clearances and repairs
> Plans fail without cleared, trained people — the UK needs a reserve of cable-repair workers.

Chair: Does the Government understand the seriousness of the threat?

Graham Skinner: Broadly, yes. The harder issue is sharing classified information with private companies. An operator may see suspicious behaviour but won’t necessarily know what a foreign government intends or how quickly the situation could become dangerous.

Chair: Chloe, are there practical problems beyond intelligence sharing?

Chloe Oakshett: Security clearances are one. A skilled worker may be perfectly capable of repairing equipment, but if the job suddenly becomes sensitive or classified, that person may not have the required clearance. The delay could hold up an urgent repair.

Chair: So resilience depends on ordinary practical details too.

Chloe Oakshett: Absolutely. You need suitable vessels, trained crews, port workers, equipment operators and security-cleared specialists. A plan on paper isn’t much use when the people required to carry it out aren’t available.

Elisabeth Braw: There’s also a serious shortage of people trained to repair undersea cables. Repair vessels matter, but they’re useless without experienced crews.

Chair: What do you suggest?

Elisabeth Braw: The UK could create a reserve of people with basic cable-repair training. They wouldn’t replace the most experienced specialists, but they could support them during a major emergency, a bit like military reservists.

Chair: It sounds as though we’re good at spotting threats, but less certain about what to do next.

Elisabeth Braw: That’s the central problem. The UK may detect a suspicious vessel interfering with a cable outside territorial waters, but then it has to decide how far it’s willing to go. Would it risk a confrontation with another country to stop the vessel?

Graham Skinner: Deterrence matters here. Better physical and cyber protection makes the UK a harder target. We should also show that suspicious activity will receive a visible response. An attacker should believe the UK is both willing and able to act.

## Drones and escalation
> Fines won’t stop hostile states; drones are rare while cyber-attacks arrive daily — and mass shutdowns are the real nightmare.

Graeme Downie: Could stronger UK legislation make it clearer that the military can act outside the 12-mile limit?

Chloe Oakshett: Civil and commercial law can help control normal behaviour. It can deal with someone who accidentally enters a safety zone or acts carelessly. But a fine won’t deter a hostile state or somebody deliberately operating a drone for malicious purposes.

Graeme Downie: So ordinary legal penalties only go so far.

Chloe Oakshett: Exactly. They’re useful for separating innocent or careless activity from something more suspicious, but they aren’t a substitute for defence and security powers.

Graeme Downie: Graham, what happens if a drone appears near an offshore platform?

Graham Skinner: So far, there have been very few reported drone incidents around UK offshore infrastructure. They may sometimes be hard to see, but the ones that have been observed generally remained at a distance.

Graeme Downie: What if one lands on a platform?

Graham Skinner: That’s where things quickly become difficult. The crew might not know whether it’s filming, carrying equipment or posing a direct danger. We’ve practised that kind of scenario.

Graeme Downie: Would the company shoot it down?

Graham Skinner: No. Any forceful anti-drone action would be a matter for the police or military, not a private operator.

Graeme Downie: Are drones the biggest threat?

Graham Skinner: No. They attract attention because they’re visible and dramatic, but cyberattacks are far more common. Critical infrastructure faces hundreds of attempted cyberattacks a day. We shouldn’t let an unusual drone sighting distract us from basic physical and cyber protection.

Graeme Downie: Is there a clear reporting system?

Graham Skinner: We recently brought the existing reporting requirements together into one document for offshore managers. Reports go to the relevant services, including the Joint Maritime Security Centre.

Graeme Downie: Do operators hear anything back?

Graham Skinner: Not always, because some information will be classified. But some feedback is important. People are more likely to keep reporting suspicious activity if they believe somebody is reading the reports and acting on them.

Graeme Downie: What did the Granite Resolve exercise teach you?

Graham Skinner: Our normal safety systems are strong. If we faced an unknown or escalating threat, we could shut down a platform and protect the people aboard.

Graeme Downie: But shutting down creates another problem, doesn’t it?

Graham Skinner: Yes. One platform shutting down temporarily may be manageable. But imagine 20 gas installations shutting down during a cold winter. That could become a national energy problem. We need to discuss those larger scenarios now, not during the emergency.

Graeme Downie: Are there international lessons beyond Taiwan?

Elisabeth Braw: Norway regularly practises dealing with drones and suspicious activity around offshore installations. It has decades of experience protecting energy infrastructure while dealing with significant Russian activity nearby. The UK could learn a lot from it.

## Repairing interconnectors
> Power cables lack the data-cable “ambulance service”, and everyone depends on the same few ships and crews.

Claire Young: Let’s talk about repairing electricity cables between countries. Data cables have organised repair arrangements, but power cables seem less prepared.

Elisabeth Braw: That’s right. Data cable operators can subscribe to what I’d call an ambulance service. They pay into an arrangement that gives them access to repair vessels and crews when something goes wrong.

Claire Young: But electricity interconnectors don’t have the same service?

Elisabeth Braw: Not in the same organised way. They’re extremely expensive and slow to repair, and they can be difficult to insure. The Government could bring the operators together and help create a shared repair framework.

Chloe Oakshett: Most operators already have repair contracts. The problem is that many of those contracts depend on the same limited group of specialist companies, ships and crews.

Claire Young: So two simultaneous failures could compete for the same repair team.

Chloe Oakshett: Exactly. Creating a central ambulance service wouldn’t magically create more vessels or skilled workers. It could help decide which repair should come first, but the shortage would still exist.

Elisabeth Braw: It would still be better than a free-for-all. When Finland’s EstLink 2 was damaged, the operator had to search for a repair vessel and eventually improvise. A shared arrangement would at least provide a known process.

Claire Young: Would the Government need to decide which cable gets priority?

Chloe Oakshett: In a major emergency, yes. But first, the Government needs a clear audit: which vessels exist, where they are, what equipment they carry and which crews are available. You can’t prioritise resources if you don’t know what resources you have.

## Reporting routes
> One monitored portal beats many hotlines — and proving intent at sea is genuinely hard.

Lizzi Collinge: Graham, are you confident that energy companies know how to report threats?

Graham Skinner: Our members do. The guidance has been circulated and will form part of their emergency planning. The complication is that several Government bodies may want information, so one incident can lead to a lot of follow-up work.

Lizzi Collinge: Chloe, is that how smaller businesses see it?

Chloe Oakshett: Smaller businesses often hear that several organisations are creating separate hotlines. There can end up being more reporting systems than people willing or able to use them.

Lizzi Collinge: The Government has discussed creating a reporting portal. Would that help?

Graham Skinner: A single portal could make reporting simpler, but only if somebody is actually monitoring it and responding. A website where reports disappear into a system isn’t enough.

Lizzi Collinge: Who decides whether something is just a safety issue, a security incident or a matter for the military?

Graham Skinner: Operators should report suspicious activity with a security element. Government bodies then decide whether it needs to be escalated. The operator’s immediate responsibility is still to protect workers and prevent environmental damage.

Chloe Oakshett: Intent is especially hard to prove at sea. You may be able to show that a vessel was near a cable when it was damaged, but that doesn’t automatically prove the damage was deliberate. Most cable damage is accidental. Intelligence from outside the commercial maritime world may be needed to establish malicious intent.

Lizzi Collinge: Would the coastguard, Navy and operators be ready to work together during a serious incident?

Elisabeth Braw: They’d respond, but the UK has a gap. In several European countries, the coastguard has law-enforcement powers and deals with suspicious ships. The UK coastguard mainly concentrates on search and rescue, so constabulary work at sea often falls to the Navy.

Lizzi Collinge: Why is that a problem?

Elisabeth Braw: Tampering with a cable might begin as a criminal incident but also have geopolitical motives. Using the Navy or special forces is a much bigger step than sending a coastguard vessel to investigate. The UK needs a clearer organisation for dealing with incidents that sit between ordinary crime and warfare.

## Cyber risk
> More devices mean more entry points; the basics — updates, access control, supplier checks — matter most.

Polly Billington: How serious is the cyber risk as the energy system becomes more distributed and reliant on renewable technology?

Graham Skinner: It remains one of the biggest risks. A modern energy system contains many connected devices, control systems and suppliers. Every connection can potentially create another route for an attacker.

Polly Billington: But having many different energy sources also makes the system harder to bring down all at once.

Graham Skinner: That’s the trade-off. More devices and operators create more possible weak points, but a varied system is less likely to have one single point whose failure brings down everything.

Polly Billington: What’s the basic lesson from attacks on other countries’ energy systems?

Graham Skinner: Do the fundamentals properly. Install updates, close known security gaps, control access and check the cyber practices of suppliers. A company can secure its own systems and still be exposed through a poorly protected contractor or component.

Polly Billington: Are offshore wind turbines at greater cyber risk simply because they’re at sea?

Graham Skinner: Not necessarily. Their location creates physical challenges, but the cyber risk comes mainly from their digital systems, communications and supply chains.

## Who pays?
> Insurance rarely covers the damage, training matters more than regulation, and component choices are national-security calls.

Torcuil Crichton: All this protection and repair work costs money. Where does the private sector’s responsibility end and the state’s responsibility begin?

Chloe Oakshett: It’s difficult to recover the full cost of damage through marine insurance. A relatively small vessel can cause enormous damage with an anchor, but its legal liability and insurance may be limited by the vessel’s size.

Torcuil Crichton: So the cost of the damage may be far greater than anything that can be recovered from the vessel’s owner.

Chloe Oakshett: Exactly. Civil claims won’t always provide a realistic solution, especially when a small ship damages extremely valuable infrastructure.

Torcuil Crichton: Elisabeth, should the Government regulate cable repairs more heavily?

Elisabeth Braw: Regulation isn’t necessarily the first answer. We urgently need more trained repair workers. Hardly anybody thinks about cable repair as a career, even though those workers are essential to the country.

Torcuil Crichton: Could the Government own repair vessels?

Elisabeth Braw: Possibly, but a vessel without skilled people is just an empty ship. Recruitment and training have to come first.

Torcuil Crichton: Could spending on this infrastructure count as defence spending?

Elisabeth Braw: Protecting infrastructure related to national security could reasonably fit within broader defence and resilience spending.

Torcuil Crichton: Put the drone threat into perspective for us.

Graham Skinner: The UK has recorded fewer than a handful of offshore drone incidents over the past couple of years. By comparison, critical infrastructure faces hundreds of cyberattacks every day. Cyber is the much larger day-to-day threat.

Torcuil Crichton: What about concerns that foreign-made components in wind turbines could be used for surveillance or create security weaknesses?

Graham Skinner: Industry can examine suppliers, but it can’t make national intelligence judgments by itself. The Government needs to decide which countries, manufacturers and components are acceptable where national security is involved.

## Summing up
> Detection isn’t readiness: the UK must decide in advance how it will respond.

Chair: So, bringing everything together, what are the main weaknesses?

Elisabeth Braw: We can detect suspicious activity, but we haven’t fully decided how we’ll respond without causing a wider confrontation.

Chloe Oakshett: Our legal powers are limited outside territorial waters, and practical resources such as ships, trained workers and security clearances may not be available quickly enough.

Graham Skinner: Government and industry still need better information sharing, clearer responsibility and agreed standards for how resilient the energy system must be.

Chair: And the practical priorities?

Elisabeth Braw: Train more cable-repair workers, create better shared repair arrangements and make reporting immediate.

Chloe Oakshett: Map the available vessels, crews and equipment, simplify reporting and don’t place unrealistic security burdens on small companies.

Graham Skinner: Strengthen physical and cyber protection, practise large-scale emergencies and make sure the Government, security services and operators are working from the same picture.

Chair: So the UK isn’t defenceless, but it can’t assume that detecting a threat is the same as being ready to handle it.

Elisabeth Braw: Exactly.

Chloe Oakshett: Preparation has to include the law, the people and the equipment.

Graham Skinner: And it needs to happen before several parts of the system fail at the same time.
`,
});
