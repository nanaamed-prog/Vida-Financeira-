import React, { useState } from 'react';
import { X, Target, Home, Car, Plane, GraduationCap, Heart, Laptop, Sparkles } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { FinancialGoal } from '../../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose }) => {
  const { addGoal } = useFinancial();
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadlineMonths, setDeadlineMonths] = useState('24');
  const [category, setCategory] = useState<FinancialGoal['category']>('casa');
  const [color, setColor] = useState('#0284c7');

  if (!isOpen) return null;

  const templates = [
    { title: '🏠 Comprar Minha Casa', amount: 80000, months: 48, category: 'casa', color: '#0284c7' },
    { title: '🚗 Comprar Meu Carro', amount: 50000, months: 36, category: 'carro', color: '#10b981' },
    { title: '✈️ Viagem de Férias', amount: 8000, months: 12, category: 'viagem', color: '#f59e0b' },
    { title: '💍 Casamento dos Sonhos', amount: 30000, months: 24, category: 'casamento', color: '#ec4899' },
    { title: '🎓 Pós-Graduação / MBA', amount: 20000, months: 18, category: 'estudos', color: '#8b5cf6' },
  ];

  const applyTemplate = (tpl: any) => {
    setTitle(tpl.title);
    setTargetAmount(tpl.amount.toString());
    setDeadlineMonths(tpl.months.toString());
    setCategory(tpl.category);
    setColor(tpl.color);
  };

  const targetNum = parseFloat(targetAmount.replace(/\./g, '').replace(',', '.')) || 0;
  const currentNum = parseFloat(currentAmount.replace(/\./g, '').replace(',', '.')) || 0;
  const monthsNum = parseInt(deadlineMonths) || 1;
  const remainingToGoal = Math.max(0, targetNum - currentNum);
  const monthlyRequired = Math.round(remainingToGoal / monthsNum);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || targetNum <= 0) return;

    addGoal({
      title,
      targetAmount: targetNum,
      currentAmount: currentNum,
      deadlineMonths: monthsNum,
      category,
      icon: category === 'casa' ? 'Home' : category === 'carro' ? 'Car' : category === 'viagem' ? 'Plane' : 'Target',
      color,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-lg text-white">Criar Nova Meta Financeira</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates */}
        <div className="p-5 pb-0">
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Modelos Rápidos Populares:
          </label>
          <div className="flex flex-wrap gap-2">
            {templates.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                {tpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Nome da Meta
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Comprar minha casa, Viagem para o Chile"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Valor Alvo Total (R$)
              </label>
              <input
                type="number"
                step="100"
                required
                placeholder="Ex: 80000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Já possui guardado (R$)
              </label>
              <input
                type="number"
                step="50"
                placeholder="Ex: 5000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Prazo Desejado (Meses)
              </label>
              <input
                type="number"
                min="1"
                max="360"
                required
                value={deadlineMonths}
                onChange={(e) => setDeadlineMonths(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition"
              >
                <option value="casa">🏠 Imóvel / Casa</option>
                <option value="carro">🚗 Carro / Veículo</option>
                <option value="viagem">✈️ Viagem / Lazer</option>
                <option value="casamento">💍 Casamento / Família</option>
                <option value="estudos">🎓 Estudos / Carreira</option>
                <option value="liberdade">👑 Liberdade Financeira</option>
                <option value="outro">🎯 Outro Objetivo</option>
              </select>
            </div>
          </div>

          {/* Monthly Required Calculation Card */}
          {targetNum > 0 && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1">
              <span className="text-xs text-emerald-300">Aporte mensal necessário estimado:</span>
              <div className="text-xl font-extrabold text-emerald-400">
                R$ {monthlyRequired.toLocaleString('pt-BR')} / mês
              </div>
              <p className="text-[11px] text-slate-400">
                Guardando este valor mensalmente durante {monthsNum} meses ({Math.round(monthsNum / 12 * 10) / 10} anos), você atinge a meta sem precisar recorrer a empréstimos bancários.
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2"
            >
              <span>Criar Meta Financeira (+30 XP)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
