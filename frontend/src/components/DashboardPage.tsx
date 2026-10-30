import React from 'react';
import { 
  TrendingUp, ShieldCheck, Target, Award, ArrowUpRight, 
  MessageSquare, BookOpen, CheckCircle
} from 'lucide-react';
import type { FinancialGoal, LearningModule, NavTab } from '../types';

interface DashboardPageProps {
  goals: FinancialGoal[];
  modules: LearningModule[];
  setActiveTab: (tab: NavTab) => void;
  onAskTopic: (topicQuery: string) => void;
  onContributeGoal: (goalId: number, amount: number) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  goals,
  modules,
  setActiveTab,
  onAskTopic,
  onContributeGoal
}) => {
  const completedModulesCount = modules.filter(m => m.user_progress?.completed).length;
  const totalModules = modules.length || 7;
  const literacyScore = Math.min(100, Math.round(((completedModulesCount + 1) / (totalModules + 1)) * 100));

  const totalTargetSavings = goals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalCurrentSavings = goals.reduce((sum, g) => sum + g.current_amount, 0);
  const totalMonthlyNeeded = goals.reduce((sum, g) => sum + g.monthly_savings_needed, 0);

  const formatInr = (val: number) => '₹' + Number(val || 0).toLocaleString('en-IN');

  const popularTopics = [
    { title: 'How to avoid UPI payment fraud', query: 'What are the main rules to prevent UPI payment fraud?' },
    { title: 'Emergency fund vs Liquid funds', query: 'Should I park my emergency fund in liquid mutual funds or fixed deposits?' },
    { title: 'Index Funds vs Active Funds', query: 'Why are Nifty 50 index funds recommended for beginners?' },
    { title: 'Tax deduction under Section 80C', query: 'Which investments qualify for tax deduction under Section 80C?' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header greeting & overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-md shadow-blue-500/10">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
            🇮🇳 Digital Financial Literacy Initiative
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white">
            Namaste! Welcome to your Financial Dashboard
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
            Track your savings goals, verify suspicious payment messages, and level up your financial education.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('chat')}
            className="px-4 py-2.5 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition shadow-sm cursor-pointer flex items-center space-x-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask FinBot</span>
          </button>
          <button
            onClick={() => setActiveTab('scam-check')}
            className="px-4 py-2.5 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 text-white text-xs font-bold transition border border-white/20 cursor-pointer flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Check Scam</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Financial Literacy Level */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Financial Literacy Score</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{literacyScore}%</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5 flex items-center">
              <span>{completedModulesCount}/{totalModules} modules mastered</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Active Savings Goals */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Goals</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{goals.length}</div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
              Saved {formatInr(totalCurrentSavings)} of {formatInr(totalTargetSavings)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Monthly Savings Target */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Monthly Savings Target</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{formatInr(totalMonthlyNeeded)}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Across all active goals</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Scam Protection Rating */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Scam Shield Status</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">Protected</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Helplines 1930 & 14431 active</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Savings Goals & Budget Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Goals Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Savings Goals</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track progress and calculate required monthly deposits</p>
              </div>
              <button
                onClick={() => setActiveTab('goals')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>Manage Goals</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {goals.map((g) => {
                const pct = Math.min(100, Math.round((g.current_amount / g.target_amount) * 100));
                return (
                  <div
                    key={g.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{g.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                          {g.category}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {formatInr(g.current_amount)} <span className="font-normal text-slate-400">/ {formatInr(g.target_amount)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span>Target: {g.target_date} · <strong>{pct}%</strong> completed</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Need {formatInr(g.monthly_savings_needed)}/mo
                        </span>
                        <button
                          onClick={() => onContributeGoal(g.id, 1000)}
                          className="px-2 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold cursor-pointer transition"
                          title="Add ₹1,000 to this goal"
                        >
                          + ₹1,000
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly 50/30/20 Budget Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Sample Monthly Budget Allocation</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Recommended 50/30/20 standard for financial health</p>
              </div>
              <button
                onClick={() => setActiveTab('calculators')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>Customize in Calculators</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-center">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">50% Needs</div>
                <div className="text-base font-bold text-slate-800 dark:text-white mt-1">₹25,000</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Rent, Groceries, Utilities, Healthcare</div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-center">
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">30% Wants</div>
                <div className="text-base font-bold text-slate-800 dark:text-white mt-1">₹15,000</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Dining out, Subscriptions, Vacations</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-center">
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">20% Savings</div>
                <div className="text-base font-bold text-slate-800 dark:text-white mt-1">₹10,000</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">SIP, Emergency Fund, PPF, NPS</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Learning Modules & Popular Topics */}
        <div className="space-y-6">
          
          {/* Learning Progress Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Learning Modules</h3>
              <button
                onClick={() => setActiveTab('learn')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {modules.slice(0, 4).map((m) => {
                const isDone = m.user_progress?.completed;
                return (
                  <div
                    key={m.id}
                    onClick={() => setActiveTab('learn')}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-slate-100 dark:border-slate-700/60"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                        isDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {isDone ? <CheckCircle className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {m.title}
                      </span>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {isDone ? 'Done' : m.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Popular Financial Topics (1-click to chat) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Popular Topics</h3>
            <div className="space-y-2">
              {popularTopics.map((pt, idx) => (
                <button
                  key={idx}
                  onClick={() => onAskTopic(pt.query)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium border border-slate-100 dark:border-slate-700/60 transition flex items-center justify-between group cursor-pointer"
                >
                  <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {pt.title}
                  </span>
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
