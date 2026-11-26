/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinancialProvider } from './context/FinancialContext';
import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { MoneyView } from './views/MoneyView';
import { LearnView } from './views/LearnView';
import { GoalsAndSimulatorsView } from './views/GoalsAndSimulatorsView';
import { AiAdvisorView } from './views/AiAdvisorView';

// Modals
import { TransactionModal } from './components/modals/TransactionModal';
import { CategoryBudgetModal } from './components/modals/CategoryBudgetModal';
import { DebtModal } from './components/modals/DebtModal';
import { GoalModal } from './components/modals/GoalModal';
import { EmergencyDepositModal } from './components/modals/EmergencyDepositModal';
import { DiagnosticModal } from './components/modals/DiagnosticModal';
import { PremiumModal } from './components/modals/PremiumModal';
import { SecurityModal } from './components/modals/SecurityModal';
import { CategoryKey, Transaction } from './types';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('inicio');

  // Modal States
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'investment'>('expense');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [isCategoryBudgetModalOpen, setIsCategoryBudgetModalOpen] = useState(false);
  const [categoryBudgetInitialCategory, setCategoryBudgetInitialCategory] = useState<CategoryKey | null>(null);

  const [isDebtOpen, setIsDebtOpen] = useState(false);
  const [isGoalOpen, setIsGoalOpen] = useState(false);
  const [isEmergencyDepositOpen, setIsEmergencyDepositOpen] = useState(false);
  const [emergencyDepositMode, setEmergencyDepositMode] = useState<'deposit' | 'correct' | 'withdraw' | 'config'>('deposit');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  const handleOpenTransaction = (type?: string | 'income' | 'expense' | 'investment') => {
    setEditingTransaction(null);
    const validTypes = ['income', 'expense', 'investment'] as const;
    const safeType = typeof type === 'string' && validTypes.includes(type as any) ? (type as typeof validTypes[number]) : 'expense';
    setTransactionType(safeType);
    setIsTransactionOpen(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setTransactionType(tx.type);
    setIsTransactionOpen(true);
  };

  const handleOpenCategoryBudget = (catKey?: CategoryKey) => {
    setCategoryBudgetInitialCategory(catKey || null);
    setIsCategoryBudgetModalOpen(true);
  };

  const handleOpenEmergency = (mode?: string | 'deposit' | 'correct' | 'withdraw' | 'config') => {
    const validModes = ['deposit', 'correct', 'withdraw', 'config'] as const;
    const safeMode = typeof mode === 'string' && validModes.includes(mode as any) ? (mode as typeof validModes[number]) : 'deposit';
    setEmergencyDepositMode(safeMode);
    setIsEmergencyDepositOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onOpenPremium={() => setIsPremiumOpen(true)}
        onOpenSecurity={() => setIsSecurityOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'inicio' && (
          <HomeView
            onOpenTransaction={handleOpenTransaction}
            onEditTransaction={handleEditTransaction}
            onOpenDebt={() => setIsDebtOpen(true)}
            onOpenGoal={() => setIsGoalOpen(true)}
            onOpenEmergencyDeposit={handleOpenEmergency}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'dinheiro' && (
          <MoneyView
            onOpenTransaction={handleOpenTransaction}
            onEditTransaction={handleEditTransaction}
            onOpenCategoryBudget={handleOpenCategoryBudget}
            onOpenDebt={() => setIsDebtOpen(true)}
            onOpenEmergencyDeposit={handleOpenEmergency}
          />
        )}

        {activeTab === 'aprender' && (
          <LearnView onOpenPremium={() => setIsPremiumOpen(true)} />
        )}

        {activeTab === 'metas' && (
          <GoalsAndSimulatorsView onOpenGoal={() => setIsGoalOpen(true)} />
        )}

        {activeTab === 'ia' && <AiAdvisorView />}
      </main>

      {/* Persistent Bottom Bar */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals & Action Sheets */}
      <TransactionModal
        isOpen={isTransactionOpen}
        onClose={() => {
          setIsTransactionOpen(false);
          setEditingTransaction(null);
        }}
        defaultType={transactionType}
        transactionToEdit={editingTransaction}
      />
      <CategoryBudgetModal
        isOpen={isCategoryBudgetModalOpen}
        onClose={() => {
          setIsCategoryBudgetModalOpen(false);
          setCategoryBudgetInitialCategory(null);
        }}
        initialCategory={categoryBudgetInitialCategory}
      />
      <DebtModal
        isOpen={isDebtOpen}
        onClose={() => setIsDebtOpen(false)}
      />
      <GoalModal
        isOpen={isGoalOpen}
        onClose={() => setIsGoalOpen(false)}
      />
      <EmergencyDepositModal
        isOpen={isEmergencyDepositOpen}
        onClose={() => setIsEmergencyDepositOpen(false)}
        defaultMode={emergencyDepositMode}
      />
      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
      />
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
      />
      <SecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <FinancialProvider>
      <MainApp />
    </FinancialProvider>
  );
}
