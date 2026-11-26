import {
  AcademyTrack,
  AchievementBadge,
  CategoryBudget,
  DayChallenge,
  DebtItem,
  EmergencyFundState,
  FamilyMember,
  FinancialGoal,
  FinancialLevelInfo,
  KidActivity,
  RecoveryPlanAction,
  Transaction,
} from '../types';

export const FINANCIAL_LEVELS: Record<number, FinancialLevelInfo> = {
  1: {
    level: 1,
    title: 'Nível 1 — Sobrevivência',
    subtitle: 'Estancando sangrias e reorganizando a base',
    color: '#ef4444',
    badgeBg: 'bg-red-500/10 text-red-500 border-red-500/20',
    description: 'Você gasta tudo o que ganha (ou mais), tem dívidas caras e nenhuma reserva. O foco absoluto é cortar supérfluos, negociar juros e ter clareza do fluxo.',
    unlockedBenefits: ['Acesso ao Diagnóstico Básico', 'Controle de Receitas e Despesas', 'Calculadora de Dívidas'],
    nextLevelRequirements: ['Fechar 1 mês com saldo positivo', 'Mapear 100% das despesas fixas e variáveis', 'Parar de usar o cheque especial e rotativo'],
  },
  2: {
    level: 2,
    title: 'Nível 2 — Organização',
    subtitle: 'Controle ativo do dinheiro e primeiros passos',
    color: '#f97316',
    badgeBg: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    description: 'Você já sabe para onde vai o seu dinheiro e não atrasa contas básicas, mas ainda possui pouca folga financeira ou dívidas estruturadas.',
    unlockedBenefits: ['Orçamento Inteligente 50/30/20', 'Trilhas de Reserva e Organização', 'Simuladores Básicos'],
    nextLevelRequirements: ['Acumular ao menos 1 mês de despesas essenciais na Reserva', 'Quitar dívidas de cartão de crédito', 'Definir teto de gastos por categoria'],
  },
  3: {
    level: 3,
    title: 'Nível 3 — Segurança',
    subtitle: 'Reserva formada e blindagem contra imprevistos',
    color: '#eab308',
    badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    description: 'Você possui de 3 a 6 meses de custos de vida protegidos em liquidez diária, sem dívidas nocivas, dormindo com tranquilidade financeira.',
    unlockedBenefits: ['Acesso a Simulador de Juros Compostos Avançado', 'Trilha Completa de Investimentos', 'Check-up de Proteção e Seguros'],
    nextLevelRequirements: ['Reserva de emergência 100% concluída (6 meses)', 'Iniciar primeiros investimentos além da poupança/CDB', 'Criar metas de médio prazo'],
  },
  4: {
    level: 4,
    title: 'Nível 4 — Crescimento',
    subtitle: 'Multiplicação de patrimônio e diversificação',
    color: '#3b82f6',
    badgeBg: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    description: 'Você investe com método e consistência todos os meses. Seus ativos estão diversificados entre Renda Fixa, Ações e Fundos Imobiliários.',
    unlockedBenefits: ['Simulador Viver de Renda / Regra dos 4%', 'Alocação de Ativos Inteligente', 'Consultório de Estratégia Patrimonial'],
    nextLevelRequirements: ['Manter taxa de poupança superior a 25% da renda', 'Receber os primeiros dividendos mensais constantes', 'Alcançar R$ 100 mil de patrimônio investido'],
  },
  5: {
    level: 5,
    title: 'Nível 5 — Independência',
    subtitle: 'Liberdade financeira e patrimônio produtivo',
    color: '#a855f7',
    badgeBg: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    description: 'O rendimento passivo dos seus investimentos cobre todos os seus custos de vida com folga. O trabalho agora é uma escolha, não uma obrigação.',
    unlockedBenefits: ['Planejamento Sucessório e Blindagem', 'Otimização Fiscal Avançada', 'Modo Família Multigeracional'],
    nextLevelRequirements: ['Manter a regra dos 4% com taxa de retirada segura', 'Blindagem patrimonial e diversificação global'],
  },
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    description: 'Salário Mensal',
    amount: 4500,
    type: 'income',
    category: 'salario',
    date: '2026-08-05',
    isPaid: true,
  },
  {
    id: 'tx-2',
    description: 'Freelance / Consultoria',
    amount: 350,
    type: 'income',
    category: 'renda_extra',
    date: '2026-08-12',
    isPaid: true,
  },
  {
    id: 'tx-3',
    description: 'Aluguel e Condomínio',
    amount: 1400,
    type: 'expense',
    category: 'moradia',
    date: '2026-08-10',
    isPaid: true,
  },
  {
    id: 'tx-4',
    description: 'Supermercado Mensal',
    amount: 700,
    type: 'expense',
    category: 'alimentacao',
    date: '2026-08-15',
    isPaid: true,
    notes: 'Excedeu a meta prevista de R$ 600',
  },
  {
    id: 'tx-5',
    description: 'Combustível e Aplicativo',
    amount: 400,
    type: 'expense',
    category: 'transporte',
    date: '2026-08-18',
    isPaid: true,
  },
  {
    id: 'tx-6',
    description: 'Plano de Saúde',
    amount: 320,
    type: 'expense',
    category: 'saude',
    date: '2026-08-08',
    isPaid: true,
  },
  {
    id: 'tx-7',
    description: 'Netflix, Spotify e Nuvem',
    amount: 110,
    type: 'expense',
    category: 'assinaturas',
    date: '2026-08-03',
    isPaid: true,
  },
  {
    id: 'tx-8',
    description: 'Jantar e Cinema no Fim de Semana',
    amount: 280,
    type: 'expense',
    category: 'lazer',
    date: '2026-08-20',
    isPaid: true,
  },
  {
    id: 'tx-9',
    description: 'Parcela Cartão / Empréstimo',
    amount: 360,
    type: 'expense',
    category: 'dividas',
    date: '2026-08-22',
    isPaid: true,
  },
  {
    id: 'tx-10',
    description: 'Aporte Reserva de Emergência (Tesouro Selic)',
    amount: 650,
    type: 'investment',
    category: 'investimentos',
    date: '2026-08-06',
    isPaid: true,
  },
];

