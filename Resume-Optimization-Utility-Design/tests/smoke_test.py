import json
from importlib.util import spec_from_file_location, module_from_spec

spec = spec_from_file_location("resume_optimizer", "src/resume_optimizer.py")
mod = module_from_spec(spec)
spec.loader.exec_module(mod)

# Monkeypatch the LLM call to return a valid JSON string
fake = {
    "match_percentage": 78,
    "missing_keywords": ["Kubernetes", "GraphQL"],
    "formatting_critique": "Use consistent bullets and remove long paragraphs.",
    "recommended_bullet_point_updates": [
        {
            "original": "Led project X",
            "suggested_revision": "Led project X using Python and Docker; improved latency by 30%.",
        }
    ],
}

mod._call_openai_chat = lambda messages, model, max_retries=5, timeout=30: json.dumps(fake)

result = mod.analyze_resume(
    "- Led project X using Python.\n- Built APIs.",
    "We require Kubernetes, GraphQL, and scalable API experience.",
)

print(result.model_dump_json(indent=2) if hasattr(result, "model_dump_json") else result.json(indent=2))
