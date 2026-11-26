import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShieldCheck,
  PlusCircle,
  MinusCircle,
  CreditCard,
  Target,
  PiggyBank,
  Compass,
  ArrowRight,
  Sparkles,
  Flame,
  AlertTriangle,
  Award,
  ChevronRight,
  LifeBuoy,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { FINANCIAL_LEVELS } from '../data/initialData';
import { TabType } from '../components/BottomNav';
import { Transaction } from '../types';

interface HomeViewProps {
  onOpenTransaction: (type: 'income' | 'expense' | 'investment') => void;
  onEditTransaction?: (tx: Transaction) => void;
  onOpenDebt: () => void;
  onOpenGoal: () => void;
  onOpenEmergencyDeposit: (mode?: 'deposit' | 'correct' | 'withdraw' | 'config') => void;
  onOpenDiagnostic: () => void;
  onNavigateTab: (tab: TabType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onOpenTransaction,
  onEditTransaction,
  onOpenDebt,
  onOpenGoal,
  onOpenEmergencyDeposit,
  onOpenDiagnostic,
  onNavigateTab,
}) => {
  const {
    netWorth,
    availableBalance,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    healthScore,
    financialLevel,
    emergencyFund,
    debts,
    goals,
    categoryBudgets,
    challenge365,
    completedChallengeDays,
    achievements,
    userXP,
  } = useFinancial();

  const levelInfo = FINANCIAL_LEVELS[financialLevel];
  const totalDebts = debts.reduce((acc, d) => acc + d.currentBalance, 0);
  const emergencyTarget = emergencyFund.essentialMonthlyExpenses * emergencyFund.targetMonths;
  const emergencyPct = Math.min(100, Math.round((emergencyFund.currentAmount / emergencyTarget) * 100));

  // Overbudget alerts
  const overBudgetCategories = categoryBudgets.filter(
    (c) => c.spent > c.budgetLimit && c.budgetLimit > 0
  );

  const activeDailyChallenge = challenge365.find((c) => c.day === 30) || challenge365[0];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* 1. Header Greeting & Health Score Hero */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Slogan & Health diagnostic */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${levelInfo.badgeBg}`}>
                {levelInfo.title}
              </span>
              <span className="text-xs text-slate-400 font-medium">Jornada da Liberdade</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Meu Dinheiro Hoje
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {healthScore >= 70
                ? '“Você está em uma boa trajetória. Seu próximo passo é aumentar sua reserva de emergência e diversificar aportes.”'
                : healthScore >= 50
                ? '“Você controla melhor o dinheiro, mas ainda possui vulnerabilidades com juros e contas variáveis.”'
                : '“Atenção ao fluxo: priorize estancar as dívidas do cartão e fechar o mês no azul.”'}
            </p>
          </div>

          {/* Health Gauge Widget */}
          <div className="flex items-center space-x-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 self-start md:self-auto">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-700"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={163}
                  strokeDashoffset={163 - (163 * healthScore) / 100}
                  className={
                    healthScore >= 70
                      ? 'text-emerald-400'
                      : healthScore >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-base font-black text-white leading-none">{healthScore}</span>
                <span className="text-[9px] text-slate-400 font-bold">/100</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-white block">Saúde Financeira</span>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                {healthScore >= 70 ? '🟢 Saudável & Seguro' : healthScore >= 50 ? '🟡 Em Organização' : '🔴 Zona de Risco'}
              </span>
              <button
                onClick={onOpenDiagnostic}
                className="text-[10px] text-slate-400 hover:text-white underline mt-1 flex items-center"
              >
                <span>Ver Diagnóstico</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Financial Dashboard Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Patrimônio Líquido */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Patrimônio</span>
            <PiggyBank className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            R$ {netWorth.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +R$ 650 este mês
          </span>
        </div>

        {/* Saldo Disponível */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Saldo Livre</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
            R$ {availableBalance.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Livre para alocação</span>
        </div>

        {/* Receitas do Mês */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Receitas</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            R$ {monthlyIncome.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Salário + Extras</span>
        </div>

        {/* Despesas do Mês */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Despesas</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            R$ {monthlyExpenses.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">73% da renda</span>
        </div>

        {/* Sobra Líquida */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Sobra Mensal</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
            R$ {monthlySavings.toLocaleString('pt-BR')}
          </div>
          <span className="text-[10px] text-amber-400/90 font-medium">Capacidade de aporte</span>
        </div>
      </section>

      {/* 3. Ações Rápidas */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          <button
            id="btn-quick-income"
            onClick={() => onOpenTransaction('income')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition group text-slate-200"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">+ Receita</span>
          </button>

          <button
            id="btn-quick-expense"
            onClick={() => onOpenTransaction('expense')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/80 transition group text-slate-200"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <MinusCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">− Despesa</span>
          </button>

          <button
            id="btn-quick-debt"
            onClick={onOpenDebt}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition group text-slate-200"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">💳 Dívida</span>
          </button>

          <button
            id="btn-quick-goal"
            onClick={onOpenGoal}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition group text-slate-200"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">🎯 Meta</span>
          </button>

          <button
            id="btn-quick-invest"
            onClick={() => onOpenEmergencyDeposit('deposit')}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 transition group text-slate-200"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <PiggyBank className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">💰 Investir</span>
          </button>

          <button
            id="btn-quick-diagnostic"
            onClick={onOpenDiagnostic}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition group text-slate-200"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">🧭 Diagnóstico</span>
          </button>
        </div>
      </section>

      {/* 4. Priority Alerts & Highlights (Overbudget & Emergency Fund) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emergency Fund Progress Card */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <LifeBuoy className="w-5 h-5 text-sky-400" />
              <h3 className="font-bold text-sm text-white">Reserva de Emergência</h3>
            </div>
            <span className="text-xs font-bold text-sky-400">
              {emergencyTarget > 0 ? `${emergencyPct}% concluído` : 'Não configurada'}
            </span>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${emergencyTarget > 0 ? emergencyPct : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 pt-1">
              <span>Guardado: <strong>R$ {emergencyFund.currentAmount.toLocaleString('pt-BR')}</strong></span>
              <span>Meta ({emergencyFund.targetMonths || 6}m): <strong>R$ {emergencyTarget.toLocaleString('pt-BR')}</strong></span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {emergencyFund.monthlyContribution > 0 && emergencyTarget > emergencyFund.currentAmount ? (
              <>
                Guardando <strong>R$ {emergencyFund.monthlyContribution}/mês</strong>, você alcançará sua meta em aproximadamente{' '}
                <strong>{Math.ceil((emergencyTarget - emergencyFund.currentAmount) / emergencyFund.monthlyContribution)} meses</strong>.
              </>
            ) : emergencyTarget > 0 && emergencyFund.currentAmount >= emergencyTarget ? (
              <span className="text-emerald-400 font-semibold">Parabéns! Sua reserva de emergência está 100% constituída.</span>
            ) : (
              <span>Defina seus gastos essenciais no Diagnóstico ou faça seu primeiro aporte para proteger sua família contra imprevistos.</span>
            )}
          </p>

          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={() => onOpenEmergencyDeposit('deposit')}
              className="flex-1 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-semibold text-xs border border-sky-500/20 transition flex items-center justify-center space-x-1"
            >
              <span>Aportar (+25 XP)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenEmergencyDeposit('correct')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition"
              title="Corrigir ou ajustar saldo da reserva"
            >
              Corrigir Saldo
            </button>
          </div>
        </div>

        {/* Smart Category Alerts */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-white">Radar de Categorias do Mês</h3>
            </div>
            <button
              onClick={() => onNavigateTab('dinheiro')}
              className="text-xs text-emerald-400 hover:underline font-medium"
            >
              Ver Orçamento
            </button>
          </div>

          <div className="space-y-2.5">
            {categoryBudgets.filter((c) => c.spent > 0).length === 0 ? (
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/40 text-center space-y-1">
                <span className="text-xs text-slate-300 font-medium block">Nenhum gasto registrado este mês</span>
                <span className="text-[11px] text-slate-500 block">Use as ações rápidas acima para lançar sua primeira receita ou despesa.</span>
              </div>
            ) : (
              categoryBudgets
                .filter((c) => c.spent > 0)
                .slice(0, 2)
                .map((cat) => {
                  const isOver = cat.budgetLimit > 0 && cat.spent > cat.budgetLimit;
                  const ratio = cat.budgetLimit > 0 ? Math.round((cat.spent / cat.budgetLimit) * 100) : 100;
                  return (
                    <div
                      key={cat.category}
                      className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white block capitalize">{cat.category}</span>
                        <span className="text-[11px] text-slate-400">
                          Gasto: R$ {cat.spent.toLocaleString('pt-BR')} {cat.budgetLimit > 0 && `/ Meta: R$ ${cat.budgetLimit.toLocaleString('pt-BR')}`}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${
                          isOver
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {isOver ? `🔴 ${ratio}% do orçamento` : `🟢 ${ratio}% (Sob controle)`}
                      </span>
                    </div>
                  );
                })
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            Dica do Vida Financeira: Manter suas despesas essenciais abaixo de 50% da sua renda garante estabilidade duradoura.
          </p>
        </div>
      </section>

      {/* 5. Highlight: Desafio dos 365 Dias & Academia */}
      <section className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-900/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Desafio dos 365 Dias — Dia {activeDailyChallenge.day}</h3>
              <p className="text-xs text-slate-400">Construindo hábitos sólidos um dia de cada vez</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            +{activeDailyChallenge.xp} XP
          </span>
        </div>

        <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
          <h4 className="text-sm font-bold text-white">{activeDailyChallenge.title}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{activeDailyChallenge.action}</p>
          <div className="text-[11px] text-amber-300 font-medium pt-1">
            💡 {activeDailyChallenge.tip}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onNavigateTab('aprender')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center space-x-1"
          >
            <span>Ver Todas as Trilhas da Academia</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateTab('ia')}
            className="text-xs px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consultar IA Financeira</span>
          </button>
        </div>
      </section>
    </div>
  );
};
