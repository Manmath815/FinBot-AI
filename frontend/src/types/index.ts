export type NavTab = 'chat' | 'dashboard' | 'calculators' | 'goals' | 'scam-check' | 'learn';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'bn' | 'gu' | 'kn';

export interface ChatMessage {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: string;
  model?: string;
}

export interface FinancialGoal {
  id: number;
  title: string;
  category: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  monthly_savings_needed: number;
  progress_percentage: number;
}

export interface ScamRedFlag {
  title: string;
  explanation: string;
}

export interface ScamAnalysisResult {
  text: string;
  category: string;
  risk_score: number;
  risk_level: 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  verdict: string;
  color: 'green' | 'yellow' | 'orange' | 'red';
  red_flags: ScamRedFlag[];
  safe_actions: string[];
  official_contacts: {
    cyber_crime_helpline: string;
    digisaathi_helpline: string;
    cyber_crime_portal: string;
    rbi_sachet_portal: string;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface LearningModule {
  id: string;
  title: string;
  icon: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  content: string[];
  quiz: QuizQuestion[];
  user_progress?: {
    completed: boolean;
    score: number;
    max_score: number;
  };
}
