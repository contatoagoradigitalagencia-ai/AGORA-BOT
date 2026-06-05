import { useEffect, useMemo, useState } from "react";
import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import { API_BASE_URL } from "../../api/client.js";
import { useAdmin } from "./useAdmin.js";
import AdminDrawer from "./AdminDrawer.jsx";
import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import toast from "react-hot-toast";

const STATUS_MAP = {
  active: { label: "Ativo", cls: "bg-green-900/50 text-green-300" },
  inactive: { label: "Inativo", cls: "bg-zinc-800 text-zinc-500" },
  pending: { label: "Pendente", cls: "bg-yellow-900/50 text-yellow-300" },
  error: { label: "Erro", cls: "bg-red-900/50 text-red-300" },
  needs_attention: { label: "Atencao", cls: "bg-yellow-900/50 text-yellow-300" },
};

const HEALTH_MAP = {
  ONLINE: "border-green-500/30 bg-green-500/10 text-green-300",
  INSTÁVEL: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  "INSTAVEL": "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  OFFLINE: "border-red-500/30 bg-red-500/10 text-red-300",
};

const TABS = [
  { key: "overview", label: "Visao geral" },
  { key: "organizations", label: "Organizacoes" },
  { key: "integrations", label: "Integracoes" },
  { key: "ai", label: "IA" },
  { key: "health", label: "Saude" },
  { key: "logs", label: "Logs" },
];

function fmtDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "-";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function apiRoot() {
  return API_BASE_URL.replace(/\/api\/v1$/, "");
}

function idOf(item) {
  return item?._id || item?.id || "";
}

function statusBadge(status) {
  return STATUS_MAP[status] || STATUS_MAP.pending;
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-100">{value ?? 0}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

function EmptyState({ title, action }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-10 text-center">
      <p className="text-sm text-zinc-400">{title}</p>
      {action}
    </div>
  );
}

