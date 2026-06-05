import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useCatalog, SECTIONS } from "./useGetSpreadsheet.js";
import Error  from "../../screens/Error.jsx";
import Load   from "../../screens/Load.jsx";
import toast  from "react-hot-toast";

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmtPrice(v) {
	if (typeof v !== "number") return "—";
	return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}
function fmtDate(v) {
	if (!v) return "—";
	return new Date(v).toLocaleDateString("pt-BR");
}

// ─── CAMPOS por seção ────────────────────────────────────────────────────────
const FIELDS = {
	products: [
		{ key: "name",        label: "Nome *",             type: "text",     required: true  },
		{ key: "description", label: "Descrição",           type: "textarea"                  },
		{ key: "price",       label: "Preço (R$)",          type: "number"                    },
		{ key: "conditions",  label: "Condições",           type: "text"                      },
		{ key: "category",    label: "Categoria",           type: "text"                      },
		{ key: "keywords",    label: "Palavras-chave",      type: "text",     hint: "Separadas por vírgula" },
		{ key: "notes",       label: "Observações internas",type: "textarea"                  },
	],
	services: [
		{ key: "name",        label: "Nome *",             type: "text",     required: true  },
		{ key: "description", label: "Descrição",           type: "textarea"                  },
		{ key: "price",       label: "Preço (R$)",          type: "number"                    },
		{ key: "deadline",    label: "Prazo",               type: "text",     hint: "Ex: 7 dias úteis" },
		{ key: "conditions",  label: "Condições",           type: "text"                      },
		{ key: "category",    label: "Categoria",           type: "text"                      },
		{ key: "keywords",    label: "Palavras-chave",      type: "text",     hint: "Separadas por vírgula" },
		{ key: "notes",       label: "Observações internas",type: "textarea"                  },
	],
	plans: [
		{ key: "name",        label: "Nome *",             type: "text",     required: true  },
		{ key: "price",       label: "Preço mensal (R$)",   type: "number"                    },
		{ key: "setup",       label: "Setup (R$)",          type: "number"                    },
		{ key: "description", label: "Itens inclusos",      type: "textarea"                  },
		{ key: "target",      label: "Indicado para",       type: "text"                      },
		{ key: "conditions",  label: "Condições",           type: "text"                      },
		{ key: "keywords",    label: "Palavras-chave",      type: "text",     hint: "Separadas por vírgula" },
		{ key: "notes",       label: "Observações internas",type: "textarea"                  },
	],
};

function defaultForm(sectionKey) {
	return Object.fromEntries(FIELDS[sectionKey].map(f => [f.key, ""]));
}

