from pydantic import BaseModel
from datetime import datetime

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    id: int
    user_message: str
    bot_reply: str
    timestamp: datetime

    class Config:
        orm_mode = True  # 👈 allows returning SQLAlchemy objects
