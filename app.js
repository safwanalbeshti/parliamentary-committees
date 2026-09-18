"use strict";

/*
 * Each session brings its own room: an image plus seat anchors expressed as
 * percentages of that image (x/y at head height). See sessions/*.js.
 */
const DEFAULT_DESIGN = {
  role: "Speaker",
  description: "",
  kind: "member",
  seats: [],
  color: "#52636a",
  soft: "#e9ece9",
};

const KIND_LABELS = {
  chair: "Chair",
  member: "MP",
  witness: "Witness",
};

const STORAGE_KEY = "committee-viewer-progress";

const el = {
  appMain: document.querySelector("main.app"),
  meetingMenu: document.querySelector("#meetingMenu"),
  meetingList: document.querySelector("#meetingList"),
  menuBtn: document.querySelector("#menuBtn"),
  stage: document.querySelector("#stage"),
  roomImage: document.querySelector("#roomImage"),
  roomDim: document.querySelector("#roomDim"),
  spotlight: document.querySelector("#spotlight"),
  nameplate: document.querySelector("#seatNameplate"),
  nameplateName: document.querySelector("#nameplateName"),
  nameplateKind: document.querySelector("#nameplateKind"),
  speechBubble: document.querySelector("#speechBubble"),
  bubbleSpeaker: document.querySelector("#bubbleSpeaker"),
  bubbleText: document.querySelector("#bubbleText"),
  bubbleCount: document.querySelector("#bubbleCount"),
  committeeName: document.querySelector("#committeeName"),
  sessionDate: document.querySelector("#sessionDate"),
  sessionTitle: document.querySelector("#sessionTitle"),
  sourceLink: document.querySelector("#sourceLink"),
  aboutSourceLink: document.querySelector("#aboutSourceLink"),
  aboutSummary: document.querySelector("#aboutSummary"),
  turnCounter: document.querySelector("#turnCounter"),
  sessionPickerWrap: document.querySelector("#sessionPickerWrap"),
  sessionPicker: document.querySelector("#sessionPicker"),
  chapterLabel: document.querySelector("#chapterLabel"),
  chapterTakeaway: document.querySelector("#chapterTakeaway"),
  previousBtn: document.querySelector("#previousBtn"),
  nextBtn: document.querySelector("#nextBtn"),
  playBtn: document.querySelector("#playBtn"),
  playLabel: document.querySelector("#playLabel"),
  iconPlay: document.querySelector("#playBtn .icon-play"),
  iconPause: document.querySelector("#playBtn .icon-pause"),
  speedSelect: document.querySelector("#speedSelect"),
  progressTrack: document.querySelector("#progressTrack"),
  progressFill: document.querySelector("#progressFill"),
  chapterTicks: document.querySelector("#chapterTicks"),
  tabButtons: [...document.querySelectorAll(".tab-button")],
  dialogueRail: document.querySelector("#dialogueRail"),
  chapterList: document.querySelector("#chapterList"),
  castList: document.querySelector("#castList"),
};

const sessions = Array.isArray(window.COMMITTEE_SESSIONS) ? window.COMMITTEE_SESSIONS : [];

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const compactLayout = window.matchMedia("(max-width: 720px)");

let session = null;
let dialogue = [];
let chapters = [];
let cast = new Map();
let currentIndex = 0;
let isPlaying = false;
let playTimer = null;

init();

function init() {
  if (!sessions.length) {
    el.sessionTitle.textContent = "No sessions found";
    el.bubbleSpeaker.textContent = "Error";
    el.bubbleText.textContent =
      "No session data was loaded. Check the <script> tags for sessions/*.js in index.html.";
    el.speechBubble.classList.add("is-visible");
    return;
  }

  buildSessionPicker();
  bindControls();
  renderMeetingMenu();

  const fromHash = readHash();

  // A deep link goes straight to its session; everyone else starts at the menu.
  if (fromHash.sessionId && findSession(fromHash.sessionId)) {
    enterSession(fromHash.sessionId, fromHash.turn);
  } else {
    showMenu();
  }
}

