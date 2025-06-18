from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
from deepface import DeepFace
import uvicorn
import logging
import bcrypt
from pymongo import MongoClient

# === SETUP ===
app = FastAPI()
logging.basicConfig(level=logging.INFO)

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
        "https://mental-wellness-xi.vercel.app",], 
      # Update to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === MONGODB CONNECTION ===
client = MongoClient("mongodb://localhost:27017/")
db = client["mental_wellness"]
users_collection = db["users"]  

# === MODELS ===
class UserIn(BaseModel):
    username: str
    password: str

# === AUTH ROUTES ===
@app.post("/register")
def register(user: UserIn):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({
        "username": user.username,
        "password": hashed_pw.decode()
    })
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: UserIn):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}

# === EMOTION DETECTION ROUTE ===
@app.post("/analyze_emotion/")
async def analyze_emotion(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if image is None:
            logging.error("Invalid image format received")
            return {"error": "Invalid image format"}

        result = DeepFace.analyze(image, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']
        stress_level = "High" if emotion in ["sad", "angry", "fear"] else "Low"

        logging.info(f"Detected emotion: {emotion}, Stress Level: {stress_level}")
        return {"emotion": emotion, "stress_level": stress_level}

    except Exception as e:
        logging.error(f"Error processing image: {str(e)}")
        return {"error": str(e)}

# === RUN ===
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
