import { useState } from "react";
import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import { useQRConnect } from "./useQRConnect.js";
import Load from "../../screens/Load.jsx";

const STATUS_LABELS = {
  connected:    { text: "Conectado",        dot: "bg-green-400" },
  disconnected: { text: "Desconectado",     dot: "bg-red-400"   },
  waiting_scan: { text: "Aguardando scan",  dot: "bg-yellow-400 animate-pulse" },
  active:       { text: "Conectado",        dot: "bg-green-400" },
  inactive:     { text: "Desconectado",     dot: "bg-red-400"   },
};

function StatusBadge({ status }) {
  const s = STATUS_LABELS[status] || { text: status, dot: "bg-zinc-500" };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
      <span className="text-sm font-medium">{s.text}</span>
    </div>
  );
}

function QRDisplay({ qr }) {
  const src = qr.startsWith("data:") ? qr : `data:image/png;base64,${qr}`;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-2xl bg-white p-4 shadow-2xl">
        <img src={src} alt="QR Code WhatsApp" className="w-56 h-56 object-contain" />
      </div>
      <div className="text-left space-y-1.5 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 max-w-xs w-full">
        <p className="text-xs font-semibold text-zinc-300 mb-2">Como conectar:</p>
        {[
          "Abra o WhatsApp no celular",
          "Toque em ⋮ → Aparelhos conectados",
          "Toque em Conectar aparelho",
          "Escaneie o QR Code acima",
        ].map((step, i) => (
          <p key={i} className="text-xs text-zinc-400">
            <span className="text-orange-400 font-bold">{i + 1}. </span>{step}
          </p>
        ))}
      </div>
    </div>
  );
}

function ConnectBody() {
  const {
    account, qr, status, loading, qrLoading, error,
    generateQR, checkStatus, disconnect, restart,
  } = useQRConnect();

  const [checking, setChecking] = useState(false);

  async function handleCheck() {
    setChecking(true);
    await checkStatus();
    setChecking(false);
  }

  if (loading) return <Load />;

  const isConnected   = status === "connected" || status === "active";
  const isWaiting     = status === "waiting_scan";
  const phoneDisplay  = account?.phoneNumber || account?.label || "—";

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-lg mx-auto flex flex-col gap-6">

        {/* Conta info */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Número configurado</p>
            <p className="text-base font-semibold">{phoneDisplay}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Erro */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* QR Code */}
        {qr && !isConnected && (
          <div className="flex flex-col items-center gap-4">
            <QRDisplay qr={qr} />
            <p className="text-xs text-zinc-500 text-center">
              O QR Code expira em alguns minutos. Se expirar, clique em "Gerar novo QR".
            </p>
          </div>
        )}

        {/* Conectado */}
        {isConnected && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-6">
            <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-sm font-semibold text-green-300">WhatsApp conectado!</p>
            <p className="text-xs text-zinc-500">O bot está ativo e pronto para atender.</p>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col gap-3">
          {!isConnected && (
            <button
              className="w-full py-3 rounded-xl bg-orange-500 text-black font-semibold text-sm hover:bg-orange-400 transition disabled:opacity-60"
              onClick={generateQR}
              disabled={qrLoading}
            >
              {qrLoading ? "Gerando QR Code..." : qr ? "Gerar novo QR Code" : "Gerar QR Code"}
            </button>
          )}

          <button
            className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-800 transition disabled:opacity-60"
            onClick={handleCheck}
            disabled={checking}
          >
            {checking ? "Verificando..." : "Atualizar status"}
          </button>

          {(isConnected || isWaiting) && (
            <button
              className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition"
              onClick={restart}
            >
              Reconectar (novo QR)
            </button>
          )}

          {isConnected && (
            <button
              className="w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition"
              onClick={() => { if (confirm("Desconectar o WhatsApp?")) disconnect(); }}
            >
              Desconectar
            </button>
          )}
        </div>

        {/* Info */}
        <p className="text-xs text-zinc-600 text-center">
          Mantenha o celular conectado à internet para o WhatsApp permanecer ativo.
        </p>
      </div>
    </div>
  );
}

export default function Connect() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-dvh bg-black text-white">
      <SideBar open={open} setOpen={setOpen} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header setOpen={setOpen} title="Conectar WhatsApp" />
        <ConnectBody />
      </main>
    </div>
  );
}
