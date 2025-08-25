import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# Load env vars
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

FRONTEND_URL = "https://code-fury2-pm1s.vercel.app"  # your frontend

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"message": "Gemini FastAPI backend is running 🚀"}

@app.post("/chat")
async def chat_with_gemini(request: ChatRequest):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(request.message)
    return {"reply": response.text}