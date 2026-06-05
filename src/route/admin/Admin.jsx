import { useState } from "react";
import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import { useAdmin } from "./useAdmin.js";
import AdminDrawer from "./AdminDrawer.jsx";
import Load  from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import toast from "react-hot-toast";

const STATUS_MAP = {
  active:   { label: "Ativo",     cls: "bg-green-900/50 text-green-300"  },
  inactive: { label: "Inativo",   cls: "bg-zinc-800 text-zinc-500"       },
  pending:  { label: "Pendente",  cls: "bg-yellow-900/50 text-yellow-300" },
  error:    { label: "Erro",      cls: "bg-red-900/50 text-red-300"      },
};

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function IntegrationCard({ item, onEdit, onDelete, onTest }) {
  const [testing,  setTesting]  = useState(false);
  const [deleting, setDeleting] = useState(false);
  const st = STATUS_MAP[item.status] || STATUS_MAP.pending;

  async function handleTest() {
    setTesting(true);
    try {
      const r = await onTest(item._id || item.id);
      if (r.ok) toast.success(r.message || "Conexão OK!");
      else      toast.error(r.message  || "Falha na conexão.");
    } catch { toast.error("Erro ao testar."); }
    finally { setTesting(false); }
  }

  async function handleDelete() {
    if (!confirm(`Excluir integração de "${item.clientName}"?`)) return;
    setDeleting(true);
    try { await onDelete(item._id || item.id); toast.success("Excluído!"); }
    catch { toast.error("Erro ao excluir."); }
    finally { setDeleting(false); }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-3">
      {/* Topo */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-zinc-100">{item.clientName}</p>
          {item.companyName && <p className="text-xs text-zinc-500">{item.companyName}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.cls}`}>{st.label}</span>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
            {item.provider === "meta" ? "Meta" : "Z-API"}
          </span>
        </div>
      </div>

      {/* Detalhes */}
      <div className="grid grid-cols-2 gap-1 text-xs text-zinc-500">
        {item.provider === "meta" && (
          <>
            {item.metaPhoneNumberId && <span>Phone ID: <span className="text-zinc-400">{item.metaPhoneNumberId}</span></span>}
            {item.metaWabaId && <span>WABA: <span className="text-zinc-400">{item.metaWabaId}</span></span>}
          </>
        )}
        {item.provider === "zapi" && (
          <>
            {item.zapiInstanceId && <span>Instance: <span className="text-zinc-400">{item.zapiInstanceId}</span></span>}
            {item.zapiBaseUrl && <span>URL: <span className="text-zinc-400 truncate">{item.zapiBaseUrl}</span></span>}
          </>
        )}
        <span className="col-span-2">Testado: <span className="text-zinc-400">{fmtDate(item.lastTestedAt)}</span></span>
        {item.lastTestResult && (
          <span className={`col-span-2 truncate ${item.status === "error" ? "text-red-400" : "text-zinc-500"}`}>
            {item.lastTestResult}
          </span>
        )}
      </div>

      {/* Ações */}
      <div className="flex gap-2 pt-1 border-t border-zinc-800">
        <button
          className="flex-1 py-1.5 text-xs rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition disabled:opacity-40 font-medium"
          onClick={handleTest}
          disabled={testing}
        >
          {testing ? "Testando..." : (item.provider === "meta" ? "Testar Meta" : "Testar Z-API")}
        </button>
        <button
          className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition"
          onClick={() => onEdit(item)}
        >✏️</button>
        <button
          className="px-3 py-1.5 text-xs rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "…" : "🗑"}
        </button>
      </div>
    </div>
  );
}

function AdminBody() {
  const { integrations, loading, error, create, update, remove, testConnection } = useAdmin();
  const [drawer,  setDrawer]  = useState(false);
  const [editing, setEditing] = useState(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  if (error)   return <Error />;
  if (loading) return <Load />;

  const filtered = integrations.filter(i => {
    const q = search.toLowerCase();
    const matchS = !q || i.clientName?.toLowerCase().includes(q) || i.companyName?.toLowerCase().includes(q);
    const matchF = filter === "all" || i.provider === filter || i.status === filter;
    return matchS && matchF;
  });

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 overflow-y-auto flex-1">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <input
            className="flex-1 max-w-xs rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
            placeholder="Buscar cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="meta">Meta</option>
            <option value="zapi">Z-API</option>
            <option value="active">Ativos</option>
            <option value="error">Com erro</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>
        <button
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition shrink-0"
          onClick={() => { setEditing(null); setDrawer(true); }}
        >
          + Nova integração
        </button>
      </div>

      <p className="text-xs text-zinc-500">{filtered.length} {filtered.length === 1 ? "integração" : "integrações"}</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-950 py-16 text-center">
          <span className="text-3xl">🔌</span>
          <p className="text-sm text-zinc-400">
            {integrations.length === 0 ? "Nenhuma integração cadastrada." : "Nenhum resultado."}
          </p>
          {integrations.length === 0 && (
            <button
              className="text-sm text-orange-400 hover:text-orange-300 transition"
              onClick={() => { setEditing(null); setDrawer(true); }}
            >
              + Cadastrar primeira integração
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(item => (
            <IntegrationCard
              key={item._id || item.id}
              item={item}
              onEdit={i => { setEditing(i); setDrawer(true); }}
              onDelete={remove}
              onTest={testConnection}
            />
          ))}
        </div>
      )}

      <AdminDrawer
        open={drawer}
        onClose={() => { setDrawer(false); setEditing(null); }}
        item={editing}
        onCreate={create}
        onUpdate={update}
      />
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
