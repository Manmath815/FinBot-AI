import os
import uuid
import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from database import init_db, get_db, ChatSession, ChatMessage, FinancialGoal, LearningProgress
from watsonx_client import generate_response, get_iam_token, GRANITE_MODEL, IBM_PROJECT_ID, IBM_URL
from calculator_service import (
    calculate_sip, calculate_loan_emi, calculate_compound_interest,
    calculate_budget_50_30_20, calculate_simple_interest, calculate_savings_goal
)
from scam_analyzer import analyze_scam_message

load_dotenv()

# Initialize DB tables and seeds
init_db()

app = FastAPI(
    title="FinBot AI API — Digital Financial Literacy Assistant",
    description="Backend API powered by IBM Watsonx and IBM Granite for Digital Financial Literacy in India.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Models -----------------

class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=1000)
    language: str = Field(default="en")

class ChatResponse(BaseModel):
    session_id: str
    reply: str
    provider: str
    model: str
    timestamp: str

class ScamCheckRequest(BaseModel):
    text: str = Field(..., min_length=3, max_length=5000)
    category: str = Field(default="general")

class GoalCreateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=120)
    category: str = Field(default="General")
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(default=0.0, ge=0)
    target_date: str = Field(...)  # YYYY-MM-DD

class GoalUpdateRequest(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    target_date: Optional[str] = None

class SipCalcRequest(BaseModel):
    monthly_investment: float = Field(..., gt=0)
    annual_return_rate: float = Field(..., ge=0, le=100)
    tenure_years: float = Field(..., gt=0, le=50)

class LoanCalcRequest(BaseModel):
    principal: float = Field(..., gt=0)
    annual_interest_rate: float = Field(..., ge=0, le=100)
    tenure_years: float = Field(..., gt=0, le=40)

class CompoundCalcRequest(BaseModel):
    principal: float = Field(..., gt=0)
    annual_rate: float = Field(..., ge=0, le=100)
    tenure_years: float = Field(..., gt=0, le=50)
    frequency: str = Field(default="yearly")

class BudgetCalcRequest(BaseModel):
    monthly_income: float = Field(..., gt=0)
    needs_pct: float = Field(default=50.0, ge=0, le=100)
    wants_pct: float = Field(default=30.0, ge=0, le=100)
    savings_pct: float = Field(default=20.0, ge=0, le=100)

class QuizSubmitRequest(BaseModel):
    module_id: str
    answers: Dict[str, int]  # question_index -> chosen_option_index

# ----------------- Chat Endpoints -----------------

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest, db: Session = Depends(get_db)):
    session_id = req.session_id or str(uuid.uuid4())

    # Get or create session
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        session = ChatSession(id=session_id, language=req.language)
        db.add(session)
        db.commit()
    else:
        session.language = req.language
        session.updated_at = datetime.datetime.utcnow()
        db.commit()

    # Save user message
    user_msg = ChatMessage(
        session_id=session_id,
        role="user",
        content=req.message,
        language=req.language
    )
    db.add(user_msg)
    db.commit()

    # Retrieve recent chat history for context
    history_records = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.timestamp.desc())
        .limit(6)
        .all()
    )
    history = [{"role": m.role, "content": m.content} for m in reversed(history_records)]

    # Generate AI response via Watsonx Granite or fallback engine
    ai_result = await generate_response(
        prompt=req.message,
        language=req.language,
        history=history
    )

    bot_text = ai_result.get("response", "I am here to guide your digital financial journey.")
    provider = ai_result.get("provider", "ibm-granite")
    model = ai_result.get("model", GRANITE_MODEL)

    # Save assistant message
    bot_msg = ChatMessage(
        session_id=session_id,
        role="assistant",
        content=bot_text,
        language=req.language
    )
    db.add(bot_msg)
    db.commit()

    return ChatResponse(
        session_id=session_id,
        reply=bot_text,
        provider=provider,
        model=model,
        timestamp=datetime.datetime.utcnow().strftime("%I:%M %p")
    )


@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.timestamp.asc())
        .all()
    )
    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "timestamp": m.timestamp.strftime("%I:%M %p")
        }
        for m in messages
    ]


