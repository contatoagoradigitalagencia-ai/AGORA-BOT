import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { ROLES } from "./useTeam.js";

const FIELDS = [
  { key: "name",       label: "Nome *",        type: "text",     required: true  },
  { key: "phone",      label: "Telefone *",    type: "text",     required: true  },
  { key: "email",      label: "E-mail",        type: "email"                     },
  { key: "department", label: "Departamento",  type: "text"                      },
  { key: "password",   label: "Senha inicial", type: "password", hint: "Deixe vazio para gerar automaticamente" },
];

function defaultForm(member) {
  return {
    name:       member?.name       || "",
    phone:      member?.phone      || "",
    email:      member?.email?.includes("@sem-email") ? "" : (member?.email || ""),
    department: member?.department || "",
    role:       member?.role       || "agent",
    active:     member?.active     !== false,
    password:   "",
  };
}

export default function TeamDrawer({ open, onClose, member, onCreate, onUpdate }) {
  const isEdit = Boolean(member?._id || member?.id);
  const [form,   setForm]   = useState(() => defaultForm(member));
  const [saving, setSaving] = useState(false);
  const [tempPw, setTempPw] = useState("");

  useEffect(() => {
    if (open) { setForm(defaultForm(member)); setTempPw(""); }
  }, [open, member]);

  function set(key, value) { setForm(p => ({ ...p, [key]: value })); }

  async function handleSave(keepOpen = false) {
    if (!form.name.trim()) { toast.error("Nome obrigatório."); return; }
    if (!form.phone.trim()) { toast.error("Telefone obrigatório."); return; }
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      if (isEdit) {
        await onUpdate(member._id || member.id, payload);
        toast.success("Membro atualizado!");
      } else {
        const created = await onCreate(payload);
        if (created?._tempPassword) setTempPw(created._tempPassword);
        toast.success("Membro criado!");
      }
      if (!keepOpen) onClose();
      else if (!isEdit) setForm(defaultForm(null));
    } catch (e) {
      toast.error(e?.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/60" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[9999] flex flex-col bg-zinc-900 border-l border-zinc-700 shadow-2xl w-full sm:w-[480px]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <h2 className="text-base font-semibold">{isEdit ? "Editar" : "Novo"} membro</h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-zinc-400">{form.active ? "Ativo" : "Inativo"}</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={form.active} onChange={() => set("active", !form.active)} />
                <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4" />
              </div>
            </label>
            <button className="text-zinc-500 hover:text-zinc-200 text-lg px-1" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          {/* Senha temp gerada */}
          {tempPw && (
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-3">
              <p className="text-xs text-orange-300 font-medium mb-1">Senha temporária gerada:</p>
              <p className="text-sm font-mono text-orange-200 select-all">{tempPw}</p>
              <p className="text-xs text-zinc-500 mt-1">Compartilhe com o membro e peça para trocar.</p>
            </div>
          )}

          {/* Campos */}
          {FIELDS.map(f => (
            <div key={f.key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-400">
                {f.label}
                {f.hint && <span className="ml-1 text-zinc-600">({f.hint})</span>}
              </label>
              <input
                type={f.type}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
                value={form[f.key] || ""}
                onChange={e => set(f.key, e.target.value)}
                placeholder={f.label.replace(" *", "")}
              />
            </div>
          ))}

          {/* Role */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Função / Cargo</label>
            <select
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
              value={form.role}
              onChange={e => set("role", e.target.value)}
            >
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-zinc-800 shrink-0">
          <button className="text-sm text-zinc-400 hover:text-zinc-200 transition" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <div className="flex gap-2">
            {!isEdit && (
              <button
                className="px-3 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-50"
                onClick={() => handleSave(true)}
                disabled={saving}
              >
                Salvar e criar outro
              </button>
            )}
            <button
              className="px-4 py-2 rounded-lg bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition disabled:opacity-60"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
