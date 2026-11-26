import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-safe Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Vida Financeira API" });
});

// AI Financial Advisor Endpoint
app.post("/api/ai/advisor", async (req, res) => {
  try {
    const { prompt, userContext, history } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "O campo 'prompt' é obrigatório." });
    }

    const ai = getGeminiClient();

    // If Gemini key is not configured or in fallback mode
    if (!ai) {
      return res.json({
        reply: generateLocalFinancialAdvice(prompt, userContext),
        source: "local-engine",
      });
    }

    const systemInstruction = `Você é o Conselheiro Inteligente do "Vida Financeira", uma plataforma de educação financeira e formação patrimonial pessoal ("Aprenda a cuidar do seu dinheiro. Organize sua vida. Construa seu patrimônio.").
Sua missão: Guiar o usuário com empatia, rigor matemático e sabedoria prática da Jornada Financeira: CAOS -> ORGANIZAÇÃO -> CONTROLE -> RESERVA -> QUITAÇÃO DE DÍVIDAS -> INVESTIMENTOS -> PATRIMÔNIO -> INDEPENDÊNCIA FINANCEIRA.

REGRAS DE CONDUTA:
1. Responda em Português do Brasil com clareza, formatação rica (tópicos com marcadores, destaques em negrito, passos numerados), tom encorajador e direto ao ponto.
2. Utilize SEMPRE os dados financeiros reais do usuário fornecidos no contexto:
   - Renda Mensal: R$ ${userContext?.income ?? 0}
   - Despesas Mensais: R$ ${userContext?.expenses ?? 0}
   - Sobra / Capacidade de Poupança: R$ ${userContext?.savingsCapacity ?? 0}
   - Saldo Disponível: R$ ${userContext?.balance ?? 0}
   - Patrimônio Líquido: R$ ${userContext?.netWorth ?? 0}
   - Reserva de Emergência Atual: R$ ${userContext?.emergencyFund ?? 0} (Meta ideal: R$ ${userContext?.emergencyTarget ?? 0})
   - Total em Dívidas: R$ ${userContext?.totalDebts ?? 0}
   - Nível Financeiro Atual: ${userContext?.financialLevel ?? 'Nível 2 — Organização'}
   - Pontuação de Saúde Financeira: ${userContext?.healthScore ?? 70}/100
3. Quando o usuário perguntar se pode comprar algo (ex: "Posso comprar um celular de R$ 3.000?"), faça a análise objetiva:
   - Verifique se ele tem dívidas caras (se sim, recomende quitar antes).
   - Verifique a reserva de emergência (não gaste a reserva com consumo!).
   - Verifique a capacidade mensal de aporte e dê um veredito claro: "Pode comprar agora à vista", "Espere X meses guardando R$ Y/mês" ou "Não recomendado no momento".
4. Ao receber perguntas como "Tenho R$ 5.000, o que fazer?", siga a hierarquia estrita:
   1º Dívidas caras (cartão rotativo/cheque especial)
   2º Reserva de emergência em liquidez diária (100% CDI / Tesouro Selic)
   3º Metas de curto prazo
   4º Investimentos de longo prazo (Tesouro IPCA, Ações/FIIs, ETFs)
5. Mantenha um disclaimer sutil quando necessário de que suas orientações são para educação financeira.`;

    const chatContents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const msg of history.slice(-6)) {
        chatContents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    chatContents.push({
      role: 'user',
      parts: [
        {
          text: `Contexto Financeiro Atual do Usuário:
- Renda Mensal: R$ ${userContext?.income || 0}
- Despesas Mensais: R$ ${userContext?.expenses || 0}
- Saldo: R$ ${userContext?.balance || 0}
- Reserva Atual: R$ ${userContext?.emergencyFund || 0} (Meta: R$ ${userContext?.emergencyTarget || 0})
- Dívidas: R$ ${userContext?.totalDebts || 0}
- Investimentos: R$ ${userContext?.investments || 0}
- Nível: ${userContext?.financialLevel || 'Organização'}

Pergunta do usuário:
${prompt}`,
        },
      ],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: chatContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "Desculpe, não consegui formular uma resposta neste momento.",
      source: "gemini-3.7-flash",
    });
  } catch (error: any) {
    console.error("Erro na API do Gemini:", error);
    // Graceful fallback to smart local rules engine
    const fallbackReply = generateLocalFinancialAdvice(req.body?.prompt || "", req.body?.userContext);
    res.json({
      reply: fallbackReply,
      source: "local-fallback",
      warning: "Orientação gerada via motor heurístico de finanças.",
    });
  }
});

