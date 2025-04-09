from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from deepface import DeepFace
import uvicorn  
import logging  
app = FastAPI()

# Enable logging....
logging.basicConfig(level=logging.INFO)

# Enable CORS for React frontend...
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if frontend is deployed elsewhere...
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze_emotion/")
async def analyze_emotion(file: UploadFile = File(...)):
    try:
        # Read image file...
        contents = await file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if image is None:
            logging.error("Invalid image format received")
            return {"error": "Invalid image format"}

        # Perform emotion analysis...
        result = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']

        # Determine stress level based on emotion...
        stress_level = "High" if emotion in ["sad", "angry", "fear"] else "Low"

        logging.info(f"Detected emotion: {emotion}, Stress Level: {stress_level}")
        return {"emotion": emotion, "stress_level": stress_level}

    except Exception as e:
        logging.error(f"Error processing image: {str(e)}")
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
