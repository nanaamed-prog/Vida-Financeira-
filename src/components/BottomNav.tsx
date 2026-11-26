import React from 'react';
import { Home, Wallet, GraduationCap, Target, Bot } from 'lucide-react';

export type TabType = 'inicio' | 'dinheiro' | 'aprender' | 'metas' | 'ia';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'inicio' as TabType,
      label: 'Início',
      icon: Home,
      sublabel: 'Meu Dinheiro Hoje',
    },
    {
      id: 'dinheiro' as TabType,
      label: 'Dinheiro',
      icon: Wallet,
      sublabel: 'Orçamento & Dívidas',
    },
    {
      id: 'aprender' as TabType,
      label: 'Aprender',
      icon: GraduationCap,
      sublabel: 'Academia & 365 Dias',
    },
    {
      id: 'metas' as TabType,
      label: 'Metas',
      icon: Target,
      sublabel: 'Metas & Simuladores',
    },
    {
      id: 'ia' as TabType,
      label: 'IA & Consultório',
      icon: Bot,
      sublabel: 'Conselheiro Pessoal',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 shadow-2xl safe-bottom">
      <div className="max-w-3xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 px-1 transition-all rounded-lg ${
                  isActive
                    ? 'text-emerald-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 bg-emerald-400 rounded-b-full shadow-sm shadow-emerald-400/50"></span>
                )}
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[11px] mt-1 tracking-tight truncate max-w-[70px] sm:max-w-none">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
