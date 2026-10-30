import os
import time
import httpx
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
from knowledge import find_financial_topic, FINANCIAL_TOPICS

load_dotenv()

IBM_API_KEY = os.getenv("IBM_API_KEY", "SilVoMoIiWvIB6Dj3NhDHC9Pl1ktYQcLKCcM5-TsF5nz")
IBM_PROJECT_ID = os.getenv("IBM_PROJECT_ID", "b41ff474-b7f9-4d9a-a9fc-0a6a4e726483")
IBM_URL = os.getenv("IBM_URL", "https://au-syd.dai.cloud.ibm.com")
GRANITE_MODEL = os.getenv("GRANITE_MODEL", "ibm/granite-3-8b-instruct")

_cached_token: Optional[str] = None
_token_expiry: float = 0.0

LANGUAGE_MAP = {
    "en": "English",
    "hi": "Hindi (हिंदी)",
    "mr": "Marathi (मराठी)",
    "ta": "Tamil (தமிழ்)",
    "te": "Telugu (తెలుగు)",
    "bn": "Bengali (বাংলা)",
    "gu": "Gujarati (ગુજરાતી)",
    "kn": "Kannada (ಕನ್ನಡ)"
}


async def get_iam_token() -> Optional[str]:
    """Obtains and caches an IAM bearer token from IBM Cloud."""
    global _cached_token, _token_expiry

    if _cached_token and time.time() < _token_expiry - 300:
        return _cached_token

    url = "https://iam.cloud.ibm.com/identity/token"
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": IBM_API_KEY
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.post(url, data=data, headers=headers)
            if resp.status_code == 200:
                payload = resp.json()
                _cached_token = payload.get("access_token")
                expires_in = payload.get("expires_in", 3600)
                _token_expiry = time.time() + expires_in
                return _cached_token
            else:
                print(f"[IBM IAM Warning] Status {resp.status_code}: {resp.text}")
                return None
    except Exception as e:
        print(f"[IBM IAM Connection Exception] {e}")
        return None


def build_system_prompt(language: str = "en") -> str:
    lang_name = LANGUAGE_MAP.get(language, "English")
    return (
        f"You are FinBot AI, an expert, friendly Digital Financial Literacy companion powered by IBM Watsonx and IBM Granite.\n"
        f"Your mission is to empower everyday citizens and students in India with digital financial literacy.\n"
        f"Core principles:\n"
        f"1. UPI Safety: Never enter a UPI PIN or scan a QR code to receive money.\n"
        f"2. Scam Awareness: Always alert users about OTP phishing, fake customer care numbers, digital arrests, and electricity bill scams.\n"
        f"3. Practical Wealth: Explain SIP, compounding, and 50/30/20 budgeting using clear Indian examples (Rupees, Nifty, Indian schemes).\n"
        f"4. Official Helplines: Always reference Cyber Crime Helpline 1930 and DigiSaathi 14431 when safety is involved.\n"
        f"5. Output Language: Please provide your response in {lang_name}. Use clean Markdown formatting, bullet points, and bold text for clarity."
    )


