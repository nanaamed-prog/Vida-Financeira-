import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  ShieldCheck,
  Crown,
  Lock,
  RotateCcw,
  Zap,
  Info,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { FINANCIAL_LEVELS } from '../data/initialData';

interface NavbarProps {
  onOpenDiagnostic: () => void;
  onOpenPremium: () => void;
  onOpenSecurity: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDiagnostic,
  onOpenPremium,
  onOpenSecurity,
}) => {
  const { healthScore, financialLevel, userXP, streakDays, isPremium } = useFinancial();
  const currentLevelInfo = FINANCIAL_LEVELS[financialLevel];
  const [showScoreDetail, setShowScoreDetail] = useState(false);

  // Calculate XP level progress (e.g. 500 XP per level)
  const currentXPLevel = Math.floor(userXP / 200) + 1;
  const xpInCurrentLevel = userXP % 200;
  const xpPct = Math.round((xpInCurrentLevel / 200) * 100);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Slogan */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/40">
              <span className="font-black text-xl text-slate-950">V</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">Vida Financeira</span>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                  Sistema Operacional Pessoal
                </span>
              </div>
              <p className="hidden md:block text-xs text-slate-400">
                Aprenda a cuidar do seu dinheiro. Organize sua vida. Construa seu patrimônio.
              </p>
            </div>
          </div>

          {/* Status Indicators & Gamification */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Health Score Pill */}
            <div className="relative">
              <button
                id="btn-health-score"
                onClick={() => setShowScoreDetail(!showScoreDetail)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                  healthScore >= 70
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    : healthScore >= 50
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                <span>Saúde: {healthScore}/100</span>
              </button>

              {/* Health Score Dropdown Info */}
              {showScoreDetail && (
                <div className="absolute right-0 mt-2 w-72 p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 text-slate-200 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">Indicador de Saúde Financeira</span>
                    <span className="text-emerald-400 font-bold">{healthScore} / 100</span>
                  </div>
                  <p className="text-slate-300 mb-3 leading-relaxed">
                    {healthScore >= 70
                      ? 'Você está em uma boa trajetória! Seu próximo passo é aumentar sua reserva de emergência e diversificar aportes.'
                      : healthScore >= 50
                      ? 'Controle moderado. Priorize liquidar dívidas com juros altos e estabelecer teto de gastos.'
                      : 'Alerta de vulnerabilidade. Siga o Plano de Recuperação para estancar sangrias imediatas.'}
                  </p>
                  <button
                    onClick={() => {
                      setShowScoreDetail(false);
                      onOpenDiagnostic();
                    }}
                    className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-center transition"
                  >
                    Refazer Diagnóstico Completo
                  </button>
                </div>
              )}
            </div>

            {/* Financial Level Badge */}
            <button
              id="btn-financial-level"
              onClick={onOpenDiagnostic}
              className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentLevelInfo.badgeBg} hover:opacity-90 transition`}
              title="Clique para ver seu Diagnóstico e Nível"
            >
              <span>Nível {financialLevel}: {currentLevelInfo.title.split('—')[1]}</span>
            </button>

            {/* Gamification: XP & Streak */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
              <div className="flex items-center space-x-1 text-amber-400">
                <Zap className="w-3.5 h-3.5 fill-amber-400" />
                <span className="text-xs font-bold">{userXP} XP</span>
              </div>
              <div className="w-12 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpPct}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400">Nv.{currentXPLevel}</span>
            </div>

            {/* Streak */}
            <div
              className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-bold"
              title={`${streakDays} dias consecutivos organizando sua vida financeira`}
            >
              <Flame className="w-3.5 h-3.5 fill-orange-400" />
              <span>{streakDays}d</span>
            </div>

            {/* Security Quick Access */}
            <button
              id="btn-security"
              onClick={onOpenSecurity}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Segurança & Privacidade LGPD"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Premium Badge */}
            <button
              id="btn-premium-toggle"
              onClick={onOpenPremium}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-sm ${
                isPremium
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500'
                  : 'bg-slate-800 text-amber-400 border border-amber-500/40 hover:bg-slate-700'
              }`}
            >
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{isPremium ? 'PREMIUM ATIVO' : 'SEJA PREMIUM'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
