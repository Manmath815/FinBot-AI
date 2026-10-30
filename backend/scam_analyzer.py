import re
from typing import Dict, Any, List


def analyze_scam_message(text: str, category: str = "general") -> Dict[str, Any]:
    text_clean = text.strip()
    text_lower = text_clean.lower()

    red_flags: List[Dict[str, str]] = []
    risk_score = 0

    # 1. UPI PIN / Collect Request scam pattern (The #1 UPI Scam in India)
    if any(k in text_lower for k in [
        "enter upi pin to receive", "enter pin to get", "pin to receive payment",
        "upi pin dalen paise pane", "pin dale paise credit", "scan qr to receive", "qr code to receive money",
        "accept request to receive"
    ]) or ("pin" in text_lower and ("receive" in text_lower or "credit" in text_lower or "cashback" in text_lower)):
        risk_score += 45
        red_flags.append({
            "title": "UPI PIN entered to RECEIVE money (CRITICAL)",
            "explanation": "NPCI Golden Rule: You NEVER enter your UPI PIN to receive money. UPI PIN is only needed to SEND or DEDUCT money from your account. If someone asks for a PIN or asks you to approve a request to get money, it is a 100% scam."
        })

    # 2. OTP / CVV / Password Phishing
    if any(k in text_lower for k in ["otp", "one time password", "cvv", "atm pin", "netbanking password", "card expiry", "share code"]):
        if any(v in text_lower for v in ["share", "send", "verify", "update", "confirm", "forward", "tell", "batao", "bhejo"]):
            risk_score += 40
            red_flags.append({
                "title": "Demand for OTP or Banking Credentials",
                "explanation": "Banks, RBI, and digital payment platforms will NEVER ask for your OTP, CVV, or passwords over call, SMS, or WhatsApp. Sharing OTP grants attackers access to your funds."
            })

    # 3. Urgency / Panic Induction
    urgent_keywords = [
        "account blocked", "account will be blocked", "suspended within 24 hours", "debit card blocked",
        "electricity will be disconnected", "electricity power will be disconnected", "electricity disconnected",
        "power cut", "power will be cut", "bill was not updated", "previous month bill", "urgent action required",
        "kyc expired", "sim will be blocked", "pan card update mandatory", "immediate action",
        "last day to verify", "legal action", "police warrant", "digital arrest"
    ]
    matched_urgency = [k for k in urgent_keywords if k in text_lower]
    if matched_urgency:
        risk_score += 35
        red_flags.append({
            "title": f"High Panic/Urgency Trigger ('{matched_urgency[0]}')",
            "explanation": "Fraudsters create artificial urgency to panic you so you act before thinking rationally. Genuine banks and utility companies give official written notices with days to comply."
        })

    # 4. Dangerous APKs and Remote Desktop Apps
    if any(k in text_lower for k in ["anydesk", "quicksupport", "teamviewer", "rustdesk", ".apk", "download app from link", "install support app"]):
        risk_score += 40
        red_flags.append({
            "title": "Remote Desktop or APK Download Request",
            "explanation": "Scammers ask victims to install apps like AnyDesk, QuickSupport, or malicious APK files. These allow fraudsters to mirror your screen and capture your banking passwords in real-time."
        })

    # 5. Work From Home / Telegram Task Scams
    if any(k in text_lower for k in [
        "like youtube videos", "earn 3000 daily", "part time job", "earn from home",
        "telegram task", "hotel review earn money", "crypto investment guaranteed",
        "double your money", "200% return", "guaranteed profit"
    ]):
        risk_score += 45
        red_flags.append({
            "title": "Task / Guaranteed High-Return Fraud",
            "explanation": "Classic 'Task-based Scam': starts by paying Rs 150-500 for small likes or reviews, then tricks victims into 'prepaid investment tasks' on Telegram where they lose lakhs."
        })

    # 6. Lottery / KBC / Prize / Free Gift Fraud
    if any(k in text_lower for k in ["kbc lottery", "won 25 lakh", "lottery prize", "lucky draw", "claim prize", "free gift voucher", "reward points expire"]):
        risk_score += 45
        red_flags.append({
            "title": "Unsolicited Prize / Lottery Claim",
            "explanation": "You cannot win a lottery or prize you never officially entered. Any request demanding processing fee, GST, or bank details to release prize money is fraudulent."
        })

    # 7. Unofficial Links / Shortened URLs
    url_pattern = re.compile(r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[^\s]*')
    urls = url_pattern.findall(text)
    if urls:
        suspicious_domains = [u for u in urls if any(d in u.lower() for d in [
            "bit.ly", "tinyurl", "ngrok", "xyz", "top", "icu", "click", "apk", "free", "claim", "sbi-", "hdfc-", "rbi-"
        ])]
        if suspicious_domains:
            risk_score += 35
            red_flags.append({
                "title": "Suspicious / Spoofed Domain Link",
                "explanation": f"The link '{suspicious_domains[0]}' does not belong to verified banking or government portals. Genuine Indian banks always use their verified official domains (e.g., onlinesbi.sbi, hdfcbank.com)."
            })
        else:
            risk_score += 20

    # 8. Unofficial phone numbers for customer care
    if any(k in text_lower for k in ["call this number", "call officer", "call our officer", "contact officer", "contact our power officer", "dial immediately", "helpline number:", "contact", "call"]):
        phone_matches = re.findall(r'\b(?:\+91|0)?[6-9]\d{9}\b', text)
        if phone_matches and not any(p in text for p in ["1930", "14431", "1800"]):
            risk_score += 35
            red_flags.append({
                "title": "Personal Mobile Number Posing as Official Helpline",
                "explanation": f"Official utilities and banks never use personal 10-digit mobile numbers ({phone_matches[0]}) as official customer support hotlines."
            })

    # Cap risk score
    risk_score = min(100, risk_score)

    # Determine risk level
    if risk_score >= 65:
        risk_level = "CRITICAL"
        verdict = "⚠️ DANGER: HIGH PROBABILITY FINANCIAL SCAM"
        color = "red"
    elif risk_score >= 40:
        risk_level = "HIGH"
        verdict = "🚨 SUSPICIOUS: LIKELY FRAUDULENT ATTEMPT"
        color = "orange"
    elif risk_score >= 20:
        risk_level = "MODERATE"
        verdict = "⚠️ CAUTION: UNVERIFIED OR POTENTIALLY UNSAFE MESSAGE"
        color = "yellow"
    else:
        risk_level = "SAFE"
        verdict = "✅ LOW RISK: NO COMMON SCAM PATTERNS DETECTED"
        color = "green"

    safe_actions = [
        "DO NOT enter your UPI PIN or approve any payment request on Google Pay / PhonePe / Paytm.",
        "DO NOT share OTP, CVV, netbanking passwords, or ATM PIN with anyone under any circumstances.",
        "DO NOT install remote screen-sharing apps (AnyDesk, QuickSupport, TeamViewer) or download .apk files.",
        "Immediately report cyber financial fraud to National Cyber Crime Helpline: 1930 or DigiSaathi: 14431.",
        "Report and block the sender in your SMS / WhatsApp / Email client.",
        "If money was deducted, immediately contact your bank to freeze the account/card and file a complaint at cybercrime.gov.in."
    ]

    return {
        "text": text_clean,
        "category": category,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "verdict": verdict,
        "color": color,
        "red_flags": red_flags,
        "safe_actions": safe_actions,
        "official_contacts": {
            "cyber_crime_helpline": "1930",
            "digisaathi_helpline": "14431",
            "cyber_crime_portal": "https://cybercrime.gov.in",
            "rbi_sachet_portal": "https://sachet.rbi.org.in"
        }
    }
