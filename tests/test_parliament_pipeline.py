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
        self.assertIn("committee_room_4.png", generated.read_text())
        self.assertIn(
            'sessions/generated/oral-evidence-123.js',
            (self.root / "index.html").read_text(),
        )


if __name__ == "__main__":
    unittest.main()


class BillingAlertTests(unittest.TestCase):
    def http_error(self, status, error):
        from urllib.error import HTTPError

        body = io.BytesIO(json.dumps({"error": error}).encode("utf-8"))
        return HTTPError("https://api.openai.com", status, "error", {}, body)

    def test_exhausted_credit_raises_billing_error(self):
        from unittest import mock

        error = self.http_error(
            429,
            {
                "message": "Your organization has no prepaid credits remaining.",
                "type": "insufficient_quota",
                "code": "credit_balance_exhausted",
            },
        )
        with mock.patch.object(pipeline, "urlopen", side_effect=error):
            with self.assertRaises(pipeline.BillingError):
                pipeline.chat_completion("key", [{"role": "user", "content": "x"}])

    def test_bad_key_is_not_a_billing_error(self):
        from unittest import mock

        error = self.http_error(401, {"message": "Incorrect API key provided."})
        with mock.patch.object(pipeline, "urlopen", side_effect=error):
            with self.assertRaises(pipeline.PipelineError) as raised:
                pipeline.chat_completion("key", [{"role": "user", "content": "x"}])
        self.assertNotIsInstance(raised.exception, pipeline.BillingError)

    def run_alert(self, alert_text, outcome, open_issues):
        from unittest import mock

        calls = []

        def fake_run(command, **kwargs):
            calls.append(command)
            result = mock.Mock()
            result.stdout = json.dumps(open_issues)
            return result

        with tempfile.TemporaryDirectory() as tmp:
            alert_file = Path(tmp) / "billing-alert.txt"
            if alert_text is not None:
                alert_file.write_text(alert_text, encoding="utf-8")
            args = pipeline.parser().parse_args(
                ["billing-alert", "--alert-file", str(alert_file),
                 "--condense-outcome", outcome]
            )
            env = {"GITHUB_REPOSITORY": "owner/repo", "GITHUB_REPOSITORY_OWNER": "owner"}
            with mock.patch.dict("os.environ", env), mock.patch.object(
                pipeline.subprocess, "run", side_effect=fake_run
            ):
                self.assertEqual(pipeline.billing_alert_command(args), 0)
        return calls

    def test_out_of_funds_opens_assigned_issue(self):
        calls = self.run_alert("no credit", "failure", [])
        create = [c for c in calls if c[:3] == ["gh", "issue", "create"]]
        self.assertEqual(len(create), 1)
        self.assertIn("--assignee", create[0])
        self.assertIn(pipeline.BILLING_ALERT_MARKER, create[0][create[0].index("--body") + 1])

    def test_out_of_funds_does_not_duplicate_open_issue(self):
        existing = [{"number": 7, "body": f"<!-- {pipeline.BILLING_ALERT_MARKER} -->"}]
        calls = self.run_alert("no credit", "failure", existing)
        self.assertFalse([c for c in calls if c[:3] == ["gh", "issue", "create"]])

    def test_success_closes_open_alert(self):
        existing = [{"number": 7, "body": f"<!-- {pipeline.BILLING_ALERT_MARKER} -->"},
                    {"number": 8, "body": "some other automation issue"}]
        calls = self.run_alert(None, "success", existing)
        self.assertEqual([c[:4] for c in calls if c[:3] == ["gh", "issue", "close"]],
                         [["gh", "issue", "close", "7"]])

    def test_other_failure_leaves_alerts_alone(self):
        self.assertEqual(self.run_alert(None, "failure", []), [])


class EvidenceMatchingTests(unittest.TestCase):
    SOURCE = (
        "Q1 The Chair: What’s the risk?\n\n"
        "Professor Lee Miles: “Not very far at all” would be my immediate response—\n"
        "  frankly. We need   redundancy which is lower.\n"
    )

    def test_quote_matches_despite_quotes_dashes_and_spacing(self):
        source = pipeline.evidence_source_text(self.SOURCE)
        folded, index = pipeline._fold(source)
        span = pipeline.locate_quote(
            '"Not very far at all" would be my immediate response - frankly.', folded, index
        )
        self.assertIsNotNone(span)
        self.assertTrue(source[span[0]:span[1]].startswith("Not very far"))
        self.assertTrue(source[span[0]:span[1]].endswith("frankly"))

    def test_ellipsis_quote_and_missing_quote(self):
        condensation = {"chapters": [{"turns": [
            {"text": "Miles on redundancy.", "evidence": [
                {"quote": "Not very far at all … redundancy which is lower"},
                {"quote": "something nobody ever said"},
            ]},
        ]}]}
        turns, missing = pipeline.match_evidence(condensation, self.SOURCE)
        self.assertEqual(len(turns[0]["ranges"]), 1)
        self.assertEqual(turns[0]["missing"], ["something nobody ever said"])
        self.assertEqual(len(missing), 1)