export const INITIAL_CATEGORY_BUDGETS: CategoryBudget[] = [
  {
    category: 'moradia',
    name: 'Moradia (Casa & Contas)',
    iconName: 'Home',
    budgetLimit: 1500,
    spent: 1400,
    group: 'essencial',
    color: '#0284c7',
  },
  {
    category: 'alimentacao',
    name: 'Alimentação & Mercado',
    iconName: 'Utensils',
    budgetLimit: 600,
    spent: 700,
    group: 'essencial',
    color: '#f97316',
  },
  {
    category: 'transporte',
    name: 'Transporte & Carro',
    iconName: 'Car',
    budgetLimit: 550,
    spent: 400,
    group: 'essencial',
    color: '#10b981',
  },
  {
    category: 'saude',
    name: 'Saúde & Farmácia',
    iconName: 'HeartPulse',
    budgetLimit: 400,
    spent: 320,
    group: 'essencial',
    color: '#ec4899',
  },
  {
    category: 'educacao',
    name: 'Educação & Cursos',
    iconName: 'GraduationCap',
    budgetLimit: 250,
    spent: 0,
    group: 'essencial',
    color: '#8b5cf6',
  },
  {
    category: 'lazer',
    name: 'Lazer & Restaurantes',
    iconName: 'Sparkles',
    budgetLimit: 350,
    spent: 280,
    group: 'estilo_vida',
    color: '#f59e0b',
  },
  {
    category: 'assinaturas',
    name: 'Assinaturas & Streaming',
    iconName: 'Tv',
    budgetLimit: 120,
    spent: 110,
    group: 'estilo_vida',
    color: '#6366f1',
  },
  {
    category: 'roupas',
    name: 'Roupas & Cuidados',
    iconName: 'ShoppingBag',
    budgetLimit: 200,
    spent: 0,
    group: 'estilo_vida',
    color: '#14b8a6',
  },
  {
    category: 'dividas',
    name: 'Pagamento de Dívidas',
    iconName: 'CreditCard',
    budgetLimit: 400,
    spent: 360,
    group: 'essencial',
    color: '#ef4444',
  },
  {
    category: 'investimentos',
    name: 'Aportes & Investimentos',
    iconName: 'TrendingUp',
    budgetLimit: 650,
    spent: 650,
    group: 'investimento',
    color: '#059669',
  },
];

export const INITIAL_DEBTS: DebtItem[] = [
  {
    id: 'debt-1',
    creditor: 'Cartão de Crédito (Rotativo)',
    originalAmount: 3200,
    currentBalance: 2800,
    installmentAmount: 450,
    interestRateMonthly: 12.5,
    dueDate: '2026-08-25',
    totalInstallments: 8,
    remainingInstallments: 6,
    category: 'rotativo',
  },
  {
    id: 'debt-2',
    creditor: 'Cheque Especial Banco A',
    originalAmount: 1500,
    currentBalance: 1200,
    installmentAmount: 200,
    interestRateMonthly: 8.0,
    dueDate: '2026-08-30',
    totalInstallments: 6,
    remainingInstallments: 5,
    category: 'cheque_especial',
  },
  {
    id: 'debt-3',
    creditor: 'Financiamento Moto / Carro',
    originalAmount: 14000,
    currentBalance: 8000,
    installmentAmount: 360,
    interestRateMonthly: 1.2,
    dueDate: '2026-09-10',
    totalInstallments: 36,
    remainingInstallments: 22,
    category: 'financiamento',
  },
];

export const INITIAL_EMERGENCY_FUND: EmergencyFundState = {
  essentialMonthlyExpenses: 3200,
  targetMonths: 6,
  currentAmount: 11900,
  monthlyContribution: 650,
};

export const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'goal-1',
    title: 'Entrada da Casa Própria',
    targetAmount: 80000,
    currentAmount: 24000,
    deadlineMonths: 48,
    category: 'casa',
    icon: 'Home',
    color: '#0284c7',
    createdAt: '2026-01-10',
  },
  {
    id: 'goal-2',
    title: 'Comprar Meu Carro Sem Dívida',
    targetAmount: 50000,
    currentAmount: 18500,
    deadlineMonths: 36,
    category: 'carro',
    icon: 'Car',
    color: '#10b981',
    createdAt: '2026-03-01',
  },
  {
    id: 'goal-3',
    title: 'Viagem de Férias dos Sonhos',
    targetAmount: 8000,
    currentAmount: 5200,
    deadlineMonths: 12,
    category: 'viagem',
    icon: 'Plane',
    color: '#f59e0b',
    createdAt: '2026-05-15',
  },
];

