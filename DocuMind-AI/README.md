# Medical Named Entity Extraction Lab

A clean, production-ready Streamlit app for high-performance medical named entity extraction using Hugging Face NLP models.

The app is engineered for digital minimalism, modularity, and fast deployment on Streamlit Community Cloud, GitHub, and Hugging Face.

## Project overview
- Uses a Hugging Face NER pipeline for entity extraction from free-form clinical or medical text.
- Supports streaming local inference with cached model loading and text preprocessing.
- Offers a polished UI with sample text, file upload, and metadata details.
- Designed for deployment on Streamlit Community Cloud and integration with Hugging Face model hosting.

## Key features
- Clean Streamlit frontend with responsive user controls
- Cached model loading via `@st.cache_resource`
- Cached preprocessing via `@st.cache_data`
- Hugging Face integration for shared model metadata and optional token-based access
- Friendly error handling and result summaries

## Installation
1. Clone the repository:

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

2. Create a Python virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file for optional Hugging Face credentials:

```bash
echo "HUGGINGFACE_TOKEN=your_token_here" > .env
```

## Local usage
Run the Streamlit app locally:

```bash
streamlit run app.py
```

Open the provided local URL in your browser.

## Deployment

### GitHub
1. Push the repository to your GitHub account.
2. Ensure `requirements.txt`, `README.md`, and `.streamlit/config.toml` are committed.
3. Optionally enable GitHub Pages or use the repository for Streamlit deployment.

### Streamlit Community Cloud
1. Connect your GitHub repository to Streamlit Community Cloud.
2. Set the main file to `app.py`.
3. In App settings, add a secret named `HUGGINGFACE_TOKEN` if you want to access private Hugging Face models.
4. Deploy and enjoy the live app.

### Hugging Face integration
- The app loads a Hugging Face NER model from the Hub: `dslim/bert-base-NER`.
- If a valid `HUGGINGFACE_TOKEN` is provided, the app can fetch additional model metadata from the Hub.
- The same architecture can be extended to use bespoke fine-tuned medical models in Hugging Face.

## Repository structure
```
├── .gitignore
├── README.md
├── requirements.txt
├── app.py
├── src/
│   ├── __init__.py
│   ├── data_processor.py
│   └── model_handler.py
└── .streamlit/
    └── config.toml
```

## Notes
- This app is engineered for minimalism: simple UI, compact backend, and reusable modules.
- For best performance, use Streamlit Community Cloud or a containerized deployment.
- 
