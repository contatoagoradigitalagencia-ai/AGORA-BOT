import { useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useLoadMessagesWaiting } from "./useLoadMessagesWaiting.js";
import { apiPost, apiList } from "../../api/client.js";
import { colorBg } from "../attendants/useAttendants.js";
import Load  from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import { formatDate } from "../../utils/functions/formatDate.js";

// ── Seletor de atendente ─────────────────────────────────────────────────────
function AttendantPicker({ onSelect, onCancel }) {
  const [attendants, setAttendants] = useState(null);

  useState(() => {
    apiList("/attendants?active=true").then(setAttendants).catch(() => setAttendants([]));
  });

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/60" onClick={onCancel} />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl flex flex-col" style={{ maxHeight: "80vh" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
            <h3 className="text-base font-semibold">Quem está assumindo?</h3>
            <button className="text-zinc-500 hover:text-zinc-200" onClick={onCancel}>✕</button>
          </div>
          <div className="overflow-y-auto flex-1 p-3 flex flex-col gap-2">
            {attendants === null && <p className="text-sm text-zinc-500 text-center py-4">Carregando...</p>}
            {attendants?.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-4">
                Nenhum atendente ativo.{" "}
                <Link to="/attendants" className="text-orange-400 hover:underline">Cadastrar</Link>
              </p>
            )}
            {attendants?.map(a => (
              <button
                key={a._id || a.id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-orange-500 hover:bg-zinc-900 transition text-left"
                onClick={() => onSelect(a)}
              >
                <div className={`w-9 h-9 rounded-full ${colorBg(a.colorTag)} flex items-center justify-center shrink-0`}>
                  <span className="text-xs font-bold text-white">{a.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-100">{a.displayName || a.name}</p>
                  {a.roleLabel && <p className="text-xs text-zinc-500">{a.roleLabel}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

// ── Card da fila ─────────────────────────────────────────────────────────────
function QueueCard({ chat, onAssume, onTransfer, onClose }) {
  const [picking,  setPicking]  = useState(false); // "assume" | "transfer" | false
  const [closing,  setClosing]  = useState(false);

  const name = chat.name && chat.name !== "Sem nome"
    ? chat.name
    : chat.phone?.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3") || chat.phone;

  async function handleSelect(attendant) {
    setPicking(false);
    try {
      if (picking === "assume")    await onAssume(chat, attendant);
      if (picking === "transfer")  await onTransfer(chat, attendant);
    } catch { toast.error("Erro ao atribuir atendente."); }
  }

  async function handleClose() {
    setClosing(true);
    try { await onClose(chat); toast.success("Atendimento encerrado!"); }
    catch { toast.error("Erro ao encerrar."); }
    finally { setClosing(false); }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-zinc-100 truncate">{name}</span>
          {chat.assignedAttendantName ? (
            <span className="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded-full shrink-0">
              Atendido por: {chat.assignedAttendantName}
            </span>
          ) : (
            <span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full shrink-0">
              Sem responsável
            </span>
          )}
        </div>
        {chat.lastMessage && <p className="text-xs text-zinc-500 truncate">{chat.lastMessage}</p>}
        <span className="text-xs text-zinc-600">{formatDate(chat.timestamp)}</span>
      </div>

      <div className="flex gap-2 shrink-0 flex-wrap">
        <Link
          to={`/chat/${chat.phone}`}
          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
        >
          Ver chat
        </Link>
        <button
          className="px-3 py-1.5 text-xs rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-400 transition"
          onClick={() => setPicking("assume")}
        >
          Assumir
        </button>
        {chat.assignedAttendantName && (
          <button
            className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
            onClick={() => setPicking("transfer")}
          >
            Transferir
          </button>
        )}
        <button
          className="px-3 py-1.5 text-xs rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
          onClick={handleClose}
          disabled={closing}
        >
          {closing ? "..." : "Encerrar"}
        </button>
      </div>

      {picking && (
        <AttendantPicker
          onSelect={handleSelect}
          onCancel={() => setPicking(false)}
        />
      )}
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function Body() {
  const { chats, setChats, error, refetch } = useLoadMessagesWaiting();

  if (error)          return <Error />;
  if (chats === null) return <Load />;

  async function handleAssume(chat, attendant) {
    await apiPost(`/conversations/${chat.conversationId}/assign`, {
      userId:   attendant._id || attendant.id,
      userName: attendant.displayName || attendant.name,
    });
    toast.success(`Assumido por ${attendant.displayName || attendant.name}!`);
    await refetch();
  }

  async function handleTransfer(chat, attendant) {
    await apiPost(`/conversations/${chat.conversationId}/assign`, {
      userId:   attendant._id || attendant.id,
      userName: attendant.displayName || attendant.name,
    });
    toast.success(`Transferido para ${attendant.displayName || attendant.name}!`);
    await refetch();
  }

  async function handleClose(chat) {
    await apiPost(`/conversations/${chat.conversationId}/close-human`, { resumeBot: true });
    setChats(prev => prev.filter(c => c.conversationId !== chat.conversationId));
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-zinc-500">
        <i className="bi bi-check-circle text-4xl text-green-500" />
        <p className="text-sm">Nenhum atendimento em aberto</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 animate-toastIn">
      <p className="text-xs text-zinc-500">
        {chats.length} {chats.length === 1 ? "conversa" : "conversas"} em espera
      </p>
      {chats.map(chat => (
        <QueueCard
          key={chat.id}
          chat={chat}
          onAssume={handleAssume}
          onTransfer={handleTransfer}
          onClose={handleClose}
        />
      ))}
    </div>
  );
}