export const ACADEMY_TRACKS: AcademyTrack[] = [
  {
    id: 'trilha-1',
    trackNumber: 1,
    title: 'Trilha 1 — Fundamentos',
    shortDescription: 'Como o dinheiro funciona: Receita x Despesa, Juros, Inflação e Poder de Compra',
    iconName: 'Coins',
    color: '#0284c7',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'A Verdadeira Função do Dinheiro',
        durationMinutes: 5,
        xpReward: 20,
        summary: 'Entenda o dinheiro como energia acumulada e ferramenta de liberdade, não de status.',
        contentMarkdown: `### O que é o dinheiro de verdade?
O dinheiro não é um fim em si mesmo, mas uma **ferramenta de troca de tempo e energia**. Quando você gasta dinheiro, está trocando horas preciosas da sua vida que você trabalhou para conquistar aquele valor.

#### Pilares Fundamentais:
1. **Poder de Troca:** O dinheiro permite que você escolha onde morar, o que comer e como viver.
2. **Poder de Segurança:** Dinheiro acumulado compra tranquilidade quando crises imprevistas surgem.
3. **Poder de Tempo:** Na independência financeira, seu patrimônio paga o seu estilo de vida, devolvendo seu tempo livre.`,
        keyTakeaways: [
          'Preço é o que você paga; valor é o que você leva.',
          'Gastar menos do que ganha é a única lei imutável da riqueza.',
          'Controle seu dinheiro antes que a falta dele controle você.',
        ],
        quiz: {
          question: 'Qual é o princípio primordial para sair do caos financeiro?',
          options: [
            'Apostar em investimentos de alto risco para multiplicar rápido',
            'Gastar rigorosamente menos do que ganha e acumular a diferença',
            'Fazer mais dívidas para acumular bens',
            'Não anotar nada e confiar apenas na memória',
          ],
          correctIndex: 1,
          explanation: 'Gastar menos do que se ganha é o alicerce insubstituível para gerar poupança, reserva e patrimônio.',
        },
      },
      {
        id: 'lesson-1-2',
        title: 'Inflação e o Ladrão Invisível',
        durationMinutes: 6,
        xpReward: 25,
        summary: 'Por que deixar dinheiro parado na conta corrente ou debaixo do colchão faz você empobrecer todos os dias.',
        contentMarkdown: `### Entendendo a Inflação (IPCA)
A inflação é a perda contínua do poder de compra da moeda. O que você comprava com R$ 100 há 10 anos não compra metade hoje.

#### A Regra de Ouro da Proteção:
- Dinheiro parado na conta corrente perde valor diariamente.
- A poupança tradicional frequentemente perde para a inflação real.
- Para seu dinheiro crescer de verdade, ele precisa render **acima da inflação** (Juro Real).`,
        keyTakeaways: [
          'Inflação corrói o poder de compra ano após ano.',
          'Investimentos precisam render no mínimo acima do IPCA.',
          'Reserva de emergência deve ficar em opções com liquidez e rendimento de 100% do CDI.',
        ],
        quiz: {
          question: 'O que acontece com R$ 1.000 guardados fisicamente em uma gaveta por 5 anos com inflação de 5% ao ano?',
          options: [
            'O valor nominal e o poder de compra aumentam',
            'O valor nominal é R$ 1.000, mas o poder de compra de produtos diminui sensivelmente',
            'O dinheiro multiplica sozinho',
            'A inflação não afeta dinheiro em espécie',
          ],
          correctIndex: 1,
          explanation: 'Embora a nota ainda marque R$ 1.000, os produtos custarão mais caros, reduzindo seu poder real de compra.',
        },
      },
      {
        id: 'lesson-1-3',
        title: 'Juros Simples vs. Juros Compostos',
        durationMinutes: 7,
        xpReward: 30,
        summary: 'A oitava maravilha do mundo: como colocar o tempo para trabalhar a favor do seu patrimônio.',
        contentMarkdown: `### Juros Compostos: O Efeito Bola de Neve
Quando você pega dinheiro emprestado, os juros compostos são seus maiores inimigos (dívidas do cartão dobram em meses). Mas quando você investe, eles transformam aportes pequenos em grandes fortunas.

#### Fórmula da Riqueza:
**Patrimônio = Aporte Mensal × (1 + Taxa)^Tempo**

O fator mais determinante não é começar com milhões, mas a **constância ao longo dos anos**.`,
        keyTakeaways: [
          'Nas dívidas, os juros trabalham contra você de forma exponencial.',
          'Nos investimentos, os juros sobre juros geram renda passiva perpétua.',
          'Começar cedo com pouco é melhor do que esperar ter muito para começar.',
        ],
        quiz: {
          question: 'Qual fator tem o maior impacto multiplicador na fórmula dos juros compostos a longo prazo?',
          options: [
            'O dia da semana em que você investe',
            'O tempo em que o dinheiro permanece rendendo com constância',
            'Trocar de investimento toda semana',
            'Sacar os rendimentos todos os meses para gastar',
          ],
          correctIndex: 1,
          explanation: 'O tempo é a variável exponencial na fórmula dos juros compostos, acelerando o efeito bola de neve.',
        },
      },
    ],
  },
  {
    id: 'trilha-2',
    trackNumber: 2,
    title: 'Trilha 2 — Organização',
    shortDescription: 'Método 50/30/20, controle de fluxo, categorias e corte de desperdícios sem sofrimento',
    iconName: 'LayoutGrid',
    color: '#059669',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'A Regra do Orçamento 50/30/20',
        durationMinutes: 6,
        xpReward: 20,
        summary: 'A divisão matemática mais elegante e prática para equilibrar presente e futuro.',
        contentMarkdown: `### Estrutura do Método 50/30/20:
- **50% Necessidades Essenciais:** Moradia, alimentação básica, saúde, contas de consumo e transporte indispensável.
- **30% Estilo de Vida e Lazer:** Restaurantes, hobbies, passeios, roupas, streaming e compras pessoais.
- **20% Futuro e Independência:** Reserva de emergência, quitação antecipada de dívidas e investimentos de longo prazo.`,
        keyTakeaways: [
          'Você não precisa abrir mão do seu cafezinho ou lazer, basta estipular um teto.',
          'Se as necessidades passarem de 65%, é sinal de alerta para reestruturar custos fixos.',
          'Pague-se primeiro: separe os 20% do futuro assim que o salário cair.',
        ],
        quiz: {
          question: 'Em um salário líquido de R$ 4.000, quanto deve ser destinado aos investimentos na regra 50/30/20?',
          options: ['R$ 400', 'R$ 800 (20%)', 'R$ 2.000', 'Zero'],
          correctIndex: 1,
          explanation: '20% de R$ 4.000 equivale a R$ 800 mensais destinados à reserva e aos investimentos.',
        },
      },
      {
        id: 'lesson-2-2',
        title: 'Como Cortar Desperdícios Sem Perder Qualidade de Vida',
        durationMinutes: 5,
        xpReward: 25,
        summary: 'A auditoria financeira: renegociando planos, cancelando assinaturas fantasmas e economizando no mercado.',
        contentMarkdown: `### A Auditoria das Pequenas Sangrias
Muitas pessoas perdem R$ 300 a R$ 600 por mês em despesas automáticas que nem utilizam.

#### Checklist de 30 Minutos:
1. **Assinaturas Fantasmas:** Revise extratos bancários procurando streamings, apps e anuidades de cartão.
2. **Taxas Bancárias:** Cancele cestas de serviços e migre para contas gratuitas essenciais.
3. **Plano de Celular e Internet:** Ligue anualmente para sua operadora solicitando a adequação para planos atuais mais baratos.`,
        keyTakeaways: [
          'Pequenos vazamentos afundam grandes navios.',
          'Eliminar R$ 200/mês em desperdício investido a 10% a.a. gera mais de R$ 40.000 em 10 anos.',
          'Corte custos invisíveis, não sua qualidade de vida básica.',
        ],
        quiz: {
          question: 'Qual é o primeiro passo para encontrar gastos fantasmas no orçamento?',
          options: [
            'Ignorar os extratos do cartão de crédito',
            'Fazer uma varredura minuciosa nos extratos bancários dos últimos 90 dias',
            'Pedir um novo empréstimo',
            'Aumentar o limite do cartão',
          ],
          correctIndex: 1,
          explanation: 'Revisar os últimos 3 meses de extratos expõe assinaturas duplicadas, taxas de conta e hábitos esquecidos.',
        },
      },
    ],
  },
  {
    id: 'trilha-3',
    trackNumber: 3,
    title: 'Trilha 3 — Dívidas',
    shortDescription: 'Cartão de crédito, rotativo, cheque especial e plano definitivo de quitação e renegociação',
    iconName: 'ShieldAlert',
    color: '#ef4444',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'O Perigo Mortal do Rotativo e Cheque Especial',
        durationMinutes: 6,
        xpReward: 25,
        summary: 'Por que pagar o mínimo do cartão de crédito é a armadilha mais destrutiva do sistema financeiro.',
        contentMarkdown: `### A Matemática do Rotativo
As taxas do rotativo de cartão de crédito no Brasil frequentemente ultrapassam **300% a 450% ao ano** (12% a 15% ao mês). 

Isso significa que uma dívida de R$ 2.000 vira R$ 8.000 em um ano se não for estancada!

#### O que NUNCA fazer:
- Nunca pague o valor mínimo da fatura do cartão.
- Nunca use o limite do cheque especial como se fosse complemento de renda.`,
        keyTakeaways: [
          'Pagar o mínimo gera uma espiral de juros impagável.',
          'Cheque especial não é salário.',
          'Se não puder pagar a fatura integral, troque por um empréstimo com juros 4x menores.',
        ],
        quiz: {
          question: 'Se você não conseguir pagar a fatura completa do cartão de crédito, qual a melhor atitude?',
          options: [
            'Pagar o mínimo todo mês indefinidamente',
            'Buscar um crédito pessoal com taxa muito menor ou negociar parcelamento fixo com juros reduzidos',
            'Fazer outro cartão para pagar a fatura anterior',
            'Ignorar e esperar 5 anos',
          ],
          correctIndex: 1,
          explanation: 'Trocar uma dívida de 13% a.m. por uma linha com garantia ou parcelamento fixo de 2% a.m. estanca a sangria.',
        },
      },
      {
        id: 'lesson-3-2',
        title: 'Estratégia Avalanche vs. Bola de Neve',
        durationMinutes: 7,
        xpReward: 30,
        summary: 'Dois métodos científicos comprovados para liquidar múltiplas dívidas com eficiência.',
        contentMarkdown: `### Escolha sua arma estratégica:

#### 1. Método Avalanche (Matemático):
- Liste todas as dívidas por **taxa de juros** (da maior para a menor).
- Pague o valor mínimo em todas e coloque todo o dinheiro extra na dívida com maior juro.
- **Vantagem:** Economiza o máximo de dinheiro em juros.

#### 2. Método Bola de Neve (Psicológico):
- Liste as dívidas por **menor saldo devedor** até o maior.
- Quite as menores primeiro rapidamente.
- **Vantagem:** Sensação de vitória imediata e impulso emocional.`,
        keyTakeaways: [
          'Avalanche é ótimo para economizar o máximo de juros.',
          'Bola de Neve é excelente para recuperar a motivação e reduzir credores.',
          'Ambos funcionam se você mantiver a disciplina mensal.',
        ],
        quiz: {
          question: 'No método Avalanche, qual dívida recebe os maiores aportes extras?',
          options: [
            'A dívida com a maior taxa de juros mensal',
            'A dívida do credor mais simpático',
            'A dívida com menor saldo',
            'A dívida com vencimento mais distante',
          ],
          correctIndex: 0,
          explanation: 'O método Avalanche foca na dívida mais cara primeiro para reduzir o custo financeiro total o mais rápido possível.',
        },
      },
    ],
  },
  {
    id: 'trilha-4',
    trackNumber: 4,
    title: 'Trilha 4 — Reserva de Emergência',
    shortDescription: 'Quanto guardar, onde aplicar com 100% CDI / liquidez diária e como se proteger de crises',
    iconName: 'LifeBuoy',
    color: '#0284c7',
    lessons: [
      {
        id: 'lesson-4-1',
        title: 'O Tamanho Exato da Sua Reserva',
        durationMinutes: 5,
        xpReward: 20,
        summary: 'Descubra se você precisa de 3, 6 ou 12 meses de custos essenciais guardados.',
        contentMarkdown: `### Quantos meses guardar?
A reserva não é calculada sobre o seu salário bruto, mas sobre suas **despesas essenciais mensais** (custo de vida mínimo).

#### Guia por Perfil Profissional:
- **Funcionário Público Estável:** 3 a 6 meses de despesas.
- **Trabalhador CLT com FGTS:** 6 meses de despesas.
- **Autônomo, PJ ou Profissional Liberal:** 6 a 12 meses de despesas (devido à oscilação de renda).`,
        keyTakeaways: [
          'Reserva de emergência não é para buscar rentabilidade milagrosa, é para dar paz.',
          'Calculada sobre custos essenciais (aluguel, comida, saúde, contas).',
          'Permite que você nunca mais precise se endividar em momentos difíceis.',
        ],
        quiz: {
          question: 'Se suas despesas essenciais são R$ 3.000/mês e você é CLT, qual o valor recomendado para sua reserva?',
          options: ['R$ 3.000', 'R$ 18.000 (6 meses)', 'R$ 100.000', 'R$ 500'],
          correctIndex: 1,
          explanation: '6 meses de despesas essenciais (6 × R$ 3.000 = R$ 18.000) conferem proteção segura para o trabalhador CLT.',
        },
      },
      {
        id: 'lesson-4-2',
        title: 'Onde Aplicar a Reserva com Segurança Total',
        durationMinutes: 6,
        xpReward: 25,
        summary: 'Tesouro Selic vs CDB 100% CDI com liquidez diária vs Poupança.',
        contentMarkdown: `### Os 3 Requisitos Obrigatórios da Reserva:
1. **Liquidez Imediata (D+0 ou D+1):** Você precisa resgatar no mesmo dia se o carro quebrar ou surgir uma emergência médica.
2. **Baixa Volatilidade:** O valor não pode oscilar negativamente (nada de Ações ou Cripto para reserva).
3. **Garantia de Segurança:** Tesouro Direto (risco soberano do país) ou CDBs com cobertura do Fundo Garantidor de Créditos (FGC até R$ 250 mil).`,
        keyTakeaways: [
          'Tesouro Selic e CDBs 100% CDI de grandes instituições são os melhores locais.',
          'Nunca coloque sua reserva em ações, fundos com prazo de resgate longo ou criptomoedas.',
          'Poupança rende significativamente menos que 100% do CDI.',
        ],
        quiz: {
          question: 'Qual destes ativos é o MAIS indicado para alocar a Reserva de Emergência?',
          options: [
            'Ações de empresas iniciantes na bolsa',
            'CDB com liquidez diária que paga 100%+ do CDI ou Tesouro Selic',
            'Imóvel na planta',
            'Criptomoedas voláteis',
          ],
          correctIndex: 1,
          explanation: 'CDB com liquidez diária e Tesouro Selic oferecem resgate imediato, segurança e rendimento diário consistente.',
        },
      },
    ],
  },
  {
    id: 'trilha-5',
    trackNumber: 5,
    title: 'Trilha 5 — Investimentos',
    shortDescription: 'Renda Fixa, Tesouro IPCA+, CDBs, Ações de dividendos, FIIs e Montagem de Carteira',
    iconName: 'TrendingUp',
    color: '#8b5cf6',
    lessons: [
      {
        id: 'lesson-5-1',
        title: 'O Mapa Completo dos Investimentos',
        durationMinutes: 7,
        xpReward: 25,
        summary: 'Entenda a diferença entre ser credor (Renda Fixa) e ser sócio (Renda Variável).',
        contentMarkdown: `### Renda Fixa vs Renda Variável:
- **Renda Fixa (Você empresta dinheiro):** Empresta para o governo (Tesouro), bancos (CDB, LCI, LCA) ou empresas (Debêntures). Recebe juros prefixados, pós-fixados (CDI) ou híbridos (IPCA + taxa).
- **Renda Variável (Você se torna sócio):** Compra frações de empresas na Bolsa (Ações) ou pedaços de imóveis reais (Fundos Imobiliários - FIIs). Recebe dividendos e valorização com o crescimento da economia.`,
        keyTakeaways: [
          'Renda Fixa traz previsibilidade e proteção do capital.',
          'Renda Variável gera crescimento acelerado e proteção contra a inflação no longo prazo.',
          'A combinação dos dois é o segredo dos grandes investidores.',
        ],
        quiz: {
          question: 'Ao comprar uma cota de um Fundo Imobiliário (FII), o que você está fazendo?',
          options: [
            'Pegando um empréstimo para comprar uma casa própria',
            'Tornando-se coproprietário de imóveis comerciais (shoppings, galpões) e recebendo aluguéis proporcionais isentos de IR',
            'Apostando em loteria esportiva',
            'Doando dinheiro a uma incorporadora',
          ],
          correctIndex: 1,
          explanation: 'FIIs reúnem investidores para comprar galpões, lajes e shoppings, distribuindo aluguéis mensais aos cotistas.',
        },
      },
      {
        id: 'lesson-5-2',
        title: 'Diversificação: O Único Almoço Grátis do Mercado',
        durationMinutes: 6,
        xpReward: 30,
        summary: 'Como montar uma carteira antifrágil que resiste a qualquer governo ou crise global.',
        contentMarkdown: `### Não coloque todos os ovos na mesma cesta
Uma carteira bem estruturada possui:
1. **Reserva & Oportunidades:** Pós-fixado (CDI / Selic)
2. **Proteção de Poder de Compra:** Tesouro IPCA+ (Longo prazo)
3. **Geração de Renda Passiva:** Fundos Imobiliários e Ações de empresas maduras (Elétricas, Bancos, Saneamento)
4. **Crescimento Global:** ETFs internacionais (como S&P 500 / IVVB11)`,
        keyTakeaways: [
          'Diversificar reduz o risco sem diminuir o retorno esperado.',
          'Rebalanceie sua carteira 1 a 2 vezes ao ano.',
          'Invista com foco nos fundamentos, não na cotação do dia.',
        ],
        quiz: {
          question: 'Por que é importante ter investimentos atrelados à inflação (IPCA+)?',
          options: [
            'Para garantir ganho real e blindar o patrimônio contra o aumento do custo de vida no longo prazo',
            'Porque rende zero juros',
            'Para resgatar no dia seguinte com prejuízo',
            'Apenas por obrigação legal',
          ],
          correctIndex: 0,
          explanation: 'O Tesouro IPCA+ garante a reposição da inflação mais uma taxa de juros real prefixada, preservando a riqueza futura.',
        },
      },
    ],
  },
  {
    id: 'trilha-6',
    trackNumber: 6,
    title: 'Trilha 6 — Patrimônio & Renda Passiva',
    shortDescription: 'A Regra dos 4%, efeito bola de neve, viver de renda e aposentadoria sustentável',
    iconName: 'Award',
    color: '#a855f7',
    lessons: [
      {
        id: 'lesson-6-1',
        title: 'A Regra dos 4% e a Liberdade Financeira',
        durationMinutes: 8,
        xpReward: 35,
        summary: 'Calcule o patrimônio exato necessário para você nunca mais depender de um emprego obrigatório.',
        contentMarkdown: `### Quanto dinheiro você precisa para viver de renda?
O estudo da Trinity University (Regra dos 4%) demonstra que você pode retirar até 4% do seu patrimônio investido anualmente, corrigido pela inflação, com probabilidade de seu dinheiro durar para sempre.

#### Fórmula Rápida:
**Patrimônio Alvo = Seu Custo de Vida Anual × 25** (ou Custo Mensal × 300)

*Exemplo:* Se você gasta R$ 4.000/mês (R$ 48.000/ano):
- R$ 48.000 × 25 = **R$ 1.200.000 de patrimônio investido**.`,
        keyTakeaways: [
          'Viver de renda é uma meta matemática tangível.',
          'Reduzir seus custos fixos diminui drasticamente o patrimônio necessário para a liberdade.',
          'Renda passiva é o salário que seu patrimônio paga para você.',
        ],
        quiz: {
          question: 'Se uma pessoa tem um custo de vida de R$ 5.000/mês, qual o patrimônio aproximado pela regra dos 300 meses?',
          options: ['R$ 150.000', 'R$ 1.500.000', 'R$ 10.000.000', 'R$ 50.000'],
          correctIndex: 1,
          explanation: 'R$ 5.000 × 300 = R$ 1.500.000, que a um rendimento real de 0,33% a.m. a 0,4% a.m. gera R$ 5.000 a R$ 6.000/mês de renda perpétua.',
        },
      },
    ],
  },
  {
    id: 'trilha-7',
    trackNumber: 7,
    title: 'Trilha 7 — Comportamento & Psicologia',
    shortDescription: 'Consumo emocional, impulsividade, comparação social, status e reprogramação de crenças',
    iconName: 'Brain',
    color: '#ec4899',
    lessons: [
      {
        id: 'lesson-7-1',
        title: 'A Regra das 72 Horas Contra o Consumo Impulsivo',
        durationMinutes: 5,
        xpReward: 20,
        summary: 'Como hackear a dopamina do cérebro e economizar milhares de reais todos os anos.',
        contentMarkdown: `### Por que compramos por impulso?
Nosso cérebro busca recompensa rápida através da dopamina quando estamos estressados, entediados ou tristes.

#### O Filtro das 72 Horas:
1. Viu algo não essencial que sentiu vontade de comprar? **Adicione em uma lista de desejos e espere 72 horas.**
2. Em 80% das vezes, o pico hormonal passa e você percebe que não precisava daquilo.
3. Se após 3 dias a necessidade persistir e couber no seu orçamento de estilo de vida, compre com consciência!`,
        keyTakeaways: [
          'Emoções fortes (raiva, cansaço, tristeza) são péssimas conselheiras de compra.',
          'A regra das 72 horas devolve o controle racional ao córtex pré-frontal.',
          'Comprar não cura a ansiedade, apenas adia o problema.',
        ],
        quiz: {
          question: 'Qual o objetivo principal da regra das 72 horas para compras não essenciais?',
          options: [
            'Esperar a loja fechar para sempre',
            'Dissipar o impulso emocional e decidir com racionalidade se o produto é realmente necessário',
            'Comprar parcelado em 72 vezes',
            'Fazer compras somente de madrugada',
          ],
          correctIndex: 1,
          explanation: 'Esperar 72 horas quebra o ciclo de dopamina imediata, permitindo uma decisão financeira sóbria.',
        },
      },
    ],
  },
  {
    id: 'trilha-8',
    trackNumber: 8,
    title: 'Trilha 8 — Família & Educação Infantil',
    shortDescription: 'Finanças do casal, filhos, educação financeira para crianças e planejamento sucessório',
    iconName: 'Users',
    color: '#14b8a6',
    lessons: [
      {
        id: 'lesson-8-1',
        title: 'Finanças a Dois: O Alinhamento que Salva Relacionamentos',
        durationMinutes: 6,
        xpReward: 25,
        summary: 'Contas conjuntas vs separadas e como falar de dinheiro com transparência e respeito.',
        contentMarkdown: `### O Método dos Três Potes no Casamento:
- **Pote 1 (Nosso):** Conta conjunta para pagar aluguel, condomínio, mercado, contas dos filhos e reserva familiar (proporcional à renda de cada um).
- **Pote 2 (Meu):** Dinheiro 100% livre para gastos individuais do parceiro A, sem necessidade de justificativas.
- **Pote 3 (Seu):** Dinheiro 100% livre para gastos individuais do parceiro B.
- **Metas Compartilhadas:** Sonhos alinhados (comprar a casa, viajar, aposentadoria).`,
        keyTakeaways: [
          'Dinheiro é uma das maiores causas de atritos conjugais quando mantido em segredo.',
          'Transparência com autonomia é a melhor receita.',
          'Contribuir proporcionalmente aos rendimentos traz justiça e harmonia.',
        ],
        quiz: {
          question: 'Qual é o benefício de manter "potes livres individuais" em um casamento além das contas conjuntas?',
          options: [
            'Esconder dívidas do parceiro',
            'Garantir liberdade e individualidade para gastos pessoais sem gerar cobranças ou culpa mútua',
            'Evitar pagar qualquer conta da casa',
            'Dividir o almoço no centavo',
          ],
          correctIndex: 1,
          explanation: 'Ter um valor individual para cada parceiro gastar como quiser preserva a autonomia e elimina conflitos de estilo de vida.',
        },
      },
    ],
  },
];

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-1',
    title: 'Primeira Semana Organizada',
    description: 'Registrou receitas e despesas por 7 dias seguidos.',
    iconName: 'CalendarCheck',
    xpReward: 50,
    isUnlocked: true,
    unlockedAt: '2026-08-10',
    progressPercent: 100,
  },
  {
    id: 'ach-2',
    title: 'Primeira Dívida Renegociada',
    description: 'Cadastrou ou quitou uma dívida com estratégia inteligente.',
    iconName: 'ShieldCheck',
    xpReward: 100,
    isUnlocked: true,
    unlockedAt: '2026-08-15',
    progressPercent: 100,
  },
  {
    id: 'ach-3',
    title: 'Clube dos R$ 10 Mil',
    description: 'Alcançou a marca de R$ 10.000 em patrimônio acumulado.',
    iconName: 'Trophy',
    xpReward: 150,
    isUnlocked: true,
    unlockedAt: '2026-08-01',
    progressPercent: 100,
  },
  {
    id: 'ach-4',
    title: 'Mestre da Reserva (60%+)',
    description: 'Conquistou mais de 60% da sua Reserva de Emergência recomendada.',
    iconName: 'LifeBuoy',
    xpReward: 100,
    isUnlocked: true,
    unlockedAt: '2026-08-20',
    progressPercent: 100,
  },
  {
    id: 'ach-5',
    title: 'Aluno Aplicado',
    description: 'Concluiu 5 aulas com nota máxima no quiz.',
    iconName: 'GraduationCap',
    xpReward: 75,
    isUnlocked: false,
    progressPercent: 60,
  },
  {
    id: 'ach-6',
    title: 'Dívida Zero Total',
    description: 'Quitou 100% das dívidas nocivas de cartão e cheque especial.',
    iconName: 'Zap',
    xpReward: 250,
    isUnlocked: false,
    progressPercent: 40,
  },
  {
    id: 'ach-7',
    title: 'Primeiro R$ 1.000 em Dividendos',
    description: 'Recebeu proventos passivos mensais de investimentos.',
    iconName: 'Sparkles',
    xpReward: 200,
    isUnlocked: false,
    progressPercent: 25,
  },
  {
    id: 'ach-8',
    title: 'Independência Financeira (Nível 5)',
    description: 'Patrimônio suficiente para cobrir todos os custos de vida.',
    iconName: 'Crown',
    xpReward: 500,
    isUnlocked: false,
    progressPercent: 15,
  },
];