// ─── DRAWER lateral ──────────────────────────────────────────────────────────
function Drawer({ open, onClose, sectionKey, item, onCreate, onUpdate }) {
	const isEdit = Boolean(item?._id);
	const fields = FIELDS[sectionKey] || [];
	const section = SECTIONS[sectionKey];

	const [form,    setForm]    = useState(() => item ? { ...defaultForm(sectionKey), ...item } : defaultForm(sectionKey));
	const [active,  setActive]  = useState(item?.active !== false);
	const [saving,  setSaving]  = useState(false);
	const [another, setAnother] = useState(false);

	function set(key, value) { setForm(p => ({ ...p, [key]: value })); }

	async function handleSave(keepOpen = false) {
		if (!form.name?.trim()) { toast.error("Nome obrigatório."); return; }
		setSaving(true);
		try {
			const payload = { ...form, active };
			if (typeof payload.price  === "string") payload.price  = payload.price  === "" ? null : parseFloat(payload.price);
			if (typeof payload.setup  === "string") payload.setup  = payload.setup  === "" ? null : parseFloat(payload.setup);

			if (isEdit) await onUpdate(sectionKey, item._id, payload);
			else        await onCreate(sectionKey, payload);

			toast.success(isEdit ? "Salvo com sucesso!" : "Criado com sucesso!");
			if (keepOpen && !isEdit) {
				setForm(defaultForm(sectionKey));
				setActive(true);
			} else {
				onClose();
			}
		} catch (e) {
			toast.error(e?.message || "Erro ao salvar.");
		} finally {
			setSaving(false);
		}
	}

	if (!open) return null;

	return createPortal(
		<>
			{/* Overlay */}
			<div className="fixed inset-0 z-[9998] bg-black/60" onClick={onClose} />

			{/* Drawer */}
			<div className="fixed inset-y-0 right-0 z-[9999] flex flex-col bg-zinc-900 border-l border-zinc-700 shadow-2xl w-full sm:w-[480px]">
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
					<h2 className="text-base font-semibold">
						{isEdit ? "Editar" : "Novo"} {section?.singular}
					</h2>
					<div className="flex items-center gap-3">
						<label className="flex items-center gap-2 cursor-pointer">
							<span className="text-xs text-zinc-400">{active ? "Ativo" : "Inativo"}</span>
							<div className="relative">
								<input type="checkbox" className="sr-only peer" checked={active} onChange={() => setActive(p => !p)} />
								<div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
								<div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-4" />
							</div>
						</label>
						<button className="text-zinc-500 hover:text-zinc-200 text-lg px-1" onClick={onClose}>✕</button>
					</div>
				</div>

				{/* Body com scroll */}
				<div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
					{fields.map(f => (
						<div key={f.key} className="flex flex-col gap-1">
							<label className="text-xs font-medium text-zinc-400">
								{f.label}
								{f.hint && <span className="ml-1 text-zinc-600">({f.hint})</span>}
							</label>
							{f.type === "textarea" ? (
								<textarea
									rows={3}
									className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition resize-none"
									value={form[f.key] || ""}
									onChange={e => set(f.key, e.target.value)}
								/>
							) : (
								<input
									type={f.type}
									min={f.type === "number" ? "0" : undefined}
									step={f.type === "number" ? "0.01" : undefined}
									className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
									value={form[f.key] ?? ""}
									onChange={e => set(f.key, e.target.value)}
								/>
							)}
						</div>
					))}
				</div>

				{/* Footer fixo */}
				<div className="flex items-center justify-between gap-2 px-5 py-4 border-t border-zinc-800 shrink-0">
					<button
						className="text-sm text-zinc-400 hover:text-zinc-200 transition"
						onClick={onClose}
						disabled={saving}
					>
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

// ─── LINHA da tabela ─────────────────────────────────────────────────────────
function ItemRow({ item, sectionKey, onEdit, onDuplicate, onDelete, onToggle }) {
	const [deleting, setDeleting] = useState(false);
	const [toggling, setToggling] = useState(false);

	async function handleDelete() {
		if (!confirm(`Excluir "${item.name}"?`)) return;
		setDeleting(true);
		try { await onDelete(sectionKey, item._id); toast.success("Excluído!"); }
		catch { toast.error("Erro ao excluir."); }
		finally { setDeleting(false); }
	}

	async function handleToggle() {
		setToggling(true);
		try { await onToggle(sectionKey, item); }
		catch { toast.error("Erro ao atualizar status."); }
		finally { setToggling(false); }
	}

	return (
		<div className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[2fr_1fr_auto_auto] items-center gap-3 px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition">
			{/* Nome + categoria */}
			<div className="min-w-0">
				<p className="font-medium text-zinc-100 truncate">{item.name}</p>
				{item.category && <p className="text-xs text-zinc-500 truncate">{item.category}</p>}
			</div>

			{/* Preço */}
			<span className="text-sm font-semibold text-orange-400 whitespace-nowrap hidden sm:block">
				{fmtPrice(item.price)}
			</span>

			{/* Status badge */}
			<button
				onClick={handleToggle}
				disabled={toggling}
				className={`text-xs px-2 py-1 rounded-full font-medium transition whitespace-nowrap ${
					item.active !== false
						? "bg-green-900/60 text-green-300 hover:bg-green-900"
						: "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
				}`}
			>
				{toggling ? "..." : item.active !== false ? "Ativo" : "Inativo"}
			</button>

			{/* Ações */}
			<div className="flex items-center gap-1">
				<button className="p-1.5 rounded text-zinc-500 hover:text-orange-400 hover:bg-zinc-800 transition" onClick={() => onEdit(item)} title="Editar">✏️</button>
				<button className="p-1.5 rounded text-zinc-500 hover:text-blue-400 hover:bg-zinc-800 transition" onClick={() => onDuplicate(sectionKey, item)} title="Duplicar">📋</button>
				<button className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition disabled:opacity-30" onClick={handleDelete} disabled={deleting} title="Excluir">
					{deleting ? "…" : "🗑"}
				</button>
			</div>
		</div>
	);
}

// ─── ABA de uma seção ────────────────────────────────────────────────────────
function SectionTab({ sectionKey, items, onCreate, onUpdate, onDelete, onDuplicate, onToggle }) {
	const [search,    setSearch]    = useState("");
	const [filter,    setFilter]    = useState("all"); // all | active | inactive
	const [drawer,    setDrawer]    = useState(false);
	const [editing,   setEditing]   = useState(null);

	const filtered = useMemo(() => {
		let list = items;
		if (search.trim()) {
			const q = search.toLowerCase();
			list = list.filter(i => i.name?.toLowerCase().includes(q) || i.category?.toLowerCase().includes(q));
		}
		if (filter === "active")   list = list.filter(i => i.active !== false);
		if (filter === "inactive") list = list.filter(i => i.active === false);
		return list;
	}, [items, search, filter]);

	function openNew()       { setEditing(null); setDrawer(true);  }
	function openEdit(item)  { setEditing(item);  setDrawer(true);  }
	function closeDrawer()   { setDrawer(false);  setEditing(null); }

	async function handleDuplicate(key, item) {
		try {
			await onDuplicate(key, item);
			toast.success("Duplicado com sucesso!");
		} catch { toast.error("Erro ao duplicar."); }
	}

	return (
		<div className="flex flex-col gap-4">
			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
				<div className="flex flex-1 gap-2 w-full sm:w-auto">
					<input
						className="flex-1 max-w-xs rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500 transition"
						placeholder="Buscar por nome..."
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
					+ Novo
				</button>
			</div>

			{/* Contador */}
			<p className="text-xs text-zinc-500">
				{filtered.length} {filtered.length === 1 ? "item" : "itens"}
				{items.length !== filtered.length && ` de ${items.length}`}
			</p>

			{/* Lista */}
			{filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-700 bg-zinc-950 py-16 text-center">
					<span className="text-3xl">📦</span>
					<p className="text-sm text-zinc-400">
						{items.length === 0 ? "Nenhum item cadastrado ainda." : "Nenhum item corresponde ao filtro."}
					</p>
					{items.length === 0 && (
						<button className="mt-1 text-sm text-orange-400 hover:text-orange-300 transition" onClick={openNew}>
							+ Cadastrar primeiro item
						</button>
					)}
				</div>
			) : (
				<div className="flex flex-col gap-2">
					{filtered.map(item => (
						<ItemRow
							key={item._id}
							item={item}
							sectionKey={sectionKey}
							onEdit={openEdit}
							onDuplicate={handleDuplicate}
							onDelete={onDelete}
							onToggle={onToggle}
						/>
					))}
				</div>
			)}

			{/* Drawer */}
			<Drawer
				open={drawer}
				onClose={closeDrawer}
				sectionKey={sectionKey}
				item={editing}
				onCreate={onCreate}
				onUpdate={onUpdate}
			/>
		</div>
	);
}

// ─── PÁGINA principal ────────────────────────────────────────────────────────
const TAB_ORDER = ["products", "services", "plans"];

export default function Body() {
	const { catalog, loading, error, createItem, updateItem, deleteItem, duplicateItem, toggleActive } = useCatalog();
	const [activeTab, setActiveTab] = useState("products");

	if (error)   return <Error />;
	if (loading) return <Load />;

	return (
		<div className="flex flex-col h-full overflow-hidden">
			{/* Abas */}
			<div className="flex border-b border-zinc-800 shrink-0 px-4 md:px-6 pt-4">
				{TAB_ORDER.map(key => {
					const count = catalog[key]?.length || 0;
					const isActive = activeTab === key;
					return (
						<button
							key={key}
							onClick={() => setActiveTab(key)}
							className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
								isActive
									? "border-orange-500 text-orange-400"
									: "border-transparent text-zinc-500 hover:text-zinc-300"
							}`}
						>
							{SECTIONS[key].label}
							<span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-orange-500/20 text-orange-400" : "bg-zinc-800 text-zinc-500"}`}>
								{count}
							</span>
						</button>
					);
				})}
			</div>

			{/* Conteúdo */}
			<div className="flex-1 overflow-y-auto p-4 md:p-6">
				<SectionTab
					key={activeTab}
					sectionKey={activeTab}
					items={catalog[activeTab] || []}
					onCreate={createItem}
					onUpdate={updateItem}
					onDelete={deleteItem}
					onDuplicate={duplicateItem}
					onToggle={toggleActive}
				/>
			</div>
		</div>
	);
}
