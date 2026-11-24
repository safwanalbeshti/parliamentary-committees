#!/usr/bin/env python3
"""Build each online session's committee room with its own members seated, from pre-rendered seat snapshots.

For every session in index.html whose chair and speaking members all have snapshots, this writes rooms/<id>.webp
(the room with those people at the table) and an entry in rooms/rooms.js (seat head positions and who sits where),
which app.js uses instead of the generic room. Rooms of sessions no longer online are removed.

Inputs (room-assets/, built with face-pipeline/rooms/):
  figures/index.json + figures/<member>.webp   every member pre-rendered at all 14 seats, already sized and styled
  layers/layers.json + layer images           the room, split into the layers that go behind and in front of people
  members.json                                current members: id, name, house, committees (for matching names)

Seating: the chair sits in the middle of the back row (seat H); the other speaking members are spread evenly
around the rest of the table. Witnesses sit in the front row as anonymous hooded figures seen from behind
(figures/cloaks.webp + cloaks.json), one per witness, up to the seven front chairs, centred on the middle chair.

  python3 scripts/build_rooms.py          # needs Pillow
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "room-assets"
OUT = ROOT / "rooms"

# Seats around the table in order, from the near end of the left arm to the near end of the right arm.
ARC = list("abcdefghijklmn")
CHAIR_SEAT = "h"
# Witnesses sit in the front row, their backs to us: chairs 1-7, left to right. A session's witnesses fill a block
# of chairs centred on chair 4; with more than seven, the eighth onwards share the first chairs (they came in later
# panels). Cloak colours alternate along the row.
FRONT_CHAIRS = 7
SHOULDER_ABOVE_CHAIR = 0.10    # shoulders this far above the chair back's top edge, as a fraction of the chair's height
HOOD_CENTRE = 0.45             # spotlight on the hood: this far from its top towards the shoulders
CLOAK_COLOURS = ["charcoal", "navy", "burgundy", "olive"]


def witness_chairs(count: int) -> list[int]:
    """Front chair (1-7) for each of `count` witnesses, in order."""
    shown = min(count, FRONT_CHAIRS)
    start = 4 - shown // 2
    return [start + i % shown for i in range(count)] if shown else []

HONORIFICS = r"^(the |rt hon |right hon )*(mr|mrs|ms|miss|dr|sir|dame|prof|professor|rev)\.? "
PEER_TITLES = ("lord ", "baroness ", "viscount ", "earl ", "duke ", "countess ", "viscountess ", "marquess ", "bishop ")


def norm(name: str) -> str:
    s = re.sub(r"\s+(mp|kc|qc|obe|cbe|mbe)$", "", name.lower().strip())
    s = re.sub(HONORIFICS, "", s)
    return re.sub(r"[^a-z ]", "", s.replace("-", " ")).strip()


def match_member(name: str, committee: str, members: list[dict], by_norm: dict) -> dict | None:
    """The member a transcript name refers to: full name without honorifics, else surname within the committee."""
    n = norm(name)
    hits = by_norm.get(n, [])
    if len(hits) > 1:
        hits = [m for m in hits if committee in m["committees"]] or hits
    if len(hits) == 1:
        return hits[0]
    last = n.split()[-1] if n else ""
    is_peer = name.lower().startswith(PEER_TITLES)
    pool = [m for m in members if committee in m["committees"] and norm(m["name"]).split()[-1:] == [last]
            and (m["house"] == "Lords") == is_peer] if last else []
    return pool[0] if len(pool) == 1 else None


def spread_seats(count: int) -> list[str]:
    """Seats for the chair (first) and `count - 1` members, spread evenly around the table."""
    if count <= 0:
        return []
    others = [s for s in ARC if s != CHAIR_SEAT]
    n = count - 1
    if n == 0:
        return [CHAIR_SEAT]
    if n >= len(others):
        return [CHAIR_SEAT] + others[:n]
    # Evenly spaced positions along the arc, ends included, never doubling up.
    picked: list[str] = []
    for i in range(n):
        idx = round(i * (len(others) - 1) / (n - 1)) if n > 1 else len(others) // 4   # a lone member sits apart
        while others[idx] in picked:
            idx = (idx + 1) % len(others)
        picked.append(others[idx])
    return [CHAIR_SEAT] + picked


def load_sessions() -> list[dict]:
    """Sessions currently online (the ones index.html loads)."""
    html = (ROOT / "index.html").read_text()
    sessions = []
    for src in re.findall(r'<script src="(sessions/[^"?]+\.js)', html):
        text = (ROOT / src).read_text()
        start, end = text.index("push(") + len("push("), text.rindex(")")
        sessions.append(json.loads(text[start:end]))
    return sessions


def plan(session: dict, members: list[dict], by_norm: dict, people: dict) -> tuple[dict, dict] | None:
    """(seat -> member id, or front_<n> -> "witness"; speaker label -> seat key), or None if a speaking member
    hasn't got snapshots."""
    cast = session.get("cast") or {}
    speakers = [(label, info) for label, info in cast.items() if info.get("kind") in ("chair", "member")]
    if not speakers:
        return None
    speakers.sort(key=lambda item: item[1].get("kind") != "chair")          # chair first
    ids = []
    for label, info in speakers:
        found = match_member(info.get("name") or label, session.get("committee", ""), members, by_norm)
        if not found or found["key"] not in people:
            return None
        ids.append((label, found["key"]))
    if len(set(i for _, i in ids)) != len(ids):
        return None
    seats = spread_seats(len(ids))
    seating = {s: mid for s, (_, mid) in zip(seats, ids)}
    cast_seats = {label: f"seat_{s}" for s, (label, _) in zip(seats, ids)}
    witnesses = [label for label, info in cast.items() if info.get("kind") == "witness"]
    for label, chair in zip(witnesses, witness_chairs(len(witnesses))):
        seating[f"front_{chair}"] = "witness"
        cast_seats[label] = f"front_{chair}"
    return seating, cast_seats


