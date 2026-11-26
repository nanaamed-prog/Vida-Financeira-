import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  AcademyTrack,
  AchievementBadge,
  BudgetMode,
  BudgetRuleConfig,
  CategoryBudget,
  DayChallenge,
  DebtItem,
  DiagnosticAnswer,
  EmergencyFundState,
  FamilyMember,
  FinancialGoal,
  FinancialLevelNumber,
  KidActivity,
  RecoveryPlanAction,
  Transaction,
} from '../types';
import {
  ACADEMY_TRACKS,
  CHALLENGE_365_DAYS,
  FINANCIAL_LEVELS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CATEGORY_BUDGETS,
  INITIAL_DEBTS,
  INITIAL_EMERGENCY_FUND,
  INITIAL_FAMILY_MEMBERS,
  INITIAL_GOALS,
  INITIAL_KID_ACTIVITIES,
  INITIAL_RECOVERY_PLAN,
  INITIAL_TRANSACTIONS,
} from '../data/initialData';

export const BUDGET_MODES: Record<BudgetMode, BudgetRuleConfig> = {
  conservador: {
    name: 'Conservador / Segurança',
    essentialPct: 60,
    lifestylePct: 20,
    investmentPct: 20,
    description: 'Prioriza estancar dívidas e construir uma muralha de reserva de emergência sem sobressaltos.',
    idealFor: 'Para quem está saindo do vermelho ou possui renda variável/insegurança.',
  },
  equilibrado: {
    name: 'Equilibrado (50/30/20 Clássico)',
    essentialPct: 50,
    lifestylePct: 30,
    investmentPct: 20,
    description: 'O equilíbrio perfeito entre aproveitar o presente e construir riqueza sólida para o futuro.',
    idealFor: 'Para quem já tem controle de contas e quer viver bem investindo com método.',
  },
  acelerado: {
    name: 'Acelerado (Independência Rápida / FIRE)',
    essentialPct: 40,
    lifestylePct: 20,
    investmentPct: 40,
    description: 'Foco extremo na construção patrimonial e multiplicação dos juros compostos.',
    idealFor: 'Para quem busca atingir a liberdade financeira em menos de 10 a 15 anos.',
  },
};

interface FinancialContextType {
  // Financial Overview
  netWorth: number;
  availableBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  healthScore: number;
  financialLevel: FinancialLevelNumber;
  
  // Data
  transactions: Transaction[];
  categoryBudgets: CategoryBudget[];
  debts: DebtItem[];
  emergencyFund: EmergencyFundState;
  goals: FinancialGoal[];
  budgetMode: BudgetMode;
  
  // Academy & Gamification
  academyTracks: AcademyTrack[];
  completedLessonIds: string[];
  userXP: number;
  streakDays: number;
  achievements: AchievementBadge[];
  
  // 365 Days
  challenge365: DayChallenge[];
  completedChallengeDays: number[];
  activeChallengeDay: number;
  
  // Family & Kids
  familyMembers: FamilyMember[];
  kidActivities: KidActivity[];
  
  // Recovery Plan & Diagnostic
  recoveryPlan: RecoveryPlanAction[];
  hasCompletedDiagnostic: boolean;
  diagnosticData: DiagnosticAnswer | null;
  
  // Premium
  isPremium: boolean;
  
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updatedData: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateCategoryBudget: (categoryKey: string, newLimit: number) => void;
  setBudgetMode: (mode: BudgetMode) => void;
  
  addDebt: (debt: Omit<DebtItem, 'id'>) => void;
  deleteDebt: (id: string) => void;
  payDebtInstallment: (id: string, amount?: number) => void;
  
  updateEmergencyFund: (partial: Partial<EmergencyFundState>) => void;
  depositEmergencyFund: (amount: number) => void;
  setEmergencyFundBalance: (newBalance: number) => void;
  withdrawEmergencyFund: (amount: number, reason?: string) => void;
  
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'createdAt'>) => void;
  depositGoal: (id: string, amount: number) => void;
  contributeToGoal?: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  
  completeLesson: (lessonId: string, xpReward: number) => void;
  addXP: (amount: number, reason?: string) => void;
  
  toggleChallengeDay: (day: number) => void;
  toggleKidActivity: (id: string) => void;
  toggleRecoveryAction: (id: string) => void;
  
  saveDiagnosticResults: (data: DiagnosticAnswer) => void;
  togglePremium: () => void;
  triggerCelebration: () => void;
  clearAllData: () => void;
  loadDemoData: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vida_financeira_state_v2';