@app.delete("/api/chat/history/{session_id}")
async def clear_chat_history(session_id: str, db: Session = Depends(get_db)):
    db.query(ChatMessage).filter(ChatMessage.session_id == session_id).delete()
    db.commit()
    return {"status": "success", "message": "Chat history cleared"}

# ----------------- Scam Check Endpoint -----------------

@app.post("/api/scam-check")
async def scam_check_endpoint(req: ScamCheckRequest):
    result = analyze_scam_message(req.text, req.category)
    return result

# ----------------- Calculators Endpoints -----------------

@app.post("/api/calculators/sip")
async def calc_sip_endpoint(req: SipCalcRequest):
    return calculate_sip(req.monthly_investment, req.annual_return_rate, req.tenure_years)

@app.post("/api/calculators/loan")
async def calc_loan_endpoint(req: LoanCalcRequest):
    return calculate_loan_emi(req.principal, req.annual_interest_rate, req.tenure_years)

@app.post("/api/calculators/compound")
async def calc_compound_endpoint(req: CompoundCalcRequest):
    return calculate_compound_interest(req.principal, req.annual_rate, req.tenure_years, req.frequency)

@app.post("/api/calculators/budget")
async def calc_budget_endpoint(req: BudgetCalcRequest):
    return calculate_budget_50_30_20(req.monthly_income, req.needs_pct, req.wants_pct, req.savings_pct)

# ----------------- Goals Endpoints -----------------

def compute_monthly_needed(target: float, current: float, target_date_str: str) -> float:
    try:
        t_date = datetime.datetime.strptime(target_date_str, "%Y-%m-%d").date()
        today = datetime.date.today()
        diff_days = (t_date - today).days
        months = max(1, diff_days / 30.4)
        remaining = max(0.0, target - current)
        return round(remaining / months, 2)
    except Exception:
        return round(max(0.0, target - current) / 12.0, 2)

@app.get("/api/goals")
async def list_goals(db: Session = Depends(get_db)):
    goals = db.query(FinancialGoal).order_by(FinancialGoal.id.asc()).all()
    out = []
    for g in goals:
        monthly = compute_monthly_needed(g.target_amount, g.current_amount, g.target_date)
        pct = round(min(100.0, (g.current_amount / g.target_amount) * 100.0), 1) if g.target_amount > 0 else 100.0
        out.append({
            "id": g.id,
            "title": g.title,
            "category": g.category,
            "target_amount": g.target_amount,
            "current_amount": g.current_amount,
            "target_date": g.target_date,
            "monthly_savings_needed": monthly,
            "progress_percentage": pct
        })
    return out

