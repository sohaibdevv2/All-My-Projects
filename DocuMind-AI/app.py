import os
import streamlit as st
from dotenv import load_dotenv
from src.data_processor import load_sample_texts, prepare_input_text, summarize_entities
from src.model_handler import fetch_model_metadata, load_ner_pipeline, run_ner_extraction

load_dotenv()
HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")

st.set_page_config(
    page_title="Medical NER Lab",
    page_icon="🧠",
    layout="centered",
    initial_sidebar_state="expanded",
)

st.title("Medical Named Entity Extraction Lab")
st.write(
    "Upload clinical text or type a sentence to extract medical entities like diseases, treatments, anatomy, and medications."
)

with st.sidebar:
    st.header("Settings")
    model_name = st.selectbox(
        "Hugging Face NER model",
        ["dslim/bert-base-NER", "Jean-Baptiste/roberta-large-ner-english"],
        index=0,
    )
    show_raw = st.checkbox("Show raw pipeline output", value=False)
    st.markdown("---")

    if HF_TOKEN:
        st.success("Hugging Face token loaded")
    else:
        st.info("Optional: add HUGGINGFACE_TOKEN in .env or Streamlit secrets for expanded Hugging Face access.")

sample_texts = load_sample_texts()
selected_sample = st.selectbox("Sample medical text", list(sample_texts.keys()))

uploaded_file = st.file_uploader("Upload a text file (.txt)", type=["txt"])
custom_text = st.text_area("Medical text input", height=220)

if uploaded_file is not None:
    try:
        raw_text = uploaded_file.read().decode("utf-8")
    except Exception:
        raw_text = ""
        st.error("Unable to read uploaded file. Please upload a valid UTF-8 encoded .txt file.")
else:
    raw_text = custom_text.strip() or sample_texts[selected_sample]

input_text = prepare_input_text(raw_text)
if not input_text:
    st.warning("Enter some medical text or upload a `.txt` file to continue.")
    st.stop()

st.subheader("Input preview")
st.write(input_text)

if st.button("Run entity extraction"):
    try:
        with st.spinner("Loading model and extracting entities..."):
            ner_pipeline = load_ner_pipeline(model_name=model_name, auth_token=HF_TOKEN)
            metadata = fetch_model_metadata(model_name=model_name, auth_token=HF_TOKEN)
            entities = run_ner_extraction(input_text, ner_pipeline)

        if entities:
            st.success(f"Detected {len(entities)} entities.")
            st.write("### Entity summary")
            summary = summarize_entities(entities)
            st.table(summary)

            st.write("### Extracted entities")
            st.markdown(
                "| Entity | Label | Score | Start | End |\n|---|---|---|---|---|"
            )
            for entity in entities:
                st.markdown(
                    f"| {entity['word']} | {entity['entity_group']} | {entity['score']:.3f} | {entity['start']} | {entity['end']} |"
                )

            if show_raw:
                st.write("### Raw pipeline output")
                st.json(entities)
        else:
            st.warning("No named entities were detected in the provided text.")

        if metadata:
            st.write("---")
            st.write("### Hugging Face model metadata")
            st.write(f"**Model:** {metadata.modelId}")
            st.write(f"**Tags:** {', '.join(metadata.tags or [])}")
            st.write(f"**Library:** {metadata.libraryName or 'transformers'}")
    except Exception as error:
        st.error(f"Extraction failed: {error}")
        st.write("Try a shorter text sample or verify the Hugging Face model ID.")