const CLEAN_EMERGENCY_FUND: EmergencyFundState = {
  currentAmount: 0,
  targetMonths: 6,
  essentialMonthlyExpenses: 0,
  monthlyContribution: 0,
};

const CLEAN_CATEGORY_BUDGETS: CategoryBudget[] = INITIAL_CATEGORY_BUDGETS.map((cat) => ({
  ...cat,
  spent: 0,
  budgetLimit: 0,
}));

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_txs');
    return saved ? JSON.parse(saved) : [];
  });

  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_budgets');
    return saved ? JSON.parse(saved) : CLEAN_CATEGORY_BUDGETS;
  });

  const [budgetMode, setBudgetModeState] = useState<BudgetMode>('equilibrado');

  const [debts, setDebts] = useState<DebtItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_debts');
    return saved ? JSON.parse(saved) : [];
  });

  const [emergencyFund, setEmergencyFund] = useState<EmergencyFundState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_emergency');
    return saved ? JSON.parse(saved) : CLEAN_EMERGENCY_FUND;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_lessons');
    return saved ? JSON.parse(saved) : [];
  });

  const [userXP, setUserXP] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_xp');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS.map(a => ({ ...a, isUnlocked: false }));
  });

  const [completedChallengeDays, setCompletedChallengeDays] = useState<number[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeChallengeDay] = useState<number>(1);

  const [familyMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);
  const [kidActivities, setKidActivities] = useState<KidActivity[]>(() => {
    return INITIAL_KID_ACTIVITIES.map(k => ({ ...k, completed: false }));
  });

  const [recoveryPlan, setRecoveryPlan] = useState<RecoveryPlanAction[]>(() => {
    return INITIAL_RECOVERY_PLAN.map(r => ({ ...r, isDone: false }));
  });
  const [hasCompletedDiagnostic, setHasCompletedDiagnostic] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_has_diagnostic');
    return saved ? JSON.parse(saved) : false;
  });
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticAnswer | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_diagnostic');
    return saved ? JSON.parse(saved) : null;
  });

  const [isPremium, setIsPremium] = useState<boolean>(true); // Enabled by default to let user explore all rich features freely

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_txs', JSON.stringify(transactions));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_budgets', JSON.stringify(categoryBudgets));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_debts', JSON.stringify(debts));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_emergency', JSON.stringify(emergencyFund));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_goals', JSON.stringify(goals));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_lessons', JSON.stringify(completedLessonIds));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_xp', userXP.toString());
    localStorage.setItem(LOCAL_STORAGE_KEY + '_streak', streakDays.toString());
    localStorage.setItem(LOCAL_STORAGE_KEY + '_achievements', JSON.stringify(achievements));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_challenges', JSON.stringify(completedChallengeDays));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_has_diagnostic', JSON.stringify(hasCompletedDiagnostic));
    if (diagnosticData) {
      localStorage.setItem(LOCAL_STORAGE_KEY + '_diagnostic', JSON.stringify(diagnosticData));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_diagnostic');
    }
  }, [
    transactions,
    categoryBudgets,
    debts,
    emergencyFund,
    goals,
    completedLessonIds,
    userXP,
    streakDays,
    achievements,
    completedChallengeDays,
    hasCompletedDiagnostic,
    diagnosticData,
  ]);

  // Recalculate spent for categories from transactions
  useEffect(() => {
    setCategoryBudgets((prev) =>
      prev.map((cat) => {
        const spentSum = transactions
          .filter((t) => t.category === cat.category && (t.type === 'expense' || t.type === 'investment'))
          .reduce((acc, t) => acc + t.amount, 0);
        return {
          ...cat,
          spent: spentSum,
        };
      })
    );
  }, [transactions]);

  // Derived financial metrics
  const monthlyIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlyExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);

  const totalInvestedInGoals = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalDebts = debts.reduce((acc, d) => acc + d.currentBalance, 0);
  
  // Net worth: emergency fund + goals saved - debts
  const netWorth = Math.max(0, emergencyFund.currentAmount + totalInvestedInGoals - totalDebts);
  const availableBalance = monthlySavings;

  // Determine Financial Level dynamically
  let financialLevel: FinancialLevelNumber = 1;
  if (totalDebts > 0 && totalDebts > (monthlyIncome * 3 || 3000)) {
    financialLevel = 1;
  } else if (totalDebts > 0 || (emergencyFund.currentAmount < (emergencyFund.essentialMonthlyExpenses * 3 || 3000))) {
    financialLevel = 2;
  } else if (emergencyFund.currentAmount >= (emergencyFund.essentialMonthlyExpenses * 3 || 3000) && totalDebts === 0) {
    financialLevel = 3;
  } else if (netWorth >= 50000 && monthlySavings > (monthlyIncome * 0.2 || 1000)) {
    financialLevel = 4;
  } else if (netWorth >= 500000) {
    financialLevel = 5;
  }

  // Dynamic Financial Health Score (0 - 100)
  const calculateHealthScore = (): number => {
    if (monthlyIncome === 0 && monthlyExpenses === 0 && debts.length === 0 && emergencyFund.currentAmount === 0) {
      return 50; // Neutral baseline for clean state
    }

    let score = 50;
    
    // Savings rate (+20 max)
    const savingsRatio = monthlyIncome > 0 ? monthlySavings / monthlyIncome : 0;
    if (savingsRatio >= 0.25) score += 20;
    else if (savingsRatio >= 0.15) score += 14;
    else if (savingsRatio > 0.05) score += 8;
    else if (monthlyIncome > 0) score -= 10;

    // Debt burden (-25 max)
    const debtRatio = monthlyIncome > 0 ? totalDebts / monthlyIncome : totalDebts > 0 ? 3 : 0;
    if (totalDebts === 0) score += 15;
    else if (debtRatio < 1) score += 5;
    else if (debtRatio > 3) score -= 20;
    else score -= 10;

    // Emergency Fund (+20 max)
    const emergencyTarget = emergencyFund.essentialMonthlyExpenses * emergencyFund.targetMonths;
    const emergencyRatio = emergencyTarget > 0 ? emergencyFund.currentAmount / emergencyTarget : 0;
    if (emergencyRatio >= 1) score += 20;
    else if (emergencyRatio >= 0.6) score += 14;
    else if (emergencyRatio >= 0.3) score += 8;
    else if (emergencyFund.currentAmount > 0) score += 4;

    // Budget discipline (+15 max)
    const overBudgetCategories = categoryBudgets.filter(
      (c) => c.group === 'essencial' && c.budgetLimit > 0 && c.spent > c.budgetLimit * 1.1
    ).length;
    if (overBudgetCategories === 0 && categoryBudgets.some(c => c.spent > 0)) score += 15;
    else if (overBudgetCategories > 0) score -= overBudgetCategories * 5;

    return Math.min(100, Math.max(10, Math.round(score)));
  };

  const healthScore = calculateHealthScore();

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6'],
      });
    } catch {
      // safe fallback
    }
  };

  const addXP = (amount: number, reason?: string) => {
    setUserXP((prev) => {
      const nextXP = prev + amount;
      return nextXP;
    });
    triggerCelebration();
  };

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx-' + Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    addXP(10, 'Registrou uma transação');
  };

  const updateTransaction = (id: string, updatedData: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateCategoryBudget = (categoryKey: string, newLimit: number) => {
    setCategoryBudgets((prev) =>
      prev.map((c) => (c.category === categoryKey ? { ...c, budgetLimit: newLimit } : c))
    );
  };

  const setBudgetMode = (mode: BudgetMode) => {
    setBudgetModeState(mode);
    const rule = BUDGET_MODES[mode];
    // Re-adjust categories proportionally to income
    const essentialBudgetTotal = monthlyIncome * (rule.essentialPct / 100);
    const lifestyleBudgetTotal = monthlyIncome * (rule.lifestylePct / 100);
    const investmentBudgetTotal = monthlyIncome * (rule.investmentPct / 100);

    setCategoryBudgets((prev) =>
      prev.map((c) => {
        if (c.group === 'essencial') {
          return { ...c, budgetLimit: Math.round((essentialBudgetTotal / 5) / 50) * 50 };
        } else if (c.group === 'estilo_vida') {
          return { ...c, budgetLimit: Math.round((lifestyleBudgetTotal / 3) / 50) * 50 };
        } else {
          return { ...c, budgetLimit: Math.round(investmentBudgetTotal) };
        }
      })
    );
    addXP(15, `Aplicou o Modo de Orçamento ${rule.name}`);
  };

  const addDebt = (debtData: Omit<DebtItem, 'id'>) => {
    const newDebt: DebtItem = {
      ...debtData,
      id: 'debt-' + Date.now(),
    };
    setDebts((prev) => [...prev, newDebt]);
    addXP(20, 'Cadastrou dívida para controle e quitação');
  };

  const deleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const payDebtInstallment = (id: string, customAmount?: number) => {
    setDebts((prev) =>
      prev
        .map((d) => {
          if (d.id === id) {
            const payAmount = customAmount || d.installmentAmount;
            const nextBalance = Math.max(0, d.currentBalance - payAmount);
            const remaining = Math.max(0, d.remainingInstallments - 1);
            if (nextBalance === 0) {
              addXP(100, `Quitou a dívida do credor ${d.creditor}! 🏆`);
            } else {
              addXP(30, `Pagou parcela da dívida ${d.creditor}`);
            }
            return {
              ...d,
              currentBalance: nextBalance,
              remainingInstallments: remaining,
            };
          }
          return d;
        })
        .filter((d) => d.currentBalance > 0)
    );
  };

  const updateEmergencyFund = (partial: Partial<EmergencyFundState>) => {
    setEmergencyFund((prev) => ({ ...prev, ...partial }));
  };

  const depositEmergencyFund = (amount: number) => {
    setEmergencyFund((prev) => {
      const nextAmount = prev.currentAmount + amount;
      const target = prev.essentialMonthlyExpenses * prev.targetMonths;
      if (target > 0 && nextAmount >= target && prev.currentAmount < target) {
        addXP(200, 'Meta de Reserva de Emergência 100% Concluída! 🛟');
      } else {
        addXP(25, `Aportou R$ ${amount} na Reserva`);
      }
      return {
        ...prev,
        currentAmount: nextAmount,
      };
    });
    // Add transaction log
    addTransaction({
      description: 'Aporte na Reserva de Emergência',
      amount,
      type: 'investment',
      category: 'investimentos',
      date: new Date().toISOString().split('T')[0],
      isPaid: true,
    });
  };

  const setEmergencyFundBalance = (newBalance: number) => {
    const sanitizedBalance = Math.max(0, newBalance);
    setEmergencyFund((prev) => {
      const diff = sanitizedBalance - prev.currentAmount;
      if (diff !== 0) {
        addTransaction({
          description: diff > 0 ? 'Ajuste / Correção de Saldo (Reserva)' : 'Ajuste / Redução de Saldo (Reserva)',
          amount: Math.abs(diff),
          type: diff > 0 ? 'investment' : 'expense',
          category: 'investimentos',
          date: new Date().toISOString().split('T')[0],
          isPaid: true,
          notes: `Correção manual do saldo da reserva de R$ ${prev.currentAmount.toLocaleString('pt-BR')} para R$ ${sanitizedBalance.toLocaleString('pt-BR')}`,
        });
      }
      return {
        ...prev,
        currentAmount: sanitizedBalance,
      };
    });
    addXP(15, 'Atualizou o saldo da Reserva de Emergência 🛡️');
  };

  const withdrawEmergencyFund = (amount: number, reason?: string) => {
    const sanitizedAmount = Math.max(0, amount);
    if (sanitizedAmount <= 0) return;

    setEmergencyFund((prev) => {
      const nextAmount = Math.max(0, prev.currentAmount - sanitizedAmount);
      return {
        ...prev,
        currentAmount: nextAmount,
      };
    });

    addTransaction({
      description: reason ? `Resgate Reserva: ${reason}` : 'Resgate para Emergência',
      amount: sanitizedAmount,
      type: 'income', // money returns to available liquid cash
      category: 'investimentos',
      date: new Date().toISOString().split('T')[0],
      isPaid: true,
      notes: reason || 'Uso em imprevisto emergencial',
    });
  };

  const addGoal = (goalData: Omit<FinancialGoal, 'id' | 'createdAt'>) => {
    const newGoal: FinancialGoal = {
      ...goalData,
      id: 'goal-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGoals((prev) => [...prev, newGoal]);
    addXP(30, `Criou a meta: ${goalData.title}`);
  };

  const depositGoal = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextAmount = g.currentAmount + amount;
          if (nextAmount >= g.targetAmount && g.currentAmount < g.targetAmount) {
            addXP(150, `Conquistou a meta ${g.title}! 🎯`);
          } else {
            addXP(20, `Aportou na meta ${g.title}`);
          }
          return {
            ...g,
            currentAmount: nextAmount,
          };
        }
        return g;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const completeLesson = (lessonId: string, xpReward: number) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
      addXP(xpReward, 'Completou aula na Academia Financeira');
    }
  };

  const toggleChallengeDay = (day: number) => {
    if (completedChallengeDays.includes(day)) {
      setCompletedChallengeDays((prev) => prev.filter((d) => d !== day));
    } else {
      setCompletedChallengeDays((prev) => [...prev, day]);
      addXP(25, `Concluiu o desafio do Dia ${day} dos 365 Dias`);
    }
  };

  const toggleKidActivity = (id: string) => {
    setKidActivities((prev) =>
      prev.map((k) => {
        if (k.id === id) {
          const nextStatus = !k.completed;
          if (nextStatus) {
            addXP(30, `Completou atividade infantil: ${k.title}`);
          }
          return { ...k, completed: nextStatus };
        }
        return k;
      })
    );
  };

  const toggleRecoveryAction = (id: string) => {
    setRecoveryPlan((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextState = !a.isDone;
          if (nextState) {
            addXP(a.xp, `Ação concluída: ${a.title}`);
          }
          return { ...a, isDone: nextState };
        }
        return a;
      })
    );
  };

  const saveDiagnosticResults = (data: DiagnosticAnswer) => {
    setDiagnosticData(data);
    setHasCompletedDiagnostic(true);
    // Update emergency fund target and base parameters
    updateEmergencyFund({
      essentialMonthlyExpenses: data.expenses * 0.65,
      currentAmount: data.emergencyFund,
    });
    addXP(100, 'Diagnóstico Financeiro Completo Realizado!');
  };

  const togglePremium = () => {
    setIsPremium((prev) => !prev);
  };

  const clearAllData = () => {
    setTransactions([]);
    setCategoryBudgets(CLEAN_CATEGORY_BUDGETS);
    setDebts([]);
    setEmergencyFund(CLEAN_EMERGENCY_FUND);
    setGoals([]);
    setCompletedLessonIds([]);
    setUserXP(0);
    setStreakDays(0);
    setAchievements(INITIAL_ACHIEVEMENTS.map((a) => ({ ...a, isUnlocked: false })));
    setCompletedChallengeDays([]);
    setHasCompletedDiagnostic(false);
    setDiagnosticData(null);
    setRecoveryPlan(INITIAL_RECOVERY_PLAN.map((r) => ({ ...r, isDone: false })));
    setKidActivities(INITIAL_KID_ACTIVITIES.map((k) => ({ ...k, completed: false })));

    // Wipe local storage
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_txs');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_budgets');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_debts');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_emergency');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_goals');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_lessons');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_xp');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_streak');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_achievements');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_challenges');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_has_diagnostic');
      localStorage.removeItem(LOCAL_STORAGE_KEY + '_diagnostic');
      // Also clean old v1 keys if present
      localStorage.removeItem('vida_financeira_state_v1_txs');
      localStorage.removeItem('vida_financeira_state_v1_budgets');
      localStorage.removeItem('vida_financeira_state_v1_debts');
      localStorage.removeItem('vida_financeira_state_v1_emergency');
      localStorage.removeItem('vida_financeira_state_v1_goals');
      localStorage.removeItem('vida_financeira_state_v1_lessons');
      localStorage.removeItem('vida_financeira_state_v1_xp');
      localStorage.removeItem('vida_financeira_state_v1_achievements');
    } catch {
      // storage unavailable or restricted
    }
  };

  const loadDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setCategoryBudgets(INITIAL_CATEGORY_BUDGETS);
    setDebts(INITIAL_DEBTS);
    setEmergencyFund(INITIAL_EMERGENCY_FUND);
    setGoals(INITIAL_GOALS);
    setCompletedLessonIds(['lesson-1-1', 'lesson-2-1']);
    setUserXP(480);
    setStreakDays(14);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setCompletedChallengeDays([1, 7, 15]);
    setHasCompletedDiagnostic(true);
    setRecoveryPlan(INITIAL_RECOVERY_PLAN);
    setKidActivities(INITIAL_KID_ACTIVITIES);
    triggerCelebration();
  };

  return (
    <FinancialContext.Provider
      value={{
        netWorth,
        availableBalance,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings,
        healthScore,
        financialLevel,
        transactions,
        categoryBudgets,
        debts,
        emergencyFund,
        goals,
        budgetMode,
        academyTracks: ACADEMY_TRACKS,
        completedLessonIds,
        userXP,
        streakDays,
        achievements,
        challenge365: CHALLENGE_365_DAYS,
        completedChallengeDays,
        activeChallengeDay,
        familyMembers,
        kidActivities,
        recoveryPlan,
        hasCompletedDiagnostic,
        diagnosticData,
        isPremium,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateCategoryBudget,
        setBudgetMode,
        addDebt,
        deleteDebt,
        payDebtInstallment,
        updateEmergencyFund,
        depositEmergencyFund,
        setEmergencyFundBalance,
        withdrawEmergencyFund,
        addGoal,
        depositGoal,
        contributeToGoal: depositGoal,
        deleteGoal,
        completeLesson,
        addXP,
        toggleChallengeDay,
        toggleKidActivity,
        toggleRecoveryAction,
        saveDiagnosticResults,
        togglePremium,
        triggerCelebration,
        clearAllData,
        loadDemoData,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