function OrganizationForm({ editing, onCreate, onUpdate, onCancel }) {
  const [form, setForm] = useState({ name: "", ownerName: "", phone: "", email: "", plan: "starter", status: "active" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: editing?.name || "",
      ownerName: editing?.ownerName || editing?.responsibleName || "",
      phone: editing?.phone || "",
      email: editing?.email || "",
      plan: editing?.plan || "starter",
      status: editing?.status || "active",
    });
  }, [editing]);

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Nome da organizacao obrigatorio.");
    setSaving(true);
    try {
      if (editing) {
        await onUpdate(idOf(editing), form);
        toast.success("Organizacao atualizada.");
      } else {
        await onCreate(form);
        toast.success("Organizacao criada.");
      }
      setForm({ name: "", ownerName: "", phone: "", email: "", plan: "starter", status: "active" });
      onCancel?.();
    } catch (err) {
      toast.error(err?.message || "Erro ao salvar organizacao.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 lg:grid-cols-6" onSubmit={submit}>
      <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" placeholder="Nome da empresa" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
      <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" placeholder="Responsavel" value={form.ownerName} onChange={(e) => setForm((p) => ({ ...p, ownerName: e.target.value }))} />
      <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" placeholder="Telefone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
      <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" placeholder="E-mail" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
      <select className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" value={form.plan} onChange={(e) => setForm((p) => ({ ...p, plan: e.target.value }))}>
        <option value="starter">Starter</option>
        <option value="growth">Growth</option>
        <option value="scale">Scale</option>
        <option value="enterprise">Enterprise</option>
      </select>
      <div className="flex gap-2">
        <button className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:opacity-60" disabled={saving}>
          {saving ? "Salvando..." : editing ? "Atualizar" : "Criar"}
        </button>
        {editing && (
          <button type="button" className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

function OrganizationsTab({ organizations, onCreate, onUpdate, onDeactivate }) {
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);

  async function deactivate(org, label = "suspender") {
    if (!confirm(`${label === "excluir" ? "Excluir/inativar" : "Suspender"} "${org.name}"?`)) return;
    try {
      await onDeactivate(idOf(org));
      toast.success("Organizacao inativada.");
    } catch (err) {
      toast.error(err?.message || "Erro ao inativar.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <OrganizationForm editing={editing} onCreate={onCreate} onUpdate={onUpdate} onCancel={() => setEditing(null)} />

      {viewing && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-orange-200">{viewing.name}</p>
              <p className="mt-1 text-xs text-orange-100/70">Criada em {fmtDate(viewing.createdAt)} · Plano {viewing.plan || "-"}</p>
            </div>
            <button className="text-xs text-orange-100/70 hover:text-orange-100" onClick={() => setViewing(null)}>Fechar</button>
          </div>
        </div>
      )}

      {organizations.length === 0 ? (
        <EmptyState title="Nenhuma organizacao cadastrada." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {organizations.map((org) => {
            const st = statusBadge(org.status);
            return (
              <div key={idOf(org)} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-100">{org.name}</p>
                    <p className="text-xs text-zinc-500">{org.slug}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.label}</span>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2">
                  <span>Plano: <b className="font-medium text-zinc-300">{org.plan || "-"}</b></span>
                  <span>Criacao: <b className="font-medium text-zinc-300">{fmtDate(org.createdAt)}</b></span>
                  <span>Mensagens mes: <b className="font-medium text-zinc-300">{org.metrics?.messagesMonth || 0}</b></span>
                  <span>Atendentes: <b className="font-medium text-zinc-300">{org.metrics?.attendants || 0}</b></span>
                  <span>Contas WhatsApp: <b className="font-medium text-zinc-300">{org.metrics?.whatsappAccounts || 0}</b></span>
                  <span>Telefone: <b className="font-medium text-zinc-300">{org.phone || "-"}</b></span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <button className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800" onClick={() => setViewing(org)}>Visualizar</button>
                  <button className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800" onClick={() => setEditing(org)}>Editar</button>
                  <button className="rounded-lg border border-yellow-500/30 px-3 py-2 text-xs text-yellow-300 hover:bg-yellow-500/10" onClick={() => deactivate(org, "suspender")}>Suspender</button>
                  <button className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10" onClick={() => deactivate(org, "excluir")}>Excluir</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IntegrationCard({ item, onEdit, onDelete, onTest, onActivate, onSync, onRestartWebhook }) {
  const [busy, setBusy] = useState("");
  const st = statusBadge(item.status);
  const operationalClass = HEALTH_MAP[item.operationalStatus] || HEALTH_MAP.OFFLINE;

  async function run(action, fn, success) {
    setBusy(action);
    try {
      const result = await fn(item);
      toast.success(success || result?.message || "Operacao concluida.");
    } catch (err) {
      toast.error(err?.message || "Erro na operacao.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-100">{item.clientName}</p>
          <p className="text-xs text-zinc-500">{item.companyName || item.organization?.name || "-"}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.label}</span>
          <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${operationalClass}`}>{item.operationalStatus || "OFFLINE"}</span>
        </div>
      </div>
      <div className="grid gap-1 text-xs text-zinc-500">
        <span>Provider: <b className="font-medium text-zinc-300">{item.provider === "meta" ? "Meta" : "Z-API"}</b></span>
        <span>Numero: <b className="font-medium text-zinc-300">{item.phoneNumber || "-"}</b></span>
        <span>Webhook: <code className="text-orange-300">{item.webhook || "-"}</code></span>
        <span>Mensagens hoje: <b className="font-medium text-zinc-300">{item.messagesToday || 0}</b></span>
        <span>Ultima atividade: <b className="font-medium text-zinc-300">{fmtDate(item.lastActivityAt)}</b></span>
        <span>Ultimo teste: <b className="font-medium text-zinc-300">{fmtDate(item.lastTestedAt)}</b></span>
        {item.lastTestResult && <span className={item.status === "error" ? "text-red-400" : "text-zinc-500"}>{item.lastTestResult}</span>}
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-zinc-800 pt-3 lg:grid-cols-6">
        <button className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-medium text-orange-400 disabled:opacity-40" disabled={busy === "test"} onClick={() => run("test", () => onTest(idOf(item)), "Conexao testada.")}>{busy === "test" ? "..." : "Testar"}</button>
        <button className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs font-medium text-green-300 disabled:opacity-40" disabled={busy === "activate" || item.status !== "active"} onClick={() => run("activate", () => onActivate(idOf(item)), "Integracao ativada.")}>{busy === "activate" ? "..." : "Ativar"}</button>
        <button className="rounded-lg border border-blue-500/30 px-3 py-2 text-xs text-blue-300 disabled:opacity-40" disabled={busy === "sync"} onClick={() => run("sync", () => onSync(idOf(item)), "Integracao sincronizada.")}>{busy === "sync" ? "..." : "Sincronizar"}</button>
        <button className="rounded-lg border border-purple-500/30 px-3 py-2 text-xs text-purple-300 disabled:opacity-40" disabled={busy === "webhook"} onClick={() => run("webhook", () => onRestartWebhook(idOf(item)), "Webhook reiniciado.")}>{busy === "webhook" ? "..." : "Webhook"}</button>
        <button className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800" onClick={() => onEdit(item)}>Editar</button>
        <button className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10" onClick={() => onDelete(idOf(item))}>Desativar</button>
      </div>
    </div>
  );
}

function IntegrationsTab({ organizations, integrations, create, update, remove, testConnection, activateIntegration, syncIntegration, restartWebhook }) {
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = integrations.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || item.clientName?.toLowerCase().includes(q)
      || item.companyName?.toLowerCase().includes(q)
      || item.organization?.name?.toLowerCase().includes(q)
      || item.phoneNumber?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || item.provider === filter || item.status === filter || item.operationalStatus === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full gap-2 sm:w-auto">
          <input className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500 sm:w-72" placeholder="Buscar cliente, empresa ou numero..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="meta">Meta</option>
            <option value="zapi">Z-API</option>
            <option value="active">Ativos</option>
            <option value="error">Com erro</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
        <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400" onClick={() => { setEditing(null); setDrawer(true); }}>
          + Nova integracao
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={integrations.length === 0 ? "Nenhuma integracao cadastrada." : "Nenhum resultado encontrado."} />
      ) : (
        <div className="grid gap-4 2xl:grid-cols-2">
          {filtered.map((item) => (
            <IntegrationCard
              key={idOf(item)}
              item={item}
              onEdit={(i) => { setEditing(i); setDrawer(true); }}
              onDelete={remove}
              onTest={testConnection}
              onActivate={activateIntegration}
              onSync={syncIntegration}
              onRestartWebhook={restartWebhook}
            />
          ))}
        </div>
      )}

      <AdminDrawer
        open={drawer}
        onClose={() => { setDrawer(false); setEditing(null); }}
        item={editing}
        organizations={organizations}
        onCreate={create}
        onUpdate={update}
      />
    </div>
  );
}

function OverviewTab({ overview }) {
  const root = apiRoot();
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Organizacoes" value={overview?.organizationsCount} hint={`${overview?.activeOrganizationsCount || 0} ativas`} />
        <StatCard label="Contas WhatsApp" value={overview?.whatsappAccounts} hint="Meta e Z-API operacionais" />
        <StatCard label="Conversas" value={overview?.conversationsCount} hint={`${overview?.messagesCount || 0} mensagens salvas`} />
        <StatCard label="Integracoes ativas" value={overview?.integrations?.active} hint={`${overview?.integrations?.error || 0} com erro`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm font-semibold text-zinc-100">Webhooks</p>
          <div className="mt-3 grid gap-2 text-xs text-zinc-400">
            <code className="rounded-lg bg-zinc-950 p-3 text-orange-300">{root}/webhook/zapi</code>
            <code className="rounded-lg bg-zinc-950 p-3 text-orange-300">{root}/webhook/meta</code>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-sm font-semibold text-zinc-100">Ultimo evento critico</p>
          {overview?.latestError ? (
            <div className="mt-3 text-xs text-zinc-400">
              <p className="text-red-300">{overview.latestError.message}</p>
              <p className="mt-2">{fmtDate(overview.latestError.createdAt)}</p>
            </div>
          ) : (
            <p className="mt-3 text-xs text-zinc-500">Nenhum erro critico registrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AiConfigCard({ item, onSave, onRestart, onTestPrompt }) {
  const [form, setForm] = useState({ model: item.model || "", temperature: item.temperature ?? 0.3, dailyLimit: item.dailyLimit || 0, enabled: item.enabled });
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState("");

  useEffect(() => {
    setForm({ model: item.model || "", temperature: item.temperature ?? 0.3, dailyLimit: item.dailyLimit || 0, enabled: item.enabled });
  }, [item]);

  async function run(action, fn) {
    setBusy(action);
    try {
      const result = await fn();
      if (action === "test") setAnswer(result?.data?.answer || result?.answer || "");
      toast.success("Operacao de IA concluida.");
    } catch (err) {
      toast.error(err?.message || "Erro na IA.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-zinc-100">{item.organization?.name || "Organizacao"}</p>
          <p className="text-xs text-zinc-500">{item.whatsappAccount?.label || item.whatsappAccount?.phoneNumber || "Conta WhatsApp"}</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs ${item.enabled ? "bg-green-900/50 text-green-300" : "bg-zinc-800 text-zinc-500"}`}>
          {item.enabled ? "IA ativa" : "IA pausada"}
        </span>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" value={form.model} onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))} placeholder="Modelo" />
        <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" type="number" step="0.05" value={form.temperature} onChange={(e) => setForm((p) => ({ ...p, temperature: e.target.value }))} placeholder="Temperatura" />
        <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" type="number" value={form.dailyLimit} onChange={(e) => setForm((p) => ({ ...p, dailyLimit: e.target.value }))} placeholder="Limite diario" />
        <select className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" value={form.enabled ? "true" : "false"} onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.value === "true" }))}>
          <option value="true">Ativa</option>
          <option value="false">Pausada</option>
        </select>
      </div>
      <div className="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-4">
        <span>Provider: <b className="text-zinc-300">{item.provider}</b></span>
        <span>Tokens usados: <b className="text-zinc-300">{item.tokensUsed || 0}</b></span>
        <span>Restantes: <b className="text-zinc-300">{item.tokensRemaining ?? "sem limite"}</b></span>
        <span>Erros IA: <b className="text-zinc-300">{item.errorsToday || 0}</b></span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-black disabled:opacity-50" disabled={busy === "save"} onClick={() => run("save", () => onSave(item.id, form))}>Salvar IA</button>
        <button className="rounded-lg border border-zinc-700 px-4 py-2 text-xs text-zinc-300 disabled:opacity-50" disabled={busy === "restart"} onClick={() => run("restart", () => onRestart(item.organizationId))}>Reiniciar IA</button>
      </div>
      <div className="mt-4 grid gap-2">
        <textarea className="min-h-20 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Teste um prompt operacional..." />
        <button className="w-fit rounded-lg border border-blue-500/30 px-4 py-2 text-xs text-blue-300 disabled:opacity-50" disabled={busy === "test" || !prompt.trim()} onClick={() => run("test", () => onTestPrompt({ prompt, model: form.model, temperature: form.temperature, organizationId: item.organizationId }))}>Testar prompt</button>
        {answer && <pre className="whitespace-pre-wrap rounded-lg bg-zinc-950 p-3 text-xs text-zinc-300">{answer}</pre>}
      </div>
    </div>
  );
}

function AiTab({ aiConfigs, updateAi, restartAi, testPrompt }) {
  if (aiConfigs.length === 0) return <EmptyState title="Nenhuma configuracao de IA encontrada." />;
  return (
    <div className="grid gap-4">
      {aiConfigs.map((item) => (
        <AiConfigCard key={item.id} item={item} onSave={updateAi} onRestart={restartAi} onTestPrompt={testPrompt} />
      ))}
    </div>
  );
}

function HealthTab({ health }) {
  if (health.length === 0) return <EmptyState title="Nenhum status operacional encontrado." />;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {health.map((item) => (
        <div key={item.key} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex items-start justify-between gap-3">
            <p className="font-semibold text-zinc-100">{item.label}</p>
            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${HEALTH_MAP[item.status] || HEALTH_MAP.OFFLINE}`}>{item.status}</span>
          </div>
          <p className="mt-3 text-xs text-zinc-500">{item.detail || "-"}</p>
        </div>
      ))}
    </div>
  );
}

function LogsTab({ logs, organizations, onFilter }) {
  const [filters, setFilters] = useState({ startDate: "", endDate: "", organizationId: "", type: "", provider: "" });
  const types = ["audit", "log", "error", "ai", "integrations", "organizations", "ingestion", "webhook"];

  async function submit(e) {
    e.preventDefault();
    try {
      await onFilter(filters);
    } catch (err) {
      toast.error(err?.message || "Erro ao filtrar logs.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 lg:grid-cols-6" onSubmit={submit}>
        <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" type="date" value={filters.startDate} onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value }))} />
        <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" type="date" value={filters.endDate} onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value }))} />
        <select className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" value={filters.organizationId} onChange={(e) => setFilters((p) => ({ ...p, organizationId: e.target.value }))}>
          <option value="">Todas organizacoes</option>
          {organizations.map((org) => <option key={idOf(org)} value={idOf(org)}>{org.name}</option>)}
        </select>
        <select className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
          <option value="">Todos tipos</option>
          {types.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" value={filters.provider} onChange={(e) => setFilters((p) => ({ ...p, provider: e.target.value }))}>
          <option value="">Todos providers</option>
          <option value="meta">Meta</option>
          <option value="zapi">Z-API</option>
        </select>
        <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black">Filtrar</button>
      </form>

      {logs.length === 0 ? (
        <EmptyState title="Nenhum log encontrado." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
          {logs.map((item, index) => (
            <div key={item.id || index} className="grid gap-2 border-b border-zinc-800 p-4 text-xs last:border-b-0 xl:grid-cols-[130px_150px_150px_110px_110px_1fr]">
              <span className="text-zinc-500">{fmtDate(item.occurredAt || item.date)}</span>
              <span className="text-zinc-300">{item.organization?.name || item.organizationId || "-"}</span>
              <span className="text-zinc-400">{item.whatsappAccount?.label || item.whatsappAccount?.phoneNumber || "-"}</span>
              <span className="text-zinc-400">{item.module || "-"}</span>
              <span className={item.level === "error" ? "text-red-300" : "text-zinc-400"}>{item.type || item.level || "-"}</span>
              <span className="text-zinc-300">{item.message || "-"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminBody() {
  const admin = useAdmin();
  const [tab, setTab] = useState("overview");

  const counts = useMemo(() => ({
    organizations: admin.organizations.length,
    integrations: admin.integrations.length,
    ai: admin.aiConfigs.length,
    health: admin.health.length,
    logs: admin.logs.length,
  }), [admin.organizations.length, admin.integrations.length, admin.aiConfigs.length, admin.health.length, admin.logs.length]);

  if (admin.error) return <Error />;
  if (admin.loading) return <Load />;

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-zinc-100">Gestao administrativa</h2>
        <p className="text-sm text-zinc-500">Controle empresas, conexoes WhatsApp, IA, webhooks, logs e saude operacional.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-zinc-800 pb-2">
        {TABS.map((item) => (
          <button key={item.key} className={`shrink-0 rounded-lg px-3 py-2 text-sm transition ${tab === item.key ? "bg-orange-500 text-black" : "text-zinc-400 hover:bg-zinc-900"}`} onClick={() => setTab(item.key)}>
            {item.label}
            {item.key !== "overview" && <span className="ml-2 text-xs opacity-70">{counts[item.key] || ""}</span>}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab overview={admin.overview} />}
      {tab === "organizations" && (
        <OrganizationsTab organizations={admin.organizations} onCreate={admin.createOrganization} onUpdate={admin.updateOrganization} onDeactivate={admin.deactivateOrganization} />
      )}
      {tab === "integrations" && (
        <IntegrationsTab
          organizations={admin.organizations}
          integrations={admin.integrations}
          create={admin.create}
          update={admin.update}
          remove={admin.remove}
          testConnection={admin.testConnection}
          activateIntegration={admin.activateIntegration}
          syncIntegration={admin.syncIntegration}
          restartWebhook={admin.restartWebhook}
        />
      )}
      {tab === "ai" && <AiTab aiConfigs={admin.aiConfigs} updateAi={admin.updateAi} restartAi={admin.restartAi} testPrompt={admin.testPrompt} />}
      {tab === "health" && <HealthTab health={admin.health} />}
      {tab === "logs" && <LogsTab logs={admin.logs} organizations={admin.organizations} onFilter={admin.loadLogs} />}
    </div>
  );
}

export default function Admin() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-dvh bg-black text-white">
      <SideBar open={open} setOpen={setOpen} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header setOpen={setOpen} title="Admin" />
        <AdminBody />
      </main>
    </div>
  );
}
