from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
from deepface import DeepFace
import uvicorn
import logging
import bcrypt
import os
from dotenv import load_dotenv
from pymongo import MongoClient


# Load environment variables
load_dotenv()

app = FastAPI()
logging.basicConfig(level=logging.INFO)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://mental-wellness-xi.vercel.app",
        "https://mental-wellness-lsihyz5sy-sai-tejas-projects-2a2e36c4.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# MongoDB Atlas connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://sai727868:Sai1234@cluster0.p1wnggu.mongodb.net/")
DATABASE_NAME = os.getenv("DATABASE_NAME", "mental_wellness")

try:
    client = MongoClient(MONGODB_URL)
    # Test the connection
    client.admin.command('ping')
    db = client[DATABASE_NAME]
    users_collection = db["users"]
    logging.info("Successfully connected to MongoDB Atlas")
except Exception as e:
    logging.error(f"Error connecting to MongoDB Atlas: {e}")
    raise e


class UserIn(BaseModel):
    username: str
    password: str


@app.get("/")
def health_check():
    return {"status": "healthy", "message": "Mental Wellness AI API is running"}


@app.get("/health")
def detailed_health_check():
    try:
        # Test database connection
        client.admin.command('ping')
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "database": db_status,
        "message": "Mental Wellness AI API"
    }


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

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
