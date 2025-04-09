from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import openai
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all frontend origins (change to specific domains if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Replace with your OpenAI API key
OPENAI_API_KEY = ""

# Create OpenAI client
client = openai.OpenAI(api_key=OPENAI_API_KEY)

class ChatRequest(BaseModel):
    message: str

# Function to calculate stress level based on keywords
def calculate_stress_level(message: str) -> int:
    stress_keywords = ["stress", "anxiety", "depressed", "overwhelmed", "sad", "angry", "frustrated"]
    stress_count = sum(1 for keyword in stress_keywords if keyword in message.lower())
    
    # Calculate stress level as a percentage (0-100)
    stress_level = min(stress_count * 20, 100)  # Each keyword adds 20% stress
    return stress_level

@app.post("/chat/")
async def chat_with_ai(request: ChatRequest):
    try:
        # Get OpenAI response
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": request.message}]
        )
        reply = response.choices[0].message.content

        # Calculate stress level
        stress_level = calculate_stress_level(request.message)

        return {"reply": reply, "stress_level": stress_level}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))