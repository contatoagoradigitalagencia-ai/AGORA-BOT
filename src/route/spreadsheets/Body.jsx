import { useState } from "react";
import { useCatalog } from "./useGetSpreadsheet.js";
import Error from "../../screens/Error.jsx";
import Load from "../../screens/Load.jsx";

const SECTIONS = [
	{ key: "products", title: "Produtos",  icon: "bi-box-seam",  empty: "Nenhum produto cadastrado",  endpoint: "/products" },
	{ key: "services", title: "Serviços",  icon: "bi-tools",     empty: "Nenhum serviço cadastrado",   endpoint: "/services" },
	{ key: "plans",    title: "Planos",    icon: "bi-layers",    empty: "Nenhum plano cadastrado",     endpoint: "/plans"    },
];

function formatPrice(item) {
	if (typeof item.price !== "number") return "Preço não informado";
	return new Intl.NumberFormat("pt-BR", { style: "currency", currency: item.currency || "BRL" }).format(item.price);
}

function ItemModal({ section, item, onClose, onSave }) {
	const editing = Boolean(item?._id);
	const [form, setForm] = useState({
		name:        item?.name        || "",
		description: item?.description || "",
		price:       item?.price       ?? "",
		currency:    item?.currency    || "BRL",
		conditions:  item?.conditions  || "",
	});
	const [saving, setSaving] = useState(false);
	const [error, setError]   = useState("");

	async function handleSubmit() {
		if (!form.name.trim()) { setError("Nome obrigatório."); return; }
		setSaving(true);
		setError("");
		try {
			await onSave(form, item?._id);
			onClose();
		} catch (e) {
			setError(e?.message || "Erro ao salvar.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
			<div className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-900 p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
				<h3 className="text-lg font-semibold">{editing ? "Editar" : "Novo"} {section.title.slice(0,-1)}</h3>

				{[
					{ label: "Nome *",     key: "name",        type: "text"   },
					{ label: "Descrição",  key: "description", type: "text"   },
					{ label: "Preço (R$)", key: "price",       type: "number" },
					{ label: "Condições",  key: "conditions",  type: "text"   },
				].map(({ label, key, type }) => (
					<div key={key} className="flex flex-col gap-1">
						<label className="text-xs text-zinc-400">{label}</label>
						<input
							type={type}
							className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500"
							value={form[key]}
							onChange={e => setForm(prev => ({ ...prev, [key]: type === "number" ? parseFloat(e.target.value) || "" : e.target.value }))}
						/>
					</div>
				))}

				{error && <p className="text-sm text-red-400">{error}</p>}

				<div className="flex justify-end gap-2">
					<button className="px-4 py-2 rounded-lg border border-zinc-700 text-sm hover:bg-zinc-800 transition" onClick={onClose}>Cancelar</button>
					<button className="px-4 py-2 rounded-lg bg-orange-500 text-black text-sm font-medium hover:bg-orange-400 transition disabled:opacity-60" onClick={handleSubmit} disabled={saving}>
						{saving ? "Salvando..." : "Salvar"}
					</button>
				</div>
			</div>
		</div>
	);
}

function CatalogSection({ section, items, onAdd, onEdit, onDelete }) {
	return (
		<section className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-5">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<i className={`bi ${section.icon} text-xl text-orange-400`} />
					<div>
						<h2 className="text-lg font-semibold">{section.title}</h2>
						<p className="text-sm text-zinc-400">Fonte principal: MongoDB Atlas.</p>
					</div>
				</div>
				<button
					className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 text-black text-xs font-medium hover:bg-orange-400 transition"
					onClick={() => onAdd(section)}
				>
					+ Novo
				</button>
			</div>

			{items.length === 0 ? (
				<div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-400">
					{section.empty}
				</div>
			) : (
				<div className="grid gap-3">
					{items.map(item => (
						<div key={item._id || item.name} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
							<div className="flex items-start justify-between gap-2">
								<div className="flex-1">
									<h3 className="font-medium text-zinc-100">{item.name}</h3>
									{item.description && <p className="mt-1 text-sm text-zinc-400">{item.description}</p>}
									{item.conditions  && <p className="mt-1 text-xs text-zinc-500">{item.conditions}</p>}
								</div>
								<div className="flex items-center gap-2 shrink-0">
									<span className="text-sm font-semibold text-orange-400">{formatPrice(item)}</span>
									<button className="p-1 text-zinc-500 hover:text-orange-400 transition" onClick={() => onEdit(section, item)} title="Editar">✏️</button>
									<button className="p-1 text-zinc-500 hover:text-red-400 transition"    onClick={() => onDelete(section, item)} title="Excluir">🗑</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</section>
	);
}

export default function Body() {
	const { catalog, loading, error, createItem, updateItem, deleteItem } = useCatalog();
	const [modal, setModal] = useState(null); // { section, item|null }

	if (error)   return <Error />;
	if (loading) return <Load />;

	function openAdd(section)       { setModal({ section, item: null }); }
	function openEdit(section, item){ setModal({ section, item }); }
	function closeModal()           { setModal(null); }

	async function handleSave(form, itemId) {
		if (itemId) await updateItem(modal.section, itemId, form);
		else        await createItem(modal.section, form);
	}

	async function handleDelete(section, item) {
		if (!confirm(`Excluir "${item.name}"?`)) return;
		await deleteItem(section, item._id);
	}

	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			<div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
				<h2 className="text-lg font-semibold">Catálogo comercial</h2>
				<p className="mt-2 text-sm text-zinc-400">
					Produtos, serviços e planos cadastrados no MongoDB. Clique em <strong>+ Novo</strong> para adicionar.
				</p>
			</div>

			<div className="grid gap-6 xl:grid-cols-3">
				{SECTIONS.map(section => (
					<CatalogSection
						key={section.key}
						section={section}
						items={catalog[section.key] || []}
						onAdd={openAdd}
						onEdit={openEdit}
						onDelete={handleDelete}
					/>
				))}
			</div>

			{modal && (
				<ItemModal
					section={modal.section}
					item={modal.item}
					onClose={closeModal}
					onSave={handleSave}
				/>
			)}
		</div>
	);
}
