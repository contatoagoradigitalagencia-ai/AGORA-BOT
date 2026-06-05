import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { COLOR_OPTIONS } from "./useAttendants.js";

function defaultForm(a) {
  return {
    name:        a?.name        || "",
    displayName: a?.displayName || "",
    phone:       a?.phone       || "",
    roleLabel:   a?.roleLabel   || "Atendente",
    colorTag:    a?.colorTag    || "orange",
    notes:       a?.notes       || "",
    active:      a?.active      !== false,
  };
}

export default function AttendantDrawer({ open, onClose, attendant, onCreate, onUpdate }) {
  const isEdit = Boolean(attendant?._id || attendant?.id);
  const [form,   setForm]   = useState(() => defaultForm(attendant));
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (open) setForm(defaultForm(attendant)); }, [open, attendant]);

  function set(key, val) { setForm(p => ({ ...p, [key]: val })); }

  async function handleSave(keepOpen = false) {
    if (!form.name.trim()) { toast.error("Nome obrigatório."); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await onUpdate(attendant._id || attendant.id, form);
        toast.success("Atendente atualizado!");
      } else {
        await onCreate(form);
        toast.success("Atendente criado!");
      }
      if (keepOpen && !isEdit) setForm(defaultForm(null));
      else onClose();
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
      <div className="fixed inset-y-0 right-0 z-[9999] flex flex-col bg-zinc-900 border-l border-zinc-700 shadow-2xl w-full sm:w-[440px]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <h2 className="text-base font-semibold">{isEdit ? "Editar" : "Novo"} atendente</h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-zinc-400">{form.active ? "Ativo" : "Inativo"}</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={form.active} onChange={() => set("active", !form.active)} />
                <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4" />
              </div>
            </label>
            <button className="text-zinc-500 hover:text-zinc-200 px-1" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Nome *</label>
            <input
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="Ex: Yago"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Nome exibido <span className="text-zinc-600">(opcional)</span></label>
            <input
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
              value={form.displayName}
              onChange={e => set("displayName", e.target.value)}
              placeholder="Ex: Yago - Tráfego"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Telefone <span className="text-zinc-600">(opcional)</span></label>
            <input
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
              value={form.phone}
              onChange={e => set("phone", e.target.value)}
              placeholder="5521..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Função</label>
            <input
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
              value={form.roleLabel}
              onChange={e => set("roleLabel", e.target.value)}
              placeholder="Ex: Vendedor, Atendente"
            />
          </div>

          {/* Cor */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-zinc-400">Cor identificadora</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.value}
                  className={`w-8 h-8 rounded-full ${c.bg} transition ring-2 ring-offset-2 ring-offset-zinc-950 ${form.colorTag === c.value ? "ring-white" : "ring-transparent"}`}
                  onClick={() => set("colorTag", c.value)}
                  title={c.label}
                  type="button"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Observações <span className="text-zinc-600">(internas)</span></label>
            <textarea
              rows={2}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition resize-none"
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="Anotações internas..."
            />
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