/* ---------- meeting menu ---------- */

function meetingsFromSessions() {
  // Sessions group under their inquiry title (e.g. "Energy resilience");
  // miscellaneous sessions without one group under their committee.
  const groups = new Map();
  for (const item of sessions) {
    const key = item.inquiry ? `inquiry|${item.inquiry}` : `committee|${item.committee || "Committee"}`;
    if (!groups.has(key)) {
      groups.set(key, {
        title: item.inquiry || item.committee || "Committee",
        committee: item.inquiry ? item.committee || "" : "",
        when: 0,
        sessions: [],
      });
    }
    const group = groups.get(key);
    group.sessions.push(item);
    group.when = Math.max(group.when, Date.parse(item.date || "") || 0);
  }
  const meetings = [...groups.values()].sort((a, b) => b.when - a.when);
  for (const meeting of meetings) {
    meeting.sessions.sort(
      (a, b) =>
        (Date.parse(a.date || "") || 0) - (Date.parse(b.date || "") || 0) ||
        String(a.label).localeCompare(String(b.label))
    );
  }
  return meetings;
}

function meetingSessionsFor(current) {
  const meetings = meetingsFromSessions();
  const found = meetings.find((meeting) => meeting.sessions.includes(current));
  return found ? found.sessions : [current];
}

function sessionMenuLabel(item) {
  const label = item.label || item.id;
  // Generated labels start with the meeting date, shown separately in the menu.
  const prefix = `${item.date} · `;
  return label.startsWith(prefix) ? label.slice(prefix.length) : label;
}

function renderMeetingMenu() {
  const fragment = document.createDocumentFragment();

  for (const meeting of meetingsFromSessions()) {
    const card = document.createElement("article");
    card.className = "meeting-card";

    const heading = document.createElement("header");
    heading.className = "meeting-heading";

    const title = document.createElement("h2");
    title.className = "meeting-committee";
    title.textContent = meeting.title;
    heading.append(title);

    if (meeting.committee) {
      const committee = document.createElement("p");
      committee.className = "meeting-date";
      committee.textContent = meeting.committee;
      heading.append(committee);
    }

    card.append(heading);

    const list = document.createElement("div");
    list.className = "meeting-sessions";

    meeting.sessions.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "meeting-session";

      const name = document.createElement("span");
      name.className = "meeting-session-name";
      name.textContent = sessionMenuLabel(item);

      const when = document.createElement("span");
      when.className = "meeting-session-date";
      when.textContent = item.date || "";

      const summary = document.createElement("span");
      summary.className = "meeting-session-summary";
      summary.textContent = item.summary || "";

      const go = document.createElement("span");
      go.className = "meeting-session-go";
      go.textContent = "→";

      button.append(name, when, summary, go);
      button.addEventListener("click", () => enterSession(item.id));
      list.append(button);
    });

    card.append(list);
    fragment.append(card);
  }

  el.meetingList.replaceChildren(fragment);
}

