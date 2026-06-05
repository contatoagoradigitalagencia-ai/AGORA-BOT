import { useState } from "react";
import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import { useAttendants, colorBg } from "./useAttendants.js";
import AttendantDrawer from "./AttendantDrawer.jsx";
import Load  from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import toast from "react-hot-toast";

function AttendantCard({ attendant, onEdit, onDeactivate }) {
  const [busy, setBusy] = useState(false);
  const id = attendant._id || attendant.id;
  const dot = colorBg(attendant.colorTag);

  async function handleDeactivate() {
    if (!confirm(`Desativar "${attendant.name}"?`)) return;
    setBusy(true);
    try { await onDeactivate(id); toast.success("Desativado."); }
    catch { toast.error("Erro ao desativar."); }
    finally { setBusy(false); }
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${attendant.active !== false ? "border-zinc-800 bg-zinc-950" : "border-zinc-800/40 bg-zinc-950/40 opacity-50"} hover:border-zinc-700 transition`}>

      {/* Avatar colorido */}
      <div className={`w-10 h-10 rounded-full ${dot} flex items-center justify-center shrink-0`}>
        <span className="text-sm font-bold text-white">
          {attendant.name.slice(0, 2).toUpperCase()}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-zinc-100 truncate">
            {attendant.displayName || attendant.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${attendant.active !== false ? "bg-green-900/40 text-green-300" : "bg-zinc-800 text-zinc-500"}`}>
            {attendant.active !== false ? "Ativo" : "Inativo"}
          </span>
          {attendant.roleLabel && (
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
              {attendant.roleLabel}
            </span>
          )}
        </div>
        {attendant.phone && (
          <p className="text-xs text-zinc-500 mt-0.5">📱 {attendant.phone}</p>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          className="p-1.5 rounded text-zinc-500 hover:text-orange-400 hover:bg-zinc-800 transition"
          onClick={() => onEdit(attendant)}
          title="Editar"
        >✏️</button>
        {attendant.active !== false && (
          <button
            className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition disabled:opacity-30"
            onClick={handleDeactivate}
            disabled={busy}
            title="Desativar"
          >
            {busy ? "…" : "🚫"}
          </button>
        )}
      </div>
    </div>
  );
}

function AttendantsBody() {
  const { attendants, loading, error, createAttendant, updateAttendant, deactivateAttendant } = useAttendants();
  const [drawer,  setDrawer]  = useState(false);
  const [editing, setEditing] = useState(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  if (error)   return <Error />;
  if (loading) return <Load />;

  const filtered = attendants.filter(a => {
    const q = search.toLowerCase();
    const matchS = !q || a.name?.toLowerCase().includes(q) || a.displayName?.toLowerCase().includes(q) || a.phone?.includes(q);
    const matchF = filter === "all" || (filter === "active" && a.active !== false) || (filter === "inactive" && a.active === false);
    return matchS && matchF;
  });

  function openNew()     { setEditing(null); setDrawer(true); }
  function openEdit(a)   { setEditing(a);    setDrawer(true); }
  function closeDrawer() { setDrawer(false); setEditing(null); }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 overflow-y-auto flex-1">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <input
            className="flex-1 max-w-xs rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
        <button
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition shrink-0"
          onClick={openNew}
        >
          + Novo atendente
        </button>
      </div>

      <p className="text-xs text-zinc-500">{filtered.length} {filtered.length === 1 ? "atendente" : "atendentes"}</p>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-950 py-16 text-center">
          <span className="text-3xl">👥</span>
          <p className="text-sm text-zinc-400">
            {attendants.length === 0 ? "Nenhum atendente cadastrado." : "Nenhum resultado."}
          </p>
          {attendants.length === 0 && (
            <button className="text-sm text-orange-400 hover:text-orange-300 transition" onClick={openNew}>
              + Cadastrar primeiro atendente
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(a => (
            <AttendantCard
              key={a._id || a.id}
              attendant={a}
              onEdit={openEdit}
              onDeactivate={deactivateAttendant}
            />
          ))}
        </div>
      )}

      <AttendantDrawer
        open={drawer}
        onClose={closeDrawer}
        attendant={editing}
        onCreate={createAttendant}
        onUpdate={updateAttendant}
      />
    </div>
  );
}

export default function Attendants() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-dvh bg-black text-white">
      <SideBar open={open} setOpen={setOpen} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header setOpen={setOpen} title="Atendentes" />
        <AttendantsBody />
      </main>
    </div>
  );
}
