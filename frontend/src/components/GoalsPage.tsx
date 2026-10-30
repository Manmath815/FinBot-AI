import React, { useState } from 'react';
import { 
  Trophy, Plus, Trash2, Edit3, CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FinancialGoal } from '../types';

interface GoalsPageProps {
  goals: FinancialGoal[];
  onCreateGoal: (goal: Omit<FinancialGoal, 'id' | 'monthly_savings_needed' | 'progress_percentage'>) => void;
  onUpdateGoal: (id: number, updates: Partial<FinancialGoal>) => void;
  onDeleteGoal: (id: number) => void;
}

const CATEGORIES = [
  'Emergency Fund', 'Vehicle / Bike', 'Higher Education', 
  'Home Down Payment', 'Travel & Vacation', 'Wedding / Family', 'Tech Gadget', 'Retirement / NPS'
];

export const GoalsPage: React.FC<GoalsPageProps> = ({
  goals,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [targetAmount, setTargetAmount] = useState<number>(100000);
  const [currentAmount, setCurrentAmount] = useState<number>(20000);
  const [targetDate, setTargetDate] = useState<string>('2027-12-31');

  // Quick contribution state
  const [contributeGoalId, setContributeGoalId] = useState<number | null>(null);
  const [contributeAmount, setContributeAmount] = useState<number>(1000);

  const openCreateModal = () => {
    setEditingGoal(null);
    setTitle('');
    setCategory(CATEGORIES[0]);
    setTargetAmount(100000);
    setCurrentAmount(20000);
    setTargetDate('2027-12-31');
    setModalOpen(true);
  };

  const openEditModal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setCategory(goal.category);
    setTargetAmount(goal.target_amount);
    setCurrentAmount(goal.current_amount);
    setTargetDate(goal.target_date);
    setModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || targetAmount <= 0) return;

    if (editingGoal) {
      onUpdateGoal(editingGoal.id, {
        title,
        category,
        target_amount: targetAmount,
        current_amount: currentAmount,
        target_date: targetDate
      });
    } else {
      onCreateGoal({
        title,
        category,
        target_amount: targetAmount,
        current_amount: currentAmount,
        target_date: targetDate
      });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    }

    setModalOpen(false);
  };

  const handleAddFunds = (goal: FinancialGoal) => {
    const newAmount = goal.current_amount + contributeAmount;
    onUpdateGoal(goal.id, { current_amount: newAmount });
    if (newAmount >= goal.target_amount) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
    setContributeGoalId(null);
  };

  const formatInr = (val: number) => '₹' + Number(val || 0).toLocaleString('en-IN');

  const getDaysRemaining = (dateStr: string) => {
    try {
      const target = new Date(dateStr);
      const today = new Date();
      const diffTime = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
    } catch {
      return 365;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <Trophy className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Financial Goal Planner
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Set clear targets, track milestones, and automate your monthly savings requirements
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-blue-500/25 cursor-pointer transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
          const daysLeft = getDaysRemaining(goal.target_date);
          const isCompleted = goal.current_amount >= goal.target_amount;

          return (
            <div
              key={goal.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {isCompleted && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Goal Achieved!</span>
                </div>
              )}

              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {goal.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {goal.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-400">
                    <button
                      onClick={() => openEditModal(goal)}
                      className="p-1.5 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Edit Goal"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress amount */}
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {formatInr(goal.current_amount)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Target: {formatInr(goal.target_amount)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    }`}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  <span className="font-semibold">{pct}% Saved</span>
                  <span>{daysLeft} days left</span>
                </div>
              </div>

              {/* Monthly requirement & Add Contribution */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Needed per month:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {isCompleted ? 'Completed' : `${formatInr(goal.monthly_savings_needed)}/mo`}
                  </span>
                </div>

                {/* Quick Add Funds button */}
                {contributeGoalId === goal.id ? (
                  <div className="flex items-center space-x-1.5 mt-2">
                    <input
                      type="number"
                      step="500"
                      value={contributeAmount}
                      onChange={(e) => setContributeAmount(Number(e.target.value))}
                      className="w-24 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold outline-none text-slate-800 dark:text-slate-100"
                    />
                    <button
                      onClick={() => handleAddFunds(goal)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setContributeGoalId(null)}
                      className="px-2 py-1 text-slate-400 text-xs hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setContributeGoalId(goal.id);
                      setContributeAmount(1000);
                    }}
                    className="w-full py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700 transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Add Funds Contribution</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Goal Modal (Create / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
            </h2>

            <form onSubmit={handleSaveGoal} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Emergency Fund (6 Months)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Current Savings (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(Number(e.target.value))}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm cursor-pointer"
                >
                  {editingGoal ? 'Update Goal' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
