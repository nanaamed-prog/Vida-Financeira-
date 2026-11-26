import React, { useState } from 'react';
import {
  X,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  TrendingUp,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { DiagnosticAnswer, FinancialLevelNumber } from '../../types';
import { FINANCIAL_LEVELS } from '../../data/initialData';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose }) => {
  const { saveDiagnosticResults, financialLevel } = useFinancial();
  const [step, setStep] = useState<number>(1);

  // Form states
  const [income, setIncome] = useState('4850');
  const [expenses, setExpenses] = useState('3570');
  const [debtsTotal, setDebtsTotal] = useState('12000');
  const [emergencyFund, setEmergencyFund] = useState('11900');
  const [investmentsTotal, setInvestmentsTotal] = useState('6550');
  const [dependentsCount, setDependentsCount] = useState('1');
  const [savingsHabit, setSavingsHabit] = useState<DiagnosticAnswer['savingsHabit']>('sempre_sobra');
  const [debtStatus, setDebtStatus] = useState<DiagnosticAnswer['debtStatus']>('dividas_controladas');
  const [financialGoalPriority, setFinancialGoalPriority] = useState<DiagnosticAnswer['financialGoalPriority']>('montar_reserva');
  const [impulseBuying, setImpulseBuying] = useState<DiagnosticAnswer['impulseBuying']>('moderado');

  const [calculatedLevel, setCalculatedLevel] = useState<FinancialLevelNumber | null>(null);

  if (!isOpen) return null;

  const calculateResults = () => {
    const inc = parseFloat(income) || 4850;
    const exp = parseFloat(expenses) || 3570;
    const debts = parseFloat(debtsTotal) || 0;
    const reserve = parseFloat(emergencyFund) || 0;
    const invest = parseFloat(investmentsTotal) || 0;
    const essentialExpenses = exp * 0.7;

    let level: FinancialLevelNumber = 2;

    if (debtStatus === 'dividas_atrasadas' || (debts > inc * 3 && reserve < 2000)) {
      level = 1;
    } else if (debts > 0 || reserve < essentialExpenses * 3) {
      level = 2;
    } else if (reserve >= essentialExpenses * 3 && debts === 0 && invest < 50000) {
      level = 3;
    } else if (invest >= 50000 && invest < 500000 && savingsHabit === 'invisto_primeiro') {
      level = 4;
    } else if (invest >= 500000 || invest > exp * 300) {
      level = 5;
    }

    setCalculatedLevel(level);
    saveDiagnosticResults({
      income: inc,
      expenses: exp,
      debtsTotal: debts,
      emergencyFund: reserve,
      investmentsTotal: invest,
      dependentsCount: parseInt(dependentsCount) || 0,
      savingsHabit,
      debtStatus,
      financialGoalPriority,
      impulseBuying,
    });
    setStep(4); // Show result screen
  };

  const levelInfo = calculatedLevel ? FINANCIAL_LEVELS[calculatedLevel] : FINANCIAL_LEVELS[financialLevel];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-bold text-lg text-white">Diagnóstico Financeiro</h2>
              <p className="text-xs text-slate-400">Descubra em qual dos 5 Níveis você está e o que fazer agora</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        {/* Steps */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Passo 1 de 3: Fluxo de Caixa Básico
              </span>
              <h3 className="text-base font-bold text-white">Quanto você ganha e quanto gasta?</h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Renda Líquida Mensal Total (R$)
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Despesas Totais Médias por Mês (R$)
                </label>
                <input
                  type="number"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Número de Dependentes
                </label>
                <input
                  type="number"
                  value={dependentsCount}
                  onChange={(e) => setDependentsCount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 transition"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition flex items-center justify-center space-x-2"
              >
                <span>Avançar para Dívidas e Reserva</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Passo 2 de 3: Dívidas e Blindagem
              </span>
              <h3 className="text-base font-bold text-white">Como está sua proteção patrimonial?</h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Total Acumulado em Dívidas e Financiamentos (R$)
                </label>
                <input
                  type="number"
                  value={debtsTotal}
                  onChange={(e) => setDebtsTotal(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-rose-400 focus:border-rose-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Situação das Dívidas
                </label>
                <select
                  value={debtStatus}
                  onChange={(e) => setDebtStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500"
                >
                  <option value="sem_dividas">Não possuo dívidas nocivas</option>
                  <option value="dividas_controladas">Possuo dívidas ou parcelamentos em dia</option>
                  <option value="dividas_atrasadas">Possuo contas/cartões em atraso ou rotativo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Reserva de Emergência Guardada (R$)
                </label>
                <input
                  type="number"
                  value={emergencyFund}
                  onChange={(e) => setEmergencyFund(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-sky-400 focus:border-sky-500 transition"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition flex items-center justify-center space-x-2"
                >
                  <span>Avançar para Hábitos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Passo 3 de 3: Hábitos & Investimentos
              </span>
              <h3 className="text-base font-bold text-white">Como você se relaciona com seu dinheiro?</h3>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Total em Investimentos (Ações, FIIs, Tesouro, Renda Fixa) (R$)
                </label>
                <input
                  type="number"
                  value={investmentsTotal}
                  onChange={(e) => setInvestmentsTotal(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-emerald-400 focus:border-emerald-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Hábito de Poupança
                </label>
                <select
                  value={savingsHabit}
                  onChange={(e) => setSavingsHabit(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500"
                >
                  <option value="nunca">Gasto tudo o que ganho ou falta dinheiro</option>
                  <option value="as_vezes">Guardo apenas quando sobra alguma coisa no final</option>
                  <option value="sempre_sobra">Consigo economizar um valor fixo na maioria dos meses</option>
                  <option value="invisto_primeiro">Pague-se primeiro: invisto assim que recebo o salário</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Compras por Impulso
                </label>
                <select
                  value={impulseBuying}
                  onChange={(e) => setImpulseBuying(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500"
                >
                  <option value="frequente">Compro com frequência por emoção/desconto</option>
                  <option value="moderado">Às vezes compro sem planejar, mas controlo</option>
                  <option value="raro">Raramente compro sem pesquisar e planejar com calma</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={calculateResults}
                  className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-sm transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50"
                >
                  <span>Gerar Diagnóstico (+100 XP)</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-in zoom-in-95">
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-slate-800 border border-slate-700 text-amber-400">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Diagnóstico Concluído!</h3>
                <p className="text-xs text-slate-400">Aqui está o seu diagnóstico no Sistema Vida Financeira:</p>
              </div>

              {/* Level banner */}
              <div className={`p-4 rounded-2xl border ${levelInfo.badgeBg} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm tracking-wide uppercase">
                    {levelInfo.title}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-950/40">
                    Estágio Atual
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-medium">{levelInfo.description}</p>
              </div>

              {/* Next step recommendation */}
              <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Seu Próximo Passo Prioritário</span>
                </h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {levelInfo.nextLevelRequirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Finish */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition"
              >
                Ir para o Meu Painel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
