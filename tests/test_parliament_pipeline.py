import base64
import io
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

from scripts import parliament_pipeline as pipeline


class TranscriptParserTests(unittest.TestCase):
    def test_span_heavy_html_becomes_paragraphs(self):
        source = """
        <html><body>
          <p><span>Corrected</span><span> oral</span><span> evidence</span></p>
          <p><span>Q1 </span><strong>Chair:</strong><span> What happened?</span></p>
          <p><strong>Alex Witness:</strong><span> It worked.</span></p>
          <img src="data:image/png;base64,AAAA">
        </body></html>
        """
        parser = pipeline.TranscriptParser()
        parser.feed(source)
        self.assertEqual(
            parser.result(),
            "Corrected oral evidence\n\n"
            "Q1 Chair: What happened?\n\n"
            "Alex Witness: It worked.\n",
        )

    def test_speaker_candidates_strip_question_number(self):
        transcript = (
            "Uncorrected oral evidence: Example inquiry\n\n"
            "Header\n\nQ1 Chair: What happened?\n\n"
            "Alex Witness: It worked.\n\nChair: Thank you.\n"
        )
        self.assertEqual(
            pipeline.speaker_candidates(transcript), ["Chair", "Alex Witness"]
        )

    def test_docx_fallback_extracts_paragraphs(self):
        paragraphs = [
            "Corrected oral evidence",
            "Chair: What happened?",
            "Alex Witness: It worked, and this longer fixture repeats enough text "
            "to represent the structure of a real oral-evidence document.",
        ] * 8
        xml_paragraphs = "".join(
            f"<w:p><w:r><w:t>{text}</w:t></w:r></w:p>" for text in paragraphs
        )
        xml = (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<w:document xmlns:w="http://schemas.openxmlformats.org/'
            'wordprocessingml/2006/main"><w:body>'
            f"{xml_paragraphs}</w:body></w:document>"
        )
        memory = io.BytesIO()
        with zipfile.ZipFile(memory, "w") as archive:
            archive.writestr("word/document.xml", xml)
        document = {
            "data": base64.b64encode(memory.getvalue()).decode(),
            "fileName": "example.docx",
            "fileDataFormat": "OriginalFormat",
        }
        result = pipeline.normalise_docx_document(document)
        self.assertIn("Chair: What happened?", result)
        self.assertIn("Alex Witness: It worked", result)


class PacketTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        (self.root / "inbox" / "123").mkdir(parents=True)
        (self.root / "sessions" / "generated").mkdir(parents=True)
        (self.root / "index.html").write_text(
            "<body>\n"
            f"{pipeline.INDEX_START}\n"
            f"{pipeline.INDEX_END}\n"
            "</body>\n",
            encoding="utf-8",
        )
        self.transcript = (
            "Corrected oral evidence\n\n"
            "Members present: Pat Chair (The Chair)\n\n"
            "Witnesses\n\nAlex Witness, Example Organisation\n\n"
            "Q1 Chair: What happened?\n\nAlex Witness: It worked.\n"
        )
        self.metadata = {
            "schema_version": 1,
            "parliament_oral_evidence_id": 123,
            "meeting_date_display": "1 January 2026",
            "committee": "Example Committee",
            "title": "Example inquiry",
            "source_url": "https://committees.parliament.uk/oralevidence/123/html/",
            "source_sha256": pipeline.sha256_text(self.transcript),
            "transcript_status": "corrected",
        }
        self.condensation = {
            "schema_version": 1,
            "source_id": 123,
            "source_sha256": self.metadata["source_sha256"],
            "title": "What the example hearing established",
            "label": "1 January 2026 · Example hearing",
            "summary": (
                "The committee asked how the example system worked, and the witness "
                "explained the practical result in language intended for a general reader."
            ),
            "speakers": [
                {
                    "label": "Chair",
                    "name": "Pat Chair",
                    "role": "Chair of the Example Committee",
                    "kind": "chair",
                },
                {
                    "label": "Alex Witness",
                    "name": "Alex Witness",
                    "role": "Witness, Example Organisation",
                    "kind": "witness",
                },
            ],
            "chapters": [
                {
                    "title": "The central question",
                    "takeaway": "The exchange establishes what the system does and why it matters.",
                    "turns": [
                        {"speaker": "Chair", "text": "Can you explain what happened?"},
                        {
                            "speaker": "Alex Witness",
                            "text": "The system worked as intended, but there’s more to improve.",
                        },
                        {"speaker": "Chair", "text": "What should change first?"},
                        {
                            "speaker": "Alex Witness",
                            "text": "We should make the process easier for people to follow.",
                        },
                        {"speaker": "Chair", "text": "Would that solve the whole problem?"},
                        {
                            "speaker": "Alex Witness",
                            "text": "No, but it’d make the next decision much clearer.",
                        },
                    ],
                }
            ],
        }
        packet = self.root / "inbox" / "123"
        (packet / "transcript.txt").write_text(self.transcript, encoding="utf-8")
        (packet / "metadata.json").write_text(
            json.dumps(self.metadata), encoding="utf-8"
        )
        (packet / "condensation.json").write_text(
            json.dumps(self.condensation), encoding="utf-8"
        )

    def tearDown(self):
        self.temp.cleanup()

    def test_valid_packet(self):
        errors, warnings, _ = pipeline.validate_packet(self.root / "inbox" / "123")
        self.assertEqual(errors, [])
        self.assertEqual(warnings, [])

    def test_stale_source_hash_is_rejected(self):
        packet = self.root / "inbox" / "123"
        value = json.loads((packet / "condensation.json").read_text())
        value["source_sha256"] = "old"
        (packet / "condensation.json").write_text(json.dumps(value))
        errors, _, _ = pipeline.validate_packet(packet)
        self.assertTrue(any("source_sha256" in error for error in errors))

    def test_build_creates_session_and_index_tag(self):
        args = type(
            "Args",
            (),
            {"root": str(self.root), "id": None, "check": False},
        )()
        self.assertEqual(pipeline.build_command(args), 0)
        generated = self.root / "sessions" / "generated" / "oral-evidence-123.js"
        self.assertTrue(generated.exists())
        self.assertIn("generic-committee-room.svg", generated.read_text())
        self.assertIn(
            'sessions/generated/oral-evidence-123.js',
            (self.root / "index.html").read_text(),
        )


if __name__ == "__main__":
    unittest.main()
