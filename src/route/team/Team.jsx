import { useState } from "react";
import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import { useTeam, roleLabel } from "./useTeam.js";
import TeamDrawer from "./TeamDrawer.jsx";
import Load  from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import toast from "react-hot-toast";

function Avatar({ name }) {
  const initials = name?.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
  return (
    <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-orange-400">{initials}</span>
    </div>
  );
}

function MemberRow({ member, onEdit, onDeactivate }) {
  const [deactivating, setDeactivating] = useState(false);

  async function handleDeactivate() {
    if (!confirm(`Desativar "${member.name}"?`)) return;
    setDeactivating(true);
    try {
      await onDeactivate(member._id || member.id);
      toast.success("Membro desativado.");
    } catch {
      toast.error("Erro ao desativar.");
    } finally {
      setDeactivating(false);
    }
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${member.active !== false ? "border-zinc-800 bg-zinc-950" : "border-zinc-800/50 bg-zinc-950/50 opacity-60"} hover:border-zinc-700 transition`}>
      <Avatar name={member.name} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-zinc-100 truncate">{member.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            member.active !== false ? "bg-green-900/40 text-green-300" : "bg-zinc-800 text-zinc-500"
          }`}>
            {member.active !== false ? "Ativo" : "Inativo"}
          </span>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
            {roleLabel(member.role)}
          </span>
        </div>
        <div className="flex gap-3 mt-0.5 text-xs text-zinc-500 flex-wrap">
          {member.phone && <span>📱 {member.phone}</span>}
          {member.email && !member.email.includes("@sem-email") && <span>✉️ {member.email}</span>}
          {member.department && <span>🏢 {member.department}</span>}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          className="p-1.5 rounded text-zinc-500 hover:text-orange-400 hover:bg-zinc-800 transition"
          onClick={() => onEdit(member)}
          title="Editar"
        >✏️</button>
        {member.active !== false && (
          <button
            className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition disabled:opacity-30"
            onClick={handleDeactivate}
            disabled={deactivating}
            title="Desativar"
          >
            {deactivating ? "…" : "🚫"}
          </button>
        )}
      </div>
    </div>
  );
}

function TeamBody() {
  const { members, loading, error, createMember, updateMember, deactivateMember } = useTeam();
  const [drawer,  setDrawer]  = useState(false);
  const [editing, setEditing] = useState(null);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");

  if (error)   return <Error />;
  if (loading) return <Load />;

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.name?.toLowerCase().includes(q) || m.phone?.includes(q) || m.email?.toLowerCase().includes(q);
    const matchFilter = filter === "all" || (filter === "active" && m.active !== false) || (filter === "inactive" && m.active === false);
    return matchSearch && matchFilter;
  });

  function openNew()       { setEditing(null); setDrawer(true); }
  function openEdit(m)     { setEditing(m);    setDrawer(true); }
  function closeDrawer()   { setDrawer(false); setEditing(null); }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 overflow-y-auto flex-1">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <input
            className="flex-1 max-w-xs rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
            placeholder="Buscar por nome, telefone..."
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
          + Novo membro
        </button>
      </div>

      <p className="text-xs text-zinc-500">{filtered.length} {filtered.length === 1 ? "membro" : "membros"}</p>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-950 py-16 text-center">
          <span className="text-3xl">👥</span>
          <p className="text-sm text-zinc-400">
            {members.length === 0 ? "Nenhum membro cadastrado." : "Nenhum resultado para o filtro."}
          </p>
          {members.length === 0 && (
            <button className="text-sm text-orange-400 hover:text-orange-300 transition" onClick={openNew}>
              + Cadastrar primeiro membro
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(m => (
            <MemberRow
              key={m._id || m.id}
              member={m}
              onEdit={openEdit}
              onDeactivate={deactivateMember}
            />
          ))}
        </div>
      )}

      <TeamDrawer
        open={drawer}
        onClose={closeDrawer}
        member={editing}
        onCreate={createMember}
        onUpdate={updateMember}
      />
    </div>
  );
}

export default function Team() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-dvh bg-black text-white">
      <SideBar open={open} setOpen={setOpen} />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Header setOpen={setOpen} title="Equipe" />
        <TeamBody />
      </main>
    </div>
  );
}
