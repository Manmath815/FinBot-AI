import React, { useState } from 'react';
import { 
  BookOpen, Smartphone, ShieldAlert, 
  TrendingUp, PieChart, ShieldCheck, CreditCard, Landmark, 
  Award, ArrowRight, X, CheckCircle2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { LearningModule } from '../types';

interface LearnPageProps {
  modules: LearningModule[];
  onCompleteQuiz: (moduleId: string, score: number) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ modules, onCompleteQuiz }) => {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'quiz'>('content');
  
  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const openModule = (m: LearningModule) => {
    setSelectedModule(m);
    setActiveTab('content');
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers({ ...userAnswers, [qIdx]: optIdx });
  };

  const handleSubmitQuiz = () => {
    if (!selectedModule) return;
    let score = 0;
    selectedModule.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_index) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    onCompleteQuiz(selectedModule.id, score);

    if (score >= selectedModule.quiz.length * 0.6) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'PieChart': return <PieChart className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5" />;
      case 'Landmark': return <Landmark className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2.5">
          <BookOpen className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Digital Financial Literacy Academy
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Essential financial education tailored for India: digital payments, fraud prevention, investments, and government schemes
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => {
          const isDone = m.user_progress?.completed;
          return (
            <div
              key={m.id}
              onClick={() => openModule(m)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    {getIcon(m.icon)}
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                    isDone
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {isDone ? 'Completed' : m.duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{m.difficulty}</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Start Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Lesson & Quiz Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  {getIcon(selectedModule.icon)}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {selectedModule.title}
                  </h2>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedModule.duration} · {selectedModule.difficulty}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedModule(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content vs Quiz Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 bg-slate-50 dark:bg-slate-800/40">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-2.5 px-4 text-xs font-bold border-b-2 transition ${
                  activeTab === 'content'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Lesson Guide
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-2.5 px-4 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
                  activeTab === 'quiz'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Interactive Quiz</span>
                <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] flex items-center justify-center font-bold">
                  {selectedModule.quiz.length}
                </span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
              {activeTab === 'content' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 leading-relaxed">
                    {selectedModule.description}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Key Principles & Rules:</h3>
                    <ul className="space-y-2.5">
                      {selectedModule.content.map((point, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Take Practice Quiz</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Quiz Section */
                <div className="space-y-6">
                  {selectedModule.quiz.map((q, qIdx) => {
                    const chosen = userAnswers[qIdx];
                    return (
                      <div
                        key={qIdx}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3"
                      >
                        <div className="font-bold text-slate-900 dark:text-white">
                          {qIdx + 1}. {q.question}
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = chosen === optIdx;
                            let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';

                            if (quizSubmitted) {
                              if (optIdx === q.correct_index) {
                                btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold';
                              } else if (isSelected && optIdx !== q.correct_index) {
                                btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200';
                              }
                            } else if (isSelected) {
                              btnStyle = 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 font-semibold';
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectOption(qIdx, optIdx)}
                                className={`w-full text-left p-2.5 rounded-xl border text-xs leading-relaxed transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {quizSubmitted && optIdx === q.correct_index && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Submit or Score Display */}
                  <div className="pt-2">
                    {quizSubmitted ? (
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                            You scored {quizScore} out of {selectedModule.quiz.length}!
                          </div>
                          <div className="text-xs text-emerald-700 dark:text-emerald-300">
                            {quizScore >= selectedModule.quiz.length * 0.6 ? 'Congratulations, module completed!' : 'Review the lesson guide and try again!'}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setUserAnswers({});
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                        >
                          Retry Quiz
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(userAnswers).length < selectedModule.quiz.length}
                        className={`w-full py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition ${
                          Object.keys(userAnswers).length === selectedModule.quiz.length
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Award className="w-4 h-4" />
                        <span>Submit Quiz & Record Score</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