def compose(seating: dict, layers: dict, people: dict, cache: dict, cloaks: dict | None = None, colour_shift: int = 0):
    from PIL import Image

    def img(path):
        if path not in cache:
            cache[path] = Image.open(path).convert("RGBA")
        return cache[path]

    room = Image.new("RGBA", (layers["width"], layers["height"]))
    heads = {}
    for layer in layers["layers"]:
        if layer["kind"] == "image":
            front = re.fullmatch(r"Seat (\d)", layer.get("name") or "")
            if front and cloaks and seating.get(f"front_{front.group(1)}"):
                # A witness, drawn just before their chair so the chair back sits in front of them.
                n = front.group(1)
                colour = CLOAK_COLOURS[(int(n) + colour_shift) % len(CLOAK_COLOURS)]
                fig, chair = cloaks["colours"][colour][n], cloaks["chairs"][n]
                tile = img(ASSETS / "figures" / "cloaks.webp").crop((fig["sx"], 0, fig["sx"] + fig["w"], fig["h"]))
                # Shoulders centred on the chair back, a little above its top edge.
                x = round(chair["cx"] - fig["shoulder"][0])
                y = round(chair["top"] - SHOULDER_ABOVE_CHAIR * chair["h"] - fig["shoulder"][1])
                room.alpha_composite(tile, (x, y))
                heads[f"front_{n}"] = (x + fig["top"][0], y + fig["top"][1] + HOOD_CENTRE * (fig["shoulder"][1] - fig["top"][1]))
            im = img(ASSETS / "layers" / layer["file"])
            room.alpha_composite(im, (layer["x"], layer["y"]))
            continue
        mid = seating.get(layer["seat"])
        if not mid:
            continue
        seat = people[mid]["seats"][layer["seat"]]
        sprite = img(ASSETS / "figures" / f"{mid}.webp")
        tile = sprite.crop((seat["sx"], 0, seat["sx"] + seat["w"], seat["h"]))
        room.alpha_composite(tile, (seat["x"], seat["y"]))
        heads[f"seat_{layer['seat']}"] = seat["head"]
    return room.convert("RGB"), heads


def pct(v: float, total: int) -> float:
    return round(v / total * 1000) / 10


def main() -> int:
    index = json.loads((ASSETS / "figures" / "index.json").read_text())
    people = index["people"]
    layers = json.loads((ASSETS / "layers" / "layers.json").read_text())
    members = json.loads((ASSETS / "members.json").read_text())
    by_norm: dict[str, list[dict]] = {}
    for m in members:
        by_norm.setdefault(norm(m["name"]), []).append(m)
    cloak_file = ASSETS / "figures" / "cloaks.json"
    cloaks = json.loads(cloak_file.read_text()) if cloak_file.exists() else None

    OUT.mkdir(exist_ok=True)
    rooms, cache, skipped = {}, {}, []
    for session in load_sessions():
        planned = plan(session, members, by_norm, people)
        if not planned:
            skipped.append(session["id"])
            continue
        seating, cast = planned
        if not cloaks:                               # no witness figures built yet: leave the front row empty
            seating = {k: v for k, v in seating.items() if not k.startswith("front_")}
            cast = {k: v for k, v in cast.items() if not v.startswith("front_")}
        shift = int(hashlib.sha256(session["id"].encode()).hexdigest(), 16) % len(CLOAK_COLOURS)
        image, heads = compose(seating, layers, people, cache, cloaks, shift)
        target = OUT / f"{session['id']}.webp"
        image.save(target.with_suffix(".tmp.webp"), "WEBP", quality=75, method=6)
        new = target.with_suffix(".tmp.webp").read_bytes()
        if target.exists() and target.read_bytes() == new:
            target.with_suffix(".tmp.webp").unlink()
        else:
            target.with_suffix(".tmp.webp").replace(target)
        seats = {key: {"x": pct(x, layers["width"]), "y": pct(y, layers["height"])} for key, (x, y) in heads.items()}
        version = hashlib.sha256(new).hexdigest()[:8]
        rooms[session["id"]] = {"image": f"rooms/{session['id']}.webp?v={version}", "width": layers["width"],
                                "height": layers["height"], "seats": seats, "cast": cast}

    # Remove rooms of sessions that are no longer online.
    for old in OUT.glob("*.webp"):
        if old.stem not in rooms:
            old.unlink()
    for leftover in ("rooms-data.json",):
        (OUT / leftover).unlink(missing_ok=True)

    body = json.dumps(dict(sorted(rooms.items())), ensure_ascii=False, indent=1)
    (OUT / "rooms.js").write_text(
        "/*\n"
        " * Committee rooms with each session's own members seated (built by scripts/build_rooms.py from the\n"
        " * pre-rendered seat snapshots in room-assets/). Sessions listed here use this room instead of the generic\n"
        " * illustration; `seats` are head positions in % of the image, `cast` maps speaker labels to those seats.\n"
        " */\n"
        f"window.COMMITTEE_ROOMS = {body};\n")
    print(f"{len(rooms)} rooms built; {len(skipped)} sessions keep the generic room"
          + (f" (a speaking member has no snapshots): {', '.join(skipped)}" if skipped else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