class ArchiveAndBatchTests(PacketTests):
    def build_args(self):
        return type("Args", (), {"root": str(self.root), "id": None, "check": False})()

    def test_prompt_template_is_filled_in(self):
        prompt = pipeline.prompt_for({**self.metadata, "witnesses": [], "speaker_candidates": ["Chair"]})
        self.assertNotIn("{{", prompt)
        self.assertIn('"source_id": 123', prompt)
        self.assertIn("evidence", prompt)

    def test_archived_session_leaves_the_site(self):
        self.assertEqual(pipeline.build_command(self.build_args()), 0)
        generated = self.root / "sessions" / "generated" / "oral-evidence-123.js"
        self.assertTrue(generated.exists())
        (self.root / "archive.json").write_text(json.dumps({"archived": [123]}))
        self.assertEqual(pipeline.build_command(self.build_args()), 0)
        self.assertFalse(generated.exists())
        self.assertNotIn("oral-evidence-123", (self.root / "index.html").read_text())
        self.assertTrue((self.root / "inbox" / "123" / "condensation.json").exists())

    def test_duplicate_transcripts_share_one_request(self):
        twin = self.root / "inbox" / "124"
        twin.mkdir()
        (twin / "transcript.txt").write_text(self.transcript, encoding="utf-8")
        (twin / "metadata.json").write_text(
            json.dumps({**self.metadata, "parliament_oral_evidence_id": 124}), encoding="utf-8"
        )
        requests, items = pipeline.build_batch_requests([self.root / "inbox" / "123", twin])
        self.assertEqual(len(requests), 1)
        self.assertEqual(items[0]["packets"], ["123", "124"])
        self.assertEqual(requests[0]["url"], "/v1/chat/completions")

    def test_invalid_answer_keeps_the_previous_condensation(self):
        packet = self.root / "inbox" / "123"
        before = (packet / "condensation.json").read_text()
        errors, _ = pipeline.apply_condensation(packet, '{"schema_version": 1, "chapters": []}')
        self.assertTrue(errors)
        self.assertEqual((packet / "condensation.json").read_text(), before)

    def test_collect_writes_finished_results(self):
        from unittest import mock

        answer = dict(self.condensation, title="A new condensation of the hearing")
        pipeline.write_batch_state(
            self.root,
            [{"batch_id": "batch_1", "items": [{"custom_id": "123", "packets": ["123"]}]}],
            {"123": 1},
        )
        line = json.dumps({
            "custom_id": "123",
            "response": {"status_code": 200, "body": {
                "choices": [{"message": {"content": json.dumps(answer)}}],
                "usage": {"prompt_tokens": 10, "completion_tokens": 20},
            }},
            "error": None,
        })

        def fake(api_key, method, path, **kwargs):
            if path == "/batches/batch_1":
                return json.dumps({"status": "completed", "output_file_id": "file_out"}).encode()
            if path == "/files/file_out/content":
                return (line + "\n").encode()
            raise AssertionError(path)

        args = type("Args", (), {"root": str(self.root)})()
        with mock.patch.dict("os.environ", {"CONDENSE_API_KEY": "key"}), mock.patch.object(
            pipeline, "openai_request", side_effect=fake
        ):
            self.assertEqual(pipeline.batch_collect_command(args), 0)
        written = json.loads((self.root / "inbox" / "123" / "condensation.json").read_text())
        self.assertEqual(written["title"], "A new condensation of the hearing")
        pending, attempts = pipeline.read_batch_state(self.root)
        self.assertEqual(pending, [])
        self.assertEqual(attempts, {})

    def test_billing_hard_limit_counts_as_out_of_funds(self):
        self.assertTrue(pipeline.is_billing_error(400, set(), "Billing hard limit has been reached"))
        self.assertTrue(pipeline.is_billing_error(400, {"billing_hard_limit_reached"}, ""))
        self.assertFalse(pipeline.is_billing_error(400, set(), "Invalid model"))

    def test_collect_reads_the_error_file_and_spares_attempts_on_billing(self):
        from unittest import mock

        pipeline.write_batch_state(
            self.root,
            [{"batch_id": "batch_1", "items": [{"custom_id": "123", "packets": ["123"]}]}],
            {"123": 1},
        )
        error_line = json.dumps({
            "custom_id": "123",
            "response": {"status_code": 400, "body": {"error": {
                "code": "billing_hard_limit_reached", "message": "Billing hard limit has been reached"}}},
            "error": None,
        })

        def fake(api_key, method, path, **kwargs):
            if path == "/batches/batch_1":
                return json.dumps({"status": "completed", "error_file_id": "file_err"}).encode()
            if path == "/files/file_err/content":
                return (error_line + "\n").encode()
            raise AssertionError(path)

        alert = self.root / "alert.txt"
        args = type("Args", (), {"root": str(self.root)})()
        env = {"CONDENSE_API_KEY": "key", "BILLING_ALERT_FILE": str(alert)}
        with mock.patch.dict("os.environ", env), mock.patch.object(
            pipeline, "openai_request", side_effect=fake
        ):
            self.assertEqual(pipeline.batch_collect_command(args), 0)
        self.assertIn("Billing hard limit", alert.read_text())
        pending, attempts = pipeline.read_batch_state(self.root)
        self.assertEqual(pending, [])
        self.assertEqual(attempts, {})

    def test_submit_does_not_fail_the_run_when_out_of_funds(self):
        from unittest import mock

        (self.root / "inbox" / "123" / "condensation.json").unlink()

        def refuse(*args, **kwargs):
            raise pipeline.BillingError("Billing hard limit has been reached")

        alert = self.root / "alert.txt"
        args = type("Args", (), {"root": str(self.root), "ids": None, "dry_run": False})()
        env = {"CONDENSE_API_KEY": "key", "BILLING_ALERT_FILE": str(alert)}
        with mock.patch.dict("os.environ", env), mock.patch.object(
            pipeline, "upload_batch_file", side_effect=refuse
        ):
            self.assertEqual(pipeline.batch_submit_command(args), 0)
        self.assertTrue(alert.exists())
        self.assertEqual(pipeline.read_batch_state(self.root), ([], {}))
