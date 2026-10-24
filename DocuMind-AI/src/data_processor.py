import streamlit as st
from typing import Dict, List


@st.cache_data(show_spinner=False)
def load_sample_texts() -> Dict[str, str]:
    return {
        "Clinical discharge summary": (
            "The patient was admitted with acute chest pain and diagnosed with myocardial infarction. "
            "Prescribed aspirin, metoprolol, and lisinopril. Follow-up imaging for cardiomegaly is scheduled."
        ),
        "Radiology report": (
            "CT scan reveals a small left renal mass and evidence of pulmonary embolism. "
            "Recommend contrast-enhanced MRI to evaluate the renal lesion and vascular structure."
        ),
        "Patient note": (
            "Patient reports chronic lower back pain and numbness in the left leg. "
            "NSAIDs provide partial relief, and physical therapy was recommended."
        ),
    }


@st.cache_data(show_spinner=False)
def prepare_input_text(raw_text: str) -> str:
    cleaned = raw_text.strip()
    cleaned = " ".join(cleaned.split())
    return cleaned


@st.cache_data(show_spinner=False)
def summarize_entities(entities: List[dict]) -> List[Dict[str, str]]:
    counts = {}
    for entity in entities:
        label = entity.get("entity_group", entity.get("entity", "UNKNOWN"))
        counts[label] = counts.get(label, 0) + 1

    summary = [{"Entity label": label, "Count": count} for label, count in sorted(counts.items(), key=lambda item: item[1], reverse=True)]
    return summary
