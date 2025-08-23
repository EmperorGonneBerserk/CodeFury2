from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class Chat(Base):
    __tablename__ = "chats"
    id = Column(Integer, primary_key=True, index=True)
    user_message = Column(String, nullable=False)
    bot_reply = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
