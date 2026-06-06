import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { apiPost } from "../../api/client.js";

function Field({ label, type = "text", value, onChange, placeholder, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-400">
        {label}
        {hint && <span className="ml-1 text-zinc-600">({hint})</span>}
      </label>
      <input
        type={type}
        className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition font-mono"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function ClientSetupDrawer({ open, onClose, organizationId, organizationName }) {
  const [form, setForm] = useState({
    name: "", phone: "", password: "",
    instanceId: "", instanceToken: "", clientToken: "", phoneNumber: "",
  });
  const [saving, setSaving]   = useState(false);
  const [result, setResult]   = useState(null);

  useEffect(() => { if (open) { setForm({ name:"", phone:"", password:"", instanceId:"", instanceToken:"", clientToken:"", phoneNumber:"" }); setResult(null); } }, [open]);

  function set(key, val) { setForm(p => ({ ...p, [key]: val })); }

  async function handleCreate() {
    if (!form.name || !form.phone || !form.password) { toast.error("Nome, telefone e senha são obrigatórios."); return; }
    if (!form.instanceId || !form.instanceToken) { toast.error("Instance ID e Token são obrigatórios."); return; }
    setSaving(true);
    try {
      const [userRes, accountRes] = await Promise.all([
        apiPost(`/admin/organizations/${organizationId}/client-user`, {
          name: form.name, phone: form.phone, password: form.password, role: "owner",
        }),
        apiPost(`/admin/organizations/${organizationId}/whatsapp-account`, {
          instanceId:    form.instanceId,
          instanceToken: form.instanceToken,
          clientToken:   form.clientToken || undefined,
          phoneNumber:   form.phoneNumber || undefined,
        }),
      ]);
      setResult({ user: userRes?.data || userRes, account: accountRes?.data || accountRes });
      toast.success("Acesso criado com sucesso!");
    } catch (e) {
      toast.error(e?.message || "Erro ao criar acesso.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] bg-black/60" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-[9999] flex flex-col bg-zinc-900 border-l border-zinc-700 shadow-2xl w-full sm:w-[480px]">

        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="text-base font-semibold">Preparar acesso do cliente</h2>
            <p className="text-xs text-zinc-500">{organizationName}</p>
          </div>
          <button className="text-zinc-500 hover:text-zinc-200 px-1" onClick={onClose}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
          {result ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-4">
                <p className="text-sm font-semibold text-green-300 mb-2">✅ Acesso criado!</p>
                <div className="text-xs text-zinc-400 space-y-1">
                  <p>Login: <span className="text-white font-mono">{result.user?.phone}</span></p>
                  <p>Senha: <span className="text-white font-mono">{form.password}</span></p>
                  <p>Role: <span className="text-white">{result.user?.role}</span></p>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
                <p className="text-xs font-semibold text-zinc-400 mb-2">Conta WhatsApp criada:</p>
                <p className="text-xs text-zinc-400">Status: <span className="text-yellow-400">Desconectado — aguardando QR</span></p>
                <p className="text-xs text-zinc-400 mt-1">O cliente deve logar e acessar <strong className="text-white">Conectar WhatsApp</strong> para escanear o QR Code.</p>
              </div>
              <button className="w-full py-2.5 rounded-lg bg-orange-500 text-black font-semibold text-sm" onClick={onClose}>Fechar</button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Acesso do cliente</p>
                <Field label="Nome do responsável *" value={form.name} onChange={v => set("name", v)} placeholder="João Silva" />
                <Field label="Telefone de login *" type="tel" value={form.phone} onChange={v => set("phone", v)} placeholder="5521999990000" hint="com código do país" />
                <Field label="Senha inicial *" type="password" value={form.password} onChange={v => set("password", v)} placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="border-t border-zinc-800" />
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Conta Z-API</p>
                <Field label="Instance ID *" value={form.instanceId} onChange={v => set("instanceId", v)} placeholder="3F36F171..." />
                <Field label="Instance Token *" type="password" value={form.instanceToken} onChange={v => set("instanceToken", v)} placeholder="Token da instância" />
                <Field label="Client Token" type="password" value={form.clientToken} onChange={v => set("clientToken", v)} placeholder="Opcional" hint="opcional" />
                <Field label="Número WhatsApp" value={form.phoneNumber} onChange={v => set("phoneNumber", v)} placeholder="5521999990000" hint="opcional" />
              </div>
            </>
          )}
        </div>

        {!result && (
          <div className="flex justify-between items-center px-5 py-4 border-t border-zinc-800 shrink-0">
            <button className="text-sm text-zinc-400 hover:text-zinc-200" onClick={onClose} disabled={saving}>Cancelar</button>
            <button
              className="px-4 py-2 rounded-lg bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition disabled:opacity-60"
              onClick={handleCreate} disabled={saving}
            >
              {saving ? "Criando..." : "Criar acesso e conta WhatsApp"}
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
