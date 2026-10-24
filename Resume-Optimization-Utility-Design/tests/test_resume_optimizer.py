import json

from importlib.util import spec_from_file_location, module_from_spec

spec = spec_from_file_location("resume_optimizer", "src/resume_optimizer.py")
mod = module_from_spec(spec)
spec.loader.exec_module(mod)


def test_analyze_resume_parses_valid_output():
    fake_response = {
        "match_percentage": 92,
        "missing_keywords": ["Kubernetes", "CI/CD"],
        "formatting_critique": "Trim long paragraphs and add consistent bullet formatting.",
        "recommended_bullet_point_updates": [
            {
                "original": "Built data pipeline.",
                "suggested_revision": "Built a scalable data pipeline with AWS Lambda and S3, reducing latency by 20%.",
            }
        ],
    }

    mod._call_openai_chat = lambda messages, model, max_retries=5, timeout=30: json.dumps(fake_response)

    result = mod.analyze_resume(
        "- Built data pipeline.\n- Wrote ETL jobs.",
        "We need Kubernetes, CI/CD, and AWS experience.",
    )

    assert result.match_percentage == 92
    assert result.missing_keywords == ["Kubernetes", "CI/CD"]
    assert "Trim long paragraphs" in result.formatting_critique
    assert result.recommended_bullet_point_updates[0].original == "Built data pipeline."
