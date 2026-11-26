export type FinancialLevelNumber = 1 | 2 | 3 | 4 | 5;

export interface FinancialLevelInfo {
  level: FinancialLevelNumber;
  title: string;
  subtitle: string;
  color: string;
  badgeBg: string;
  description: string;
  unlockedBenefits: string[];
  nextLevelRequirements: string[];
}

export type TransactionType = 'income' | 'expense' | 'investment';

export type CategoryKey =
  | 'moradia'
  | 'alimentacao'
  | 'transporte'
  | 'saude'
  | 'educacao'
  | 'filhos'
  | 'lazer'
  | 'roupas'
  | 'assinaturas'
  | 'dividas'
  | 'investimentos'
  | 'salario'
  | 'renda_extra'
  | 'outros';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: CategoryKey;
  date: string;
  isPaid: boolean;
  notes?: string;
}

export interface CategoryBudget {
  category: CategoryKey;
  name: string;
  iconName: string;
  budgetLimit: number;
  spent: number;
  group: 'essencial' | 'estilo_vida' | 'investimento';
  color: string;
}

export type BudgetMode = 'conservador' | 'equilibrado' | 'acelerado';

export interface BudgetRuleConfig {
  name: string;
  essentialPct: number; // e.g. 50%
  lifestylePct: number;  // e.g. 30%
  investmentPct: number; // e.g. 20%
  description: string;
  idealFor: string;
}

export interface DebtItem {
  id: string;
  creditor: string; // e.g. "Cartão Nubank", "Cheque Especial Itaú", "Empréstimo Caixa"
  originalAmount: number;
  currentBalance: number;
  installmentAmount: number;
  interestRateMonthly: number; // e.g. 12%
  dueDate: string;
  totalInstallments: number;
  remainingInstallments: number;
  category: 'cartao' | 'rotativo' | 'cheque_especial' | 'emprestimo' | 'financiamento' | 'outro';
}

export interface EmergencyFundState {
  essentialMonthlyExpenses: number;
  targetMonths: number; // 3, 6 or 12
  currentAmount: number;
  monthlyContribution: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadlineMonths: number;
  category: 'casa' | 'carro' | 'viagem' | 'estudos' | 'casamento' | 'eletronicos' | 'liberdade' | 'outro';
  icon: string;
  color: string;
  createdAt: string;
}

export interface AcademyLesson {
  id: string;
  title: string;
  durationMinutes: number;
  xpReward: number;
  summary: string;
  contentMarkdown: string;
  keyTakeaways: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface AcademyTrack {
  id: string;
  trackNumber: number;
  title: string;
  description?: string;
  shortDescription: string;
  iconName: string;
  color: string;
  isPremiumOnly?: boolean;
  lessons: AcademyLesson[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  xpReward: number;
  unlockedAt?: string;
  isUnlocked: boolean;
  progressPercent: number;
}

export interface DayChallenge {
  day: number;
  title: string;
  action: string;
  xp: number;
  tip: string;
  category: 'consciencia' | 'organizacao' | 'economia' | 'investimento' | 'habito';
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'eu' | 'conjuge' | 'filho' | 'dependente';
  avatarColor: string;
  contributionPct?: number;
}

export interface KidActivity {
  id: string;
  title: string;
  pillar: 'guardar' | 'gastar' | 'esperar' | 'escolher' | 'ganhar' | 'doar' | 'planejar';
  description: string;
  practicalTask: string;
  ageGroup: string;
  completed: boolean;
}

export interface DiagnosticAnswer {
  income: number;
  expenses: number;
  debtsTotal: number;
  emergencyFund: number;
  investmentsTotal: number;
  dependentsCount: number;
  savingsHabit: 'nunca' | 'as_vezes' | 'sempre_sobra' | 'invisto_primeiro';
  debtStatus: 'sem_dividas' | 'dividas_controladas' | 'dividas_atrasadas';
  financialGoalPriority: 'sair_dividas' | 'montar_reserva' | 'comprar_bem' | 'investir_independencia';
  impulseBuying: 'frequente' | 'moderado' | 'raro';
}

export interface CheckupPillar {
  name: string;
  scoreStatus: 'green' | 'yellow' | 'red' | 'orange';
  label: string;
  advice: string;
}

export interface RecoveryPlanAction {
  id: string;
  phase: '30dias' | '6meses' | '5anos';
  title: string;
  detail: string;
  isDone: boolean;
  xp: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  quickActions?: string[];
}