export const CHALLENGE_365_DAYS: DayChallenge[] = [
  {
    day: 1,
    title: 'Descubra quanto você realmente ganha',
    action: 'Some todo o seu salário líquido + rendas extras reais dos últimos 3 meses.',
    xp: 20,
    tip: 'Não use o salário bruto, use o valor real que cai na sua conta após descontos de INSS/IR.',
    category: 'consciencia',
  },
  {
    day: 7,
    title: 'Descubra seus 3 maiores ralos de dinheiro',
    action: 'Analise o extrato do seu cartão e identifique onde R$ 200+ foram gastos sem você perceber.',
    xp: 25,
    tip: 'Pequenos pedidos de delivery e compras impulsivas somados viram fortunas no fim do ano.',
    category: 'consciencia',
  },
  {
    day: 15,
    title: 'Cancele 1 assinatura ou serviço esquecido',
    action: 'Abra as configurações de assinaturas do seu celular ou cartão e cancele pelo menos um serviço não essencial.',
    xp: 30,
    tip: 'Economizar R$ 39,90/mês equivale a guardar quase R$ 500 por ano.',
    category: 'economia',
  },
  {
    day: 30,
    title: 'Feche seu primeiro mês com sobra positiva',
    action: 'Certifique-se de que suas receitas superaram suas despesas em pelo menos R$ 100.',
    xp: 50,
    tip: 'Parabéns pelo primeiro mês sob controle! Essa sobra será a semente da sua liberdade.',
    category: 'organizacao',
  },
  {
    day: 60,
    title: 'Abra sua conta de investimentos e guarde na Reserva',
    action: 'Faça seu primeiro depósito em um CDB de 100% CDI ou Tesouro Selic.',
    xp: 60,
    tip: 'A sensação de ter uma reserva financeira não tem preço. É o seu escudo contra o estresse.',
    category: 'investimento',
  },
  {
    day: 90,
    title: 'Elimine sua primeira dívida ou liquide uma parcela',
    action: 'Utilize o método Avalanche ou Bola de Neve para matar o primeiro credor da sua lista.',
    xp: 80,
    tip: 'Menos um boleto na sua vida! Sinta o alívio e redirecione esse valor para a próxima dívida.',
    category: 'habito',
  },
  {
    day: 180,
    title: 'Faça seu primeiro investimento em Renda Fixa ou FIIs',
    action: 'Adquira seu primeiro título IPCA+ ou sua primeira cota de fundo imobiliário.',
    xp: 100,
    tip: 'Você deixou de ser apenas poupador e se tornou oficialmente um investidor consciente.',
    category: 'investimento',
  },
  {
    day: 365,
    title: 'Compare seu patrimônio hoje com o do Dia 1',
    action: 'Gere seu relatório anual no Vida Financeira e comemore a sua transformação!',
    xp: 200,
    tip: 'Você percorreu a jornada do Caos à Organização e ao Crescimento. Você mudou sua história!',
    category: 'habito',
  },
];

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  { id: 'fm-1', name: 'Você (Titular)', role: 'eu', avatarColor: '#0284c7', contributionPct: 70 },
  { id: 'fm-2', name: 'Cônjuge / Parceiro(a)', role: 'conjuge', avatarColor: '#ec4899', contributionPct: 30 },
  { id: 'fm-3', name: 'Lucas (Filho - 9 anos)', role: 'filho', avatarColor: '#f59e0b' },
];

