import React, { useState } from 'react';
import { 
  Calculator, TrendingUp, Home, Percent, Wallet, 
  Target, PiggyBank 
} from 'lucide-react';

export const CalculatorsPage: React.FC = () => {
  // 1. SIP Calculator State
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(10);
  const [sipResult, setSipResult] = useState<any>(null);

  // 2. Loan EMI Calculator State
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [loanRate, setLoanRate] = useState<number>(10);
  const [loanYears, setLoanYears] = useState<number>(5);
  const [loanResult, setLoanResult] = useState<any>(null);

  // 3. Compound Interest State
  const [ciPrincipal, setCiPrincipal] = useState<number>(100000);
  const [ciRate, setCiRate] = useState<number>(8);
  const [ciYears, setCiYears] = useState<number>(5);
  const [ciFreq, setCiFreq] = useState<string>('yearly');
  const [ciResult, setCiResult] = useState<any>(null);

  // 4. 50/30/20 Budget Planner State
  const [income, setIncome] = useState<number>(50000);
  const [needsPct, setNeedsPct] = useState<number>(50);
  const [wantsPct, setWantsPct] = useState<number>(30);
  const [savingsPct, setSavingsPct] = useState<number>(20);
  const [budgetResult, setBudgetResult] = useState<any>(null);

  // 5. Simple Interest State
  const [siPrincipal, setSiPrincipal] = useState<number>(50000);
  const [siRate, setSiRate] = useState<number>(7);
  const [siYears, setSiYears] = useState<number>(3);
  const [siResult, setSiResult] = useState<any>(null);

  // 6. Savings Goal State
  const [goalTarget, setGoalTarget] = useState<number>(200000);
  const [goalCurrent, setGoalCurrent] = useState<number>(50000);
  const [goalMonths, setGoalMonths] = useState<number>(12);
  const [goalResult, setGoalResult] = useState<any>(null);

  // Calculate SIP
  const calculateSip = () => {
    const P = sipMonthly;
    const i = (sipRate / 100) / 12;
    const n = sipYears * 12;
    const invested = Math.round(P * n);
    const maturity = Math.round(P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i)));
    const returns = Math.round(maturity - invested);
    setSipResult({ invested, returns, maturity });
  };

  // Calculate EMI
  const calculateEmi = () => {
    const P = loanAmount;
    const r = (loanRate / 100) / 12;
    const n = loanYears * 12;
    const emi = Math.round(P * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)));
    const totalPayment = Math.round(emi * n);
    const totalInterest = Math.round(totalPayment - P);
    setLoanResult({ emi, totalPayment, totalInterest });
  };

  // Calculate Compound Interest
  const calculateCi = () => {
    const P = ciPrincipal;
    const r = ciRate / 100;
    const t = ciYears;
    const nMap: Record<string, number> = { monthly: 12, quarterly: 4, 'half-yearly': 2, yearly: 1 };
    const n = nMap[ciFreq] || 1;
    const maturity = Math.round(P * Math.pow(1 + (r / n), n * t));
    const interest = Math.round(maturity - P);
    setCiResult({ maturity, interest, principal: P });
  };

  // Calculate Budget
  const calculateBudget = () => {
    const needs = Math.round(income * (needsPct / 100));
    const wants = Math.round(income * (wantsPct / 100));
    const savings = Math.round(income * (savingsPct / 100));
    setBudgetResult({ needs, wants, savings, total: income });
  };

  // Calculate Simple Interest
  const calculateSi = () => {
    const interest = Math.round((siPrincipal * siRate * siYears) / 100);
    const total = Math.round(siPrincipal + interest);
    setSiResult({ interest, total });
  };

  // Calculate Savings Goal
  const calculateGoal = () => {
    const remaining = Math.max(0, goalTarget - goalCurrent);
    const monthlyNeeded = Math.round(remaining / goalMonths);
    const pct = Math.min(100, Math.round((goalCurrent / goalTarget) * 100));
    setGoalResult({ remaining, monthlyNeeded, pct });
  };

  // Initialize defaults on first render
  React.useEffect(() => {
    calculateSip();
    calculateEmi();
    calculateCi();
    calculateBudget();
    calculateSi();
    calculateGoal();
  }, []);

  const formatInr = (val: number) => {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Title & Subtitle (Matches Reference Screenshot 3) */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2.5">
          <Calculator className="w-7 h-7 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Financial Calculators
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Plan your investments and loans with precision
        </p>
      </div>

      {/* 2-Column Grid of Calculator Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. SIP Calculator Card (Exact match to reference) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            {/* Blue-purple gradient header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold text-sm sm:text-base">SIP Calculator</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                Investment
              </span>
            </div>

            {/* Inputs body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Monthly Investment (₹)
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(Number(e.target.value))}
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                />
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="0.5"
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value))}
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                />
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={sipRate}
                  onChange={(e) => setSipRate(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Investment Period (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                />
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-5 pt-0 space-y-4">
            <button
              onClick={calculateSip}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer transition"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate SIP Returns</span>
            </button>

            {sipResult && (
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Invested</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {formatInr(sipResult.invested)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Est. Returns</div>
                    <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      +{formatInr(sipResult.returns)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Value</div>
                    <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      {formatInr(sipResult.maturity)}
                    </div>
                  </div>
                </div>

                {/* Progress bar of wealth proportion */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(sipResult.invested / sipResult.maturity) * 100}%` }}
                    className="bg-blue-600 h-full"
                    title={`Invested: ${formatInr(sipResult.invested)}`}
                  ></div>
                  <div
                    style={{ width: `${(sipResult.returns / sipResult.maturity) * 100}%` }}
                    className="bg-emerald-500 h-full"
                    title={`Returns: ${formatInr(sipResult.returns)}`}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Loan EMI Calculator Card (Exact match to reference) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5" />
                <span className="font-bold text-sm sm:text-base">Loan EMI Calculator</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-200 border border-rose-400/30">
                Loan
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  min="10000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                />
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  step="0.25"
                  value={loanRate}
                  onChange={(e) => setLoanRate(Number(e.target.value))}
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                />
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="0.25"
                  value={loanRate}
                  onChange={(e) => setLoanRate(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Loan Tenure (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={loanYears}
                  onChange={(e) => setLoanYears(Number(e.target.value))}
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                />
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={loanYears}
                  onChange={(e) => setLoanYears(Number(e.target.value))}
                  className="w-full accent-blue-600 mt-2 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-5 pt-0 space-y-4">
            <button
              onClick={calculateEmi}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer transition"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate EMI</span>
            </button>

            {loanResult && (
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Monthly EMI</div>
                    <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      {formatInr(loanResult.emi)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Interest</div>
                    <div className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      {formatInr(loanResult.totalInterest)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Amount</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {formatInr(loanResult.totalPayment)}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(loanAmount / loanResult.totalPayment) * 100}%` }}
                    className="bg-blue-600 h-full"
                    title="Principal"
                  ></div>
                  <div
                    style={{ width: `${(loanResult.totalInterest / loanResult.totalPayment) * 100}%` }}
                    className="bg-rose-500 h-full"
                    title="Interest"
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Compound Interest Calculator Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Percent className="w-5 h-5" />
                <span className="font-bold text-sm sm:text-base">Compound Interest Calculator</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/30">
                Savings
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Principal Amount (₹)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  value={ciPrincipal}
                  onChange={(e) => setCiPrincipal(Number(e.target.value))}
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Annual Rate (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    step="0.25"
                    value={ciRate}
                    onChange={(e) => setCiRate(Number(e.target.value))}
                    className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Time (Years)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={ciYears}
                    onChange={(e) => setCiYears(Number(e.target.value))}
                    className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Compounding Frequency
                </label>
                <select
                  value={ciFreq}
                  onChange={(e) => setCiFreq(e.target.value)}
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                >
                  <option value="yearly">Annually (Once a year)</option>
                  <option value="half-yearly">Half-Yearly (Twice a year)</option>
                  <option value="quarterly">Quarterly (4 times a year)</option>
                  <option value="monthly">Monthly (12 times a year)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0 space-y-4">
            <button
              onClick={calculateCi}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer transition"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Compound Interest</span>
            </button>

            {ciResult && (
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 flex justify-around text-center">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Interest Earned</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    +{formatInr(ciResult.interest)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Maturity Value</div>
                  <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {formatInr(ciResult.maturity)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. 50/30/20 Budget Planner Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5" />
                <span className="font-bold text-sm sm:text-base">50/30/20 Budget Planner</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-400/30">
                Budget
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Monthly In-Hand Income (₹)
                </label>
                <input
                  type="number"
                  min="5000"
                  step="5000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Needs % ({needsPct}%)
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="70"
                    value={needsPct}
                    onChange={(e) => setNeedsPct(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Wants % ({wantsPct}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={wantsPct}
                    onChange={(e) => setWantsPct(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Savings % ({savingsPct}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={savingsPct}
                    onChange={(e) => setSavingsPct(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0 space-y-4">
            <button
              onClick={calculateBudget}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer transition"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Budget Allocation</span>
            </button>

            {budgetResult && (
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Needs ({needsPct}%)</div>
                    <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      {formatInr(budgetResult.needs)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Wants ({wantsPct}%)</div>
                    <div className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {formatInr(budgetResult.wants)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Savings ({savingsPct}%)</div>
                    <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {formatInr(budgetResult.savings)}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                  <div style={{ width: `${needsPct}%` }} className="bg-blue-600 h-full"></div>
                  <div style={{ width: `${wantsPct}%` }} className="bg-amber-500 h-full"></div>
                  <div style={{ width: `${savingsPct}%` }} className="bg-emerald-500 h-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. Savings Goal Calculator Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span className="font-bold text-sm sm:text-base">Savings Goal Calculator</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                Target
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Target Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="5000"
                    step="5000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(Number(e.target.value))}
                    className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Current Savings (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={goalCurrent}
                    onChange={(e) => setGoalCurrent(Number(e.target.value))}
                    className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Timeframe: {goalMonths} Months
                </label>
                <input
                  type="range"
                  min="3"
                  max="60"
                  value={goalMonths}
                  onChange={(e) => setGoalMonths(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="p-5 pt-0 space-y-4">
            <button
              onClick={calculateGoal}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer transition"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Required Monthly Savings</span>
            </button>

            {goalResult && (
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 flex justify-around text-center">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Remaining to Save</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatInr(goalResult.remaining)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Required Monthly Savings</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatInr(goalResult.monthlyNeeded)}/mo
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 6. Simple Interest Calculator Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <PiggyBank className="w-5 h-5" />
                <span className="font-bold text-sm sm:text-base">Simple Interest Calculator</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                Deposit
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Principal Amount (₹)
                </label>
                <input
                  type="number"
                  value={siPrincipal}
                  onChange={(e) => setSiPrincipal(Number(e.target.value))}
                  className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    value={siRate}
                    onChange={(e) => setSiRate(Number(e.target.value))}
                    className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Time Period (Years)
                  </label>
                  <input
                    type="number"
                    value={siYears}
                    onChange={(e) => setSiYears(Number(e.target.value))}
                    className="w-full bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-semibold outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0 space-y-4">
            <button
              onClick={calculateSi}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-sm shadow-blue-500/20 cursor-pointer transition"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Simple Interest</span>
            </button>

            {siResult && (
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 flex justify-around text-center">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Interest</div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    +{formatInr(siResult.interest)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Maturity</div>
                  <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {formatInr(siResult.total)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
