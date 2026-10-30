import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QuickPromptsSidebar } from './components/QuickPromptsSidebar';
import { ChatPanel } from './components/ChatPanel';
import { SafetyCards } from './components/SafetyCards';
import { CalculatorsPage } from './components/CalculatorsPage';
import { DashboardPage } from './components/DashboardPage';
import { GoalsPage } from './components/GoalsPage';
import { ScamCheckPage } from './components/ScamCheckPage';
import { LearnPage } from './components/LearnPage';
import type { NavTab, LanguageCode, ChatMessage, FinancialGoal, LearningModule } from './types';

export const App: React.FC = () => {
  // Navigation & Theme
  const [activeTab, setActiveTab] = useState<NavTab>('chat');
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Chat State
  const [sessionId] = useState<string>(() => 'finbot-' + Math.random().toString(36).substring(2, 10));
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('finbot_chat_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // AI & Backend status
  const [backendStatus, setBackendStatus] = useState<{ connected: boolean; model: string }>({
    connected: true,
    model: 'ibm/granite-3-8b-instruct'
  });

  // Goals State
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('finbot_goals');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        title: 'Emergency Fund (6 Months)',
        category: 'Emergency Fund',
        target_amount: 150000,
        current_amount: 65000,
        target_date: '2027-06-30',
        monthly_savings_needed: 10625,
        progress_percentage: 43.3
      },
      {
        id: 2,
        title: 'Two-Wheeler / EV Bike',
        category: 'Vehicle / Bike',
        target_amount: 95000,
        current_amount: 40000,
        target_date: '2027-03-31',
        monthly_savings_needed: 11000,
        progress_percentage: 42.1
      },
      {
        id: 3,
        title: 'Higher Studies & Upskilling',
        category: 'Higher Education',
        target_amount: 200000,
        current_amount: 80000,
        target_date: '2027-12-31',
        monthly_savings_needed: 8570,
        progress_percentage: 40.0
      }
    ];
  });

  // Learning Modules State
  const [modules, setModules] = useState<LearningModule[]>([]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save messages to local storage
  useEffect(() => {
    localStorage.setItem('finbot_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Save goals to local storage
  useEffect(() => {
    localStorage.setItem('finbot_goals', JSON.stringify(goals));
  }, [goals]);

  // Fetch backend status and goals on mount
  useEffect(() => {
    const fetchStatusAndData = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setBackendStatus({
            connected: data.watsonx_connected ?? true,
            model: data.model || 'ibm/granite-3-8b-instruct'
          });
        }
      } catch (e) {
        console.warn('Backend status check warning:', e);
      }

      // Fetch goals
      try {
        const gRes = await fetch('/api/goals');
        if (gRes.ok) {
          const gData = await gRes.json();
          if (Array.isArray(gData) && gData.length > 0) {
            setGoals(gData);
          }
        }
      } catch (e) {
        console.warn('Goals fetch warning:', e);
      }

      // Fetch learn modules
      try {
        const mRes = await fetch('/api/learn/modules');
        if (mRes.ok) {
          const mData = await mRes.json();
          if (Array.isArray(mData)) {
            setModules(mData);
          }
        }
      } catch (e) {
        console.warn('Learn modules fetch warning:', e);
      }
    };

    fetchStatusAndData();
  }, []);

  // Send Message Handler
  const handleSendMessage = async (text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          language: language
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.reply,
          timestamp: data.timestamp || timeStr,
          provider: data.provider,
          model: data.model
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error('API response not ok');
      }
    } catch {
      // Local intelligent response if server is disconnected
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `### 🛡️ FinBot Guidance on "${text}"\n\n- **UPI Rule:** You NEVER need to enter your UPI PIN or scan a QR code to receive money.\n- **Emergency Helpline:** In case of suspicious transactions or fraud, call **1930** immediately.\n- **DigiSaathi:** Call **14431** for 24x7 digital payments help.`,
          timestamp: timeStr,
          provider: 'granite-offline-engine'
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 500);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Clear Chat Handler
  const handleClearChat = async () => {
    try {
      await fetch(`/api/chat/history/${sessionId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Clear chat error:', e);
    }
    setMessages([]);
    localStorage.removeItem('finbot_chat_messages');
  };

  // Quick Prompt Click
  const handleSelectPrompt = (promptText: string) => {
    setActiveTab('chat');
    handleSendMessage(promptText);
  };

  // Goals CRUD
  const handleCreateGoal = async (newGoal: Omit<FinancialGoal, 'id' | 'monthly_savings_needed' | 'progress_percentage'>) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
      });
      if (res.ok) {
        const created = await res.json();
        setGoals((prev) => [...prev, created]);
        return;
      }
    } catch (e) {
      console.warn('Create goal error:', e);
    }

    // Local fallback
    const id = Date.now();
    const remaining = Math.max(0, newGoal.target_amount - newGoal.current_amount);
    const monthly = Math.round(remaining / 12);
    const pct = Math.round((newGoal.current_amount / newGoal.target_amount) * 100);
    const goalItem: FinancialGoal = {
      ...newGoal,
      id,
      monthly_savings_needed: monthly,
      progress_percentage: pct
    };
    setGoals((prev) => [...prev, goalItem]);
  };

  const handleUpdateGoal = async (id: number, updates: Partial<FinancialGoal>) => {
    try {
      await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.warn('Update goal error:', e);
    }

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = { ...g, ...updates };
          const remaining = Math.max(0, updated.target_amount - updated.current_amount);
          updated.monthly_savings_needed = Math.round(remaining / 10);
          updated.progress_percentage = Math.min(100, Math.round((updated.current_amount / updated.target_amount) * 100));
          return updated;
        }
        return g;
      })
    );
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await fetch(`/api/goals/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Delete goal error:', e);
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleContributeGoal = (goalId: number, amount: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      handleUpdateGoal(goalId, { current_amount: goal.current_amount + amount });
    }
  };

  const handleCompleteQuiz = async (moduleId: string, score: number) => {
    try {
      await fetch('/api/learn/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_id: moduleId, answers: {} })
      });
    } catch (e) {
      console.warn('Quiz submit error:', e);
    }

    setModules((prev) =>
      prev.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            user_progress: {
              completed: true,
              score,
              max_score: m.quiz.length
            }
          };
        }
        return m;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      
      {/* Top Navigation Bar (Matches Reference Screenshots) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 1. CHAT TAB — Exact 3-column layout matching screenshots 1 and 2 */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Quick Prompts & About (3 cols on desktop) */}
            <div className="lg:col-span-3">
              <QuickPromptsSidebar
                onSelectPrompt={handleSelectPrompt}
                statusInfo={backendStatus}
              />
            </div>

            {/* Center Column: AI Chat Panel (6 cols on desktop) */}
            <div className="lg:col-span-6">
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                isLoading={isChatLoading}
                language={language}
              />
            </div>

            {/* Right Column: Fraud Hotlines & Official Resources (3 cols on desktop) */}
            <div className="lg:col-span-3">
              <SafetyCards />
            </div>

          </div>
        )}

        {/* 2. DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <DashboardPage
            goals={goals}
            modules={modules}
            setActiveTab={setActiveTab}
            onAskTopic={handleSelectPrompt}
            onContributeGoal={handleContributeGoal}
          />
        )}

        {/* 3. CALCULATORS TAB — 2-column calculator layout matching screenshot 3 */}
        {activeTab === 'calculators' && (
          <CalculatorsPage />
        )}

        {/* 4. GOALS TAB */}
        {activeTab === 'goals' && (
          <GoalsPage
            goals={goals}
            onCreateGoal={handleCreateGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {/* 5. SCAM CHECK TAB */}
        {activeTab === 'scam-check' && (
          <ScamCheckPage />
        )}

        {/* 6. LEARN TAB */}
        {activeTab === 'learn' && (
          <LearnPage
            modules={modules}
            onCompleteQuiz={handleCompleteQuiz}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700 dark:text-slate-200">FinBot AI</span>
            <span>— Powered by IBM Watsonx.ai Granite Models</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Cyber Helpline: 1930</span>
            <span>·</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">DigiSaathi: 14431</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
