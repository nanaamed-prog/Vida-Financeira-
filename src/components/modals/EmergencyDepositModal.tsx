import React, { useState, useEffect } from 'react';
import {
  X,
  LifeBuoy,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  Edit3,
  ArrowDownRight,
  Settings,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

interface EmergencyDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'deposit' | 'correct' | 'withdraw' | 'config';
}

export const EmergencyDepositModal: React.FC<EmergencyDepositModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'deposit',
}) => {
  const {
    emergencyFund,
    depositEmergencyFund,
    setEmergencyFundBalance,
    withdrawEmergencyFund,
    updateEmergencyFund,
    triggerCelebration,
  } = useFinancial();

  const VALID_MODES = ['deposit', 'correct', 'withdraw', 'config'] as const;
  const safeInitialMode = typeof defaultMode === 'string' && VALID_MODES.includes(defaultMode as any)
    ? defaultMode
    : 'deposit';

  const [activeTab, setActiveTab] = useState<'deposit' | 'correct' | 'withdraw' | 'config'>(safeInitialMode);

  // Form states
  const [depositAmount, setDepositAmount] = useState('500');
  const [correctBalance, setCorrectBalance] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawReason, setWithdrawReason] = useState('Imprevisto médico / farmácia');
  
  // Config states
  const [essentialExpenses, setEssentialExpenses] = useState('');
  const [targetMonths, setTargetMonths] = useState<number>(6);
  const [monthlyContribution, setMonthlyContribution] = useState('');

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const mode = typeof defaultMode === 'string' && VALID_MODES.includes(defaultMode as any)
        ? defaultMode
        : 'deposit';
      setActiveTab(mode);
      setCorrectBalance(emergencyFund.currentAmount.toString());
      setEssentialExpenses(emergencyFund.essentialMonthlyExpenses.toString());
      setTargetMonths(emergencyFund.targetMonths || 6);
      setMonthlyContribution(emergencyFund.monthlyContribution.toString());
      setFeedbackMsg(null);
    }
  }, [isOpen, defaultMode, emergencyFund]);

  if (!isOpen) return null;

  const current = emergencyFund.currentAmount;
  const target = emergencyFund.essentialMonthlyExpenses * (emergencyFund.targetMonths || 6);
  const remaining = Math.max(0, target - current);
  const progressPct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  const quickChips = [100, 250, 500, 1000, 2000];

  // 1. Handle Deposit
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount.replace(/\./g, '').replace(',', '.'));
    if (isNaN(val) || val <= 0) return;

    depositEmergencyFund(val);
    triggerCelebration();
    setFeedbackMsg(`Aporte de R$ ${val.toLocaleString('pt-BR')} adicionado com sucesso!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // 2. Handle Correct/Fix Total Balance
  const handleCorrectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(correctBalance.replace(/\./g, '').replace(',', '.'));
    if (isNaN(val) || val < 0) return;

    setEmergencyFundBalance(val);
    setFeedbackMsg(`Saldo da reserva corrigido para R$ ${val.toLocaleString('pt-BR')}!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // 3. Handle Withdraw
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount.replace(/\./g, '').replace(',', '.'));
    if (isNaN(val) || val <= 0) return;

    if (val > current) {
      alert('O valor do resgate não pode ser maior que o saldo atual da reserva.');
      return;
    }

    withdrawEmergencyFund(val, withdrawReason);
    setFeedbackMsg(`Resgate de R$ ${val.toLocaleString('pt-BR')} registrado com sucesso.`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // 4. Handle Config Submit
  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expensesVal = parseFloat(essentialExpenses.replace(/\./g, '').replace(',', '.')) || 0;
    const monthlyContribVal = parseFloat(monthlyContribution.replace(/\./g, '').replace(',', '.')) || 0;

    updateEmergencyFund({
      essentialMonthlyExpenses: expensesVal,
      targetMonths: targetMonths,
      monthlyContribution: monthlyContribVal,
    });

    setFeedbackMsg('Parâmetros da reserva salvos com sucesso!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Reserva de Emergência</h2>
              <p className="text-[11px] text-slate-400">Aportar, corrigir saldo e ajustar metas de segurança</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Summary Banner */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Saldo Atual Acumulado:</span>
            <span className="text-base font-black text-white">
              R$ {current.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Meta: R$ {target.toLocaleString('pt-BR')} ({emergencyFund.targetMonths || 6} meses)</span>
            <span className="font-bold text-sky-400">{progressPct}% blindado</span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-2 bg-slate-900 border-b border-slate-800 grid grid-cols-4 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('deposit'); setFeedbackMsg(null); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'deposit'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="text-[11px]">Aportar</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('correct'); setFeedbackMsg(null); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'correct'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Corrigir Saldo</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('withdraw'); setFeedbackMsg(null); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'withdraw'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span className="text-[11px]">Resgatar</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('config'); setFeedbackMsg(null); }}
            className={`py-2 px-1 rounded-xl transition flex flex-col items-center justify-center space-y-1 ${
              activeTab === 'config'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="text-[11px]">Metas</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {feedbackMsg && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* TAB 1: FAZER APORTE */}
          {activeTab === 'deposit' && (
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Valor a adicionar à reserva (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    R$
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-lg font-bold text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500 transition"
                  />
                </div>
              </div>

              {/* Quick Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 block">Atalhos rápidos de aporte:</span>
                <div className="flex flex-wrap gap-2">
                  {quickChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setDepositAmount(chip.toString())}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
                    >
                      + R$ {chip.toLocaleString('pt-BR')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-[11px] text-slate-300 space-y-1">
                <span className="font-bold text-sky-400 block">🛡️ Dica de Alocação:</span>
                Mantenha este valor em <strong>Tesouro Selic</strong> ou <strong>CDB 100% CDI com Liquidez Diária</strong> para resgate a qualquer momento.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-lg shadow-sky-950/40 flex items-center justify-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Confirmar Aporte (+25 XP)</span>
              </button>
            </form>
          )}

          {/* TAB 2: CORRIGIR / AJUSTAR SALDO EXATO */}
          {activeTab === 'correct' && (
            <form onSubmit={handleCorrectSubmit} className="space-y-4">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Ajuste Direto de Saldo</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Use esta opção se você digitou um valor errado anteriormente ou quer sincronizar o saldo exato que possui guardado no seu banco ou corretora hoje.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Saldo Total Real Acumulado Hoje (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    R$
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={correctBalance}
                    onChange={(e) => setCorrectBalance(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-800/80 border border-amber-500/40 rounded-xl pl-10 pr-4 py-2.5 text-lg font-bold text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 transition"
                  />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Saldo anterior registrado: R$ {current.toLocaleString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-lg shadow-amber-950/40 flex items-center justify-center space-x-1.5"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Salvar Correção de Saldo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCorrectBalance('0')}
                  className="px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold border border-slate-700 transition"
                  title="Zerar reserva"
                >
                  Zerar (R$ 0)
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: RESGATAR DA RESERVA */}
          {activeTab === 'withdraw' && (
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-rose-400 font-bold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Resgate para Emergência Real</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  A reserva existe exatamente para te proteger sem você precisar entrar em cheque especial ou rotativo de cartão.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Valor a Resgatar (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    R$
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    max={current}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-slate-800/80 border border-rose-500/40 rounded-xl pl-10 pr-4 py-2.5 text-lg font-bold text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-400 transition"
                  />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Disponível para resgate: R$ {current.toLocaleString('pt-BR')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Motivo do Resgate
                </label>
                <select
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-rose-400 transition"
                >
                  <option value="Imprevisto médico / farmácia">Imprevisto médico / saúde / farmácia</option>
                  <option value="Conserto urgente de carro ou moto">Conserto urgente de veículo de trabalho</option>
                  <option value="Reparo elétrico / hidráulico na casa">Reparo emergencial na residência</option>
                  <option value="Perda temporária de renda / transição">Perda temporária de renda / emprego</option>
                  <option value="Outro imprevisto inevitável">Outro imprevisto inevitável</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={current <= 0}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs transition shadow-lg shadow-rose-950/40 flex items-center justify-center space-x-1.5"
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Confirmar Resgate da Reserva</span>
              </button>
            </form>
          )}

          {/* TAB 4: CONFIGURAR METAS E PARÂMETROS */}
          {activeTab === 'config' && (
            <form onSubmit={handleConfigSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Gastos Essenciais Mensais (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    R$
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={essentialExpenses}
                    onChange={(e) => setEssentialExpenses(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white focus:outline-hidden focus:border-sky-500 transition"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Aluguel/moradia, supermercado, luz, água, saúde e transporte básico.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Meses de Cobertura Desejados
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTargetMonths(m)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                        targetMonths === m
                          ? 'bg-sky-600 border-sky-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {m} Meses {m === 6 && '(Recomendado)'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Aporte Mensal Planejado (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                    R$
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-white focus:outline-hidden focus:border-sky-500 transition"
                  />
                </div>
              </div>

              {/* Calculated target preview */}
              <div className="p-3 bg-slate-800 rounded-xl text-xs text-slate-300 flex justify-between items-center">
                <span>Nova Meta Calculada:</span>
                <strong className="text-sky-400 text-sm">
                  R$ {((parseFloat(essentialExpenses) || 0) * targetMonths).toLocaleString('pt-BR')}
                </strong>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition shadow-lg shadow-sky-950/40"
              >
                Salvar Parâmetros da Reserva
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
