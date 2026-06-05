import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

const PROVIDERS = [
  { value: "zapi", label: "Z-API" },
  { value: "meta", label: "Meta Cloud API" },
];

const META_FIELDS = [
  { key: "metaWabaId",         label: "WhatsApp Business Account ID", secret: false },
  { key: "metaPhoneNumberId",  label: "Phone Number ID",              secret: false },
  { key: "metaAppId",          label: "App ID",                       secret: false },
  { key: "metaAccessToken",    label: "Access Token",                 secret: true  },
  { key: "metaVerifyToken",    label: "Verify Token",                 secret: true  },
  { key: "metaAppSecret",      label: "App Secret",                   secret: true  },
];

const ZAPI_FIELDS = [
  { key: "zapiInstanceId",    label: "Instance ID",   secret: false },
  { key: "zapiBaseUrl",       label: "Base URL",      secret: false, placeholder: "https://api.z-api.io" },
  { key: "zapiInstanceToken", label: "Instance Token", secret: true  },
  { key: "zapiClientToken",   label: "Client Token",   secret: true  },
];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function defaultForm(item) {
  return {
    organizationId: item?.organizationId || item?.organization?.id || item?.organization?._id || "",
    clientName:  item?.clientName  || "",
    companyName: item?.companyName || "",
    provider:    item?.provider    || "zapi",
    // Meta
    metaWabaId:        item?.metaWabaId        || "",
    metaPhoneNumberId: item?.metaPhoneNumberId || "",
    metaAppId:         item?.metaAppId         || "",
    metaAccessToken:   "",  // nunca preencher com valor mascarado
    metaVerifyToken:   "",
    metaAppSecret:     "",
    // ZAPI
    zapiInstanceId:    item?.zapiInstanceId    || "",
    zapiBaseUrl:       item?.zapiBaseUrl        || "https://api.z-api.io",
    zapiInstanceToken: "",
    zapiClientToken:   "",
  };
}

export default function AdminDrawer({ open, onClose, item, organizations = [], onCreate, onUpdate }) {
  const organizationItems = asArray(organizations).filter(Boolean);
  const isEdit = Boolean(item?._id || item?.id);
  const [form,   setForm]   = useState(() => defaultForm(item));
  const [saving, setSaving] = useState(false);
  const [show,   setShow]   = useState({}); // visibilidade de cada campo secret

  useEffect(() => { if (open) { setForm(defaultForm(item)); setShow({}); } }, [open, item]);

  function set(key, val) { setForm(p => ({ ...p, [key]: val })); }
  function toggleShow(key) { setShow(p => ({ ...p, [key]: !p[key] })); }

  const fields = form.provider === "meta" ? META_FIELDS : ZAPI_FIELDS;

  async function handleSave() {
    if (!form.clientName.trim()) { toast.error("Nome do cliente obrigatório."); return; }
    if (organizationItems.length === 0) { toast.error("Cadastre uma organização antes da integração."); return; }
    if (!form.organizationId) { toast.error("Selecione a organização."); return; }
    setSaving(true);
    try {
      // Remove campos de secret vazios para não sobrescrever no edit
      const payload = { ...form };
      if (!payload.organizationId && organizationItems[0]) payload.organizationId = organizationItems[0]._id || organizationItems[0].id;
      if (isEdit) {
        for (const f of [...META_FIELDS, ...ZAPI_FIELDS]) {
          if (f.secret && !payload[f.key]) delete payload[f.key];
        }
      }
      if (isEdit) await onUpdate(item._id || item.id, payload);
      else        await onCreate(payload);
      toast.success(isEdit ? "Atualizado!" : "Criado!");
      onClose();
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
      <div className="fixed inset-y-0 right-0 z-[9999] flex flex-col bg-zinc-900 border-l border-zinc-700 shadow-2xl w-full sm:w-[520px]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <h2 className="text-base font-semibold">{isEdit ? "Editar" : "Nova"} integração</h2>
          <button className="text-zinc-500 hover:text-zinc-200 px-1 text-lg" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          {/* Dados básicos */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-400">Organização *</label>
              <select
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
                value={form.organizationId || ""}
                onChange={e => set("organizationId", e.target.value)}
              >
                <option value="">Selecione...</option>
                {organizationItems.map((org) => (
                  <option key={org?._id || org?.id} value={org?._id || org?.id}>{org?.name || org?._id || org?.id}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-400">Nome do cliente *</label>
              <input
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
                value={form.clientName}
                onChange={e => set("clientName", e.target.value)}
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-400">Empresa / Organização</label>
              <input
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
                value={form.companyName}
                onChange={e => set("companyName", e.target.value)}
                placeholder="Ex: Farmácia Central"
              />
            </div>
          </div>

          {/* Provedor */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-400">Provedor de WhatsApp</label>
            <div className="flex gap-2">
              {PROVIDERS.map(p => (
                <button
                  key={p.value}
                  onClick={() => set("provider", p.value)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${
                    form.provider === p.value
                      ? "border-orange-500 bg-orange-500/10 text-orange-400"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-800" />

          {/* Campos do provedor */}
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Credenciais — {form.provider === "meta" ? "Meta Cloud API" : "Z-API"}
          </p>

          {isEdit && (
            <p className="text-xs text-zinc-600">Deixe os campos de token vazios para manter os valores atuais.</p>
          )}

          {fields.map(f => (
            <div key={f.key} className="flex flex-col gap-1">
              <label className="text-xs font-medium text-zinc-400">
                {f.label}
                {f.secret && <span className="ml-1 text-zinc-600">(sensível)</span>}
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type={f.secret && !show[f.key] ? "password" : "text"}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition font-mono"
                  value={form[f.key] || ""}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder || (f.secret ? (isEdit ? "Deixe vazio para manter" : "") : "")}
                />
                {f.secret && (
                  <button
                    type="button"
                    className="text-zinc-500 hover:text-zinc-300 px-1"
                    onClick={() => toggleShow(f.key)}
                  >
                    <i className={`bi bi-eye${show[f.key] ? "" : "-slash"}`} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-4 border-t border-zinc-800 shrink-0">
          <button className="text-sm text-zinc-400 hover:text-zinc-200 transition" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition disabled:opacity-60"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
