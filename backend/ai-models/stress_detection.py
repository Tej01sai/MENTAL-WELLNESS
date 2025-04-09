from fastapi import FastAPI, HTTPException
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Get API key from environment variables
HUGGING_FACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
if not HUGGING_FACE_API_KEY:
    raise ValueError("HUGGINGFACE_API_KEY is not set in the environment variables")

API_URL = "https://api-inference.huggingface.co/models/bhadresh-savani/roberta-emotion"
HEADERS = {"Authorization": f"Bearer {HUGGING_FACE_API_KEY}"}

def analyze_stress(text: str):
    """Sends text to Hugging Face API for emotion detection."""
    payload = {"inputs": text}
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Hugging Face API Error: " + response.text)
    
    result = response.json()
    return result

@app.post("/detect-stress/")
async def detect_stress(data: dict):
    text = data.get("text")
    if not text:
        raise HTTPException(status_code=400, detail="Text input is required")
    
    emotions = analyze_stress(text)
    
    # Extract stress-related emotions (e.g., sadness, anger, fear)
    stress_score = sum(emotion["score"] for emotion in emotions[0] if emotion["label"] in ["sadness", "anger", "fear"])

    return {"stress_level": round(stress_score * 100, 2), "emotions": emotions[0]}