@app.post("/api/goals")
async def create_goal(req: GoalCreateRequest, db: Session = Depends(get_db)):
    monthly = compute_monthly_needed(req.target_amount, req.current_amount, req.target_date)
    goal = FinancialGoal(
        title=req.title,
        category=req.category,
        target_amount=req.target_amount,
        current_amount=req.current_amount,
        target_date=req.target_date,
        monthly_savings_needed=monthly
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return {
        "id": goal.id,
        "title": goal.title,
        "category": goal.category,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "target_date": goal.target_date,
        "monthly_savings_needed": monthly,
        "progress_percentage": round(min(100.0, (goal.current_amount / goal.target_amount) * 100.0), 1)
    }

@app.put("/api/goals/{goal_id}")
async def update_goal(goal_id: int, req: GoalUpdateRequest, db: Session = Depends(get_db)):
    goal = db.query(FinancialGoal).filter(FinancialGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    if req.title is not None:
        goal.title = req.title
    if req.category is not None:
        goal.category = req.category
    if req.target_amount is not None:
        goal.target_amount = req.target_amount
    if req.current_amount is not None:
        goal.current_amount = req.current_amount
    if req.target_date is not None:
        goal.target_date = req.target_date

    goal.monthly_savings_needed = compute_monthly_needed(goal.target_amount, goal.current_amount, goal.target_date)
    db.commit()
    db.refresh(goal)
    return {
        "id": goal.id,
        "title": goal.title,
        "category": goal.category,
        "target_amount": goal.target_amount,
        "current_amount": goal.current_amount,
        "target_date": goal.target_date,
        "monthly_savings_needed": goal.monthly_savings_needed,
        "progress_percentage": round(min(100.0, (goal.current_amount / goal.target_amount) * 100.0), 1)
    }

@app.delete("/api/goals/{goal_id}")
async def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(FinancialGoal).filter(FinancialGoal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"status": "success", "message": f"Goal {goal_id} deleted"}

# ----------------- Learning Modules -----------------

LEARN_MODULES = [
    {
        "id": "upi_safety",
        "title": "UPI & Digital Payments Safety",
        "icon": "Smartphone",
        "description": "Master UPI payment mechanics, avoid fake QR codes, and learn the golden rules of digital transactions.",
        "difficulty": "Beginner",
        "duration": "5 mins",
        "content": [
            "UPI is an instant real-time payment system developed by NPCI.",
            "Golden Rule 1: You NEVER need to enter your UPI PIN to receive money.",
            "Golden Rule 2: QR codes are only for SENDING money or initiating a debit.",
            "Collect Requests: If someone sends you a collect request promising cashback, decline it immediately.",
            "National Cyber Crime Helpline: In case of fraud, dial 1930 within 2 hours."
        ],
        "quiz": [
            {
                "question": "A buyer on OLX sends you a QR code and says 'Scan this to receive ₹5,000 in your account'. What should you do?",
                "options": [
                    "Scan the QR code and enter your UPI PIN",
                    "Do NOT scan the QR code — receiving money never requires scanning or entering a PIN",
                    "Share your OTP with the buyer",
                    "Click on AnyDesk link"
                ],
                "correct_index": 1,
                "explanation": "You NEVER scan a QR code or enter your UPI PIN to receive money. Scanning a QR code authorizes money to leave your account."
            },
            {
                "question": "What is the official toll-free DigiSaathi helpline for digital payments assistance in India?",
                "options": ["100", "14431", "1912", "1800-00-0000"],
                "correct_index": 1,
                "explanation": "14431 is the official 24x7 DigiSaathi helpline initiated by RBI and NPCI for digital payment queries."
            },
            {
                "question": "What should be your first action within the 'Golden Hour' if you lose money to cyber fraud?",
                "options": [
                    "Wait 24 hours to see if bank reverses it",
                    "Dial 1930 Cyber Crime Helpline immediately",
                    "Post about it on social media only",
                    "Call the scammer back to request a refund"
                ],
                "correct_index": 1,
                "explanation": "Dialing 1930 immediately alerts banks to intercept and freeze the defrauded funds before the scammer withdraws them."
            }
        ]
    },
    {
        "id": "avoid_scams",
        "title": "Identifying & Avoiding Online Scams",
        "icon": "ShieldAlert",
        "description": "Recognize phishing, fake electricity bill SMS, digital arrest calls, and Telegram task scams.",
        "difficulty": "Beginner",
        "duration": "6 mins",
        "content": [
            "Urgency & Fear: Scammers invent fake emergencies (e.g., 'Power cut tonight', 'Account blocked').",
            "Screen Sharing Apps: Never install AnyDesk, QuickSupport, or RustDesk on advice of unknown callers.",
            "Digital Arrest Myth: No Indian police, CBI, or ED agency conducts 'arrests' via Skype/WhatsApp video call.",
            "Task Scams: Legitimate companies never ask you to pay deposits to withdraw salary or commissions."
        ],
        "quiz": [
            {
                "question": "You receive an SMS: 'Dear consumer, your electricity will be disconnected tonight at 9:30 PM. Call 9876543210'. What is this?",
                "options": [
                    "A genuine notice from the electricity board",
                    "A common cyber scam designed to steal bank access",
                    "A reminder to recharge prepaid meter",
                    "An automatic government warning"
                ],
                "correct_index": 1,
                "explanation": "Electricity boards never disconnect services via personal mobile numbers or without official written notices."
            },
            {
                "question": "Someone posing as a CBI officer asks you to stay on video call for 'Digital Arrest' and transfer money for 'verification'. What is true?",
                "options": [
                    "Digital arrest is legal in India",
                    "There is NO law or procedure for 'Digital Arrest' in India — it is 100% fraud",
                    "You must transfer the money immediately",
                    "You should delete your bank account"
                ],
                "correct_index": 1,
                "explanation": "Indian law enforcement agencies NEVER place citizens under video call arrest or demand money for verification."
            },
            {
                "question": "Why should you never install AnyDesk or QuickSupport when asked by an unknown caller?",
                "options": [
                    "It consumes phone battery",
                    "It gives the caller full remote control to view your screen, OTPs, and passwords",
                    "It installs games",
                    "It turns off Wi-Fi"
                ],
                "correct_index": 1,
                "explanation": "Remote desktop apps allow attackers to see your screen in real time and steal banking OTPs and passwords."
            }
        ]
    },
    {
        "id": "sip_mutual_funds",
        "title": "SIP & The Power of Compounding",
        "icon": "TrendingUp",
        "description": "Understand Systematic Investment Plans, rupee cost averaging, and long-term compounding.",
        "difficulty": "Intermediate",
        "duration": "7 mins",
        "content": [
            "SIP is a disciplined method of investing a fixed sum monthly into mutual funds.",
            "Rupee Cost Averaging: Automatically buys more units during market dips and fewer during rallies.",
            "Direct Plans: Always choose 'Direct - Growth' plans over 'Regular' plans to eliminate distributor commissions.",
            "Rule of 72: Divide 72 by the annual return rate to estimate doubling time (e.g., 72 / 12% = 6 years)."
        ],
        "quiz": [
            {
                "question": "What is the primary benefit of Rupee Cost Averaging in a SIP?",
                "options": [
                    "Guarantees that market never drops",
                    "Buys more units when NAV is low and fewer when NAV is high, reducing average cost",
                    "Exempts you from all capital gains taxes",
                    "Multiplies your salary by 2"
                ],
                "correct_index": 1,
                "explanation": "Rupee cost averaging eliminates the impossible task of timing the market by averaging your purchase price over cycles."
            },
            {
                "question": "According to the Rule of 72, at an average 12% annual return, how many years does it take to double your investment?",
                "options": ["12 years", "6 years", "10 years", "3 years"],
                "correct_index": 1,
                "explanation": "72 divided by 12 = 6 years to double."
            },
            {
                "question": "Why should investors prefer 'Direct' mutual fund plans over 'Regular' plans?",
                "options": [
                    "Direct plans have zero NAV",
                    "Direct plans do not pay commissions to middlemen, yielding higher long-term returns",
                    "Direct plans are only for government employees",
                    "Regular plans have lower risk"
                ],
                "correct_index": 1,
                "explanation": "Direct plans have lower expense ratios because they don't pay distributor commissions, generating substantially higher returns over 10-20 years."
            }
        ]
    },
    {
        "id": "budget_50_30_20",
        "title": "50/30/20 Budgeting & Expense Tracking",
        "icon": "PieChart",
        "description": "Structure your income effortlessly between necessities, lifestyle desires, and future wealth.",
        "difficulty": "Beginner",
        "duration": "5 mins",
        "content": [
            "50% for Needs: Rent, groceries, utility bills, school fees, essential medicines.",
            "30% for Wants: Dining out, subscriptions, shopping, movies, vacations.",
            "20% for Savings: Emergency fund, SIPs, debt prepayments, PPF, NPS.",
            "Warren Buffett's Rule: Do not save what is left after spending; spend what is left after saving."
        ],
        "quiz": [
            {
                "question": "Under the 50/30/20 budget framework, if your monthly in-hand salary is ₹40,000, how much should be allocated to savings/investments?",
                "options": ["₹5,000", "₹8,000", "₹12,000", "₹20,000"],
                "correct_index": 1,
                "explanation": "20% of ₹40,000 = ₹8,000 dedicated to savings and wealth creation."
            },
            {
                "question": "Which of the following is considered a 'Want' rather than a 'Need'?",
                "options": ["Basic grocery supplies", "LPG cylinder cylinder refill", "Dining at a fine restaurant on weekends", "Mandatory health insurance premium"],
                "correct_index": 2,
                "explanation": "Restaurant dining and entertainment are lifestyle choices ('Wants') that can be cut during financial distress."
            },
            {
                "question": "If house rent in an expensive city consumes 45% of your income, how should you adapt the budget?",
                "options": [
                    "Stop saving completely",
                    "Adopt a 60/20/20 split and reduce wants to 20% while protecting your 20% savings",
                    "Take a personal loan to fund wants",
                    "Ignore budgeting"
                ],
                "correct_index": 1,
                "explanation": "Protecting your 20% savings habit by trimming lifestyle expenses (wants) ensures long-term financial stability."
            }
        ]
    },
    {
        "id": "emergency_fund",
        "title": "Emergency Fund & Liquid Savings",
        "icon": "ShieldCheck",
        "description": "Construct a resilient shock absorber to protect your family from job loss or medical crises.",
        "difficulty": "Beginner",
        "duration": "5 mins",
        "content": [
            "Target size: 3 to 6 months of mandatory living expenses.",
            "Keep it liquid: High-interest sweep-in fixed deposits or liquid mutual funds.",
            "Never risk it: Never invest emergency funds in high-volatility stock markets or real estate.",
            "Strict replenishment: Replenish your emergency reserves immediately once drawn upon."
        ],
        "quiz": [
            {
                "question": "If your mandatory monthly expenses are ₹25,000, what is the ideal 6-month emergency fund target?",
                "options": ["₹75,000", "₹1,50,000", "₹2,50,000", "₹5,00,000"],
                "correct_index": 1,
                "explanation": "₹25,000 x 6 months = ₹1,50,000 safety cushion."
            },
            {
                "question": "Where should you park your emergency fund?",
                "options": [
                    "High-risk crypto coins",
                    "Volatile small-cap stocks",
                    "Sweep-in FDs, liquid funds, and high-interest savings accounts",
                    "Physical jewelry only"
                ],
                "correct_index": 2,
                "explanation": "Emergency funds require immediate liquidity and capital preservation, not market volatility."
            },
            {
                "question": "When should you withdraw money from an emergency fund?",
                "options": [
                    "To buy a new smartphone on flash sale",
                    "Only for genuine emergencies like medical hospitalisation or sudden job loss",
                    "To go on an impromptu holiday",
                    "To gamble on lottery tickets"
                ],
                "correct_index": 1,
                "explanation": "Emergency funds are strictly for unplanned financial crises, not discretionary shopping."
            }
        ]
    },
    {
        "id": "cibil_credit_score",
        "title": "CIBIL Score & Credit Health",
        "icon": "CreditCard",
        "description": "Build and maintain a 750+ credit score for cheap home and personal loan interest rates.",
        "difficulty": "Intermediate",
        "duration": "6 mins",
        "content": [
            "Score ranges from 300 to 900. 750+ is considered excellent by Indian banks.",
            "Payment history accounts for 35% of your score — never miss an EMI or credit card bill.",
            "Credit Utilization: Keep card spending under 30% of total sanctioned limit.",
            "Free Credit Report: Every Indian citizen is entitled to 1 free credit report per year from each bureau."
        ],
        "quiz": [
            {
                "question": "What is considered an ideal credit utilization ratio on your credit card?",
                "options": ["Above 90%", "Under 30%", "Exactly 100%", "It does not matter"],
                "correct_index": 1,
                "explanation": "Keeping credit utilization below 30% demonstrates responsible borrowing and lifts your CIBIL score."
            },
            {
                "question": "What happens if you only pay the 'Minimum Amount Due' on your credit card bill every month?",
                "options": [
                    "All remaining balance becomes interest-free",
                    "You will be charged steep financing charges of 36% to 48% p.a. on the unpaid balance",
                    "Bank gives you cashback rewards",
                    "Your CIBIL score automatically hits 900"
                ],
                "correct_index": 1,
                "explanation": "Paying only minimum due attracts exorbitant credit card interest rates (up to 42-48% p.a.) and traps you in debt."
            },
            {
                "question": "What score range qualifies as 'Excellent' for obtaining best loan rates in India?",
                "options": ["300 to 500", "500 to 650", "750 to 900", "100 to 200"],
                "correct_index": 2,
                "explanation": "A CIBIL score between 750 and 900 unlocks fast approvals and the lowest lending interest rates."
            }
        ]
    },
    {
        "id": "govt_schemes",
        "title": "Government Financial Schemes",
        "icon": "Landmark",
        "description": "Tap into subsidized social security, micro-insurance, and sovereign wealth schemes.",
        "difficulty": "Beginner",
        "duration": "6 mins",
        "content": [
            "PM Suraksha Bima Yojana (PMSBY): ₹2 Lakh accidental insurance for ₹20/year.",
            "PM Jeevan Jyoti Bima Yojana (PMJJBY): ₹2 Lakh life insurance for ₹436/year.",
            "Atal Pension Yojana (APY): Guaranteed monthly pension of ₹1,000 - ₹5,000 after 60.",
            "Sukanya Samriddhi Yojana (SSY): High interest (8.2%) tax-free scheme for girl child under 10."
        ],
        "quiz": [
            {
                "question": "What is the annual premium for ₹2 Lakh accidental insurance under PMSBY?",
                "options": ["₹20 per year", "₹1,200 per year", "₹5,000 per year", "₹500 per month"],
                "correct_index": 0,
                "explanation": "PMSBY offers ₹2 Lakh accidental death cover for an ultra-affordable ₹20 per year."
            },
            {
                "question": "Who is eligible to open a Sukanya Samriddhi Yojana (SSY) account?",
                "options": [
                    "Anyone above age 60",
                    "Parents/guardians of a girl child below age 10",
                    "Corporate employees only",
                    "College graduates"
                ],
                "correct_index": 1,
                "explanation": "SSY is dedicated to girl children up to age 10, offering high interest and complete tax exemption."
            },
            {
                "question": "What is the guaranteed monthly pension provided under Atal Pension Yojana (APY) after age 60?",
                "options": ["₹50,000", "₹1,000 to ₹5,000 depending on contribution", "₹500", "₹10,000 to ₹25,000"],
                "correct_index": 1,
                "explanation": "APY provides guaranteed monthly pension brackets of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000."
            }
        ]
    }
]

@app.get("/api/learn/modules")
async def get_modules(db: Session = Depends(get_db)):
    progress_records = db.query(LearningProgress).all()
    progress_map = {p.module_id: {"completed": p.completed, "score": p.score, "max_score": p.max_score} for p in progress_records}

    result = []
    for m in LEARN_MODULES:
        p = progress_map.get(m["id"], {"completed": False, "score": 0, "max_score": len(m["quiz"])})
        item = dict(m)
        item["user_progress"] = p
        result.append(item)
    return result

@app.post("/api/learn/submit-quiz")
async def submit_quiz(req: QuizSubmitRequest, db: Session = Depends(get_db)):
    module = next((m for m in LEARN_MODULES if m["id"] == req.module_id), None)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    quiz = module["quiz"]
    correct_count = 0
    feedback = []

    for idx, q in enumerate(quiz):
        chosen = req.answers.get(str(idx))
        is_correct = (chosen == q["correct_index"])
        if is_correct:
            correct_count += 1
        feedback.append({
            "question_index": idx,
            "chosen": chosen,
            "correct_index": q["correct_index"],
            "is_correct": is_correct,
            "explanation": q["explanation"]
        })

    # Save to db
    p = db.query(LearningProgress).filter(LearningProgress.module_id == req.module_id).first()
    if not p:
        p = LearningProgress(
            module_id=req.module_id,
            completed=True,
            score=correct_count,
            max_score=len(quiz),
            completed_at=datetime.datetime.utcnow()
        )
        db.add(p)
    else:
        p.completed = True
        p.score = max(p.score, correct_count)
        p.max_score = len(quiz)
        p.completed_at = datetime.datetime.utcnow()
    db.commit()

    return {
        "module_id": req.module_id,
        "score": correct_count,
        "max_score": len(quiz),
        "percentage": round((correct_count / len(quiz)) * 100, 1),
        "passed": correct_count >= (len(quiz) * 0.6),
        "feedback": feedback
    }

# ----------------- Status & Health -----------------

@app.get("/api/status")
async def status_check():
    token = await get_iam_token()
    return {
        "status": "healthy",
        "watsonx_connected": bool(token),
        "model": GRANITE_MODEL,
        "ibm_url": IBM_URL,
        "project_configured": bool(IBM_PROJECT_ID),
        "server_time": datetime.datetime.utcnow().isoformat()
    }

# ----------------- Serve Built Frontend SPA -----------------
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Don't intercept API routes
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "FinBot AI Backend Running"}

