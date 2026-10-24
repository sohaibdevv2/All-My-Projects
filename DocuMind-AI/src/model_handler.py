import streamlit as st
from huggingface_hub import HfApi
from transformers import Pipeline, pipeline
from typing import List, Optional


@st.cache_resource(show_spinner=False)
def load_ner_pipeline(model_name: str = "dslim/bert-base-NER", auth_token: Optional[str] = None) -> Pipeline:
    try:
        return pipeline(
            task="ner",
            model=model_name,
            tokenizer=model_name,
            aggregation_strategy="simple",
            use_auth_token=auth_token,
        )
    except Exception as error:
        raise RuntimeError(f"Unable to load Hugging Face model '{model_name}': {error}") from error


def fetch_model_metadata(model_name: str, auth_token: Optional[str] = None):
    try:
        api = HfApi()
        return api.model_info(model_name, token=auth_token)
    except Exception:
        return None


def run_ner_extraction(text: str, ner_pipeline: Pipeline) -> List[dict]:
    if not text:
        return []
    try:
        results = ner_pipeline(text)
        return [
            {
                "word": item.get("word", ""),
                "entity_group": item.get("entity_group", item.get("entity", "")),
                "score": float(item.get("score", 0.0)),
                "start": int(item.get("start", 0)),
                "end": int(item.get("end", 0)),
            }
            for item in results
        ]
    except Exception as error:
        raise RuntimeError(f"NER inference failed: {error}") from error