export const INITIAL_KID_ACTIVITIES: KidActivity[] = [
  {
    id: 'kid-1',
    title: 'O Desafio do Cofrinho Transparente',
    pillar: 'guardar',
    description: 'Usar um pote transparente para que a criança veja o dinheiro crescendo visualmente.',
    practicalTask: 'Separar moedas ou notas de troco e guardar toda semana até o topo.',
    ageGroup: '5 a 10 anos',
    completed: true,
  },
  {
    id: 'kid-2',
    title: 'Esperar para Conquistar (O Teste do Brinquedo)',
    pillar: 'esperar',
    description: 'Ensinar que querer algo hoje não significa ter que comprar no mesmo minuto.',
    practicalTask: 'Quando pedir um brinquedo, anotar em um papel e esperar 15 dias antes de decidir.',
    ageGroup: '6 a 12 anos',
    completed: true,
  },
  {
    id: 'kid-3',
    title: 'O Jogo das Escolhas no Supermercado',
    pillar: 'escolher',
    description: 'Dar uma missão no mercado: escolher entre duas opções respeitando um limite de R$ 15.',
    practicalTask: 'A criança compara preços de cereais ou frutas e escolhe a melhor opção.',
    ageGroup: '7 a 14 anos',
    completed: false,
  },
  {
    id: 'kid-4',
    title: 'Empreendedor Mirim (Ganhando seu Primeiro Valor)',
    pillar: 'ganhar',
    description: 'Ensinar que dinheiro é fruto de esforço, ideias e solução de problemas.',
    practicalTask: 'Vender limonada, organizar a garagem ou fazer artesanato para familiares.',
    ageGroup: '8 a 15 anos',
    completed: false,
  },
  {
    id: 'kid-5',
    title: 'O Pote da Generosidade (Doar)',
    pillar: 'doar',
    description: 'Separar 10% do cofrinho para comprar um presente ou alimento para quem precisa.',
    practicalTask: 'Escolher um brinquedo ou comprar um lanche para doação em datas especiais.',
    ageGroup: 'Todas as idades',
    completed: false,
  },
];