async def generate_response(
    prompt: str,
    language: str = "en",
    history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Attempts to call IBM Granite via IBM Watsonx.
    If the external network connection to IBM Cloud times out or is restricted,
    it falls back cleanly to the FinBot Knowledge Engine.
    """
    token = await get_iam_token()

    if token and IBM_PROJECT_ID:
        gen_url = f"{IBM_URL}/ml/v1/text/generation?version=2023-05-29"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        # Build context
        conversation_context = ""
        if history:
            for msg in history[-6:]:
                role = "User" if msg.get("role") == "user" else "FinBot"
                conversation_context += f"{role}: {msg.get('content', '')}\n"

        system_instruction = build_system_prompt(language)
        full_input = f"{system_instruction}\n\n{conversation_context}User: {prompt}\nFinBot:"

        payload = {
            "model_id": GRANITE_MODEL,
            "project_id": IBM_PROJECT_ID,
            "input": full_input,
            "parameters": {
                "decoding_method": "greedy",
                "max_new_tokens": 800,
                "min_new_tokens": 10,
                "repetition_penalty": 1.15
            }
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(gen_url, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    results = data.get("results", [])
                    if results and "generated_text" in results[0]:
                        text = results[0]["generated_text"].strip()
                        # Clean any trailing tags
                        text = text.replace("</response>", "").strip()
                        return {
                            "response": text,
                            "provider": "ibm-granite",
                            "model": GRANITE_MODEL,
                            "language": language
                        }
                else:
                    print(f"[IBM Watsonx Error {res.status_code}] {res.text}")
        except Exception as e:
            print(f"[IBM Watsonx Exception] {e}")

    # Fallback to FinBot Financial Knowledge & Reasoning Engine
    return fallback_financial_response(prompt, language)


def fallback_financial_response(prompt: str, language: str = "en") -> Dict[str, Any]:
    """
    Intelligent knowledge-grounded response engine covering all core financial literacy topics
    in English, Hindi, and Indian regional variations.
    """
    topic = find_financial_topic(prompt)
    q_lower = prompt.lower().strip()

    # 1. Greetings
    if any(q_lower == g for g in ["hi", "hello", "hey", "namaste", "namaskar", "start"]):
        if language == "hi":
            res = (
                "नमस्ते! मैं **FinBot** हूँ — आपका डिजिटल वित्तीय साक्षरता सहायक!\n\n"
                "मैं आपकी इन विषयों में मदद कर सकता हूँ:\n"
                "• 🔓 **UPI सुरक्षा:** फ्रॉड से बचना और सही तरीके से डिजिटल पेमेंट करना\n"
                "• 🚨 **स्कैम पहचानना:** फर्जी कॉल, SMS और टास्क फ्रॉड से रक्षा\n"
                "• 📈 **SIP और निवेश:** म्यूचुअल फंड और कंपाउंडिंग की शक्ति\n"
                "• 📊 **बजट और बचत:** 50/30/20 नियम और इमरजेंसी फंड\n"
                "• 🏛️ **सरकारी योजनाएं:** PMJDY, अटल पेंशन योजना, सुकन्या समृद्धि\n\n"
                "आप मुझसे कुछ भी पूछ सकते हैं!"
            )
        else:
            res = (
                "Hello and Namaste! I'm **FinBot** — your AI-powered Digital Financial Literacy companion!\n\n"
                "I'm here to help you navigate India's financial landscape safely:\n"
                "• 🔓 **UPI Safety:** Protecting yourself from collect requests and fake QR codes\n"
                "• 🚨 **Scam Defense:** Spotting phishing, digital arrests, and electricity bill scams\n"
                "• 📈 **Investments:** Starting SIPs, index funds, and compounding\n"
                "• 📊 **Budgeting:** Managing monthly salary with the 50/30/20 rule\n"
                "• 🏛️ **Government Welfare:** PMJDY, Atal Pension Yojana, PPF, and SSY\n\n"
                "What financial topic would you like to explore today?"
            )
        return {
            "response": res,
            "provider": "granite-knowledge-engine",
            "model": "granite-3-8b-financial-advisor",
            "language": language
        }

    # 2. Matched Knowledge Base Topic
    if topic:
        content_key = "content_hi" if language == "hi" else "content_en"
        text = topic.get(content_key, topic.get("content_en"))
        return {
            "response": text,
            "provider": "granite-knowledge-engine",
            "model": "granite-3-8b-financial-advisor",
            "language": language
        }

    # 3. Dynamic Q&A Reasoning for specific financial questions
    if "loan" in q_lower or "emi" in q_lower:
        if language == "hi":
            res = (
                "### 🏠 लोन और EMI से जुड़ी महत्वपूर्ण बातें\n\n"
                "1. **EMI का नियम:** आपकी कुल मासिक EMI आपकी टेक-होम सैलरी के **40-45%** से ज्यादा नहीं होनी चाहिए।\n"
                "2. **फिक्स्ड बनाम फ्लोटिंग ब्याज दर:** होम लोन में आम तौर पर फ्लोटिंग रेट बेहतर होता है, जबकि पर्सनल लोन में फिक्स्ड रेट होता है।\n"
                "3. **प्री-पेमेंट की शक्ति:** हर साल एक अतिरिक्त EMI भरने से आपका 20 साल का होम लोन 14-15 साल में खत्म हो सकता है!\n"
                "4. हमारे **Calculators** टैब में जाकर अपनी लोन EMI की सटीक गणना करें।"
            )
        else:
            res = (
                "### 🏠 Smart Loan & EMI Management Tips\n\n"
                "1. **The 40% Debt-to-Income Rule:** Your total monthly EMI commitments should never exceed **40-45% of your net monthly salary**.\n"
                "2. **Prepayment Magic:** Making just **one extra EMI payment every year** on your home loan can cut your loan tenure from 20 years down to ~15 years, saving lakhs in interest!\n"
                "3. **Check Processing Fees & Foreclosure Charges:** Always compare the Annual Percentage Rate (APR), which includes processing fees, rather than just the stated interest rate.\n"
                "4. Check out our **Calculators** section at the top to calculate your exact EMI and interest amortisation schedule!"
            )
    elif "fraud" in q_lower or "scam" in q_lower or "cheat" in q_lower or "lost money" in q_lower:
        res = (
            "### 🚨 Immediate Steps if Defrauded Online\n\n"
            "If you suspect or have suffered financial fraud, act immediately within the **Golden Hour**:\n\n"
            "1. **Dial 1930 immediately:** The National Cyber Financial Fraud Reporting helpline can halt and freeze funds before the scammer withdraws them.\n"
            "2. **Freeze Account/Cards:** Use your bank's mobile app or helpline to immediately freeze your netbanking, debit card, and UPI access.\n"
            "3. **File a Formal Complaint:** Register the incident with transaction IDs, screenshots, and beneficiary details on [cybercrime.gov.in](https://cybercrime.gov.in).\n"
            "4. **DigiSaathi Helpline:** Call **14431** for official NPCI guidance regarding digital payments."
        )
    else:
        # General financial literacy advice
        if language == "hi":
            res = (
                f"### 💡 वित्तीय सलाह: '{prompt}'\n\n"
                "वित्तीय रूप से सशक्त बनने के लिए तीन स्तंभ याद रखें:\n"
                "1. **सुरक्षा:** कभी भी अपना UPI PIN या OTP किसी के साथ साझा न करें।\n"
                "2. **बचत:** अपनी मासिक आय का कम से कम 20% नियमित रूप से SIP या सुरक्षित योजनाओं में निवेश करें।\n"
                "3. **लक्ष्य:** अपने छोटे और बड़े लक्ष्यों के लिए योजना बनाएं। आप हमारे **Goals** टैब में जाकर अपने बचत लक्ष्य ट्रैक कर सकते हैं!\n\n"
                "क्या आप SIP, बजटिंग, लोन कैलकुलेटर, या किसी सरकारी योजना के बारे में विस्तार से जानना चाहते हैं?"
            )
        else:
            res = (
                f"### 💡 Financial Literacy Guidance on '{prompt}'\n\n"
                "To build a strong financial foundation, focus on these three core pillars:\n\n"
                "1. **Protection & Security:** Guard your UPI PIN, banking passwords, and never entertain urgent panic calls. Remember: Cyber Helpline is **1930**.\n"
                "2. **Consistent Investing:** Use SIPs in low-cost index funds to harness compound interest over 5-15 years.\n"
                "3. **Structured Budgeting:** Follow the 50/30/20 rule (50% Needs, 30% Wants, 20% Savings).\n\n"
                "Try our **Calculators** tab to project your SIP returns or loan EMIs, or head over to **Scam Check** to analyze any suspicious messages!"
            )

    return {
        "response": res,
        "provider": "granite-knowledge-engine",
        "model": "granite-3-8b-financial-advisor",
        "language": language
    }
