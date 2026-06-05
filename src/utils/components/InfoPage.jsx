import { useState } from "react";
import { SideBar, Header } from "./Sidebar.jsx";

/**
 * Componente reutilizável para páginas informativas.
 * Sem dependência de socket. Sem loading infinito.
 */
export function InfoSection({ title, icon, children }) {
	return (
		<section className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
			<div className="flex items-center gap-2">
				{icon && <span className="text-xl">{icon}</span>}
				<h2 className="text-base font-semibold text-zinc-100">{title}</h2>
			</div>
			<div className="text-sm text-zinc-400 leading-relaxed flex flex-col gap-2">
				{children}
			</div>
		</section>
	);
}

export function InfoCard({ icon, title, children }) {
	return (
		<div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 flex gap-3">
			{icon && <span className="text-2xl shrink-0 mt-0.5">{icon}</span>}
			<div>
				{title && <p className="text-sm font-semibold text-zinc-200 mb-1">{title}</p>}
				<p className="text-sm text-zinc-400 leading-relaxed">{children}</p>
			</div>
		</div>
	);
}

export function InfoPage({ title, children }) {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex h-dvh bg-black text-white">
			<SideBar open={open} setOpen={setOpen} />
			<main className="flex flex-1 flex-col overflow-hidden">
				<Header setOpen={setOpen} title={title} />
				<div className="flex-1 overflow-y-auto p-4 md:p-6">
					<div className="max-w-3xl mx-auto flex flex-col gap-5">
						{children}
					</div>
				</div>
			</main>
		</div>
	);
}