export const INITIAL_RECOVERY_PLAN: RecoveryPlanAction[] = [
  {
    id: 'rec-1',
    phase: '30dias',
    title: 'Mapear 100% das Despesas Fixas e Variáveis',
    detail: 'Categorize todas as saídas no app para identificar ralos de consumo.',
    isDone: true,
    xp: 30,
  },
  {
    id: 'rec-2',
    phase: '30dias',
    title: 'Cancelar 2 Desperdícios Automáticos',
    detail: 'Elimine tarifas bancárias, streamings sem uso ou clubes esquecidos.',
    isDone: true,
    xp: 25,
  },
  {
    id: 'rec-3',
    phase: '30dias',
    title: 'Negociar Dívida do Cartão Rotativo (12% a.m.)',
    detail: 'Ligue para o emissor ou use o Feirão Limpa Nome para obter desconto ou parcelamento fixo com juros menores.',
    isDone: false,
    xp: 50,
  },
  {
    id: 'rec-4',
    phase: '30dias',
    title: 'Guardar os Primeiros R$ 300 na Reserva',
    detail: 'Aplique em Tesouro Selic ou CDB 100% CDI de liquidez diária.',
    isDone: true,
    xp: 40,
  },
  {
    id: 'rec-5',
    phase: '6meses',
    title: 'Quitar Integralmente as Dívidas de Cartão e Cheque',
    detail: 'Use o método Avalanche direcionando a sobra mensal de R$ 650+ para estancar os juros.',
    isDone: false,
    xp: 100,
  },
  {
    id: 'rec-6',
    phase: '6meses',
    title: 'Completar 100% da Reserva de Emergência (R$ 19.200)',
    detail: 'Mantenha 6 meses de custos essenciais blindados contra qualquer imprevisto.',
    isDone: false,
    xp: 150,
  },
  {
    id: 'rec-7',
    phase: '6meses',
    title: 'Iniciar Carteira de Renda Fixa e Fundos Imobiliários',
    detail: 'Faça aportes regulares diversificados em Tesouro IPCA+ e FIIs para receber os primeiros proventos.',
    isDone: false,
    xp: 80,
  },
  {
    id: 'rec-8',
    phase: '5anos',
    title: 'Construir Patrimônio Acumulado de R$ 200.000+',
    detail: 'Manter aportes disciplinados com reinvestimento de todos os dividendos e juros compostos.',
    isDone: false,
    xp: 300,
  },
  {
    id: 'rec-9',
    phase: '5anos',
    title: 'Alcançar Nível 5 — Independência Financeira Parcial/Total',
    detail: 'Rendimentos passivos cobrindo 50% a 100% das despesas familiares essenciais.',
    isDone: false,
    xp: 500,
  },
];

