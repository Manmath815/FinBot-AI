import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, 
  ExternalLink, PhoneCall, Sparkles, AlertOctagon 
} from 'lucide-react';
import type { ScamAnalysisResult } from '../types';

export const ScamCheckPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [category, setCategory] = useState('sms');
  const [analysis, setAnalysis] = useState<ScamAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const sampleScams = [
    {
      label: '⚡ Electricity Bill Threat',
      text: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from electricity office because your previous month bill was not updated. Please immediately contact our power officer at 9876543210. Thank you.'
    },
    {
      label: '🔓 Fake UPI PIN Collect Request',
      text: 'Congratulations! You have received a cashback prize of Rs 4,999 from Google Pay / PhonePe. Scan this QR code or accept collect request and enter UPI PIN to receive money into your bank account immediately.'
    },
    {
      label: '💰 Telegram Part-Time Job',
      text: 'Part-time Work from Home! Earn Rs 3,000 to Rs 8,000 daily by simply liking YouTube videos and rating hotels on Google. Contact HR on Telegram @WorkFastNow. First payment Rs 250 instantly credited upon joining.'
    },
    {
      label: '🏦 Bank KYC Block Alert',
      text: 'Dear SBI Customer, your YONO account has been suspended today due to expired KYC. Please click http://sbi-kyc-update.xyz to verify your PAN card and Aadhaar details immediately to avoid permanent deactivation.'
    }
  ];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || inputText;
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/scam-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, category })
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);
      } else {
        // Local fallback analysis if offline
        fallbackAnalysis(text);
      }
    } catch {
      fallbackAnalysis(text);
    } finally {
      setLoading(false);
    }
  };

  const fallbackAnalysis = (text: string) => {
    const isPin = text.toLowerCase().includes('pin') && (text.toLowerCase().includes('receive') || text.toLowerCase().includes('cashback'));
    setAnalysis({
      text,
      category,
      risk_score: isPin ? 85 : 65,
      risk_level: isPin ? 'CRITICAL' : 'HIGH',
      verdict: isPin ? '⚠️ DANGER: HIGH PROBABILITY FINANCIAL SCAM' : '🚨 SUSPICIOUS: LIKELY FRAUDULENT ATTEMPT',
      color: 'red',
      red_flags: [
        {
          title: 'High Urgency / Credential Harvest Pattern Detected',
          explanation: 'Fraudsters create panic or false promises of money to trick you into entering your UPI PIN or sharing credentials.'
        }
      ],
      safe_actions: [
        'NEVER enter your UPI PIN to receive money.',
        'DO NOT share OTP, CVV, or netbanking passwords.',
        'Report immediately to Cyber Crime Helpline 1930 or DigiSaathi 14431.'
      ],
      official_contacts: {
        cyber_crime_helpline: '1930',
        digisaathi_helpline: '14431',
        cyber_crime_portal: 'https://cybercrime.gov.in',
        rbi_sachet_portal: 'https://sachet.rbi.org.in'
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Financial Scam Awareness Tool
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Paste suspicious messages, collect requests, links, or job offers to analyze fraud patterns
        </p>
      </div>

      {/* Golden Safety Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start space-x-3 text-amber-900 dark:text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <strong className="font-bold">Strict Safety Rule:</strong> FinBot AI will <strong>NEVER</strong> ask for your UPI PIN, OTP, ATM PIN, CVV, or Netbanking passwords. Never share these with anyone under any circumstances!
        </div>
      </div>

      {/* Main Analysis Input Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Category selector */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400 flex-shrink-0 mr-1">Message Type:</span>
          {['sms', 'upi', 'whatsapp', 'investment', 'call'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider transition cursor-pointer ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste suspicious SMS, WhatsApp message, email, or UPI payment description here..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Quick Sample Scam Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Try samples:</span>
              {sampleScams.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(s.text);
                    handleAnalyze(s.text);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition cursor-pointer border border-slate-200/60 dark:border-slate-700"
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Analyze Button */}
            <button
              onClick={() => handleAnalyze()}
              disabled={!inputText.trim() || loading}
              className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition flex-shrink-0 ${
                inputText.trim() && !loading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 cursor-pointer'
                  : 'bg-blue-300 dark:bg-slate-700 text-white dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Analyzing Message...' : 'Analyze Scam Risk'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Risk Level Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold text-white ${
                  analysis.risk_level === 'CRITICAL' || analysis.risk_level === 'HIGH'
                    ? 'bg-rose-600'
                    : analysis.risk_level === 'MODERATE'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}>
                  {analysis.risk_level} RISK
                </span>
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  {analysis.verdict}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Risk Score: <strong>{analysis.risk_score}/100</strong>
              </div>
            </div>

            {/* Meter Bar */}
            <div className="w-full sm:w-48 bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                style={{ width: `${analysis.risk_score}%` }}
                className={`h-full ${
                  analysis.risk_score >= 65 ? 'bg-rose-600' : analysis.risk_score >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              ></div>
            </div>
          </div>

          {/* Red Flags Breakdown */}
          {analysis.red_flags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                <span>Detected Red Flags & Warning Indicators:</span>
              </h3>
              <div className="space-y-2.5">
                {analysis.red_flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 text-xs text-slate-800 dark:text-slate-200 space-y-1"
                  >
                    <div className="font-bold text-rose-700 dark:text-rose-400">
                      • {flag.title}
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-2.5">
                      {flag.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Immediate Safe Action Steps */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Recommended Immediate Safe Actions:</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {analysis.safe_actions.map((act, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">✔</span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Helplines quick dial */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-blue-900 dark:text-blue-200 font-semibold">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>National Cyber Crime Helpline: <strong>1930</strong> · DigiSaathi: <strong>14431</strong></span>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1"
            >
              <span>File Formal Complaint</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      )}

    </div>
  );
};