function showMenu() {
  stopAutoplay();
  el.meetingMenu.hidden = false;
  el.appMain.hidden = true;
  document.title = "Parliamentary Committees, in Plain English";
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

function enterSession(id, turn = null) {
  el.meetingMenu.hidden = true;
  el.appMain.hidden = false;
  selectSession(id);

  let startTurn = 0;
  const stored = readStorage();
  if (turn !== null) {
    startTurn = turn;
  } else if (stored && stored.id === session.id) {
    startTurn = stored.turn;
  }
  setCurrent(startTurn, { immediate: true });
}

function findSession(id) {
  return sessions.find((item) => item.id === id) || null;
}

/* ---------- session loading ---------- */

function selectSession(id) {
  stopAutoplay();
  session = findSession(id) || sessions[0];

  const parsed = parseTranscript(session.transcript);
  dialogue = parsed.dialogue;
  chapters = parsed.chapters;
  cast = buildCast();

  const room = session.room || {};
  if (room.image && el.roomImage.getAttribute("src") !== room.image) {
    el.roomImage.src = room.image;
  }
  if (room.width && room.height) {
    el.stage.style.aspectRatio = `${room.width} / ${room.height}`;
  }

  const title = parsed.title || "Committee session";
  document.title = `${title} — Plain English`;
  el.sessionTitle.textContent = title;
  el.committeeName.textContent = session.committee || "Select committee";
  el.sessionDate.hidden = !session.date;
  el.sessionDate.textContent = session.date ? `· ${session.date}` : "";
  el.aboutSummary.textContent = session.summary || "";

  const sourceUrl = session.sourceUrl || "https://committees.parliament.uk/";
  el.sourceLink.href = sourceUrl;
  el.aboutSourceLink.href = sourceUrl;
  if (session.sourceLabel) el.sourceLink.textContent = `${session.sourceLabel} ↗`;

  populateSessionPicker();
  if (el.sessionPicker.value !== session.id) el.sessionPicker.value = session.id;

  renderDialogueRail();
  renderChapterList();
  renderCastList();
  renderChapterTicks();
}

function parseTranscript(text) {
  const lines = String(text).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const dialogueItems = [];
  const chapterItems = [];
  let title = "";

  for (const line of lines) {
    if (line.startsWith("## ")) {
      chapterItems.push({ label: line.slice(3).trim(), takeaway: "", start: dialogueItems.length });
      continue;
    }

    if (line.startsWith("# ")) {
      title = title || line.slice(2).trim();
      continue;
    }

    if (line.startsWith("> ")) {
      const open = chapterItems[chapterItems.length - 1];
      if (open && open.start === dialogueItems.length && !open.takeaway) {
        open.takeaway = line.slice(2).trim();
      }
      continue;
    }

    // Bold "**Name:** text" or plain "Name: text" speaker lines.
    const match =
      line.match(/^\*\*([^*]+?):\*\*\s*(.+)$/) ||
      line.match(/^([A-Z][A-Za-z .’'-]{0,48}?):\s+(.+)$/);
    if (match) {
      dialogueItems.push({ speaker: match[1].trim(), line: match[2].trim() });
    }
  }

  if (!dialogueItems.length) {
    throw new Error("No dialogue entries found in the session transcript.");
  }

  if (!chapterItems.length) {
    chapterItems.push({ label: "Full session", takeaway: "", start: 0 });
  }

  return { title, dialogue: dialogueItems, chapters: chapterItems };
}

function buildCast() {
  const result = new Map();
  const defined = session.cast || {};

  for (const [key, value] of Object.entries(defined)) {
    result.set(key, { ...DEFAULT_DESIGN, name: key, ...value, count: 0 });
  }

  for (const entry of dialogue) {
    if (!result.has(entry.speaker)) {
      result.set(entry.speaker, { ...DEFAULT_DESIGN, name: entry.speaker, count: 0 });
    }
    result.get(entry.speaker).count += 1;
  }

  return result;
}

/* ---------- navigation ---------- */

function setCurrent(nextIndex, options = {}) {
  if (!dialogue.length) return;

  currentIndex = clamp(nextIndex, 0, dialogue.length - 1);
  const entry = dialogue[currentIndex];
  const design = cast.get(entry.speaker) || { ...DEFAULT_DESIGN, name: entry.speaker };
  const seat = seatForTurn(design, currentIndex);
  const chapter = chapterForTurn(currentIndex);

  el.bubbleSpeaker.textContent = design.name;
  el.bubbleText.textContent = entry.line;
  el.bubbleCount.textContent = `${currentIndex + 1} of ${dialogue.length}`;
  el.speechBubble.style.setProperty("--speaker-soft", design.soft);
  el.bubbleText.scrollTop = 0;

  el.nameplateName.textContent = design.name;
  el.nameplateKind.textContent = KIND_LABELS[design.kind] || "";
  el.nameplate.style.setProperty("--speaker-soft", design.soft);
  el.spotlight.style.setProperty("--spot-color", design.color);

  const chapterNumber = chapters.indexOf(chapter) + 1;
  el.chapterLabel.textContent = `Chapter ${chapterNumber} · ${chapter.label}`;
  el.chapterTakeaway.textContent = chapter.takeaway;

  el.turnCounter.textContent = `${currentIndex + 1} / ${dialogue.length}`;
  el.progressFill.style.width = `${((currentIndex + 1) / dialogue.length) * 100}%`;
  el.previousBtn.disabled = currentIndex === 0;
  el.nextBtn.disabled = currentIndex === dialogue.length - 1;

  updateRailSelection(options.immediate);
  updateChapterSelection();
  updateCastSelection(entry.speaker);

  positionSeatOverlay(seat);
  positionBubble(seat);
  popBubble(options.immediate);
  persistProgress();

  if (isPlaying) scheduleAdvance();
}

function seatForTurn(design, turnIndex) {
  const seatMap = (session && session.room && session.room.seats) || {};
  const seats = design.seats || [];
  const key = seats.length ? seats[turnIndex % seats.length] : null;
  return (key && seatMap[key]) || { x: 50, y: 50 };
}

function chapterForTurn(turnIndex) {
  let current = chapters[0];
  for (const chapter of chapters) {
    if (turnIndex >= chapter.start) current = chapter;
  }
  return current;
}

/* ---------- stage overlay ---------- */

function positionSeatOverlay(seat) {
  const depth = 0.7 + (seat.y / 100) * 0.75;
  const stageRect = el.stage.getBoundingClientRect();
  const size = Math.max(56, stageRect.width * 0.085 * depth);

  el.spotlight.style.width = `${size * 1.55}px`;
  el.spotlight.style.height = `${size * 1.9}px`;
  el.spotlight.style.left = `${seat.x}%`;
  el.spotlight.style.top = `${seat.y}%`;

  el.roomDim.style.setProperty("--sx", `${seat.x}%`);
  el.roomDim.style.setProperty("--sy", `${seat.y}%`);

  const plateTop = Math.min(
    (seat.y / 100) * stageRect.height + size * 0.92,
    stageRect.height - 34
  );
  const plateHalf = el.nameplate.offsetWidth / 2 || 60;
  const plateLeft = clamp(
    (seat.x / 100) * stageRect.width,
    plateHalf + 8,
    stageRect.width - plateHalf - 8
  );
  el.nameplate.style.left = `${plateLeft}px`;
  el.nameplate.style.top = `${plateTop}px`;
}

function positionBubble(seat) {
  const bubble = el.speechBubble;

  if (compactLayout.matches) {
    bubble.style.left = "";
    bubble.style.top = "";
    bubble.style.width = "";
    bubble.dataset.placement = "static";
    return;
  }

  const frameRect = bubble.parentElement.getBoundingClientRect();
  const stageRect = el.stage.getBoundingClientRect();
  const offsetX = stageRect.left - frameRect.left;
  const offsetY = stageRect.top - frameRect.top;

  const bubbleWidth = Math.min(460, Math.max(260, stageRect.width - 28));
  bubble.style.width = `${bubbleWidth}px`;

  const anchorX = (seat.x / 100) * stageRect.width;
  const anchorY = (seat.y / 100) * stageRect.height;
  const depth = 0.7 + (seat.y / 100) * 0.75;
  const spotSize = Math.max(56, stageRect.width * 0.085 * depth);

  const halfWidth = bubbleWidth / 2;
  const left = clamp(anchorX, halfWidth + 12, stageRect.width - halfWidth - 12);
  const placement = seat.y > 47 ? "top" : "bottom";

  bubble.dataset.placement = placement;
  bubble.style.left = `${offsetX + left}px`;

  if (placement === "top") {
    const gap = Math.max(40, spotSize * 0.85);
    const bubbleHeight = bubble.getBoundingClientRect().height;
    bubble.style.top = `${offsetY + Math.max(anchorY - gap, bubbleHeight + 16)}px`;
  } else {
    // Clear the nameplate, which sits at anchorY + spotSize * 0.92.
    const gap = spotSize * 0.92 + 34;
    bubble.style.top = `${offsetY + clamp(anchorY + gap, 16, stageRect.height - 120)}px`;
  }

  const arrowX = clamp(anchorX - (left - halfWidth), 26, bubbleWidth - 26);
  bubble.style.setProperty("--arrow-x", `${arrowX}px`);
}

function popBubble(immediate = false) {
  el.speechBubble.classList.add("is-visible");
  if (immediate || reducedMotion.matches) return;

  el.speechBubble.classList.remove("pop");
  void el.speechBubble.offsetWidth;
  el.speechBubble.classList.add("pop");
}

function repositionOverlay() {
  if (!dialogue.length) return;
  const entry = dialogue[currentIndex];
  const design = cast.get(entry.speaker) || DEFAULT_DESIGN;
  const seat = seatForTurn(design, currentIndex);
  positionSeatOverlay(seat);
  positionBubble(seat);
}

/* ---------- side panel rendering ---------- */

function renderDialogueRail() {
  const fragment = document.createDocumentFragment();
  let chapterCursor = 0;

  dialogue.forEach((entry, index) => {
    while (chapterCursor < chapters.length && chapters[chapterCursor].start === index) {
      const divider = document.createElement("div");
      divider.className = "rail-chapter";
      divider.textContent = chapters[chapterCursor].label;
      fragment.append(divider);
      chapterCursor += 1;
    }

    const design = cast.get(entry.speaker) || DEFAULT_DESIGN;
    const item = document.createElement("button");
    item.type = "button";
    item.className = "rail-item";
    item.dataset.index = String(index);
    item.style.setProperty("--speaker-color", design.color);

    const number = document.createElement("span");
    number.className = "rail-index";
    number.textContent = String(index + 1).padStart(2, "0");

    const copy = document.createElement("span");
    copy.className = "rail-copy";

    const speaker = document.createElement("span");
    speaker.className = "rail-speaker";
    speaker.textContent = design.name;

    const line = document.createElement("span");
    line.className = "rail-line";
    line.textContent = entry.line;

    copy.append(speaker, line);
    item.append(number, copy);
    item.addEventListener("click", () => setCurrent(index));
    fragment.append(item);
  });

  el.dialogueRail.replaceChildren(fragment);
}

function updateRailSelection(immediate = false) {
  let active = null;

  for (const item of el.dialogueRail.querySelectorAll(".rail-item")) {
    const isCurrent = Number(item.dataset.index) === currentIndex;
    item.classList.toggle("is-current", isCurrent);
    if (isCurrent) active = item;
  }

  const panel = document.querySelector("#tab-dialogue");
  if (!active || panel.hidden) return;

  // Scroll only the panel, never the page (scrollIntoView would drag the
  // document and hide the stage on small screens).
  const panelRect = panel.getBoundingClientRect();
  const itemRect = active.getBoundingClientRect();
  const delta = itemRect.top - panelRect.top - panel.clientHeight / 2 + itemRect.height / 2;

  if (Math.abs(delta) > 4) {
    panel.scrollTo({
      top: panel.scrollTop + delta,
      behavior: immediate || reducedMotion.matches ? "auto" : "smooth",
    });
  }
}

function renderChapterList() {
  const fragment = document.createDocumentFragment();

  chapters.forEach((chapter, index) => {
    const end = index + 1 < chapters.length ? chapters[index + 1].start : dialogue.length;
    const item = document.createElement("button");
    item.type = "button";
    item.className = "chapter-item";
    item.dataset.chapter = String(index);

    const number = document.createElement("span");
    number.className = "chapter-number";
    number.textContent = String(index + 1);

    const copy = document.createElement("span");
    copy.className = "chapter-copy";

    const label = document.createElement("span");
    label.className = "chapter-name";
    label.textContent = chapter.label;

    const takeaway = document.createElement("span");
    takeaway.className = "chapter-note";
    takeaway.textContent = chapter.takeaway;

    const range = document.createElement("span");
    range.className = "chapter-range";
    range.textContent = `Turns ${chapter.start + 1}–${end}`;

    copy.append(label, takeaway, range);
    item.append(number, copy);
    item.addEventListener("click", () => setCurrent(chapter.start));
    fragment.append(item);
  });

  el.chapterList.replaceChildren(fragment);
}

function updateChapterSelection() {
  const chapter = chapterForTurn(currentIndex);
  const index = chapters.indexOf(chapter);

  for (const item of el.chapterList.querySelectorAll(".chapter-item")) {
    item.classList.toggle("is-current", Number(item.dataset.chapter) === index);
  }
}

function renderCastList() {
  const fragment = document.createDocumentFragment();

  for (const [speaker, design] of cast) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "cast-item";
    item.dataset.speaker = speaker;
    item.style.setProperty("--speaker-color", design.color);
    item.style.setProperty("--speaker-soft", design.soft);
    item.title = "Jump to their next remark";

    const dot = document.createElement("span");
    dot.className = "cast-dot";
    dot.textContent = getInitials(design.name);

    const copy = document.createElement("span");
    copy.className = "cast-copy";

    const name = document.createElement("span");
    name.className = "cast-name";
    name.textContent = design.name;

    const role = document.createElement("span");
    role.className = "cast-role";
    role.textContent = design.role;

    copy.append(name, role);

    if (design.description) {
      const description = document.createElement("span");
      description.className = "cast-description";
      description.textContent = design.description;
      copy.append(description);
    }

    const count = document.createElement("span");
    count.className = "cast-count";
    count.textContent = String(design.count);

    item.append(dot, copy, count);
    item.addEventListener("click", () => jumpToSpeaker(speaker));
    fragment.append(item);
  }

  el.castList.replaceChildren(fragment);
}

function updateCastSelection(activeSpeaker) {
  for (const item of el.castList.querySelectorAll(".cast-item")) {
    item.classList.toggle("is-active", item.dataset.speaker === activeSpeaker);
  }
}

function jumpToSpeaker(speaker) {
  for (let step = 1; step <= dialogue.length; step += 1) {
    const index = (currentIndex + step) % dialogue.length;
    if (dialogue[index].speaker === speaker) {
      setCurrent(index);
      return;
    }
  }
}

function renderChapterTicks() {
  const fragment = document.createDocumentFragment();

  chapters.forEach((chapter, index) => {
    if (chapter.start === 0) return;
    const tick = document.createElement("button");
    tick.type = "button";
    tick.className = "chapter-tick";
    tick.style.left = `${(chapter.start / dialogue.length) * 100}%`;
    tick.title = `Chapter ${index + 1}: ${chapter.label}`;
    tick.setAttribute("aria-label", tick.title);
    tick.addEventListener("click", (event) => {
      event.stopPropagation();
      setCurrent(chapter.start);
    });
    fragment.append(tick);
  });

  el.chapterTicks.replaceChildren(fragment);
}

/* ---------- autoplay ---------- */

function togglePlay() {
  if (isPlaying) {
    stopAutoplay();
    return;
  }

  isPlaying = true;
  el.playLabel.textContent = "Pause";
  el.playBtn.setAttribute("aria-label", "Pause");
  el.iconPlay.hidden = true;
  el.iconPause.hidden = false;

  if (currentIndex >= dialogue.length - 1) {
    setCurrent(0);
  } else {
    scheduleAdvance();
  }
}

function stopAutoplay() {
  isPlaying = false;
  clearTimeout(playTimer);
  playTimer = null;
  if (el.playLabel) {
    el.playLabel.textContent = "Play";
    el.playBtn.setAttribute("aria-label", "Play");
    el.iconPlay.hidden = false;
    el.iconPause.hidden = true;
  }
}

function scheduleAdvance() {
  clearTimeout(playTimer);

  const entry = dialogue[currentIndex];
  const words = entry.line.split(/\s+/).length;
  const speed = parseFloat(el.speedSelect.value) || 1;
  const readingTime = clamp(1300 + words * 290, 3200, 15000) / speed;

  playTimer = setTimeout(() => {
    if (currentIndex >= dialogue.length - 1) {
      stopAutoplay();
    } else {
      setCurrent(currentIndex + 1);
    }
  }, readingTime);
}

/* ---------- persistence and deep links ---------- */

function persistProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: session.id, turn: currentIndex }));
  } catch {
    /* storage unavailable (private mode etc.) — fine */
  }

  const params = new URLSearchParams();
  if (sessions.length > 1) params.set("s", session.id);
  params.set("t", String(currentIndex + 1));
  history.replaceState(null, "", `#${params.toString()}`);
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data.id === "string" && Number.isInteger(data.turn)) return data;
  } catch {
    /* corrupted or unavailable */
  }
  return null;
}