export const KIDS_ACTIVITIES = [
  {
    id: 'kid-1',
    title: 'O Desafio dos 3 Cofrinhos',
    pillar: 'guardar',
    icon: '🐷',
    description: 'Divida a mesada em 3 partes: 1. Gastar hoje (desejos imediatos), 2. Guardar para o sonho (brinquedo maior), 3. Doar / Ajudar alguém.',
    practicalTask: 'Separar 3 potes transparentes e etiquetar com desenhos.',
    ageGroup: '4 a 8 anos',
    reward: '+50 Pontos no Cofrinho',
    completed: true,
  },
  {
    id: 'kid-2',
    title: 'O Teste da Espera (Superpoder da Paciência)',
    pillar: 'esperar',
    icon: '⏳',
    description: 'Quando quiser um brinquedo ou doce na loja, anote em uma folha e espere 7 dias. Se ainda quiser muito depois de uma semana, conversem sobre comprar.',
    practicalTask: 'Criar a lista do "Quero, mas posso esperar".',
    ageGroup: '6 a 12 anos',
    reward: '+80 Pontos no Cofrinho',
    completed: false,
  },
  {
    id: 'kid-3',
    title: 'Mini-Empreendedor da Casa',
    pillar: 'ganhar',
    icon: '🌟',
    description: 'Aprender que dinheiro vem de resolver problemas e ajudar as pessoas. Realizar uma tarefa extra criativa (como organizar a estante ou cuidar das plantas) para ganhar uma recompensa.',
    practicalTask: 'Realizar uma tarefa de ajuda voluntária na família.',
    ageGroup: '7 a 14 anos',
    reward: '+100 Pontos no Cofrinho',
    completed: false,
  },
  {
    id: 'kid-4',
    title: 'Mercadinho Inteligente',
    pillar: 'escolher',
    icon: '🛒',
    description: 'No supermercado, dê a missão de encontrar a opção de melhor valor ou comparar preços de 2 marcas do mesmo produto que a família consome.',
    practicalTask: 'Encontrar a marca mais econômica no mercado.',
    ageGroup: '8 a 14 anos',
    reward: '+70 Pontos no Cofrinho',
    completed: false,
  },
];
