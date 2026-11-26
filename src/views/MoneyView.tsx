import React, { useState } from 'react';
import {
  Wallet,
  PieChart,
  ShieldAlert,
  LifeBuoy,
  TrendingUp,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Calculator,
  ArrowRight,
  Sparkles,
  Zap,
  Sliders,
  DollarSign,
  FileText,
  Edit3,
  ArrowDownRight,
  Settings,
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
} from 'lucide-react';
import { useFinancial, BUDGET_MODES } from '../context/FinancialContext';
import { BudgetMode, CategoryKey, DebtItem, Transaction } from '../types';

interface MoneyViewProps {
  onOpenTransaction: (type: 'income' | 'expense' | 'investment') => void;
  onEditTransaction?: (tx: Transaction) => void;
  onOpenCategoryBudget?: (category?: CategoryKey) => void;
  onOpenDebt: () => void;
  onOpenEmergencyDeposit: (mode?: 'deposit' | 'correct' | 'withdraw' | 'config') => void;
}

export const MoneyView: React.FC<MoneyViewProps> = ({
  onOpenTransaction,
  onEditTransaction,
  onOpenCategoryBudget,
  onOpenDebt,
  onOpenEmergencyDeposit,
}) => {
  const {
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    categoryBudgets,
    budgetMode,
    setBudgetMode,
    updateCategoryBudget,
    debts,
    deleteDebt,
    payDebtInstallment,
    emergencyFund,
    transactions,
    deleteTransaction,
  } = useFinancial();

  const [activeSubTab, setActiveSubTab] = useState<'orcamento' | 'dividas' | 'reserva' | 'transacoes'>('orcamento');
  const [debtStrategy, setDebtStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [showNegotiationLetter, setShowNegotiationLetter] = useState<string | null>(null);

  // Budget and Transactions edit/filter states
  const [budgetTxFilter, setBudgetTxFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'expense' | 'income' | 'investment'>('all');
  const [budgetSearch, setBudgetSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Math for smart budget analysis
  const essentialTotal = categoryBudgets
    .filter((c) => c.group === 'essencial')
    .reduce((acc, c) => acc + c.spent, 0);
  const lifestyleTotal = categoryBudgets
    .filter((c) => c.group === 'estilo_vida')
    .reduce((acc, c) => acc + c.spent, 0);
  const investmentTotal = categoryBudgets
    .filter((c) => c.group === 'investimento')
    .reduce((acc, c) => acc + c.spent, 0);

  const essentialPct = monthlyIncome > 0 ? Math.round((essentialTotal / monthlyIncome) * 100) : 60;
  const lifestylePct = monthlyIncome > 0 ? Math.round((lifestyleTotal / monthlyIncome) * 100) : 25;
  const investmentPct = monthlyIncome > 0 ? Math.round((investmentTotal / monthlyIncome) * 100) : 15;

  // Debt Calculations
  const totalDebtBalance = debts.reduce((acc, d) => acc + d.currentBalance, 0);
  const totalMonthlyDebtInstallments = debts.reduce((acc, d) => acc + d.installmentAmount, 0);

  // Sort debts based on strategy
  const sortedDebts = [...debts].sort((a, b) => {
    if (debtStrategy === 'avalanche') {
      return b.interestRateMonthly - a.interestRateMonthly; // Highest interest first
    } else {
      return a.currentBalance - b.currentBalance; // Lowest balance first
    }
  });

  const emergencyTarget = emergencyFund.essentialMonthlyExpenses * emergencyFund.targetMonths;
  const emergencyCurrent = emergencyFund.currentAmount;
  const emergencyPct = Math.min(100, Math.round((emergencyCurrent / emergencyTarget) * 100));
  const emergencyRemaining = Math.max(0, emergencyTarget - emergencyCurrent);
  const monthsToEmergencyTarget = emergencyFund.monthlyContribution > 0
    ? Math.ceil(emergencyRemaining / emergencyFund.monthlyContribution)
    : 12;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header & Sub-tab navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Gestão Financeira & Orçamento</h1>
          <p className="text-xs text-slate-400">Controle de despesas, central de dívidas, reserva e orçamento inteligente</p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('orcamento')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'orcamento'
                ? 'bg-emerald-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Orçamento
          </button>
          <button
            onClick={() => setActiveSubTab('dividas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1 ${
              activeSubTab === 'dividas'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>💣 Dívidas</span>
            {debts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] font-extrabold text-rose-300">
                {debts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('reserva')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'reserva'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛟 Reserva
          </button>
          <button
            onClick={() => setActiveSubTab('transacoes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'transacoes'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💳 Extrato ({transactions.length})
          </button>
        </div>
      </div>

      {/* SUBTAB 1: ORÇAMENTO INTELIGENTE & CATEGORIAS */}
      {activeSubTab === 'orcamento' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Smart Budget AI Diagnostic Card */}
          <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Análise do Orçamento Inteligente</span>
                </span>
                <h2 className="text-lg font-extrabold text-white">
                  Sua renda é de R$ {monthlyIncome.toLocaleString('pt-BR')}
                </h2>
                <div className="text-xs text-slate-300 space-y-1">
                  <p>• Suas despesas essenciais representam <strong>{essentialPct}%</strong> da renda (R$ {essentialTotal.toLocaleString('pt-BR')}).</p>
                  <p>• Você está gastando <strong>{lifestylePct}%</strong> com estilo de vida e despesas que podem ser otimizadas.</p>
                  <p>• Sua capacidade atual de investimento é de aproximadamente <strong>R$ {monthlySavings.toLocaleString('pt-BR')}/mês</strong>.</p>
                </div>
              </div>

              {/* Mode Selector & Quick Edit */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-2.5 min-w-[260px]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Modo de Orçamento:</span>
                  <button
                    type="button"
                    onClick={() => onOpenCategoryBudget?.()}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center space-x-1 transition"
                    title="Configurar limites manuais de cada categoria"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Ajustar Tetos</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['conservador', 'equilibrado', 'acelerado'] as BudgetMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setBudgetMode(m)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition capitalize ${
                        budgetMode === m
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 leading-snug">
                  {BUDGET_MODES[budgetMode].description}
                </p>
              </div>
            </div>

            {/* Distribution Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span className="text-sky-400">Essenciais ({essentialPct}%)</span>
                <span className="text-amber-400">Estilo de Vida ({lifestylePct}%)</span>
                <span className="text-emerald-400">Investimentos ({investmentPct}%)</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
                <div className="bg-sky-500 h-full" style={{ width: `${essentialPct}%` }}></div>
                <div className="bg-amber-500 h-full" style={{ width: `${lifestylePct}%` }}></div>
                <div className="bg-emerald-500 h-full" style={{ width: `${investmentPct}%` }}></div>
              </div>
            </div>
          </section>

          {/* Categorias e Controle de Gastos com Edição de Tetos */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <span>Controle de Gastos por Categoria</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Acompanhe e edite os limites planejados para cada categoria
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <button
                  type="button"
                  onClick={() => onOpenCategoryBudget?.()}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold transition flex items-center space-x-1.5"
                  title="Editar os limites de gastos por categoria"
                >
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Editar Tetos</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTransaction('expense')}
                  className="text-xs px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold transition flex items-center space-x-1 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nova Despesa</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTransaction('income')}
                  className="text-xs px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition flex items-center space-x-1 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Nova Receita</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {categoryBudgets.map((cat) => {
                const pct = cat.budgetLimit > 0 ? Math.round((cat.spent / cat.budgetLimit) * 100) : 0;
                const isOver = pct > 100;
                const isWarning = pct > 85 && pct <= 100;

                return (
                  <div
                    key={cat.category}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 transition hover:border-slate-700 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white">{cat.name}</span>
                          <button
                            type="button"
                            onClick={() => onOpenCategoryBudget?.(cat.category)}
                            title={`Editar teto de ${cat.name}`}
                            className="p-1 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs text-slate-400">
                          Gasto: <strong className={isOver ? 'text-rose-400' : 'text-slate-300'}>R$ {cat.spent.toLocaleString('pt-BR')}</strong> / Teto: R$ {cat.budgetLimit.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      {/* Pill indicator */}
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                          isOver
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse'
                            : isWarning
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isOver ? `🔴 ${pct}% do orçamento` : isWarning ? `🟡 ${pct}%` : `🟢 ${pct}%`}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lançamentos do Orçamento: Editar ou Excluir Despesas e Receitas */}
          <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Despesas & Receitas do Orçamento</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Edite valores, datas e categorias ou exclua lançamentos do orçamento
                </p>
              </div>

              {/* Action tabs & search */}
              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <div className="flex p-1 bg-slate-800 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setBudgetTxFilter('all')}
                    className={`px-3 py-1 rounded-lg transition ${
                      budgetTxFilter === 'all'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Todas ({transactions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetTxFilter('expense')}
                    className={`px-3 py-1 rounded-lg transition ${
                      budgetTxFilter === 'expense'
                        ? 'bg-rose-500 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Despesas ({transactions.filter((t) => t.type === 'expense').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetTxFilter('income')}
                    className={`px-3 py-1 rounded-lg transition ${
                      budgetTxFilter === 'income'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Receitas ({transactions.filter((t) => t.type === 'income').length})
                  </button>
                </div>
              </div>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar despesa ou receita por nome ou categoria..."
                value={budgetSearch}
                onChange={(e) => setBudgetSearch(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>

            {/* List of items */}
            {transactions.filter((t) => {
              if (budgetTxFilter !== 'all' && t.type !== budgetTxFilter) return false;
              if (budgetSearch) {
                const term = budgetSearch.toLowerCase();
                return (
                  t.description.toLowerCase().includes(term) ||
                  t.category.toLowerCase().includes(term) ||
                  (t.notes && t.notes.toLowerCase().includes(term))
                );
              }
              return true;
            }).length === 0 ? (
              <div className="p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-sm font-semibold text-slate-300 block">
                  Nenhum lançamento encontrado
                </span>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {budgetSearch
                    ? 'Tente buscar com outro termo.'
                    : 'Adicione uma receita ou despesa para compor o seu orçamento mensal.'}
                </p>
                <div className="flex items-center justify-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenTransaction('expense')}
                    className="text-xs px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold transition"
                  >
                    + Adicionar Despesa
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenTransaction('income')}
                    className="text-xs px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition"
                  >
                    + Adicionar Receita
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80 bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden">
                {transactions
                  .filter((t) => {
                    if (budgetTxFilter !== 'all' && t.type !== budgetTxFilter) return false;
                    if (budgetSearch) {
                      const term = budgetSearch.toLowerCase();
                      return (
                        t.description.toLowerCase().includes(term) ||
                        t.category.toLowerCase().includes(term) ||
                        (t.notes && t.notes.toLowerCase().includes(term))
                      );
                    }
                    return true;
                  })
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition"
                    >
                      <div className="flex items-start sm:items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            tx.type === 'income'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : tx.type === 'investment'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {tx.type === 'income' ? (
                            <ArrowUpCircle className="w-4 h-4" />
                          ) : tx.type === 'investment' ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <ArrowDownCircle className="w-4 h-4" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="font-bold text-sm text-white">{tx.description}</span>
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/80">
                              {tx.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                            <span>{tx.date}</span>
                            {tx.notes && <span className="text-amber-400/90">• {tx.notes}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Right actions: Amount + Edit + Delete */}
                      <div className="flex items-center justify-between sm:justify-end space-x-3 pl-11 sm:pl-0">
                        <span
                          className={`font-black text-sm whitespace-nowrap ${
                            tx.type === 'income'
                              ? 'text-emerald-400'
                              : tx.type === 'investment'
                              ? 'text-sky-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {tx.type === 'income' ? '+ ' : '- '}R$ {tx.amount.toLocaleString('pt-BR')}
                        </span>

                        {confirmDeleteId === tx.id ? (
                          <div className="flex items-center space-x-1.5 bg-rose-950/60 p-1 rounded-xl border border-rose-500/40 animate-in fade-in">
                            <span className="text-[10px] text-rose-300 font-bold px-1">Excluir?</span>
                            <button
                              type="button"
                              onClick={() => {
                                deleteTransaction(tx.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition"
                            >
                              Sim
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                            >
                              Não
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => onEditTransaction?.(tx)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition flex items-center space-x-1 text-xs font-semibold"
                              title="Editar despesa ou receita"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(tx.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Excluir lançamento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* SUBTAB 2: CENTRAL DE DÍVIDAS */}
      {activeSubTab === 'dividas' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Summary Banner */}
          <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Central Estratégica de Dívidas</span>
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Saldo Devedor Total: R$ {totalDebtBalance.toLocaleString('pt-BR')}
                </h2>
                <p className="text-xs text-slate-300">
                  Parcelas mensais somadas: <strong>R$ {totalMonthlyDebtInstallments.toLocaleString('pt-BR')}/mês</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenDebt}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-lg shadow-rose-950/40"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Cadastrar Nova Dívida</span>
                </button>
              </div>
            </div>

            {/* Strategy Selector (Avalanche vs Bola de Neve) */}
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Estratégia Recomendada de Ataque:</span>
                </span>
                <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setDebtStrategy('avalanche')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      debtStrategy === 'avalanche'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Método Avalanche (Maior Juro 1º)
                  </button>
                  <button
                    onClick={() => setDebtStrategy('snowball')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      debtStrategy === 'snowball'
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bola de Neve (Menor Saldo 1º)
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {debtStrategy === 'avalanche'
                  ? '🎯 O Método Avalanche prioriza a dívida com maior custo financeiro (% juros ao mês). É a forma matematicamente mais eficiente, economizando milhares de reais.'
                  : '⛄ O Método Bola de Neve foca em quitar a menor dívida primeiro para liberar credores e gerar vitórias psicológicas rápidas.'}
              </p>
            </div>
          </section>

          {/* List of Debts */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Dívidas Cadastradas ({debts.length})
            </h3>

            {sortedDebts.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white">Parabéns! Nenhuma dívida ativa.</h4>
                <p className="text-xs text-slate-400">Você está no caminho certo para acumular patrimônio sem juros nocivos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedDebts.map((debt, index) => {
                  const isTopPriority = index === 0;
                  const estimatedInterest = debt.currentBalance * (debt.interestRateMonthly / 100) * debt.remainingInstallments;

                  return (
                    <div
                      key={debt.id}
                      className={`p-5 rounded-3xl bg-slate-900 border transition relative space-y-3 ${
                        isTopPriority
                          ? 'border-amber-500/60 shadow-lg shadow-amber-950/20'
                          : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isTopPriority && (
                        <span className="absolute -top-2.5 right-4 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 uppercase tracking-wider">
                          Prioridade #1 de Pagamento
                        </span>
                      )}

                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-base text-white">{debt.creditor}</h4>
                          <span className="text-xs text-slate-400 capitalize">{debt.category.replace('_', ' ')}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-rose-400 block">
                            R$ {debt.currentBalance.toLocaleString('pt-BR')}
                          </span>
                          <span className="text-[11px] font-bold text-amber-400">
                            Juros: {debt.interestRateMonthly}% a.m.
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-800/80 rounded-xl text-xs text-slate-300">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Parcela Mensal:</span>
                          <strong>R$ {debt.installmentAmount.toLocaleString('pt-BR')}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Parcelas Restantes:</span>
                          <strong>{debt.remainingInstallments} parcelas</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Vencimento:</span>
                          <strong>{debt.dueDate}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Juros Projetados:</span>
                          <strong className="text-rose-400">+ R$ {Math.round(estimatedInterest).toLocaleString('pt-BR')}</strong>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => payDebtInstallment(debt.id)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition flex items-center justify-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Pagar Parcela</span>
                        </button>
                        <button
                          onClick={() => setShowNegotiationLetter(debt.id)}
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                          title="Simular Proposta de Renegociação"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteDebt(debt.id)}
                          className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-slate-800 transition"
                          title="Excluir dívida"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Renegotiation Letter Modal Preview */}
          {showNegotiationLetter && (
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-700 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-sm text-white">Modelo de Proposta para Renegociação Bancária</h4>
                </div>
                <button
                  onClick={() => setShowNegotiationLetter(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Fechar
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono space-y-2 whitespace-pre-wrap">
{`Prezada equipe de relacionamento / cobrança,

Venho por meio desta manifestar minha firme intenção de quitar integralmente meus débitos pendentes referentes ao contrato sob meu CPF.

Considerando minha atual capacidade orçamentária e a taxa de juros praticada, proponho formalmente a liquidação da dívida nas seguintes condições:
1. Pagamento à vista com desconto de 40% a 70% sobre os encargos de mora acumulados; OU
2. Parcelamento fixo sem juros compostos em parcelas compatíveis com minha renda comprovada.

Aguardo contato para celebração do acordo e emissão do boleto de quitação.

Atenciosamente,
Titular da Conta.`}
              </div>
              <p className="text-[11px] text-slate-400">
                💡 Dica: Utilize canais oficiais como o <em>consumidor.gov.br</em> ou o Feirão Limpa Nome para formalizar descontos de até 80% sobre dívidas atrasadas.
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: RESERVA DE EMERGÊNCIA */}
      {activeSubTab === 'reserva' && (
        <div className="space-y-6 animate-in fade-in">
          <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
                  <LifeBuoy className="w-3.5 h-3.5" />
                  <span>Blindagem e Paz Financeira</span>
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Reserva Atual: R$ {emergencyCurrent.toLocaleString('pt-BR')} ({emergencyPct}%)
                </h2>
                <p className="text-xs text-slate-300">
                  Despesas essenciais: <strong>R$ {emergencyFund.essentialMonthlyExpenses.toLocaleString('pt-BR')}/mês</strong> | Meta: <strong>R$ {emergencyTarget.toLocaleString('pt-BR')}</strong> ({emergencyFund.targetMonths} meses)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onOpenEmergencyDeposit('deposit')}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-lg shadow-sky-950/40"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Fazer Aporte</span>
                </button>
                <button
                  onClick={() => onOpenEmergencyDeposit('correct')}
                  className="px-3.5 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 font-bold text-xs transition flex items-center space-x-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Corrigir Saldo</span>
                </button>
                <button
                  onClick={() => onOpenEmergencyDeposit('withdraw')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium text-xs transition flex items-center space-x-1.5"
                >
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                  <span>Resgatar</span>
                </button>
                <button
                  onClick={() => onOpenEmergencyDeposit('config')}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                  title="Configurar metas da reserva"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Gauge progress */}
            <div className="space-y-2">
              <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${emergencyPct}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Você possui: <strong>R$ {emergencyCurrent.toLocaleString('pt-BR')}</strong></span>
                <span>Faltam: <strong className="text-amber-400">R$ {emergencyRemaining.toLocaleString('pt-BR')}</strong></span>
              </div>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-200 space-y-1">
              <span className="font-bold text-emerald-400 block">Previsão Inteligente de Conclusão:</span>
              <p>
                Guardando <strong>R$ {emergencyFund.monthlyContribution}/mês</strong>, você alcançará sua meta de R$ {emergencyTarget.toLocaleString('pt-BR')} em aproximadamente <strong>{monthsToEmergencyTarget} meses</strong>.
              </p>
            </div>
          </section>

          {/* Onde Guardar Guide */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-sky-400 block">1. Tesouro Selic (Tesouro Direto)</span>
              <p className="text-xs text-slate-300">
                O investimento mais seguro do Brasil com risco soberano. Rende a taxa Selic com liquidez em D+1.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 block">2. CDB 100%+ CDI com Liquidez Diária</span>
              <p className="text-xs text-slate-300">
                Emitido por bancos sólidos com garantia do FGC até R$ 250 mil. Resgate imediato 24/7.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-purple-400 block">3. Contas Remuneradas Automáticas</span>
              <p className="text-xs text-slate-300">
                NuConta, PicPay, Mercado Pago rendendo 100% CDI diariamente sem carência.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* SUBTAB 4: EXTRATO DE TRANSAÇÕES */}
      {activeSubTab === 'transacoes' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Extrato Completo ({transactions.length} lançamentos)
              </h3>
              <p className="text-xs text-slate-400">
                Visualize, filtre, edite ou exclua qualquer movimentação financeira
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onOpenTransaction('expense')}
                className="text-xs px-3 py-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold transition flex items-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Despesa</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenTransaction('income')}
                className="text-xs px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition flex items-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Receita</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setHistoryFilter('all')}
                className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                  historyFilter === 'all'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todas ({transactions.length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('expense')}
                className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                  historyFilter === 'expense'
                    ? 'bg-rose-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Despesas ({transactions.filter((t) => t.type === 'expense').length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('income')}
                className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                  historyFilter === 'income'
                    ? 'bg-emerald-600 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Receitas ({transactions.filter((t) => t.type === 'income').length})
              </button>
              <button
                type="button"
                onClick={() => setHistoryFilter('investment')}
                className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
                  historyFilter === 'investment'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Investimentos ({transactions.filter((t) => t.type === 'investment').length})
              </button>
            </div>

            <div className="relative sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={budgetSearch}
                onChange={(e) => setBudgetSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500 transition"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            {transactions
              .filter((tx) => {
                if (historyFilter !== 'all' && tx.type !== historyFilter) return false;
                if (budgetSearch) {
                  const term = budgetSearch.toLowerCase();
                  return (
                    tx.description.toLowerCase().includes(term) ||
                    tx.category.toLowerCase().includes(term) ||
                    (tx.notes && tx.notes.toLowerCase().includes(term))
                  );
                }
                return true;
              })
              .map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-start sm:items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : tx.type === 'investment'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {tx.type === 'income' ? (
                        <ArrowUpCircle className="w-4 h-4" />
                      ) : tx.type === 'investment' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white block">{tx.description}</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/80">
                          {tx.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span>{tx.date}</span>
                        {tx.notes && <span className="text-amber-400/90">• {tx.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-3 pl-12 sm:pl-0">
                    <span
                      className={`font-black text-sm whitespace-nowrap ${
                        tx.type === 'income'
                          ? 'text-emerald-400'
                          : tx.type === 'investment'
                          ? 'text-sky-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {tx.type === 'income' ? '+ ' : '- '}R$ {tx.amount.toLocaleString('pt-BR')}
                    </span>

                    {confirmDeleteId === tx.id ? (
                      <div className="flex items-center space-x-1.5 bg-rose-950/60 p-1 rounded-xl border border-rose-500/40 animate-in fade-in">
                        <span className="text-[10px] text-rose-300 font-bold px-1">Excluir?</span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteTransaction(tx.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition"
                        >
                          Sim
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                        >
                          Não
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => onEditTransaction?.(tx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition flex items-center space-x-1 text-xs font-semibold"
                          title="Editar despesa ou receita"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Editar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(tx.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Excluir transação"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
