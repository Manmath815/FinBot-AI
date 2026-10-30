# FinBot AI Financial Knowledge & Reasoning Engine
from typing import Dict, Any, List

FINANCIAL_TOPICS = {
    "upi_safety": {
        "title": "UPI Safety Tips",
        "keywords": ["upi", "safety", "payment", "qr", "qr code", "bhim", "phonepe", "gpay", "paytm", "pin"],
        "content_en": """### 🛡️ Essential UPI & Digital Payment Safety Guidelines

UPI (Unified Payments Interface) is India's most popular instant payment system. Follow these golden rules to protect your money:

1. **The Golden Rule: NEVER enter UPI PIN to RECEIVE money**
   - UPI PIN is required **ONLY** when money leaves your bank account.
   - If someone sends you a payment request, cashback link, or QR code claiming you will receive money after typing your PIN, **it is a 100% scam!**

2. **Verify Beneficiary Name Before Paying**
   - Always verify the receiver's verified registered name on the UPI app before confirming payment.

3. **Beware of Fake QR Codes**
   - Do not scan QR codes sent via WhatsApp, OLX, Facebook Marketplace, or SMS to receive money.
   - Scanning a QR code only authorizes a debit from your account.

4. **Set Transaction Limits**
   - Use your bank's mobile app or UPI app settings to set daily transaction limits (e.g., ₹5,000 or ₹10,000) for daily safety.

5. **Helpline in Case of Fraud**
   - Immediately report unauthorized UPI transactions to **DigiSaathi Helpline: 14431** or National Cyber Crime Helpline: **1930**.""",
        "content_hi": """### 🛡️ UPI और डिजिटल पेमेंट सुरक्षा के महत्वपूर्ण नियम

UPI पेमेंट बहुत आसान और सुरक्षित है, बशर्ते आप इन ज़रूरी बातों का ध्यान रखें:

1. **सुनहरा नियम: पैसे प्राप्त करने के लिए कभी UPI PIN दर्ज न करें**
   - UPI PIN केवल तभी डालना होता है जब आपके खाते से **पैसे कटने** हों।
   - यदि कोई व्यक्ति कहे कि "रुपये पाने के लिए PIN डालें" या "कैशबैक क्लेम करने के लिए PIN एंटर करें", तो यह **100% फ्रॉड है**!

2. **भुगतान से पहले नाम जांचें**
   - पेमेंट भेजने से पहले स्क्रीन पर दिखने वाले रजिस्टर्ड नाम को ध्यान से पढ़ें।

3. **अनजान QR कोड स्कैन न करें**
   - OLX, Quikr या WhatsApp पर मिले QR कोड को पैसे लेने के लिए कभी स्कैन न करें।

4. **फर्जी पेमेंट रिक्वेस्ट से बचें**
   - यदि आपके Google Pay, PhonePe या Paytm पर कोई अचानक 'Collect Request' आए, तो उसे तुरंत Decline करें।

5. **धोखाधड़ी होने पर क्या करें?**
   - तुरंत **1930 (साइबर क्राइम हेल्पलाइन)** या **14431 (डिजीसाथी)** पर कॉल करें और बैंक को सूचित करें।"""
    },

    "avoid_scams": {
        "title": "Avoid Financial Scams",
        "keywords": ["scam", "fraud", "phishing", "fake", "avoid", "lottery", "electricity", "kyc", "cybercrime"],
        "content_en": """### 🚨 Common Financial Scams in India & How to Avoid Them

Stay alert against these widespread fraud tactics:

1. **Electricity Bill Disconnection Scam**
   - *Tactic:* "Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer at 98xxxxxx."
   - *Truth:* Discoms never disconnect without legal notices or via personal mobile numbers. Never call the number in the SMS.

2. **Bank KYC Expiry / Account Blocked Fraud**
   - *Tactic:* "Your SBI / HDFC account is blocked due to pending KYC. Click link to update PAN."
   - *Truth:* Banks never send APK download links or ask for credentials via SMS. Visit your branch or official netbanking.

3. **Part-time Job / YouTube Like Scam**
   - *Tactic:* Scammers offer ₹150 for liking videos, then lure you into Telegram VIP groups asking for ₹10,000 to ₹5,00,000 "crypto investment".
   - *Truth:* There is no legitimate job requiring you to deposit money to withdraw earned income.

4. **Digital Arrest Scam**
   - *Tactic:* Callers pose as CBI, ED, Police, or Customs claiming an illegal parcel was found in your name and place you on "Skype arrest".
   - *Truth:* Indian law enforcement agencies NEVER conduct arrests or demand money via video call.

5. **Immediate Actions if Defrauded:**
   - Call **1930** within the golden hour (first 2 hours).
   - Lodge complaint at **cybercrime.gov.in**.""",
        "content_hi": """### 🚨 भारत में होने वाले मुख्य वित्तीय फ्रॉड और उनसे बचाव

1. **बिजली बिल कटने का फर्जी SMS:**
   - "आपका बिजली कनेक्शन आज रात कट जाएगा..." ऐसे मैसेज पर दिए नंबर पर कभी कॉल न करें। यह जालसाजों का नंबर होता है।

2. **बैंक KYC अपडेट और सिम ब्लॉक स्कैम:**
   - बैंक कभी भी SMS में लिंक भेजकर पैन कार्ड या पासवर्ड अपडेट करने को नहीं कहते। किसी भी लिंक पर क्लिक न करें।

3. **पार्ट-टाइम जॉब / यूट्यूब लाइक फ्रॉड:**
   - टेलीग्राम पर वीडियो लाइक करके रोज़ाना ₹3000 कमाने का लालच देकर लाखों रुपये ठग लिए जाते हैं। कभी ऐसे काम के लिए पैसे न लगाएं।

4. **डिजिटल अरेस्ट फ्रॉड:**
   - सीबीआई, पुलिस या कस्टम्स अधिकारी बनकर वीडियो कॉल पर डराना और पैसे ट्रांसफर करवाना पूरी तरह फर्जी है।

5. **शिकायत कहाँ करें?**
   - तुरंत साइबर क्राइम हेल्पलाइन **1930** पर कॉल करें और **cybercrime.gov.in** पर रिपोर्ट दर्ज करें।"""
    },

    "start_sip": {
        "title": "Start SIP (Systematic Investment Plan)",
        "keywords": ["sip", "mutual fund", "invest", "investment", "shares", "equity", "nav", "compound"],
        "content_en": """### 📈 How to Start a SIP (Systematic Investment Plan)

A Systematic Investment Plan (SIP) allows you to invest small fixed amounts (as low as ₹500/month) regularly into Mutual Funds.

#### Why SIP is Powerful:
1. **Rupee Cost Averaging:** You buy more mutual fund units when markets drop and fewer when markets rise, eliminating market timing stress.
2. **Power of Compounding:** Reinvested earnings generate exponential long-term wealth.
3. **Disciplined Savings:** Automated monthly deduction on salary day builds financial resilience.

#### Step-by-Step Guide to Start:
1. **Complete e-KYC:** All you need is PAN Card, Aadhaar (linked to mobile OTP), and a Bank Account.
2. **Choose the Right Fund Category:**
   - *Beginners:* Nifty 50 Index Funds (low expense ratio, tracks top 50 Indian companies).
   - *Moderate Risk:* Large & Mid Cap Funds or Flexi Cap Funds.
   - *Tax Savings:* ELSS (Equity Linked Savings Scheme) under Section 80C (3-year lock-in).
3. **Use Direct Growth Plans:** Always choose "Direct - Growth" option instead of "Regular" to save 1% to 1.5% in distributor commissions every year!
4. **Calculated Example:**
   - Monthly SIP: ₹5,000
   - Expected Return: 12% p.a.
   - Tenure: 15 Years
   - Total Invested: ₹9,00,000 | **Expected Maturity: ₹25,22,880** (Gain: ₹16,22,880!)""",
        "content_hi": """### 📈 SIP (सिस्टमैटिक इन्वेस्टमेंट प्लान) कैसे शुरू करें?

SIP के जरिए आप हर महीने छोटी रकम (जैसे ₹500 या ₹1,000) म्यूचुअल फंड में निवेश करके लंबी अवधि में बड़ा फंड बना सकते हैं।

#### SIP के मुख्य फायदे:
1. **कंपाउंडिंग की ताकत:** ब्याज पर ब्याज मिलने से आपका पैसा तेजी से बढ़ता है।
2. **रुपये की औसत लागत (Rupee Cost Averaging):** बाज़ार में गिरावट के समय आपको अधिक यूनिट्स मिलती हैं, जिससे रिस्क घटता है।
3. **कम राशि से शुरुआत:** आपको एक साथ बड़ी रकम की जरूरत नहीं होती।

#### शुरुआत कैसे करें?
1. **KYC पूरा करें:** पैन कार्ड, आधार और बैंक खाता चाहिए।
2. **सही फंड चुनें:** नए निवेशकों के लिए **निफ्टी 50 इंडेक्स फंड** सबसे सुरक्षित और बेहतर विकल्प है।
3. **'Direct Plan' चुनें:** 'Regular' के बजाय हमेशा **Direct - Growth** प्लान चुनें ताकि कमीशन के पैसे बच सकें।

**उदाहरण:** अगर आप 15 साल तक ₹5,000 प्रति माह 12% रिटर्न पर निवेश करते हैं:
- आपकी कुल जमा राशि: ₹9,00,000
- 15 साल बाद अनुमानित वैल्यू: **₹25.22 लाख**!"""
    },

    "compound_interest": {
        "title": "The Power of Compound Interest",
        "keywords": ["compound", "interest", "compounding", "einstein", "returns", "cagr", "wealth"],
        "content_en": """### 💰 The Magic of Compound Interest

Albert Einstein famously called compound interest the *"8th wonder of the world: he who understands it, earns it; he who doesn't, pays it."*

#### How It Works:
Unlike Simple Interest (where interest is calculated only on the initial principal), Compound Interest calculates interest on both **Principal + Accumulated Interest**.

$$A = P \\left(1 + \\frac{r}{n}\\right)^{nt}$$

#### The Rule of 72:
Divide 72 by your annual interest rate to find out roughly how many years it takes to **double** your money!
- Fixed Deposit at 7%: $72 / 7 \\approx 10.2$ years
- Mutual Funds at 12%: $72 / 12 = 6$ years!
- High-risk equity at 15%: $72 / 15 = 4.8$ years!

#### Why Starting Early Matters:
- **Person A** starts investing ₹5,000/month at age 22 for 10 years, then stops.
- **Person B** starts investing ₹5,000/month at age 32 for 25 years.
- By age 60, Person A still ends up with more wealth due to an extra decade of compounding!""",
        "content_hi": """### 💰 चक्रवृद्धि ब्याज (कंपाउंड इंटरेस्ट) का जादू

कंपाउंडिंग का सीधा मतलब है: **"पैसे पर मिलने वाले ब्याज पर भी ब्याज मिलना"**।

#### 72 का नियम (Rule of 72):
यह जानने के लिए कि आपका पैसा कितने साल में दोगुना होगा, 72 को अपने सालाना ब्याज दर से भाग दें:
- 7% बैंक एफडी में: $72 / 7 = 10.2$ साल में पैसा दोगुना।
- 12% म्यूचुअल फंड में: $72 / 12 = 6$ साल में पैसा दोगुना!

#### जल्दी शुरुआत करने का फायदा:
जितना जल्दी आप निवेश शुरू करेंगे, कंपाउंडिंग उतना ही बड़ा चमत्कार दिखाएगी। 20-25 की उम्र में शुरू की गई ₹2000 की SIP भी 50 साल की उम्र में करोड़ों का फंड बन सकती है!"""
    },

    "budget_50_30_20": {
        "title": "50/30/20 Budgeting Rule",
        "keywords": ["50/30/20", "budget", "budgeting", "expenses", "spending", "savings", "income", "salary"],
        "content_en": """### 📊 The 50/30/20 Budgeting Rule

Popularized by financial experts, the 50/30/20 framework is the most straightforward, stress-free way to manage your monthly in-hand salary:

```
Total In-Hand Monthly Income (100%)
├── 50% Needs (Non-negotiable survival expenses)
├── 30% Wants (Lifestyle & entertainment)
└── 20% Savings & Debt Repayment (Your future self)
```

1. **50% for Needs:**
   - House rent / EMI, groceries, electricity, water, LPG, essential transport/fuel, health insurance premiums, school fees.

2. **30% for Wants:**
   - Dining out, Zomato/Swiggy orders, weekend movies, Netflix/Prime subscriptions, shopping, vacations, hobbies.

3. **20% for Savings & Investments:**
   - Emergency fund contributions, monthly SIP in equity funds, PPF, NPS, or extra prepayments toward high-interest loans.

*Pro-Tip for Indian Metro Cities:* If your rent is high, adapt it to **60/20/20** until your income increases!""",
        "content_hi": """### 📊 50/30/20 बजट नियम — अपनी सैलरी कैसे मैनेज करें?

यह दुनिया का सबसे लोकप्रिय और आसान बजटिंग फॉर्मूला है:

1. **50% जरूरतें (Needs):**
   - मकान का किराया, राशन, बिजली-पानी का बिल, जरूरी दवाईयाँ और स्कूल फीस।

2. **30% इच्छाएं और शौक (Wants):**
   - रेस्टोरेंट में खाना, मूवी, नेटफ्लिक्स, नए कपड़े और घूमने-फिरने का खर्च।

3. **20% बचत और निवेश (Savings):**
   - इमरजेंसी फंड, म्यूचुअल फंड में SIP, पीपीएफ और भविष्य के लिए बचत।

**सुनहरा नियम:** "खर्च करने के बाद जो बचे उसे न बचाएं, बल्कि बचत करने के बाद जो बचे उसे खर्च करें!" — वॉरेन बफे"""
    },

    "govt_schemes": {
        "title": "Government Financial Schemes",
        "keywords": ["scheme", "govt", "government", "pmjdy", "apy", "pmjjby", "pmsby", "sukanya", "ppf"],
        "content_en": """### 🏛️ Top Government Financial Schemes in India

The Government of India offers excellent, highly secure welfare schemes for savings, insurance, and retirement:

1. **PM Jan Dhan Yojana (PMJDY):**
   - Zero-balance savings account.
   - Free RuPay debit card with ₹2 Lakh accidental insurance cover.
   - ₹10,000 overdraft facility.

2. **PM Suraksha Bima Yojana (PMSBY):**
   - Accidental death & full disability cover of **₹2 Lakh for just ₹20/year!**
   - Age group: 18 to 70 years.

3. **PM Jeevan Jyoti Bima Yojana (PMJJBY):**
   - Life insurance cover of **₹2 Lakh for just ₹436/year** for any cause of death.
   - Age group: 18 to 50 years.

4. **Atal Pension Yojana (APY):**
   - Guaranteed monthly pension of ₹1,000 to ₹5,000 after age 60.
   - Open to all Indian citizens aged 18 to 40.

5. **Sukanya Samriddhi Yojana (SSY):**
   - For girl children below age 10.
   - High government interest rate (currently 8.2% p.a.) with complete EEE (Exempt-Exempt-Exempt) tax exemption under Section 80C.

6. **Public Provident Fund (PPF):**
   - 15-year tenure with guaranteed sovereign backing and tax-free interest (currently 7.1% p.a.).""",
        "content_hi": """### 🏛️ भारत सरकार की प्रमुख बचत व सुरक्षा योजनाएं

1. **प्रधानमंत्री जन धन योजना (PMJDY):**
   - ज़ीरो बैलेंस खाता + ₹2 लाख का मुफ्त दुर्घटना बीमा (RuPay कार्ड के साथ)।

2. **प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY):**
   - सिर्फ **₹20 प्रति वर्ष** में ₹2 लाख का दुर्घटना बीमा कवर! (उम्र: 18-70 वर्ष)।

3. **प्रधानमंत्री जीवन ज्योति बीमा योजना (PMJJBY):**
   - सिर्फ **₹436 प्रति वर्ष** में ₹2 लाख का जीवन बीमा कवर (उम्र: 18-50 वर्ष)।

4. **अटल पेंशन योजना (APY):**
   - 60 साल की उम्र के बाद हर महीने ₹1,000 से ₹5,000 की गारंटीड सरकारी पेंशन।

5. **सुकन्या समृद्धि योजना (SSY):**
   - 10 वर्ष से कम उम्र की बेटियों के लिए 8.2% ब्याज दर और पूरी तरह टैक्स-फ्री बचत।"""
    },

    "cibil_score": {
        "title": "CIBIL Score & Credit Health",
        "keywords": ["cibil", "credit", "score", "loan", "bureau", "experian", "crif", "equifax"],
        "content_en": """### ⭐ Understanding Your CIBIL / Credit Score

Your CIBIL score is a 3-digit numeric summary of your credit history, ranging from **300 to 900**.

#### Score Breakdown:
- **750 to 900 (Excellent):** Instant loan approvals, lowest interest rates, high credit card limits.
- **700 to 749 (Good):** Generally approved by most banks.
- **650 to 699 (Fair):** May face higher interest rates or strict conditions.
- **Below 650 (Poor):** High risk of loan rejection.

#### Top 5 Ways to Increase Your CIBIL Score to 750+:
1. **Pay 100% On Time:** Never miss an EMI or Credit Card due date. Payment history accounts for 35% of your score.
2. **Keep Credit Utilization Ratio (CUR) below 30%:** If your credit card limit is ₹1,00,000, keep total spend under ₹30,000 before the bill generates.
3. **Avoid Multiple Loan Enquiries:** Applying for 5 credit cards in one week triggers "hard enquiries" that damage your score.
4. **Maintain a Healthy Credit Mix:** A combination of secured loans (home/car) and unsecured loans (credit card/personal) shows disciplined borrowing.
5. **Check Your Credit Report Annually for Errors:** You are entitled to 1 FREE credit report per bureau every year under RBI mandates.""",
        "content_hi": """### ⭐ सिबिल स्कोर (CIBIL Score) क्या है और इसे 750+ कैसे बनाएं?

सिबिल स्कोर 300 से 900 के बीच का 3 अंकों का नंबर होता है, जो यह बताता है कि आपका लोन चुकाने का रिकॉर्ड कैसा है।

- **750 से ऊपर:** बहुत बेहतरीन! बैंक आपको सबसे कम ब्याज दर पर तुरंत लोन देते हैं।
- **700 से कम:** लोन मिलने में कठिनाई और अधिक ब्याज दर।

#### सिबिल स्कोर सुधारने के 5 आसान तरीके:
1. **क्रेडिट कार्ड और लोन की EMI समय पर भरें** (कभी भी लेट पेमेंट न करें)।
2. **क्रेडिट लिमिट का सिर्फ 30% इस्तेमाल करें** (अगर लिमिट ₹50,000 है तो ₹15,000 से ज्यादा खर्च न करें)।
3. **बार-बार कई बैंकों में लोन के लिए अप्लाई न करें**।
4. **पुराने क्रेडिट कार्ड बंद न करें** (लंबे क्रेडिट इतिहास से स्कोर मजबूत होता है)।”"""
    },

    "upi_pin_vs_otp": {
        "title": "UPI PIN vs OTP — What is the Difference?",
        "keywords": ["pin", "otp", "difference", "upi pin vs otp", "password", "security"],
        "content_en": """### ❓ UPI PIN vs OTP: Know the Critical Difference!

Many financial scams happen because users confuse when to use a UPI PIN vs an OTP.

| Feature | UPI PIN | OTP (One-Time Password) |
|---|---|---|
| **What is it?** | 4 or 6 digit secret passcode you created | 6 digit temporary code sent to mobile via SMS |
| **When is it used?** | To **SEND money** or authorize a debit | To **VERIFY identity** during login or online card shopping |
| **Validity** | Permanent (until you choose to change it) | Single-use, expires in 2–10 minutes |
| **Who knows it?** | Only YOU. Never shared with anyone | Generated automatically by the bank's server |
| **Golden Rule** | **NEVER entered to receive money!** | **NEVER shared with callers or typed into links!** |

> 🚨 **Crucial Warning:**
> If anyone sends you a link and asks you to enter your UPI PIN or tell them an OTP to receive a refund, cashback, or prize money — **STOP! You are being scammed.**""",
        "content_hi": """### ❓ UPI PIN और OTP में क्या अंतर है?

बहुत से लोग इन दोनों में भ्रमित होकर साइबर धोखाधड़ी का शिकार हो जाते हैं। इसे ठीक से समझें:

| विशेषता | UPI PIN | OTP (One-Time Password) |
|---|---|---|
| **क्या है?** | आपका खुद का बनाया हुआ 4 या 6 अंकों का गुप्त पासवर्ड | बैंक द्वारा SMS पर भेजा गया 6 अंकों का अस्थायी कोड |
| **कब इस्तेमाल होता है?** | जब आप किसी को **पैसे भेजते** हैं | अकाउंट लॉगिन या कार्ड वेरिफिकेशन के लिए |
| **वैधता** | हमेशा के लिए (जब तक आप न बदलें) | सिर्फ 2-5 मिनट के लिए |
| **किसे पता होता है?** | केवल आपको | बैंक सिस्टम को |
| **सुरक्षा नियम** | **पैसे लेने के लिए PIN की जरूरत नहीं होती!** | **OTP कभी किसी को फोन पर न बताएं!** |"""
    },

    "emergency_fund": {
        "title": "Emergency Fund Planning",
        "keywords": ["emergency", "fund", "contingency", "savings", "safety net", "job loss", "medical"],
        "content_en": """### 🛡️ Building an Unshakable Emergency Fund

An Emergency Fund is a financial safety net strictly reserved for life's unexpected crises: medical emergencies, sudden job loss, urgent car repairs, or family emergencies.

#### How Much Do You Need?
- **Salaried with stable job:** 3 to 6 months of mandatory living expenses (Rent + EMIs + Food + Utilities).
- **Freelancers / Business owners:** 6 to 12 months of expenses.

#### Example Calculation:
If your monthly mandatory expenses are ₹35,000:
- Minimum Emergency Fund (3 months) = ₹1,05,000
- Recommended Emergency Fund (6 months) = ₹2,10,000

#### Where to Park Your Emergency Fund:
- **Don't invest in Equity/Stocks:** Stocks can be down 20% right when you need the cash!
- **Ideal Split:**
  - 20% in your primary Savings Bank account for instant ATM / UPI withdrawal.
  - 80% in High-Interest Sweep-in Fixed Deposits (FDs) or Liquid Mutual Funds (instant redemption with T+1 settlement and zero penalty).""",
        "content_hi": """### 🛡️ इमरजेंसी फंड (आपातकालीन कोष) कैसे बनाएं?

इमरजेंसी फंड वह पैसा है जिसे आप सिर्फ अप्रत्याशित संकटों (जैसे नौकरी छूटना, मेडिकल इमरजेंसी या बीमारी) के लिए अलग रखते हैं।

#### कितना फंड जरूरी है?
- कम से कम **3 से 6 महीने के जरूरी मासिक खर्चों** (किराया, राशन, EMI, बिल) के बराबर।
- अगर आपका महीने का अनिवार्य खर्च ₹30,000 है, तो आपका इमरजेंसी फंड कम से कम **₹1,80,000** होना चाहिए।

#### इसे कहाँ रखें?
- इसे शेयर बाज़ार या जोखिम भरे निवेश में कभी न लगाएं।
- 20% सेविंग्स अकाउंट में रखें और 80% बैंक की 'स्वीप-इन FD' या लिक्विड म्यूचुअल फंड में रखें ताकि जरूरत पड़ने पर तुरंत निकाला जा सके।"""
    },

    "tax_basics": {
        "title": "Income Tax Basics in India (Old vs New Regime)",
        "keywords": ["tax", "income tax", "regime", "80c", "87a", "rebate", "slab", "tds", "itr"],
        "content_en": """### 📋 Income Tax Basics in India (Simplified)

Understanding income tax helps you retain more of your hard-earned salary legally.

#### 1. Old Regime vs New Regime:
- **New Tax Regime (Default):**
  - Lower, simplified tax slabs.
  - Zero tax on income up to **₹7,00,000** (with Section 87A rebate) plus standard deduction of ₹75,000 (total ₹7.75 Lakh effectively tax-free for salaried individuals).
  - No need to submit investment proofs like HRA, LTA, or 80C.
- **Old Tax Regime:**
  - Beneficial if you have high deductions: Section 80C (up to ₹1.5L for ELSS/PPF/EPF), 80D (Health Insurance up to ₹25k-₹50k), HRA (House Rent Allowance), and Home Loan Interest under Section 24b (up to ₹2L).

#### 2. Essential Tax-Saving Avenues:
- **ELSS Mutual Funds:** Equity Linked Savings Scheme with shortest lock-in (3 years) and high growth potential under Section 80C.
- **PPF (Public Provident Fund):** 15-year risk-free EEE tax-saving avenue.
- **NPS (National Pension System):** Additional ₹50,000 deduction under Section 80CCD(1B) beyond the ₹1.5L 80C limit!""",
        "content_hi": """### 📋 भारत में इनकम टैक्स की बुनियादी बातें (सरल भाषा में)

#### न्यू टैक्स रिजीम बनाम ओल्ड टैक्स रिजीम:
1. **न्यू टैक्स रिजीम (New Regime):**
   - सैलरीड लोगों के लिए ₹7.75 लाख तक की सालाना आय पर कोई टैक्स नहीं (स्टैंडर्ड डिडक्शन और 87A रिबेट के साथ)।
   - इसमें किसी भी इन्वेस्टमेंट प्रूफ या HRA रसीद जमा करने की जरूरत नहीं होती।

2. **ओल्ड टैक्स रिजीम (Old Regime):**
   - अगर आपके पास बड़े डिडक्शंस हैं (जैसे 80C में ₹1.5 लाख, होम लोन ब्याज ₹2 लाख, HRA और हेल्थ इंश्योरेंस), तो यह विकल्प फायदेमंद हो सकता है।

#### टैक्स बचाने के मुख्य साधन:
- **ELSS म्यूचुअल फंड:** सिर्फ 3 साल का लॉक-इन और 80C में ₹1.5 लाख तक की छूट।
- **NPS (नेशनल पेंशन सिस्टम):** 80C के अतिरिक्त ₹50,000 की एक्स्ट्रा छूट।"""
    }
}


def find_financial_topic(query: str) -> Dict[str, Any] | None:
    q = query.lower()
    for key, data in FINANCIAL_TOPICS.items():
        if key in q or any(kw in q for kw in data["keywords"]):
            return data
    return None
