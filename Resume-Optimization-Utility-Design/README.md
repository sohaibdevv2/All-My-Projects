Resume Optimization Engine
=========================

Overview
--------
Small Python utility that uses an LLM (via OpenAI) to compare `resume_text` against a `job_description` and returns a structured JSON critique matching the required schema.

Installation
------------
1. Create a virtualenv and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Copy `.env.template` to `.env` and set `OPENAI_API_KEY`.

Usage
-----
Basic usage from CLI:

```bash
python src/resume_optimizer.py --resume-file my_resume.txt --job-file job_desc.txt
```

Or provide text directly:

```bash
python src/resume_optimizer.py --resume-text "...resume..." --job-text "...job..."
```

Output
------
The program prints a validated JSON object matching this schema:

{
  "match_percentage": integer,
  "missing_keywords": ["list", "of", "strings"],
  "formatting_critique": "string advice",
  "recommended_bullet_point_updates": [{"original": "str", "suggested_revision": "str"}]
}

Notes
-----
- API key is read from `OPENAI_API_KEY` in environment (.env via python-dotenv).
- The code uses exponential backoff for rate-limit and API errors.
- The system instruction forces the LLM to act as a cynical, technical hiring manager and to return only JSON matching the schema.
- Use `pytest -q` to run the included tests.
