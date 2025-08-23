import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .database import engine, Base, get_db

# Load env vars
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="Cyber Safety Chat 🚀")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Gemini + SQLite Community Chat is running 🚀"}

@app.post("/chat", response_model=schemas.ChatResponse)
async def chat_with_gemini(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(request.message)
    return crud.create_chat(db, request, response.text)

@app.get("/chat/history", response_model=list[schemas.ChatResponse])
def get_chat_history(db: Session = Depends(get_db)):
    return crud.get_chats(db)
