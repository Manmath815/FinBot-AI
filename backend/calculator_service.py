import math
from typing import Dict, Any, List


def calculate_sip(monthly_investment: float, annual_return_rate: float, tenure_years: float) -> Dict[str, Any]:
    """
    SIP Compound Interest Formula:
    M = P * [ (1 + i)^n - 1 ] / i * (1 + i)
    where:
    P = Monthly investment
    i = Monthly rate of interest = (annual_return_rate / 12) / 100
    n = Total number of months = tenure_years * 12
    """
    P = float(monthly_investment)
    annual_rate = float(annual_return_rate)
    years = float(tenure_years)

    months = int(round(years * 12))
    total_invested = round(P * months, 2)

    if annual_rate <= 0:
        return {
            "monthly_investment": P,
            "annual_return_rate": annual_rate,
            "tenure_years": years,
            "total_invested": total_invested,
            "estimated_returns": 0.0,
            "maturity_value": total_invested,
            "growth_multiple": 1.0,
            "wealth_gain_percentage": 0.0
        }

    monthly_rate = (annual_rate / 100.0) / 12.0
    maturity_value = P * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)
    maturity_value = round(maturity_value, 2)
    estimated_returns = round(maturity_value - total_invested, 2)
    growth_multiple = round(maturity_value / total_invested, 2) if total_invested > 0 else 1.0
    gain_pct = round((estimated_returns / total_invested) * 100, 1) if total_invested > 0 else 0.0

    # Yearly milestone projection
    projections = []
    for y in range(1, int(years) + 1):
        m = y * 12
        inv = round(P * m, 2)
        val = round(P * (((1 + monthly_rate) ** m - 1) / monthly_rate) * (1 + monthly_rate), 2)
        projections.append({
            "year": y,
            "invested": inv,
            "value": val,
            "returns": round(val - inv, 2)
        })

    return {
        "monthly_investment": P,
        "annual_return_rate": annual_rate,
        "tenure_years": years,
        "total_invested": total_invested,
        "estimated_returns": estimated_returns,
        "maturity_value": maturity_value,
        "growth_multiple": growth_multiple,
        "wealth_gain_percentage": gain_pct,
        "projections": projections
    }


def calculate_loan_emi(principal: float, annual_interest_rate: float, tenure_years: float) -> Dict[str, Any]:
    """
    EMI Formula:
    E = P * r * (1 + r)^n / [ (1 + r)^n - 1 ]
    where:
    P = Loan principal
    r = Monthly interest rate = (annual_interest_rate / 12) / 100
    n = Total number of months = tenure_years * 12
    """
    P = float(principal)
    annual_rate = float(annual_interest_rate)
    years = float(tenure_years)
    months = int(round(years * 12))

    if annual_rate <= 0:
        emi = round(P / months, 2) if months > 0 else 0.0
        return {
            "principal": P,
            "annual_interest_rate": 0.0,
            "tenure_years": years,
            "monthly_emi": emi,
            "total_interest": 0.0,
            "total_payment": P,
            "interest_to_principal_ratio": 0.0
        }

    monthly_rate = (annual_rate / 100.0) / 12.0
    numerator = monthly_rate * ((1 + monthly_rate) ** months)
    denominator = ((1 + monthly_rate) ** months) - 1
    monthly_emi = round(P * (numerator / denominator), 2)
    total_payment = round(monthly_emi * months, 2)
    total_interest = round(total_payment - P, 2)
    ratio = round((total_interest / P) * 100, 1) if P > 0 else 0.0

    return {
        "principal": P,
        "annual_interest_rate": annual_rate,
        "tenure_years": years,
        "monthly_emi": monthly_emi,
        "total_interest": total_interest,
        "total_payment": total_payment,
        "interest_to_principal_ratio": ratio
    }


def calculate_compound_interest(principal: float, annual_rate: float, tenure_years: float, frequency: str = "yearly") -> Dict[str, Any]:
    """
    Formula:
    A = P * (1 + r/n)^(n*t)
    where:
    n = compounding frequency per year (1=yearly, 2=half-yearly, 4=quarterly, 12=monthly)
    """
    freq_map = {
        "monthly": 12,
        "quarterly": 4,
        "half-yearly": 2,
        "yearly": 1,
        "annually": 1
    }
    n = freq_map.get(frequency.lower(), 1)
    P = float(principal)
    r = float(annual_rate) / 100.0
    t = float(tenure_years)

    amount = round(P * ((1 + (r / n)) ** (n * t)), 2)
    interest_earned = round(amount - P, 2)

    return {
        "principal": P,
        "annual_rate": annual_rate,
        "tenure_years": t,
        "frequency": frequency,
        "maturity_amount": amount,
        "interest_earned": interest_earned,
        "percentage_gain": round((interest_earned / P) * 100, 2) if P > 0 else 0.0
    }


def calculate_budget_50_30_20(monthly_income: float, needs_pct: float = 50.0, wants_pct: float = 30.0, savings_pct: float = 20.0) -> Dict[str, Any]:
    income = float(monthly_income)
    needs = round(income * (needs_pct / 100.0), 2)
    wants = round(income * (wants_pct / 100.0), 2)
    savings = round(income * (savings_pct / 100.0), 2)

    return {
        "monthly_income": income,
        "needs": {
            "amount": needs,
            "percentage": needs_pct,
            "examples": ["Rent / Mortgage", "Groceries & Food", "Utilities & Bills", "Healthcare", "Minimum Loan Payments"]
        },
        "wants": {
            "amount": wants,
            "percentage": wants_pct,
            "examples": ["Dining Out & Swiggy", "Entertainment & OTT", "Shopping & Fashion", "Travel & Vacations", "Hobbies"]
        },
        "savings": {
            "amount": savings,
            "percentage": savings_pct,
            "examples": ["Emergency Fund", "SIP & Mutual Funds", "PPF & NPS", "Debt Prepayment", "Gold / Sovereign Gold Bonds"]
        }
    }


def calculate_simple_interest(principal: float, annual_rate: float, tenure_years: float) -> Dict[str, Any]:
    P = float(principal)
    R = float(annual_rate)
    T = float(tenure_years)

    interest = round((P * R * T) / 100.0, 2)
    total = round(P + interest, 2)

    return {
        "principal": P,
        "annual_rate": R,
        "tenure_years": T,
        "interest": interest,
        "total_amount": total
    }


def calculate_savings_goal(target_amount: float, current_savings: float, target_months: int) -> Dict[str, Any]:
    target = float(target_amount)
    current = float(current_savings)
    months = max(1, int(target_months))

    remaining = max(0.0, target - current)
    monthly_needed = round(remaining / months, 2)
    progress_pct = round(min(100.0, (current / target) * 100.0), 1) if target > 0 else 100.0

    return {
        "target_amount": target,
        "current_savings": current,
        "remaining_amount": round(remaining, 2),
        "target_months": months,
        "monthly_savings_needed": monthly_needed,
        "progress_percentage": progress_pct
    }
