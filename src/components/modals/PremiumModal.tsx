import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Shield, Zap } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const { isPremium, togglePremium, triggerCelebration } = useFinancial();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  const handleActivate = () => {
    togglePremium();
    triggerCelebration();
    onClose();
  };

  const features = [
    { name: 'Controle de Receitas e Despesas Básico', free: true, premium: true },
    { name: 'Orçamento Inteligente com Modos 50/30/20', free: true, premium: true },
    { name: 'Diagnóstico e Nível Financeiro', free: true, premium: true },
    { name: 'Academia Financeira Completa (8 Trilhas)', free: 'Básico (2 Trilhas)', premium: 'Acesso Total (8 Trilhas)' },
    { name: 'IA Financeira Pessoal Ilimitada (Gemini 3.7)', free: false, premium: true },
    { name: 'Simuladores Avançados (Juros, Viver de Renda, Financiamentos)', free: false, premium: true },
    { name: 'Consultório Check-Up & Plano 30d/6m/5a', free: false, premium: true },
    { name: 'Central de Dívidas & Simulador de Renegociação', free: false, premium: true },
    { name: 'Metas Financeiras Ilimitadas', free: 'Até 2 metas', premium: 'Ilimitadas' },
    { name: 'Modo Família & Educação Financeira Infantil', free: false, premium: true },
    { name: 'Desafio 365 Dias com Gamificação e XP', free: false, premium: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-br from-amber-600/30 via-slate-900 to-slate-900 border-b border-slate-800 text-center space-y-2">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Crown className="w-8 h-8 fill-amber-400/20" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Vida Financeira Premium</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Transforme seu dinheiro no seu maior aliado. Acesso irrestrito à Academia completa, IA Financeira, Consultório e Simuladores.
          </p>

          {/* Billing toggle */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex p-1 bg-slate-800 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  billingCycle === 'monthly'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensal (R$ 19,90/mês)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Anual (R$ 149,90/ano)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-700 text-emerald-100">
                  -37% OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="p-6 space-y-4">
          <div className="border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Recurso / Benefício</th>
                  <th className="py-3 px-3 text-center">Gratuito</th>
                  <th className="py-3 px-4 text-center text-amber-400 font-bold">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {features.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-4 font-medium text-slate-300">{f.name}</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">
                      {typeof f.free === 'boolean' ? (
                        f.free ? (
                          <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )
                      ) : (
                        <span className="text-[11px]">{f.free}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center font-semibold text-amber-400">
                      {typeof f.premium === 'boolean' ? (
                        f.premium ? (
                          <Check className="w-4 h-4 text-amber-400 mx-auto stroke-[3]" />
                        ) : (
                          <span className="text-slate-600">—</span>
                        )
                      ) : (
                        <span className="text-[11px] text-amber-300">{f.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleActivate}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm transition shadow-xl shadow-amber-950/50 flex items-center justify-center space-x-2"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              <span>
                {isPremium ? 'Alternar Status de Teste (Ativo/Inativo)' : 'Ativar Acesso Premium Agora'}
              </span>
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              🛡️ Cancele quando quiser. Sem fidelidade. Garantia incondicional de 7 dias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
