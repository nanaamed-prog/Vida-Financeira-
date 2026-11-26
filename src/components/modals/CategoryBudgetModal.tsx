import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PieChart,
  RotateCcw,
  Save,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useFinancial, BUDGET_MODES } from '../../context/FinancialContext';
import { CategoryKey } from '../../types';

interface CategoryBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: CategoryKey | null;
}

export const CategoryBudgetModal: React.FC<CategoryBudgetModalProps> = ({
  isOpen,
  onClose,
  initialCategory = null,
}) => {
  const {
    categoryBudgets,
    updateCategoryBudget,
    monthlyIncome,
    budgetMode,
    setBudgetMode,
    addXP,
    triggerCelebration,
  } = useFinancial();

  // Local state holding the editable limits for each category key
  const [limits, setLimits] = useState<Record<string, number>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedFilterGroup, setSelectedFilterGroup] = useState<'all' | 'essencial' | 'estilo_vida' | 'investimento'>('all');

  useEffect(() => {
    if (isOpen) {
      const initialMap: Record<string, number> = {};
      categoryBudgets.forEach((c) => {
        initialMap[c.category] = c.budgetLimit;
      });
      setLimits(initialMap);
      setSavedSuccess(false);

      if (initialCategory) {
        const found = categoryBudgets.find((c) => c.category === initialCategory);
        if (found) {
          setSelectedFilterGroup(found.group);
        }
      } else {
        setSelectedFilterGroup('all');
      }
    }
  }, [isOpen, categoryBudgets, initialCategory]);

  if (!isOpen) return null;

  const handleLimitChange = (catKey: string, valueStr: string) => {
    const cleanVal = parseFloat(valueStr.replace(/\./g, '').replace(',', '.')) || 0;
    setLimits((prev) => ({
      ...prev,
      [catKey]: Math.max(0, cleanVal),
    }));
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(limits).forEach(([catKey, newLimit]) => {
      updateCategoryBudget(catKey, newLimit);
    });

    addXP(20, 'Personalizou tetos de orçamento por categoria');
    triggerCelebration();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  // Calculate totals
  const totalPlannedEssential = categoryBudgets
    .filter((c) => c.group === 'essencial')
    .reduce((acc, c) => acc + (limits[c.category] !== undefined ? limits[c.category] : c.budgetLimit), 0);

  const totalPlannedLifestyle = categoryBudgets
    .filter((c) => c.group === 'estilo_vida')
    .reduce((acc, c) => acc + (limits[c.category] !== undefined ? limits[c.category] : c.budgetLimit), 0);

  const totalPlannedInvestment = categoryBudgets
    .filter((c) => c.group === 'investimento')
    .reduce((acc, c) => acc + (limits[c.category] !== undefined ? limits[c.category] : c.budgetLimit), 0);

  const totalPlannedBudget = totalPlannedEssential + totalPlannedLifestyle + totalPlannedInvestment;
  const plannedSavings = Math.max(0, monthlyIncome - (totalPlannedEssential + totalPlannedLifestyle));

  // Percentages relative to monthly income
  const incomeBase = monthlyIncome > 0 ? monthlyIncome : 1;
  const essentialPct = Math.round((totalPlannedEssential / incomeBase) * 100);
  const lifestylePct = Math.round((totalPlannedLifestyle / incomeBase) * 100);

  const filteredCategories = categoryBudgets.filter((c) => {
    if (selectedFilterGroup === 'all') return true;
    return c.group === selectedFilterGroup;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Editar Tetos do Orçamento</h2>
              <p className="text-xs text-slate-400">
                Ajuste os limites mensais de cada categoria para manter seus gastos sob controle
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Bar */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800/80 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Renda Mensal</span>
              <span className="text-sm font-black text-emerald-400">
                R$ {monthlyIncome.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Orçado</span>
              <span className="text-sm font-black text-white">
                R$ {totalPlannedBudget.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-sky-400 block">Essenciais ({essentialPct}%)</span>
              <span className="text-xs font-extrabold text-sky-300">
                R$ {totalPlannedEssential.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Estilo de Vida ({lifestylePct}%)</span>
              <span className="text-xs font-extrabold text-amber-300">
                R$ {totalPlannedLifestyle.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Budget distribution bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
              <span>Distribuição do Planejamento</span>
              <span className={essentialPct > 60 ? 'text-amber-400' : 'text-emerald-400'}>
                {essentialPct <= 55 ? '✅ Equilibrado' : '⚠️ Essenciais acima de 55%'}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-sky-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, essentialPct)}%` }}
                title={`Essenciais: ${essentialPct}%`}
              ></div>
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, lifestylePct)}%` }}
                title={`Estilo de Vida: ${lifestylePct}%`}
              ></div>
            </div>
          </div>
        </div>

        {/* Group Filter Tabs */}
        <div className="px-5 pt-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex space-x-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedFilterGroup('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedFilterGroup === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Todas ({categoryBudgets.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterGroup('essencial')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedFilterGroup === 'essencial'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Essenciais
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterGroup('estilo_vida')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedFilterGroup === 'estilo_vida'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Estilo de Vida
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilterGroup('investimento')}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedFilterGroup === 'investimento'
                  ? 'bg-purple-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Investimentos
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Clique no campo para alterar o teto
          </span>
        </div>

        {/* Categories List */}
        <form onSubmit={handleSaveAll} className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tetos do orçamento atualizados com sucesso!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCategories.map((cat) => {
              const currentLimit = limits[cat.category] !== undefined ? limits[cat.category] : cat.budgetLimit;
              const isOver = currentLimit > 0 && cat.spent > currentLimit;

              return (
                <div
                  key={cat.category}
                  className={`p-3.5 rounded-2xl border transition flex flex-col justify-between space-y-2 ${
                    isOver
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : 'bg-slate-850/80 bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-white block">{cat.name}</span>
                      <span className="text-[11px] text-slate-400">
                        Gasto atual: <strong className={isOver ? 'text-rose-400' : 'text-slate-300'}>
                          R$ {cat.spent.toLocaleString('pt-BR')}
                        </strong>
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        cat.group === 'essencial'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : cat.group === 'estilo_vida'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {cat.group === 'essencial' ? 'Essencial' : cat.group === 'estilo_vida' ? 'Estilo de Vida' : 'Investimento'}
                    </span>
                  </div>

                  {/* Input for Budget Limit */}
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                      Teto Mensal:
                    </label>
                    <div className="relative flex-1">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">
                        R$
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={currentLimit}
                        onChange={(e) => handleLimitChange(cat.category, e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-sm font-bold text-white focus:outline-hidden focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setBudgetMode('equilibrado')}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
                title="Aplica a regra clássica 50% essenciais, 30% estilo de vida, 20% investimentos com base na sua renda"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Aplicar Regra 50/30/20</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition flex-1 sm:flex-none text-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition flex-1 sm:flex-none flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-900/30"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Tetos do Orçamento</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
