// Motor heurístico local de orientação financeira.
// Usado pelo servidor (quando não há chave do Gemini) e pelo app
// (GitHub Pages / APK Android), que funciona sem servidor e offline.

// Smart local fallback heuristic generator
export function generateLocalFinancialAdvice(prompt: string, ctx: any): string {
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
