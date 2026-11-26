import React, { useState } from 'react';
import { X, ShieldCheck, Lock, AlertTriangle, Download, Upload, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  const { transactions, debts, emergencyFund, goals, clearAllData, loadDemoData } = useFinancial();
  const [pinEnabled, setPinEnabled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);

  if (!isOpen) return null;

  const handleExportData = () => {
    const backupData = {
      app: 'Vida Financeira',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      transactions,
      debts,
      emergencyFund,
      goals,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vida_financeira_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleClearAll = () => {
    clearAllData();
    setShowConfirmClear(false);
    setClearSuccess(true);
    setTimeout(() => {
      setClearSuccess(false);
      onClose();
    }, 1800);
  };

  const handleLoadDemo = () => {
    loadDemoData();
    setDemoLoaded(true);
    setTimeout(() => {
      setDemoLoaded(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-lg text-white">Segurança & Gerenciamento de Dados</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Security Guarantees */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Nossos Compromissos com Seu Dinheiro:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-bold text-white block mb-1">🔐 Zero Senhas Bancárias</span>
                <p className="text-slate-400 text-[11px]">
                  O Vida Financeira nunca solicita senhas bancárias, tokens ou acessos de movimentação de conta.
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-bold text-white block mb-1">🛡️ Total Conformidade LGPD</span>
                <p className="text-slate-400 text-[11px]">
                  Seus dados pertencem a você. Sem venda de dados para terceiros ou financeiras.
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-bold text-white block mb-1">🔒 Criptografia Local</span>
                <p className="text-slate-400 text-[11px]">
                  Registros financeiros armazenados com proteção e privacidade de dispositivo.
                </p>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                <span className="font-bold text-white block mb-1">📱 Bloqueio por PIN / Biometria</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-slate-400">Proteção na abertura</span>
                  <button
                    type="button"
                    onClick={() => setPinEnabled(!pinEnabled)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      pinEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {pinEnabled ? 'ATIVO' : 'DESATIVADO'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scam alert guide */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Guia Antigolpes do Vida Financeira</span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
              <li><strong>Golpe do Pix falso / Devolução:</strong> Bancos nunca ligam pedindo para você fazer um Pix de teste.</li>
              <li><strong>Falsas promessas de 10% a 20% ao mês:</strong> Não existe rentabilidade alta sem risco altíssimo ou pirâmide financeira.</li>
              <li><strong>Mensagens de parentes com número novo pedindo dinheiro:</strong> Sempre ligue por voz antes de transferir qualquer valor.</li>
            </ul>
          </div>

          {/* Backup & Export */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-300">Backup & Exportação:</h3>
            <button
              onClick={handleExportData}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{copied ? '✅ Backup JSON Baixado com Sucesso!' : 'Baixar Cópia Completa dos Meus Dados (JSON)'}</span>
            </button>
          </div>

          {/* Data Reset Section */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpeza & Reset de Dados</span>
            </h3>

            {clearSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Todos os dados do aplicativo foram limpos com sucesso!</span>
              </div>
            )}

            {demoLoaded && (
              <div className="p-3 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-300 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Dados de demonstração carregados com sucesso!</span>
              </div>
            )}

            {!showConfirmClear ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmClear(true)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 hover:border-rose-500/50 font-bold text-xs transition flex items-center justify-center space-x-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Limpar Todos os Dados (Zerar Tudo)</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium text-xs transition flex items-center justify-center space-x-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Carregar Demonstração</span>
                </button>
              </div>
            ) : (
              <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-3">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-rose-300 block">Tem certeza que deseja apagar tudo?</span>
                  <p className="text-[11px] text-slate-400">
                    Isso removerá permanentemente todas as suas receitas, despesas, dívidas, metas e histórico financeiro deste navegador.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
                  >
                    Sim, Limpar Todos os Dados
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmClear(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
