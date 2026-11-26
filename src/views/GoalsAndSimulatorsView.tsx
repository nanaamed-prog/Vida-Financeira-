import React, { useState, useMemo } from 'react';
import {
  Target,
  Calculator,
  TrendingUp,
  PlusCircle,
  PiggyBank,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Flame,
  Sparkles,
  Zap,
  Clock,
  Percent,
  Home,
  Trash2,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { FinancialGoal } from '../types';

interface GoalsAndSimulatorsViewProps {
  onOpenGoal: () => void;
}

export const GoalsAndSimulatorsView: React.FC<GoalsAndSimulatorsViewProps> = ({
  onOpenGoal,
}) => {
  const { goals, contributeToGoal, deleteGoal } = useFinancial();
  const [activeTab, setActiveTab] = useState<'metas' | 'juros' | 'aposentadoria' | 'vista_parcelado' | 'amortizacao'>('metas');

  // 1. Compound Interest Simulator State
  const [ciInitial, setCiInitial] = useState('5000');
  const [ciMonthly, setCiMonthly] = useState('650');
  const [ciYears, setCiYears] = useState('15');
  const [ciAnnualRate, setCiAnnualRate] = useState('11.0');

  // Math for Compound Interest
  const compoundInterestResult = useMemo(() => {
    const P = parseFloat(ciInitial) || 0;
    const PMT = parseFloat(ciMonthly) || 0;
    const years = parseInt(ciYears) || 1;
    const annualRate = (parseFloat(ciAnnualRate) || 0) / 100;
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    const totalMonths = years * 12;

    const dataPoints: { year: number; invested: number; total: number; interest: number }[] = [];
    let currentTotal = P;
    let currentInvested = P;

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        currentTotal = currentTotal * (1 + monthlyRate) + PMT;
        currentInvested += PMT;
      }
      dataPoints.push({
        year: y,
        invested: Math.round(currentInvested),
        total: Math.round(currentTotal),
        interest: Math.round(Math.max(0, currentTotal - currentInvested)),
      });
    }

    const finalTotal = currentTotal;
    const finalInvested = currentInvested;
    const finalInterest = Math.max(0, finalTotal - finalInvested);

    return {
      finalTotal: Math.round(finalTotal),
      finalInvested: Math.round(finalInvested),
      finalInterest: Math.round(finalInterest),
      dataPoints,
    };
  }, [ciInitial, ciMonthly, ciYears, ciAnnualRate]);

  // 2. Viver de Renda / Aposentadoria State
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState('8000');
  const [swrRate, setSwrRate] = useState('0.6'); // 0.6% real monthly yield (~7.4% a.a. real)
  const [monthlyContribution, setMonthlyContribution] = useState('1200');

  const retirementMath = useMemo(() => {
    const desiredMonthly = parseFloat(targetMonthlyIncome) || 8000;
    const rateMonthly = (parseFloat(swrRate) || 0.6) / 100;
    const monthlyAporte = parseFloat(monthlyContribution) || 1000;

    // Required capital = desired income / safe monthly withdrawal rate
    const requiredCapital = rateMonthly > 0 ? desiredMonthly / rateMonthly : 0;

    // Approximate years to reach target
    let currentAccum = 0;
    let months = 0;
    while (currentAccum < requiredCapital && months < 600) {
      currentAccum = currentAccum * (1 + rateMonthly) + monthlyAporte;
      months++;
    }

    return {
      requiredCapital: Math.round(requiredCapital),
      yearsNeeded: Math.round((months / 12) * 10) / 10,
    };
  }, [targetMonthlyIncome, swrRate, monthlyContribution]);

  // 3. À Vista vs Parcelado State
  const [cashPrice, setCashPrice] = useState('3000');
  const [cashDiscountPct, setCashDiscountPct] = useState('10');
  const [installmentsCount, setInstallmentsCount] = useState('10');
  const [cdiAnnualRate, setCdiAnnualRate] = useState('11.5');

  const cashVsInstallmentsMath = useMemo(() => {
    const orig = parseFloat(cashPrice) || 3000;
    const disc = parseFloat(cashDiscountPct) || 0;
    const n = parseInt(installmentsCount) || 1;
    const cdi = (parseFloat(cdiAnnualRate) || 11.5) / 100;
    const monthlyCdi = Math.pow(1 + cdi, 1 / 12) - 1;

    const actualCashPaid = orig * (1 - disc / 100);
    const installmentVal = orig / n;

    // If paying in installments while investing the cash upfront:
    let investmentBalance = orig;
    let totalInterestEarned = 0;

    for (let i = 0; i < n; i++) {
      investmentBalance -= installmentVal;
      const monthlyReturn = investmentBalance * monthlyCdi;
      investmentBalance += monthlyReturn;
      totalInterestEarned += monthlyReturn;
    }

    const cashSavings = orig - actualCashPaid;
    const isCashBetter = cashSavings > totalInterestEarned;

    return {
      actualCashPaid: Math.round(actualCashPaid),
      cashSavings: Math.round(cashSavings),
      installmentVal: Math.round(installmentVal),
      totalInterestEarned: Math.round(totalInterestEarned),
      isCashBetter,
      difference: Math.round(Math.abs(cashSavings - totalInterestEarned)),
    };
  }, [cashPrice, cashDiscountPct, installmentsCount, cdiAnnualRate]);

  // 4. Amortização Extraordinária State
  const [finLoanAmount, setFinLoanAmount] = useState('300000');
  const [finMonthlyRate, setFinMonthlyRate] = useState('0.85'); // ~10.7% a.a.
  const [finTotalMonths, setFinTotalMonths] = useState('360'); // 30 anos
  const [finExtraMonthly, setFinExtraMonthly] = useState('600');

  const amortizacaoMath = useMemo(() => {
    const loan = parseFloat(finLoanAmount) || 300000;
    const rate = (parseFloat(finMonthlyRate) || 0.85) / 100;
    const originalMonths = parseInt(finTotalMonths) || 360;
    const extra = parseFloat(finExtraMonthly) || 0;

    // Normal SAC amortization
    const normalPrincipalPayment = loan / originalMonths;
    let totalInterestNormal = 0;
    let balanceNormal = loan;
    for (let i = 0; i < originalMonths; i++) {
      totalInterestNormal += balanceNormal * rate;
      balanceNormal -= normalPrincipalPayment;
    }

    // With extra monthly amortization
    let balanceAccelerated = loan;
    let totalInterestAccelerated = 0;
    let monthsElapsed = 0;
    while (balanceAccelerated > 0 && monthsElapsed < originalMonths) {
      monthsElapsed++;
      const interestDue = balanceAccelerated * rate;
      totalInterestAccelerated += interestDue;
      const principalPaid = normalPrincipalPayment + extra;
      balanceAccelerated -= principalPaid;
    }

    const interestSaved = Math.max(0, totalInterestNormal - totalInterestAccelerated);
    const yearsReduced = Math.round(((originalMonths - monthsElapsed) / 12) * 10) / 10;

    return {
      normalTotalInterest: Math.round(totalInterestNormal),
      acceleratedTotalInterest: Math.round(totalInterestAccelerated),
      interestSaved: Math.round(interestSaved),
      monthsToPayoff: monthsElapsed,
      yearsReduced,
    };
  }, [finLoanAmount, finMonthlyRate, finTotalMonths, finExtraMonthly]);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Metas & Simuladores Financeiros</h1>
          <p className="text-xs text-slate-400">Planejamento de longo prazo, juros compostos e amortizações</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('metas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'metas' ? 'bg-emerald-600 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Metas ({goals.length})
          </button>
          <button
            onClick={() => setActiveTab('juros')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'juros' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Juros Compostos
          </button>
          <button
            onClick={() => setActiveTab('aposentadoria')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'aposentadoria' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            👑 Viver de Renda
          </button>
          <button
            onClick={() => setActiveTab('vista_parcelado')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'vista_parcelado' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚖️ À Vista vs Parcelado
          </button>
          <button
            onClick={() => setActiveTab('amortizacao')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'amortizacao' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏠 Financiamento & SAC
          </button>
        </div>
      </div>

      {/* 1. METAS FINANCEIRAS */}
      {activeTab === 'metas' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Seus Grandes Objetivos de Vida
            </h2>
            <button
              onClick={onOpenGoal}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nova Meta</span>
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">Nenhuma meta cadastrada</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Defina objetivos claros (como trocar de carro, viagem dos sonhos ou comprar uma casa) com prazos e valores para automatizar seu plano de aportes.
              </p>
              <button
                onClick={onOpenGoal}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition inline-flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Criar Minha Primeira Meta</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((g) => {
                const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                const remaining = Math.max(0, g.targetAmount - g.currentAmount);
                const monthlyRequired = Math.round(remaining / g.deadlineMonths);

                return (
                  <div
                    key={g.id}
                    className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-base text-white">{g.title}</h3>
                        <span className="text-xs text-slate-400 capitalize">Prazo: {g.deadlineMonths} meses</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-emerald-400">
                          R$ {g.targetAmount.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-xs text-slate-400 block">{pct}% conquistado</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 bg-emerald-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Guardado: R$ {g.currentAmount.toLocaleString('pt-BR')}</span>
                        <span>Falta: R$ {remaining.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>

                    {/* Dynamic calculation card */}
                    <div className="p-3 bg-slate-800/80 rounded-xl text-xs text-slate-300">
                      <span className="text-slate-400 block text-[11px]">Plano de Aportes:</span>
                      Para atingir esta meta no prazo, guarde <strong>R$ {monthlyRequired.toLocaleString('pt-BR')}/mês</strong>.
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        onClick={() => contributeToGoal ? contributeToGoal(g.id, 250) : null}
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition flex items-center justify-center space-x-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Aportar R$ 250 (+20 XP)</span>
                      </button>
                      <button
                        onClick={() => deleteGoal(g.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition"
                        title="Excluir meta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. SIMULADOR DE JUROS COMPOSTOS */}
      {activeTab === 'juros' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">A Oitava Maravilha do Mundo</span>
              <h2 className="text-xl font-black text-white">Simulador de Juros Compostos</h2>
              <p className="text-xs text-slate-300">Descubra o efeito multiplicador do tempo e da disciplina sobre o seu patrimônio.</p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Aporte Inicial (R$)</label>
                <input
                  type="number"
                  step="500"
                  value={ciInitial}
                  onChange={(e) => setCiInitial(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Aporte Mensal (R$)</label>
                <input
                  type="number"
                  step="50"
                  value={ciMonthly}
                  onChange={(e) => setCiMonthly(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Prazo (Anos)</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={ciYears}
                  onChange={(e) => setCiYears(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Taxa Anual (% a.a.)</label>
                <input
                  type="number"
                  step="0.5"
                  value={ciAnnualRate}
                  onChange={(e) => setCiAnnualRate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Results cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30">
                <span className="text-xs text-indigo-300 block">Patrimônio Total Acumulado</span>
                <span className="text-2xl font-black text-indigo-400">
                  R$ {compoundInterestResult.finalTotal.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-xs text-slate-400 block">Total Investido do Seu Bolso</span>
                <span className="text-2xl font-black text-white">
                  R$ {compoundInterestResult.finalInvested.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-xs text-emerald-300 block">Juros Puros Ganhos (Lucro)</span>
                <span className="text-2xl font-black text-emerald-400">
                  + R$ {compoundInterestResult.finalInterest.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>

            {/* Visual SVG Timeline Bar */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-300">Evolução do Patrimônio ao longo dos Anos:</span>
              <div className="h-32 flex items-end space-x-1 sm:space-x-2 pt-4">
                {compoundInterestResult.dataPoints.map((pt) => {
                  const heightPct = Math.round((pt.total / compoundInterestResult.finalTotal) * 100);
                  return (
                    <div key={pt.year} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-[10px] text-white px-2 py-1 rounded shadow-lg pointer-events-none transition whitespace-nowrap z-20">
                        Ano {pt.year}: R$ {pt.total.toLocaleString('pt-BR')}
                      </div>
                      <div
                        className="w-full bg-indigo-500 hover:bg-indigo-400 rounded-t transition-all"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                      <span className="text-[9px] text-slate-500 mt-1">{pt.year}a</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SIMULADOR VIVER DE RENDA */}
      {activeTab === 'aposentadoria' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Independência Financeira</span>
              <h2 className="text-xl font-black text-white">Simulador de Aposentadoria & Renda Passiva</h2>
              <p className="text-xs text-slate-300">Calcule o patrimônio necessário para nunca mais depender de um salário fixo.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Renda Mensal Desejada (R$/mês)
                </label>
                <input
                  type="number"
                  step="500"
                  value={targetMonthlyIncome}
                  onChange={(e) => setTargetMonthlyIncome(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Rendimento Real Mensal Seguro (% a.m.)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={swrRate}
                  onChange={(e) => setSwrRate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-500 block mt-0.5">0.5% a 0.6% a.m. acima da inflação</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Aporte Mensal Atual (R$/mês)
                </label>
                <input
                  type="number"
                  step="100"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold text-emerald-400 focus:border-purple-500"
                />
              </div>
            </div>

            <div className="p-6 bg-purple-950/40 border border-purple-500/30 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Patrimônio Necessário para Viver de Renda:</span>
              <div className="text-3xl font-black text-purple-400">
                R$ {retirementMath.requiredCapital.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-slate-300">
                Investindo <strong>R$ {monthlyContribution}/mês</strong> de forma consistente, você alcançará este montante em aproximadamente <strong>{retirementMath.yearsNeeded} anos</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. SIMULADOR À VISTA VS PARCELADO */}
      {activeTab === 'vista_parcelado' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Decisão de Compra Inteligente</span>
              <h2 className="text-xl font-black text-white">Simulador À Vista vs Parcelado</h2>
              <p className="text-xs text-slate-300">Descubra se vale mais a pena pagar com desconto à vista ou parcelar sem juros investindo o dinheiro.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Preço Total (R$)</label>
                <input
                  type="number"
                  value={cashPrice}
                  onChange={(e) => setCashPrice(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Desconto à Vista (%)</label>
                <input
                  type="number"
                  value={cashDiscountPct}
                  onChange={(e) => setCashDiscountPct(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nº de Parcelas</label>
                <input
                  type="number"
                  value={installmentsCount}
                  onChange={(e) => setInstallmentsCount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Rendimento CDI (% a.a.)</label>
                <input
                  type="number"
                  value={cdiAnnualRate}
                  onChange={(e) => setCdiAnnualRate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-5 bg-slate-800/90 border border-slate-700 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {cashVsInstallmentsMath.isCashBetter ? '🏆' : '💳'}
                </span>
                <h3 className="font-bold text-base text-white">
                  {cashVsInstallmentsMath.isCashBetter
                    ? 'Opção Vencedora: PAGAR À VISTA'
                    : 'Opção Vencedora: PARCELAR E INVESTIR'}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl">
                  <span className="text-slate-400 block">Economia à vista com desconto:</span>
                  <strong className="text-emerald-400 text-sm">R$ {cashVsInstallmentsMath.cashSavings.toLocaleString('pt-BR')}</strong>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl">
                  <span className="text-slate-400 block">Rendimento gerado se parcelar:</span>
                  <strong className="text-sky-400 text-sm">R$ {cashVsInstallmentsMath.totalInterestEarned.toLocaleString('pt-BR')}</strong>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                {cashVsInstallmentsMath.isCashBetter
                  ? `O desconto oferecido (R$ ${cashVsInstallmentsMath.cashSavings}) supera em R$ ${cashVsInstallmentsMath.difference} o rendimento que você obteria deixando o dinheiro no CDI.`
                  : `Vale a pena parcelar! O dinheiro rendendo no CDI gerará R$ ${cashVsInstallmentsMath.difference} a mais do que o desconto à vista.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. SIMULADOR AMORTIZAÇÃO FINANCIAMENTO */}
      {activeTab === 'amortizacao' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Blindagem de Patrimônio Imobiliário</span>
              <h2 className="text-xl font-black text-white">Simulador de Amortização Extraordinária (SAC / Price)</h2>
              <p className="text-xs text-slate-300">Veja o poder brutal de amortizar R$ 500 a R$ 1.000 extras por mês para quitar seu financiamento de 30 anos em menos de 10 anos.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Saldo Devedor (R$)</label>
                <input
                  type="number"
                  step="10000"
                  value={finLoanAmount}
                  onChange={(e) => setFinLoanAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Juros (% a.m.)</label>
                <input
                  type="number"
                  step="0.05"
                  value={finMonthlyRate}
                  onChange={(e) => setFinMonthlyRate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Prazo Original (Meses)</label>
                <input
                  type="number"
                  value={finTotalMonths}
                  onChange={(e) => setFinTotalMonths(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Amortização Extra (R$/mês)</label>
                <input
                  type="number"
                  step="100"
                  value={finExtraMonthly}
                  onChange={(e) => setFinExtraMonthly(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-emerald-400 focus:border-sky-500"
                />
              </div>
            </div>

            {/* Impact results banner */}
            <div className="p-6 bg-sky-950/40 border border-sky-500/30 rounded-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-sky-300 block">Juros Totais Economizados:</span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                    R$ {amortizacaoMath.interestSaved.toLocaleString('pt-BR')}
                  </div>
                  <span className="text-xs text-slate-400">Dinheiro que não vai para o lucro do banco</span>
                </div>

                <div>
                  <span className="text-xs text-sky-300 block">Tempo Total Reduzido:</span>
                  <div className="text-2xl sm:text-3xl font-black text-sky-400">
                    - {amortizacaoMath.yearsReduced} anos
                  </div>
                  <span className="text-xs text-slate-400">
                    Quitado em apenas {Math.round(amortizacaoMath.monthsToPayoff / 12 * 10) / 10} anos
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                💡 <strong>Dica de ouro:</strong> Ao solicitar amortização no aplicativo do banco, sempre escolha a opção <strong>"Reduzir Prazo"</strong> (e não reduzir valor da parcela) para abater direto o saldo devedor principal.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
