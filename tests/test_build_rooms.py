import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import build_rooms  # noqa: E402


MEMBERS = [
    {"key": "1_mr-clive-betts", "name": "Mr Clive Betts", "house": "Commons", "committees": ["Public Accounts Committee"]},
    {"key": "2_sir-geoffrey-clifton-brown", "name": "Sir Geoffrey Clifton-Brown", "house": "Commons",
     "committees": ["Public Accounts Committee"]},
    {"key": "3_lord-betts", "name": "Lord Betts", "house": "Lords", "committees": ["Public Accounts Committee"]},
    {"key": "4_dame-meg-hillier", "name": "Dame Meg Hillier", "house": "Commons", "committees": ["Treasury Committee"]},
]


def by_norm():
    out = {}
    for m in MEMBERS:
        out.setdefault(build_rooms.norm(m["name"]), []).append(m)
    return out


class MatchMemberTests(unittest.TestCase):
    def test_full_name_without_honorific(self):
        m = build_rooms.match_member("Meg Hillier", "Treasury Committee", MEMBERS, by_norm())
        self.assertEqual(m["key"], "4_dame-meg-hillier")

    def test_surname_within_committee_and_house(self):
        m = build_rooms.match_member("Mr Betts", "Public Accounts Committee", MEMBERS, by_norm())
        self.assertEqual(m["key"], "1_mr-clive-betts")
        peer = build_rooms.match_member("Lord Betts", "Public Accounts Committee", MEMBERS, by_norm())
        self.assertEqual(peer["key"], "3_lord-betts")

    def test_unknown_name(self):
        self.assertIsNone(build_rooms.match_member("Ms Nobody", "Treasury Committee", MEMBERS, by_norm()))


class SpreadSeatsTests(unittest.TestCase):
    def test_chair_first_in_the_middle(self):
        for n in range(1, 15):
            seats = build_rooms.spread_seats(n)
            self.assertEqual(len(seats), n)
            self.assertEqual(len(set(seats)), n)
            self.assertEqual(seats[0], "h")

    def test_members_spread_to_both_ends(self):
        seats = build_rooms.spread_seats(7)
        self.assertIn("a", seats)
        self.assertIn("n", seats)


class PlanTests(unittest.TestCase):
    def test_skips_when_a_speaker_has_no_snapshots(self):
        session = {"committee": "Public Accounts Committee", "cast": {
            "Chair": {"name": "Sir Geoffrey Clifton-Brown", "kind": "chair"},
            "Mr Betts": {"name": "Mr Betts", "kind": "member"},
            "A Witness": {"name": "A Witness", "kind": "witness"}}}
        people = {"2_sir-geoffrey-clifton-brown": {}, "1_mr-clive-betts": {}}
        seating, cast = build_rooms.plan(session, MEMBERS, by_norm(), people)
        self.assertEqual(cast["Chair"], "seat_h")
        self.assertEqual(seating["h"], "2_sir-geoffrey-clifton-brown")
        self.assertNotIn("A Witness", cast)
        self.assertIsNone(build_rooms.plan(session, MEMBERS, by_norm(), {"2_sir-geoffrey-clifton-brown": {}}))


if __name__ == "__main__":
    unittest.main()
