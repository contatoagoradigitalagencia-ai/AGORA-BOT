import { Component } from "react";

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, info) {
		console.error("[ErrorBoundary]", error, info);
	}

	render() {
		if (!this.state.hasError) return this.props.children;
		return (
			<div className="flex flex-col items-center justify-center flex-1 h-dvh bg-black text-white gap-4 p-6">
				<i className="bi bi-exclamation-triangle text-5xl text-orange-500" />
				<p className="text-lg font-semibold">Algo deu errado ao carregar esta tela</p>
				<p className="text-sm text-zinc-400 text-center max-w-sm">
					{this.state.error?.message || "Erro desconhecido"}
				</p>
				<div className="flex gap-3 mt-2">
					<button
						className="px-4 py-2 rounded-lg bg-orange-500 text-black text-sm font-medium hover:bg-orange-400 transition"
						onClick={() => window.location.reload()}
					>
						Recarregar
					</button>
					<a
						className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 text-sm hover:bg-zinc-800 transition"
						href="/dashboard"
					>
						Voltar ao Dashboard
					</a>
				</div>
			</div>
		);
	}
}
