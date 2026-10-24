import os
import time
import json
import logging
from typing import List, Dict

from dotenv import load_dotenv
from pydantic import BaseModel, Field, ValidationError

try:
    import openai
    from openai.error import RateLimitError, APIError, OpenAIError
except Exception:
    openai = None

load_dotenv()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class BulletUpdate(BaseModel):
    original: str
    suggested_revision: str


class ResumeMatchOutput(BaseModel):
    match_percentage: int = Field(..., ge=0, le=100)
    missing_keywords: List[str]
    formatting_critique: str
    recommended_bullet_point_updates: List[BulletUpdate]


SYSTEM_INSTRUCTION = (
    "You are a cynical, highly technical hiring manager reviewing a candidate's resume "
    "against a job description. Be blunt, precise, and harsh where appropriate. "
    "Provide a single JSON object and ONLY the JSON matching this exact schema:\n"
    "{\n"
    "  \"match_percentage\": integer,\n"
    "  \"missing_keywords\": [\"list\", \"of\", \"strings\"],\n"
    "  \"formatting_critique\": \"string advice\",\n"
    "  \"recommended_bullet_point_updates\": [{\"original\": \"str\", \"suggested_revision\": \"str\"}]\n"
    "}\n"
    "Rules:\n"
    "- Output must be valid JSON parsable by a strict JSON parser.\n"
    "- `match_percentage` should be 0-100 (integer).\n"
    "- `missing_keywords` should list relevant job keywords absent from the resume.\n"
    "- `formatting_critique` must be concise (one or two sentences).\n"
    "- `recommended_bullet_point_updates` should include up to 5 suggested rewrites of existing resume bullets.\n"
    "- Do NOT include any explanatory text outside the JSON."
)


def _get_openai_api_key() -> str:
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise EnvironmentError("OPENAI_API_KEY not set in environment")
    return key


def _call_openai_chat(messages: List[Dict[str, str]], model: str, max_retries: int = 5, timeout: int = 30) -> str:
    if openai is None:
        raise RuntimeError("openai package is not installed or failed to import")

    openai.api_key = _get_openai_api_key()
    backoff = 1.0
    for attempt in range(1, max_retries + 1):
        try:
            resp = openai.ChatCompletion.create(
                model=model,
                messages=messages,
                temperature=0.0,
                max_tokens=800,
                timeout=timeout,
            )
            content = resp["choices"][0]["message"]["content"]
            return content
        except RateLimitError as e:
            logger.warning("Rate limit encountered (attempt %d): %s", attempt, str(e))
        except APIError as e:
            logger.warning("API error (attempt %d): %s", attempt, str(e))
        except OpenAIError as e:
            logger.error("OpenAI error: %s", str(e))
            raise
        except Exception as e:
            logger.error("Unexpected error calling OpenAI: %s", str(e))
            raise

        if attempt < max_retries:
            time.sleep(backoff)
            backoff *= 2

    raise RuntimeError("Exceeded maximum retries when calling the OpenAI API")


def analyze_resume(resume_text: str, job_description: str, model: str = None) -> ResumeMatchOutput:
    model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    messages = [
        {"role": "system", "content": SYSTEM_INSTRUCTION},
        {
            "role": "user",
            "content": (
                "Resume text:\n" + resume_text + "\n\n---\n\n" + "Job description:\n" + job_description
            ),
        },
    ]

    raw = _call_openai_chat(messages, model=model)

    text = raw.strip()
    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start == -1 or end == -1:
            raise ValueError("Response did not contain JSON and could not be parsed")
        try:
            parsed = json.loads(text[start : end + 1])
        except Exception as e:
            raise ValueError(f"Failed to parse JSON from model output: {e}\nOutput was:\n{text}")

    try:
        if hasattr(ResumeMatchOutput, "model_validate"):
            validated = ResumeMatchOutput.model_validate(parsed)
        else:
            validated = ResumeMatchOutput.parse_obj(parsed)
    except ValidationError as e:
        raise ValueError(f"LLM output failed validation: {e}\nParsed JSON:\n{json.dumps(parsed, indent=2)}")

    return validated


def cli():
    import argparse

    parser = argparse.ArgumentParser(description="Resume Optimization Engine: compare resume to job description using an LLM")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--resume-file", help="Path to plain-text resume file")
    group.add_argument("--resume-text", help="Provide resume text directly")
    group2 = parser.add_mutually_exclusive_group(required=True)
    group2.add_argument("--job-file", help="Path to plain-text job description file")
    group2.add_argument("--job-text", help="Provide job description text directly")
    parser.add_argument("--model", help="LLM model to use (overrides OPENAI_MODEL)")

    args = parser.parse_args()

    if args.resume_file:
        with open(args.resume_file, "r", encoding="utf-8") as f:
            resume_text = f.read()
    else:
        resume_text = args.resume_text

    if args.job_file:
        with open(args.job_file, "r", encoding="utf-8") as f:
            job_description = f.read()
    else:
        job_description = args.job_text

    try:
        result = analyze_resume(resume_text, job_description, model=args.model)
    except Exception as e:
        logger.error("Failed to analyze resume: %s", e)
        raise

    json_output = result.model_dump_json(indent=2) if hasattr(result, "model_dump_json") else result.json(indent=2)
    print(json_output)


if __name__ == "__main__":
    cli()
