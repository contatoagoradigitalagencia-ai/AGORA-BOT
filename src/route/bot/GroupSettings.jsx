import { useState } from "react";
import toast from "react-hot-toast";
import { apiPatch } from "../../api/client.js";

const MODE_OPTIONS = [
  { value: "mention_only", label: "Apenas quando mencionado" },
  { value: "always",       label: "Sempre"                   },
  { value: "disabled",     label: "Nunca"                    },
];

export default function GroupSettings({ bot, setBot }) {
  const account   = bot?.account;
  const accountId = account?.id || account?._id;
  const settings  = account?.settings || {};

  const [enabled, setEnabled] = useState(settings.groupRepliesEnabled !== false);
  const [mode,    setMode]    = useState(settings.groupReplyMode || "mention_only");
  const [saving,  setSaving]  = useState(false);

  async function handleSave(newEnabled, newMode) {
    if (!accountId || saving) return;
    setSaving(true);
    try {
      const res = await apiPatch(`/whatsapp-accounts/${accountId}/settings`, {
        groupRepliesEnabled: newEnabled,
        groupReplyMode:      newMode,
      });
      const updated = res?.data;
      setBot(prev => ({
        ...prev,
        account: updated || {
          ...prev.account,
          settings: { ...prev.account?.settings, groupRepliesEnabled: newEnabled, groupReplyMode: newMode },
        },
      }));
      toast.success("Configuração de grupos salva!");
    } catch {
      toast.error("Erro ao salvar configuração de grupos.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleEnabled() {
    const next = !enabled;
    setEnabled(next);
    await handleSave(next, mode);
  }

  async function changeMode(e) {
    const next = e.target.value;
    setMode(next);
    await handleSave(enabled, next);
  }

  return (
    <div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <div>
        <h2 className="text-lg font-semibold">Respostas em grupos</h2>
        <p className="text-sm text-zinc-400">Controla como o bot se comporta em grupos de WhatsApp.</p>
      </div>

      {/* Toggle principal */}
      <label className={`flex items-center justify-between ${accountId ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
        <span className="text-sm text-zinc-300">
          Responder em grupos
          {saving && <span className="ml-2 text-xs text-zinc-500">salvando...</span>}
        </span>
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            onChange={toggleEnabled}
            disabled={!accountId || saving}
          />
          <div className="w-10 h-5 bg-zinc-700 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
        </div>
      </label>

      {/* Modo — só visível se grupos habilitados */}
      {enabled && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-400">Quando responder em grupos</label>
          <select
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition disabled:opacity-50"
            value={mode}
            onChange={changeMode}
            disabled={!accountId || saving}
          >
            {MODE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Alerta */}
      <div className="flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2.5">
        <span className="text-yellow-400 mt-0.5 shrink-0">⚠️</span>
        <p className="text-xs text-yellow-300">
          Recomendado: <strong>Apenas quando mencionado</strong> para evitar flood e banimento em grupos.
        </p>
      </div>
    </div>
  );
}