function readHash() {
  const params = new URLSearchParams(window.location.hash.slice(1));
  const turnRaw = parseInt(params.get("t") || "", 10);
  return {
    sessionId: params.get("s"),
    turn: Number.isFinite(turnRaw) ? turnRaw - 1 : null,
  };
}

/* ---------- controls ---------- */

function buildSessionPicker() {
  el.sessionPicker.addEventListener("change", () => {
    selectSession(el.sessionPicker.value);
    setCurrent(0, { immediate: true });
  });
}

// The dropdown offers only the sessions of the current meeting; the full
// catalogue lives in the meeting menu.
function populateSessionPicker() {
  const siblings = meetingSessionsFor(session);
  el.sessionPicker.replaceChildren();
  for (const item of siblings) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.label || item.committee || item.id;
    el.sessionPicker.append(option);
  }
  el.sessionPickerWrap.hidden = siblings.length < 2;
}

function bindControls() {
  el.menuBtn.addEventListener("click", showMenu);
  el.previousBtn.addEventListener("click", () => setCurrent(currentIndex - 1));
  el.nextBtn.addEventListener("click", () => setCurrent(currentIndex + 1));
  el.playBtn.addEventListener("click", togglePlay);

  el.speedSelect.addEventListener("change", () => {
    if (isPlaying) scheduleAdvance();
  });

  el.progressTrack.addEventListener("click", (event) => {
    const rect = el.progressTrack.getBoundingClientRect();
    const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    setCurrent(Math.round(ratio * (dialogue.length - 1)));
  });

  for (const button of el.tabButtons) {
    button.addEventListener("click", () => activateTab(button.dataset.tab));
  }

  window.addEventListener("keydown", onKeydown);
  window.addEventListener("resize", () => requestAnimationFrame(repositionOverlay));
  compactLayout.addEventListener("change", () => requestAnimationFrame(repositionOverlay));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && isPlaying) stopAutoplay();
  });
}

function activateTab(name) {
  for (const button of el.tabButtons) {
    const selected = button.dataset.tab === name;
    button.setAttribute("aria-selected", selected ? "true" : "false");
    document.querySelector(`#tab-${button.dataset.tab}`).hidden = !selected;
  }

  if (name === "dialogue") updateRailSelection(true);
}

function onKeydown(event) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  if (el.appMain.hidden) return;

  const target = event.target;
  if (target instanceof Element && target.closest("input, select, textarea, [contenteditable]")) {
    return;
  }

  switch (event.key) {
    case "ArrowRight":
      event.preventDefault();
      setCurrent(currentIndex + 1);
      break;
    case "ArrowLeft":
      event.preventDefault();
      setCurrent(currentIndex - 1);
      break;
    case "Home":
      event.preventDefault();
      setCurrent(0);
      break;
    case "End":
      event.preventDefault();
      setCurrent(dialogue.length - 1);
      break;
    case " ":
      if (target instanceof Element && target.closest("button, a")) return;
      event.preventDefault();
      togglePlay();
      break;
    default:
      break;
  }
}

/* ---------- helpers ---------- */

function getInitials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