// Smart local fallback heuristic generator
function generateLocalFinancialAdvice(prompt: string, ctx: any): string {
  const p = prompt.toLowerCase();
  const balance = ctx?.balance || 1280;
  const debts = ctx?.totalDebts || 0;
  const emergency = ctx?.emergencyFund || 11900;
  const emergencyTarget = ctx?.emergencyTarget || 19200;
  const savings = ctx?.savingsCapacity || 650;

  if (p.includes("posso comprar") || p.includes("celular") || p.includes("comprar")) {
    const numbers = prompt.match(/\d+[\d.,]*/g);
    const amount = numbers ? parseFloat(numbers[0].replace(/\./g, "").replace(",", ".")) : 2000;
    
    if (debts > 0) {
      return `### ⚠️ Análise de Compra Inteligente\n\n**Veredito:** *Recomendamos adiar ou reavaliar.*\n\nVocê possui atualmente **R$ ${debts.toLocaleString('pt-BR')} em dívidas cadastradas**. Juros de cartão de crédito e empréstimos costumam corroer muito mais patrimônio do que qualquer bem de consumo.\n\n**Plano sugerido:**\n1. Direcione sua capacidade de poupança (R$ ${savings.toLocaleString('pt-BR')}/mês) para liquidar as dívidas prioritárias.\n2. Crie uma meta específica no app para essa compra juntando o valor sem tocar na sua reserva de emergência.`;
    }

    if (amount > balance) {
      const monthsNeeded = Math.ceil(amount / (savings || 500));
      return `### 💡 Análise de Viabilidade Financeira\n\n**Veredito:** *Espere cerca de ${monthsNeeded} meses para comprar à vista.*\n\nO valor de **R$ ${amount.toLocaleString('pt-BR')}** excede o seu saldo livre atual (R$ ${balance.toLocaleString('pt-BR')}).\n\n**Como conquistar este objetivo:**\n- **Economia mensal:** Guardando R$ ${savings.toLocaleString('pt-BR')}/mês em um CDB de liquidez diária (100% CDI).\n- **Benefício:** Você acumula os rendimentos a seu favor e ainda pode negociar de 5% a 10% de desconto à vista no Pix!`;
    }

    return `### 🟢 Análise de Compra Aprovada com Cautela\n\n**Veredito:** *Compra viável dentro do seu orçamento.*\n\nVocê possui saldo livre disponível (R$ ${balance.toLocaleString('pt-BR')}) e sua reserva de emergência está em R$ ${emergency.toLocaleString('pt-BR')} (${Math.round((emergency / emergencyTarget) * 100)}% da meta).\n\n**Dica de Ouro do Vida Financeira:**\n- Peça desconto para pagamento no Pix/à vista.\n- Nunca use o dinheiro da sua Reserva de Emergência para compras de consumo.`;
  }

  if (p.includes("tenho r$") || p.includes("recebi") || p.includes("o que fazer") || p.includes("investir")) {
    return `### 🧭 Roteiro Estratégico de Alocação de Recursos\n\nAo receber um valor extra, siga a **Hierarquia da Paz Financeira**:\n\n1. **Quitação de Dívidas Caras:** Se você tiver dívidas no rotativo ou cheque especial, quite-as imediatamente (juros médios passam de 300% a.a.).\n2. **Blindagem (Reserva de Emergência):** Complete sua reserva até atingir R$ ${emergencyTarget.toLocaleString('pt-BR')} (6 meses de custos essenciais) em Tesouro Selic ou CDB 100% CDI.\n3. **Metas de Médio Prazo:** Separe uma fatia para suas metas cadastradas (viagem, carro, casa).\n4. **Construção de Patrimônio:** O restante pode ser diversificado entre Renda Fixa (Tesouro IPCA+), Fundos Imobiliários (FIIs) e Ações focadas em dividendos.\n\n*Progresso constante gera independência financeira!*`;
  }

  return `### 💡 Análise Financeira Personalizada\n\nCom base no seu perfil atual (**${ctx?.financialLevel || 'Nível 2 — Organização'}**):\n\n- **Receitas:** R$ ${ctx?.income?.toLocaleString('pt-BR') || '4.850,00'}\n- **Despesas:** R$ ${ctx?.expenses?.toLocaleString('pt-BR') || '3.570,00'}\n- **Sobra:** R$ ${ctx?.savingsCapacity?.toLocaleString('pt-BR') || '1.280,00'}/mês\n- **Reserva:** R$ ${emergency.toLocaleString('pt-BR')} / R$ ${emergencyTarget.toLocaleString('pt-BR')}\n\n**Próximo Passo Recomendado:** Mantenha a disciplina no orçamento 50/30/20 e acelere os aportes na reserva de emergência para subir para o *Nível 3 — Segurança*!`;
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vida Financeira Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
