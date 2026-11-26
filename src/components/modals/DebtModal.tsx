import React, { useState } from 'react';
import { X, ShieldAlert, Calculator, DollarSign, ArrowRight } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { DebtItem } from '../../types';

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DebtModal: React.FC<DebtModalProps> = ({ isOpen, onClose }) => {
  const { addDebt } = useFinancial();
  const [creditor, setCreditor] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [interestRateMonthly, setInterestRateMonthly] = useState('12.0');
  const [remainingInstallments, setRemainingInstallments] = useState('6');
  const [category, setCategory] = useState<DebtItem['category']>('cartao');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(currentBalance.replace(/\./g, '').replace(',', '.'));
    const orig = parseFloat(originalAmount.replace(/\./g, '').replace(',', '.')) || balance;
    const installment = parseFloat(installmentAmount.replace(/\./g, '').replace(',', '.')) || (balance / (parseInt(remainingInstallments) || 1));
    const rate = parseFloat(interestRateMonthly) || 0;
    const remaining = parseInt(remainingInstallments) || 1;

    if (!creditor || isNaN(balance) || balance <= 0) return;

    addDebt({
      creditor,
      originalAmount: orig,
      currentBalance: balance,
      installmentAmount: installment,
      interestRateMonthly: rate,
      totalInstallments: remaining,
      remainingInstallments: remaining,
      dueDate,
      category,
    });

    onClose();
  };

  // Live estimated total future cost
  const balanceNum = parseFloat(currentBalance.replace(/\./g, '').replace(',', '.')) || 0;
  const rateNum = parseFloat(interestRateMonthly) || 0;
  const remNum = parseInt(remainingInstallments) || 1;
  const totalEstimatedCost = balanceNum * Math.pow(1 + rateNum / 100, remNum);
  const totalInterestPaid = Math.max(0, totalEstimatedCost - balanceNum);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h2 className="font-bold text-lg text-white">Cadastrar Dívida na Central</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 leading-relaxed">
            💡 Cadastrar suas dívidas com precisão permite ao <strong>Vida Financeira</strong> calcular quanto cada credor está custando e traçar o melhor plano de ataque (Método Avalanche ou Bola de Neve).
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Nome do Credor / Instituição
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Cartão Nubank, Cheque Especial Itaú, Empréstimo Caixa"
              value={creditor}
              onChange={(e) => setCreditor(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Saldo Devedor Atual (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Ex: 2800,00"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Valor Original (Opcional)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 3200,00"
                value={originalAmount}
                onChange={(e) => setOriginalAmount(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Taxa de Juros (% ao mês)
              </label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="Ex: 12.5"
                value={interestRateMonthly}
                onChange={(e) => setInterestRateMonthly(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Cartão rotativo: ~12-15% a.m. | Empréstimo: ~2-5% a.m.
              </span>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Parcela Mensal Atual (R$)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Ex: 450,00"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Parcelas Restantes
              </label>
              <input
                type="number"
                required
                value={remainingInstallments}
                onChange={(e) => setRemainingInstallments(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-rose-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Tipo de Dívida
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-rose-500 transition"
              >
                <option value="cartao">Cartão de Crédito</option>
                <option value="rotativo">Rotativo do Cartão</option>
                <option value="cheque_especial">Cheque Especial</option>
                <option value="emprestimo">Empréstimo Pessoal</option>
                <option value="financiamento">Financiamento (Veículo/Imóvel)</option>
                <option value="outro">Outro Credor</option>
              </select>
            </div>
          </div>

          {/* Real-Time Cost Projection Box */}
          {balanceNum > 0 && (
            <div className="p-3.5 bg-slate-800/90 border border-slate-700 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Juros projetados até o fim:</span>
                <span className="font-bold text-rose-400">
                  + R$ {Math.round(totalInterestPaid).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Custo Total Projetado:</span>
                <span className="font-bold text-white">
                  R$ {Math.round(totalEstimatedCost).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition shadow-lg shadow-rose-900/30 flex items-center justify-center space-x-2"
            >
              <span>Cadastrar Dívida (+20 XP)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
