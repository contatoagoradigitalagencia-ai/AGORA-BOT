import { useMemo, useState } from "react";
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
};

const TABS = [
  { key: "overview", label: "Visao geral" },
  { key: "organizations", label: "Organizacoes" },
  { key: "integrations", label: "Integracoes" },
  { key: "logs", label: "Logs" },
];

function fmtDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleString("pt-BR", {
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

function OrganizationForm({ onCreate }) {
  const [form, setForm] = useState({ name: "", ownerName: "", phone: "", email: "", plan: "starter" });
  const [saving, setSaving] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Nome da organizacao obrigatorio.");
    setSaving(true);
    try {
      await onCreate(form);
      setForm({ name: "", ownerName: "", phone: "", email: "", plan: "starter" });
      toast.success("Organizacao criada.");
    } catch (err) {
      toast.error(err?.message || "Erro ao criar organizacao.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 md:grid-cols-5" onSubmit={submit}>
      <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" placeholder="Nome da empresa" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
      <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" placeholder="Responsavel" value={form.ownerName} onChange={(e) => setForm((p) => ({ ...p, ownerName: e.target.value }))} />
      <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" placeholder="Telefone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
      <input className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" placeholder="E-mail" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
      <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:opacity-60" disabled={saving}>
        {saving ? "Salvando..." : "Criar"}
      </button>
    </form>
  );
}

function OrganizationsTab({ organizations, onCreate, onDeactivate }) {
  async function deactivate(org) {
    if (!confirm(`Inativar "${org.name}"?`)) return;
    try {
      await onDeactivate(org._id || org.id);
      toast.success("Organizacao inativada.");
    } catch (err) {
      toast.error(err?.message || "Erro ao inativar.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <OrganizationForm onCreate={onCreate} />
      {organizations.length === 0 ? (
        <EmptyState title="Nenhuma organizacao cadastrada." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {organizations.map((org) => {
            const st = STATUS_MAP[org.status] || STATUS_MAP.pending;
            return (
              <div key={org._id || org.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-100">{org.name}</p>
                    <p className="text-xs text-zinc-500">{org.slug}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.label}</span>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2">
                  <span>Responsavel: <b className="font-medium text-zinc-300">{org.ownerName || org.responsibleName || "-"}</b></span>
                  <span>Plano: <b className="font-medium text-zinc-300">{org.plan || "-"}</b></span>
                  <span>Telefone: <b className="font-medium text-zinc-300">{org.phone || "-"}</b></span>
                  <span>E-mail: <b className="font-medium text-zinc-300">{org.email || "-"}</b></span>
                </div>
                <button className="mt-4 rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-40" onClick={() => deactivate(org)} disabled={org.status === "inactive"}>
                  Inativar
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function IntegrationCard({ item, onEdit, onDelete, onTest, onActivate }) {
  const [testing, setTesting] = useState(false);
  const [activating, setActivating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const st = STATUS_MAP[item.status] || STATUS_MAP.pending;

  async function handleTest() {
    setTesting(true);
    try {
      const r = await onTest(item._id || item.id);
      if (r.ok) toast.success(r.message || "Conexao OK.");
      else toast.error(r.message || r.error || "Falha na conexao.");
    } catch (err) {
      toast.error(err?.message || "Erro ao testar.");
    } finally {
      setTesting(false);
    }
  }

  async function handleActivate() {
    setActivating(true);
    try {
      await onActivate(item._id || item.id);
      toast.success("Integracao ativada em whatsapp_accounts.");
    } catch (err) {
      toast.error(err?.message || "Erro ao ativar integracao.");
    } finally {
      setActivating(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Inativar integracao de "${item.clientName}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(item._id || item.id);
      toast.success("Integracao inativada.");
    } catch (err) {
      toast.error(err?.message || "Erro ao inativar.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-100">{item.clientName}</p>
          <p className="text-xs text-zinc-500">{item.companyName || item.organization?.name || "-"}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.label}</span>
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{item.provider === "meta" ? "Meta" : "Z-API"}</span>
        </div>
      </div>
      <div className="grid gap-1 text-xs text-zinc-500">
        <span>Organizacao: <b className="font-medium text-zinc-300">{item.organization?.name || item.organizationId || "-"}</b></span>
        {item.provider === "meta" && <span>Phone ID: <b className="font-medium text-zinc-300">{item.metaPhoneNumberId || "-"}</b></span>}
        {item.provider === "zapi" && <span>Instance ID: <b className="font-medium text-zinc-300">{item.zapiInstanceId || "-"}</b></span>}
        <span>Ultimo teste: <b className="font-medium text-zinc-300">{fmtDate(item.lastTestedAt)}</b></span>
        {item.lastTestResult && <span className={item.status === "error" ? "text-red-400" : "text-zinc-500"}>{item.lastTestResult}</span>}
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-zinc-800 pt-3 sm:grid-cols-4">
        <button className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-medium text-orange-400 transition hover:bg-orange-500/20 disabled:opacity-40" onClick={handleTest} disabled={testing}>
          {testing ? "Testando..." : "Testar"}
        </button>
        <button className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs font-medium text-green-300 transition hover:bg-green-500/20 disabled:opacity-40" onClick={handleActivate} disabled={activating || item.status !== "active"}>
          {activating ? "Ativando..." : "Ativar"}
        </button>
        <button className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-800" onClick={() => onEdit(item)}>
          Editar
        </button>
        <button className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-40" onClick={handleDelete} disabled={deleting}>
          {deleting ? "..." : "Inativar"}
        </button>
      </div>
    </div>
  );
}

function IntegrationsTab({ organizations, integrations, create, update, remove, testConnection, activateIntegration }) {
  const [drawer, setDrawer] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = integrations.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || item.clientName?.toLowerCase().includes(q)
      || item.companyName?.toLowerCase().includes(q)
      || item.organization?.name?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || item.provider === filter || item.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full gap-2 sm:w-auto">
          <input className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500 sm:w-72" placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-orange-500" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="meta">Meta</option>
            <option value="zapi">Z-API</option>
            <option value="active">Ativos</option>
            <option value="error">Com erro</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>
        <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400" onClick={() => { setEditing(null); setDrawer(true); }}>
          + Nova integracao
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={integrations.length === 0 ? "Nenhuma integracao cadastrada." : "Nenhum resultado encontrado."}
          action={integrations.length === 0 && (
            <button className="mt-3 text-sm text-orange-400 hover:text-orange-300" onClick={() => { setEditing(null); setDrawer(true); }}>
              Cadastrar primeira integracao
            </button>
          )}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
            <IntegrationCard
              key={item._id || item.id}
              item={item}
              onEdit={(i) => { setEditing(i); setDrawer(true); }}
              onDelete={remove}
              onTest={testConnection}
              onActivate={activateIntegration}
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

function LogsTab({ logs }) {
  if (logs.length === 0) return <EmptyState title="Nenhum log encontrado." />;
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      {logs.map((item, index) => (
        <div key={item._id || item.id || index} className="grid gap-2 border-b border-zinc-800 p-4 text-xs last:border-b-0 md:grid-cols-[160px_100px_1fr]">
          <span className="text-zinc-500">{fmtDate(item.createdAt)}</span>
          <span className={item.level === "error" ? "text-red-300" : "text-zinc-400"}>{item.level || item.kind}</span>
          <span className="text-zinc-300">{item.message || item.source || "-"}</span>
        </div>
      ))}
    </div>
  );
}

function AdminBody() {
  const admin = useAdmin();
  const [tab, setTab] = useState("overview");

  const counts = useMemo(() => ({
    organizations: admin.organizations.length,
    integrations: admin.integrations.length,
    logs: admin.logs.length,
  }), [admin.organizations.length, admin.integrations.length, admin.logs.length]);

  if (admin.error) return <Error />;
  if (admin.loading) return <Load />;

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-zinc-100">Gestao administrativa</h2>
        <p className="text-sm text-zinc-500">Controle empresas, conexoes WhatsApp, webhooks e saude operacional.</p>
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
        <OrganizationsTab organizations={admin.organizations} onCreate={admin.createOrganization} onDeactivate={admin.deactivateOrganization} />
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
        />
      )}
      {tab === "logs" && <LogsTab logs={admin.logs} />}
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
