from sqlalchemy import create_engine, Column, Integer, String, Text, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:////tmp/finbot.db" if os.getenv("VERCEL") else "sqlite:///./finbot.db"
)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(64), primary_key=True, index=True)
    language = Column(String(16), default="en")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(64), index=True)
    role = Column(String(16))  # 'user' or 'assistant'
    content = Column(Text)
    language = Column(String(16), default="en")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class FinancialGoal(Base):
    __tablename__ = "financial_goals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(128))
    category = Column(String(64), default="General")  # Emergency, House, Vehicle, Education, Travel, etc.
    target_amount = Column(Float)
    current_amount = Column(Float, default=0.0)
    target_date = Column(String(32))  # YYYY-MM-DD
    monthly_savings_needed = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    module_id = Column(String(64), unique=True, index=True)
    completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    max_score = Column(Integer, default=3)
    completed_at = Column(DateTime, nullable=True)


def init_db():
    Base.metadata.create_all(bind=engine)
    # Seed sample goals if none exist
    db = SessionLocal()
    try:
        if db.query(FinancialGoal).count() == 0:
            sample_goals = [
                FinancialGoal(
                    title="Emergency Fund (6 Months)",
                    category="Emergency",
                    target_amount=150000.0,
                    current_amount=65000.0,
                    target_date="2027-06-30",
                    monthly_savings_needed=10625.0
                ),
                FinancialGoal(
                    title="Two-Wheeler / EV Bike",
                    category="Vehicle",
                    target_amount=95000.0,
                    current_amount=40000.0,
                    target_date="2027-03-31",
                    monthly_savings_needed=11000.0
                ),
                FinancialGoal(
                    title="Higher Studies & Upskilling",
                    category="Education",
                    target_amount=200000.0,
                    current_amount=80000.0,
                    target_date="2027-12-31",
                    monthly_savings_needed=8570.0
                )
            ]
            db.add_all(sample_goals)
            db.commit()
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
