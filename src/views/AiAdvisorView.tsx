import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronRight,
  User,
  Zap,
  TrendingUp,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { generateLocalFinancialAdvice } from '../lib/localAdvisor';

// URL do servidor de IA (opcional). Sem ela, o app usa o motor local (funciona offline).
const API_BASE_URL: string = ((import.meta as any).env?.VITE_API_URL || '').replace(/\/$/, '');

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiAdvisorView: React.FC = () => {
  const {
    netWorth,
    availableBalance,
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    healthScore,
    financialLevel,
    emergencyFund,
    debts,
    goals,
  } = useFinancial();

  const [activeTab, setActiveTab] = useState<'ia_chat' | 'consultorio'>('ia_chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Olá! Sou seu **Conselheiro Financeiro Pessoal**. Analisei seus números atuais:\n\n• **Patrimônio:** R$ ${netWorth.toLocaleString('pt-BR')}\n• **Saúde Financeira:** ${healthScore}/100\n• **Reserva de Emergência:** R$ ${emergencyFund.currentAmount.toLocaleString('pt-BR')}\n• **Dívidas ativas:** ${debts.length} credor(es)\n\nEm que posso te orientar hoje? Você pode me fazer perguntas diretas ou escolher uma das sugestões abaixo.`,
      timestamp: 'Agora',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickQuestions = [
    'Posso comprar um celular de R$ 3.000 agora?',
    'Tenho R$ 5.000 sobrando, o que devo fazer primeiro?',
    'Como quitar minhas dívidas com juros altos mais rápido?',
    'Qual a melhor estratégia para acelerar minha reserva de emergência?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    const totalDebts = debts.reduce((acc, d) => acc + d.currentBalance, 0);
    const userContext = {
      income: monthlyIncome,
      expenses: monthlyExpenses,
      savingsCapacity: monthlySavings,
      balance: availableBalance,
      netWorth,
      emergencyFund: emergencyFund.currentAmount,
      emergencyTarget: emergencyFund.essentialMonthlyExpenses * emergencyFund.targetMonths,
      totalDebts,
      investments: goals.reduce((acc, g) => acc + g.currentAmount, 0),
      financialLevel: `Nível ${financialLevel}`,
      healthScore,
    };
    const history = messages.slice(-6).map((m) => ({ role: m.role, text: m.content }));
    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      let reply = '';
      if (API_BASE_URL && (typeof navigator === 'undefined' || navigator.onLine !== false)) {
        try {
          const response = await fetch(API_BASE_URL + '/api/ai/advisor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: query, userContext, history }),
          });
          if (response.ok) {
            const data = await response.json();
            reply = data.reply || '';
          }
        } catch (e) {
          console.warn('Servidor de IA indisponível, usando motor local.', e);
        }
      }
      if (!reply) {
        reply = generateLocalFinancialAdvice(query, userContext);
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, timestamp: now() }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 7 Pillars Evaluation for Consultório
  const pillars = [
    {
      id: 'orcamento',
      name: '1. Orçamento & Fluxo de Caixa',
      status: monthlySavings > 0 ? 'green' : 'red',
      feedback: monthlySavings > 0 ? 'Receitas superam despesas com sobra mensal positiva.' : 'Despesas ultrapassando a renda mensal.',
    },
    {
      id: 'dividas',
      name: '2. Central de Dívidas',
      status: debts.length === 0 ? 'green' : debts.some((d) => d.interestRateMonthly > 5) ? 'red' : 'yellow',
      feedback: debts.length === 0 ? 'Livre de dívidas nocivas.' : 'Atenção para juros rotativos de cartão.',
    },
    {
      id: 'reserva',
      name: '3. Reserva de Emergência',
      status: emergencyFund.currentAmount >= emergencyFund.essentialMonthlyExpenses * 3 ? 'green' : 'yellow',
      feedback: `Você possui R$ ${emergencyFund.currentAmount.toLocaleString('pt-BR')} guardados (${Math.round((emergencyFund.currentAmount / (emergencyFund.essentialMonthlyExpenses * emergencyFund.targetMonths)) * 100)}% da meta).`,
    },
    {
      id: 'investimentos',
      name: '4. Diversificação de Investimentos',
      status: netWorth > 15000 ? 'green' : 'yellow',
      feedback: 'Iniciando diversificação entre Renda Fixa e Liquidez.',
    },
    {
      id: 'protecao',
      name: '5. Proteção Patrimonial & Segurança',
      status: 'green',
      feedback: 'Proteção por biometria ativada e sem senhas expostas.',
    },
    {
      id: 'metas',
      name: '6. Planejamento de Longo Prazo',
      status: goals.length > 0 ? 'green' : 'yellow',
      feedback: `${goals.length} meta(s) cadastrada(s) com aportes mensais calculados.`,
    },
    {
      id: 'habitos',
      name: '7. Inteligência Emocional & Hábitos',
      status: 'green',
      feedback: 'Acompanhamento diário e aprendizado contínuo ativo.',
    },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">IA & Consultório Financeiro</h1>
          <p className="text-xs text-slate-400">Conselheiro com inteligência artificial e check-up clínico dos 7 pilares</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab('ia_chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'ia_chat' ? 'bg-emerald-600 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Pergunte à IA</span>
          </button>
          <button
            onClick={() => setActiveTab('consultorio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'consultorio' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Consultório & Plano 30d/6m/5a</span>
          </button>
        </div>
      </div>

      {/* 1. CHAT COM A IA FINANCEIRA */}
      {activeTab === 'ia_chat' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Quick Questions Chips */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Perguntas Rápidas Frequentes:
            </span>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-emerald-500/40 transition text-left"
                >
                  💬 {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
            {/* Chat header */}
            <div className="p-4 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-white">IA Financeira Especialista (Gemini 3.7 Flash)</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                    Conectada aos seus números em tempo real
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start space-x-2.5 ${
                    msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[75%] space-y-1 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none leading-relaxed'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <span className="text-[9px] opacity-60 block text-right">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-slate-400 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center animate-spin">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span>Analisando seus dados e formulando resposta...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Pergunte qualquer coisa sobre seu dinheiro, investimentos ou compras..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 transition"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. CONSULTÓRIO & PLANO 30D / 6M / 5A */}
      {activeTab === 'consultorio' && (
        <div className="space-y-6 animate-in fade-in">
          {/* 7 Pillars Checkup */}
          <section className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Diagnóstico Clínico</span>
              <h2 className="text-xl font-black text-white">Check-Up dos 7 Pilares Financeiros</h2>
              <p className="text-xs text-slate-300">Avaliação do seu estado de saúde financeira e pontos de atenção imediatos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pillars.map((pil) => (
                <div
                  key={pil.id}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-start space-x-3"
                >
                  <span className="text-base mt-0.5">
                    {pil.status === 'green' ? '🟢' : pil.status === 'yellow' ? '🟡' : '🔴'}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{pil.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{pil.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Plano de Ação em 3 Horizontes */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Seu Plano de Ação e Recuperação Personalizado
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 30 Days */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-xs">
                    30d
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Plano de 30 Dias</h3>
                    <span className="text-[10px] text-amber-400 font-bold uppercase">Estancar Sangrias</span>
                  </div>
                </div>

                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>Identificar e renegociar qualquer dívida de juros rotativos de cartão (&gt;10% a.m.).</li>
                  <li>Cortar 10% a 15% das despesas supérfluas (delivery, assinaturas esquecidas).</li>
                  <li>Garantir o primeiro aporte de R$ 650 na Reserva de Emergência (Tesouro Selic).</li>
                </ul>
              </div>

              {/* 6 Months */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-sky-500/40 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-black text-xs">
                    6m
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Plano de 6 Meses</h3>
                    <span className="text-[10px] text-sky-400 font-bold uppercase">Blindagem & Equilíbrio</span>
                  </div>
                </div>

                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>Completar os 6 meses de despesas essenciais na Reserva de Emergência.</li>
                  <li>Automatizar a regra do "Pague-se Primeiro": investir no dia que o salário cai.</li>
                  <li>Iniciar os primeiros estudos da Trilha 6 da Academia (Renda Variável & FIIs).</li>
                </ul>
              </div>

              {/* 5 Years */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/40 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xs">
                    5a
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Plano de 5 Anos</h3>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Multiplicação de Patrimônio</span>
                  </div>
                </div>

                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li>Acumular mais de R$ 150.000 em patrimônio diversificado com dividendos mensais.</li>
                  <li>Atingir a meta da casa própria ou liberdade financeira sem contrair juros bancários.</li>
                  <li>Alcançar o Nível 5: Independência Financeira no Vida Financeira.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
