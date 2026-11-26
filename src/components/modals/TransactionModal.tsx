import React, { useState, useEffect } from 'react';
import { X, PlusCircle, ArrowDownCircle, ArrowUpCircle, TrendingUp, Edit3, Trash2 } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { CategoryKey, Transaction, TransactionType } from '../../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  transactionToEdit?: Transaction | null;
  onDelete?: (id: string) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
  transactionToEdit = null,
  onDelete,
}) => {
  const { addTransaction, updateTransaction, deleteTransaction } = useFinancial();
  const [type, setType] = useState<TransactionType>(defaultType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CategoryKey>('alimentacao');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfirmDelete(false);
      if (transactionToEdit) {
        setType(transactionToEdit.type);
        setDescription(transactionToEdit.description);
        setAmount(transactionToEdit.amount.toString());
        setCategory(transactionToEdit.category);
        setDate(transactionToEdit.date);
        setNotes(transactionToEdit.notes || '');
      } else {
        const safeType = defaultType || 'expense';
        setType(safeType);
        setDescription('');
        setAmount('');
        setCategory(safeType === 'income' ? 'salario' : safeType === 'investment' ? 'investimentos' : 'alimentacao');
        setDate(new Date().toISOString().split('T')[0]);
        setNotes('');
      }
    }
  }, [isOpen, transactionToEdit, defaultType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
    if (!description || isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, {
        description,
        amount: parsedAmount,
        type,
        category,
        date,
        isPaid: true,
        notes: notes || undefined,
      });
    } else {
      addTransaction({
        description,
        amount: parsedAmount,
        type,
        category,
        date,
        isPaid: true,
        notes: notes || undefined,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (transactionToEdit) {
      if (onDelete) {
        onDelete(transactionToEdit.id);
      } else {
        deleteTransaction(transactionToEdit.id);
      }
      onClose();
    }
  };

  const expenseCategories: { key: CategoryKey; label: string }[] = [
    { key: 'moradia', label: 'Moradia / Contas' },
    { key: 'alimentacao', label: 'Alimentação & Mercado' },
    { key: 'transporte', label: 'Transporte / Carro' },
    { key: 'saude', label: 'Saúde & Farmácia' },
    { key: 'educacao', label: 'Educação / Cursos' },
    { key: 'lazer', label: 'Lazer & Restaurantes' },
    { key: 'assinaturas', label: 'Assinaturas & Streaming' },
    { key: 'roupas', label: 'Roupas & Cuidados' },
    { key: 'dividas', label: 'Pagamento de Dívida' },
    { key: 'outros', label: 'Outros' },
  ];

  const incomeCategories: { key: CategoryKey; label: string }[] = [
    { key: 'salario', label: 'Salário Principal' },
    { key: 'renda_extra', label: 'Renda Extra / Freelance' },
    { key: 'investimentos', label: 'Rendimentos / Dividendos' },
    { key: 'outros', label: 'Outra Receita' },
  ];

  const isEditing = !!transactionToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <Edit3 className="w-5 h-5 text-sky-400" />
            ) : (
              <PlusCircle className="w-5 h-5 text-emerald-400" />
            )}
            <h2 className="font-bold text-lg text-white">
              {isEditing
                ? `Editar ${type === 'income' ? 'Receita' : type === 'investment' ? 'Investimento' : 'Despesa'}`
                : 'Nova Transação'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Type Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (type === 'income' || type === 'investment') setCategory('alimentacao');
              }}
              className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span>Despesa</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                if (type === 'expense' || type === 'investment') setCategory('salario');
              }}
              className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              <span>Receita</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('investment');
                setCategory('investimentos');
              }}
              className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold transition ${
                type === 'investment'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Investir</span>
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Valor (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-lg font-bold text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Descrição
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Supermercado Semanal, Freelance, Aluguel"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryKey)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition"
            >
              {type === 'expense'
                ? expenseCategories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))
                : type === 'income'
                ? incomeCategories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))
                : (
                  <option value="investimentos">Investimentos / Aportes</option>
                )}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Data
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-500 transition"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Observações (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Compra parcelada, almoço no trabalho..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition"
            />
          </div>

          {/* Submit & Delete Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2"
            >
              <span>{isEditing ? 'Salvar Alterações' : 'Salvar Transação (+10 XP)'}</span>
            </button>

            {isEditing && (
              <>
                {!showConfirmDelete ? (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir {type === 'income' ? 'Receita' : 'Despesa'}</span>
                  </button>
                ) : (
                  <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-2">
                    <p className="text-xs text-rose-300 font-semibold text-center">
                      Confirmar exclusão desta transação?
                    </p>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
                      >
                        Sim, Excluir
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowConfirmDelete(false)}
                        className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
