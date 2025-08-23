from sqlalchemy.orm import Session
from . import models, schemas

def create_chat(db: Session, request: schemas.ChatRequest, bot_reply: str):
    chat = models.Chat(user_message=request.message, bot_reply=bot_reply)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat

def get_chats(db: Session):
    return db.query(models.Chat).order_by(models.Chat.timestamp.desc()).all()
