import React from 'react';
import { Zap, Info, Cpu } from 'lucide-react';

interface QuickPromptsSidebarProps {
  onSelectPrompt: (promptText: string) => void;
  statusInfo?: {
    connected: boolean;
    model: string;
  };
}

const PROMPTS = [
  { icon: '🔓', label: 'UPI Safety Tips', query: 'What are the essential UPI safety tips and rules?' },
  { icon: '🚨', label: 'Avoid Scams', query: 'How to identify and avoid online financial scams and phishing?' },
  { icon: '📈', label: 'Start SIP', query: 'How to start a SIP in mutual funds as a beginner?' },
  { icon: '💰', label: 'Compound Interest', query: 'Explain the power of compound interest and Rule of 72.' },
  { icon: '📊', label: '50/30/20 Budget', query: 'Explain the 50/30/20 budget rule for managing salary.' },
  { icon: '🏛️', label: 'Govt Schemes', query: 'What are the best Indian government financial and insurance schemes?' },
  { icon: '⭐', label: 'CIBIL Score', query: 'What is a CIBIL score and how can I increase it to 750+?' },
  { icon: '❓', label: 'UPI PIN vs OTP', query: 'What is the difference between UPI PIN and OTP?' },
  { icon: '🛡️', label: 'Emergency Fund', query: 'How much emergency fund should I have and where to keep it?' },
  { icon: '📋', label: 'Tax Basics', query: 'Explain Income Tax basics: Old vs New Regime and Section 80C.' },
];

export const QuickPromptsSidebar: React.FC<QuickPromptsSidebarProps> = ({ 
  onSelectPrompt,
  statusInfo 
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-6">
      
      {/* Quick Prompts Section */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Quick Prompts</span>
        </div>

        <div className="space-y-2">
          {PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectPrompt(item.query)}
              className="w-full text-left flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-100 dark:border-slate-700/60 transition group cursor-pointer"
            >
              <span className="text-sm">{item.icon}</span>
              <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* About FinBot Card */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Info className="w-4 h-4 text-blue-500" />
          <span className="uppercase tracking-wider">About FinBot</span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Powered by <strong className="text-slate-700 dark:text-slate-200 font-semibold">IBM Watsonx.ai</strong> Granite models. Providing trusted financial guidance in multiple Indian languages.
        </p>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-semibold">
          <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>IBM Granite AI</span>
          {statusInfo?.connected && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          )}
        </div>
      </div>

    </div>
  );
};
