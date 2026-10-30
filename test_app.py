import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Add backend to path
sys.path.append(os.path.abspath("backend"))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("[OK] Health Check Passed:", data)

def test_chat_english():
    response = client.post("/api/chat", json={
        "session_id": "test-session-1",
        "message": "What is the golden rule of UPI?",
        "language": "en"
    })
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["reply"]) > 20
    print("[OK] Chat English Response Passed:")
    print("  Reply snippet:", data["reply"][:120].encode('ascii', errors='ignore').decode(), "...")

def test_chat_hindi():
    response = client.post("/api/chat", json={
        "session_id": "test-session-1",
        "message": "UPI",
        "language": "hi"
    })
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    print("[OK] Chat Hindi Response Passed:")
    print("  Reply snippet:", data["reply"][:120].encode('ascii', errors='ignore').decode(), "...")

def test_chat_history():
    response = client.get("/api/chat/history/test-session-1")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    print(f"[OK] Chat History Retrieved: {len(data)} messages found")

def test_clear_chat():
    response = client.delete("/api/chat/history/test-session-1")
    assert response.status_code == 200
    history = client.get("/api/chat/history/test-session-1").json()
    assert len(history) == 0
    print("[OK] Clear Chat History Passed")

def test_scam_check():
    sample_scam = "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM. Call officer at 9876543210 immediately."
    response = client.post("/api/scam-check", json={
        "text": sample_scam,
        "category": "sms"
    })
    assert response.status_code == 200
    data = response.json()
    print("DEBUG SCAM DATA:", data)
    assert data["risk_level"] in ["HIGH", "CRITICAL"]
    assert len(data["red_flags"]) > 0
    print("[OK] Scam Analyzer Passed:")
    print(f"  Risk Level: {data['risk_level']}, Score: {data['risk_score']}")
    print(f"  Red Flag: {data['red_flags'][0]['title']}")

def test_calculators():
    # 1. SIP
    sip_res = client.post("/api/calculators/sip", json={
        "monthly_investment": 5000,
        "annual_return_rate": 12,
        "tenure_years": 10
    })
    assert sip_res.status_code == 200
    sip_data = sip_res.json()
    assert sip_data["total_invested"] == 600000
    assert sip_data["maturity_value"] > 1100000
    print("[OK] SIP Calculator Passed: Invested 600,000 -> Maturity", sip_data["maturity_value"])

    # 2. Loan EMI
    loan_res = client.post("/api/calculators/loan", json={
        "principal": 500000,
        "annual_interest_rate": 10,
        "tenure_years": 5
    })
    assert loan_res.status_code == 200
    loan_data = loan_res.json()
    assert loan_data["monthly_emi"] > 10000
    print("[OK] Loan EMI Calculator Passed: Monthly EMI", loan_data["monthly_emi"])

    # 3. Compound Interest
    ci_res = client.post("/api/calculators/compound", json={
        "principal": 100000,
        "annual_rate": 8,
        "tenure_years": 5,
        "frequency": "yearly"
    })
    assert ci_res.status_code == 200
    ci_data = ci_res.json()
    assert ci_data["maturity_amount"] > 140000
    print("[OK] Compound Interest Passed: 100,000 ->", ci_data["maturity_amount"])

    # 4. Budget 50/30/20
    budget_res = client.post("/api/calculators/budget", json={
        "monthly_income": 50000,
        "needs_pct": 50,
        "wants_pct": 30,
        "savings_pct": 20
    })
    assert budget_res.status_code == 200
    b_data = budget_res.json()
    assert b_data["needs"]["amount"] == 25000
    assert b_data["wants"]["amount"] == 15000
    assert b_data["savings"]["amount"] == 10000
    print("[OK] 50/30/20 Budget Passed: Needs 25,000, Wants 15,000, Savings 10,000")

def test_goals_crud():
    # Create
    create_res = client.post("/api/goals", json={
        "title": "Dream Bike EV",
        "category": "Vehicle",
        "target_amount": 120000,
        "current_amount": 30000,
        "target_date": "2027-12-31"
    })
    assert create_res.status_code == 200
    goal = create_res.json()
    goal_id = goal["id"]
    print(f"[OK] Goal Created: ID {goal_id}, Monthly Needed: {goal['monthly_savings_needed']}")

    # Update
    update_res = client.put(f"/api/goals/{goal_id}", json={
        "current_amount": 40000
    })
    assert update_res.status_code == 200
    assert update_res.json()["current_amount"] == 40000
    print(f"[OK] Goal Updated: ID {goal_id}, New Amount: 40,000")

    # Delete
    delete_res = client.delete(f"/api/goals/{goal_id}")
    assert delete_res.status_code == 200
    print(f"[OK] Goal Deleted: ID {goal_id}")

def test_learn_modules():
    res = client.get("/api/learn/modules")
    assert res.status_code == 200
    modules = res.json()
    assert len(modules) >= 7
    print(f"[OK] Learn Modules Passed: {len(modules)} educational modules available")

    # Submit quiz
    quiz_res = client.post("/api/learn/submit-quiz", json={
        "module_id": "upi_safety",
        "answers": {"0": 1, "1": 1, "2": 1}
    })
    assert quiz_res.status_code == 200
    quiz_data = quiz_res.json()
    assert quiz_data["score"] == 3
    assert quiz_data["passed"] is True
    print(f"[OK] Quiz Submission Passed: Score {quiz_data['score']}/{quiz_data['max_score']}")

if __name__ == "__main__":
    print("================ RUNNING FINBOT AI TEST SUITE ================")
    test_health()
    test_chat_english()
    test_chat_hindi()
    test_chat_history()
    test_clear_chat()
    test_scam_check()
    test_calculators()
    test_goals_crud()
    test_learn_modules()
    print("================ ALL TESTS PASSED SUCCESSFULLY! ================")
