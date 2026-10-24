import gradio as gr
from transformers import pipeline

# 1. Load the AI pipeline
# We use a pre-trained model specifically for sentiment analysis
sentiment_pipeline = pipeline("sentiment-analysis")

# 2. Define the function that does the work
def analyze_vibe(text):
    result = sentiment_pipeline(text)[0]
    label = result['label']
    score = round(result['score'], 2)
    return f"Vibe: {label} (Confidence: {score})"

# 3. Create the User Interface (UI)
interface = gr.Interface(
    fn=analyze_vibe, 
    inputs=gr.Textbox(label="Enter your text here..."), 
    outputs=gr.Textbox(label="Result"),
    title="The Vibe Checker",
    description="Enter a sentence and I'll tell you if it's POSITIVE or NEGATIVE."
)

# 4. Launch the app
interface.launch()