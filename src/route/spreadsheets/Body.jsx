import { useCatalog } from "./useGetSpreadsheet.js";

import Error from "../../screens/Error.jsx";
import Load from "../../screens/Load.jsx";

const SECTIONS = [
	{
		key: "products",
		title: "Produtos",
		icon: "bi-box-seam",
		empty: "Nenhum produto cadastrado",
	},
	{
		key: "services",
		title: "Servicos",
		icon: "bi-tools",
		empty: "Nenhum servico cadastrado",
	},
	{
		key: "plans",
		title: "Planos",
		icon: "bi-layers",
		empty: "Nenhum plano cadastrado",
	},
];

function formatPrice(item) {
	if (typeof item.price !== "number") return "Preco nao informado";
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: item.currency || "BRL",
	}).format(item.price);
}

function CatalogItem({ item }) {
	return (
		<div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
			<div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
				<div>
					<h3 className="font-medium text-zinc-100">{item.name}</h3>
					{item.description && <p className="mt-1 text-sm text-zinc-400">{item.description}</p>}
				</div>
				<span className="text-sm font-semibold text-orange-400">{formatPrice(item)}</span>
			</div>
			{item.conditions && <p className="mt-3 text-xs text-zinc-500">{item.conditions}</p>}
			{Array.isArray(item.tags) && item.tags.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-2">
					{item.tags.map((tag) => (
						<span key={tag} className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-400">{tag}</span>
					))}
				</div>
			)}
		</div>
	);
}

function CatalogSection({ section, items }) {
	return (
		<section className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-5">
			<div className="flex items-center gap-3">
				<i className={`bi ${section.icon} text-xl text-orange-400`} />
				<div>
					<h2 className="text-lg font-semibold">{section.title}</h2>
					<p className="text-sm text-zinc-400">Fonte principal: MongoDB Atlas.</p>
				</div>
			</div>
			{items.length === 0 ? (
				<div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-950 p-4 text-sm text-zinc-400">
					{section.empty}
				</div>
			) : (
				<div className="grid gap-3">
					{items.map((item) => <CatalogItem key={item._id || item.name} item={item} />)}
				</div>
			)}
		</section>
	);
}

/**
 * @author VAMPETA
 * @brief MODULO DE CATALOGO INTERNO
*/
export default function Body() {
	const { catalog, loading, error } = useCatalog();

	if (error) return (<Error />);
	if (loading) return (<Load />);
	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			<div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
				<h2 className="text-lg font-semibold">Catalogo comercial</h2>
				<p className="mt-2 text-sm text-zinc-400">
					Produtos, servicos, planos, precos e condicoes comerciais agora vêm do MongoDB. Google Sheets fica apenas como exportacao opcional.
				</p>
			</div>
			<div className="grid gap-6 xl:grid-cols-3">
				{SECTIONS.map((section) => (
					<CatalogSection key={section.key} section={section} items={catalog[section.key] || []} />
				))}
			</div>
		</div>
	);
}
