import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { generateLocalFinancialAdvice } from "./src/lib/localAdvisor";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Allow the static build (GitHub Pages / Android app) to call this API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

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
