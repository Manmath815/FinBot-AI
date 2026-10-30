import React from 'react';
import { ShieldCheck, Link2, ExternalLink, PhoneCall } from 'lucide-react';

export const SafetyCards: React.FC = () => {
  const hotlines = [
    { number: '1930', title: 'Cyber Crime Helpline', tel: '1930' },
    { number: '14431', title: 'DigiSaathi (Digital Payments)', tel: '14431' },
    { number: '1800-11-0001', title: 'RBI Helpline', tel: '1800110001' },
    { number: '155260', title: 'Bank Fraud Helpline', tel: '155260' },
  ];

  const resources = [
    { name: 'RBI India', icon: '🏛️', url: 'https://www.rbi.org.in' },
    { name: 'Cyber Crime Portal', icon: '🛡️', url: 'https://cybercrime.gov.in' },
    { name: 'NCFE', icon: '🎓', url: 'https://www.ncfe.org.in' },
    { name: 'SEBI Investor Ed', icon: '📈', url: 'https://investor.sebi.gov.in' },
    { name: 'MyMoney.gov.in', icon: '📁', url: 'https://www.mymoney.gov.in' },
  ];

  return (
    <div className="space-y-4">
      {/* Card 1: Fraud Hotlines */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Fraud Hotlines</span>
        </div>

        <div className="space-y-3.5">
          {hotlines.map((h, idx) => (
            <a
              key={idx}
              href={`tel:${h.tel}`}
              className="flex items-center justify-between text-xs py-1 group hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg transition"
              title={`Call ${h.number}`}
            >
              <div className="flex items-center space-x-2">
                <span className="font-bold text-red-600 dark:text-red-500 text-sm group-hover:underline flex items-center">
                  <PhoneCall className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {h.number}
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 text-right">
                {h.title}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Card 2: Official Resources */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-4">
          <Link2 className="w-4 h-4 text-blue-500" />
          <span>Official Resources</span>
        </div>

        <div className="space-y-2.5">
          {resources.map((r, idx) => (
            <a
              key={idx}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition group"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-sm">{r.icon}</span>
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {r.name}
                </span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
