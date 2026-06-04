/**
 * @author VAMPETA
 * @brief CARD DE STATUS
 * @param {Object} support INFORMACOES DA PAGINA
*/
export default function Status({ support }) {
	// return (
	// 	<div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
	// 		<div className="flex items-center gap-3">
	// 			<div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
	// 				<i className="bi bi-headset text-2xl text-orange-500" />
	// 			</div>
	// 			<div>
	// 				<h1 className="text-2xl font-bold">Central de Suporte</h1>
	// 				<p className="text-sm text-zinc-400">Encontre respostas rápidas, documentação e canais de atendimento.</p>
	// 			</div>
	// 		</div>
	// 		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
	// 			<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
	// 				<p className="text-zinc-400 text-sm">Tempo médio de resposta</p>
	// 				<h2 className="text-2xl font-bold text-orange-500 mt-2">~5 min</h2>
	// 			</div>
	// 			<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
	// 				<p className="text-zinc-400 text-sm">Atendimento</p>
	// 				<h2 className="text-2xl font-bold text-orange-500 mt-2">24/7</h2>
	// 			</div>
	// 			<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
	// 				<p className="text-zinc-400 text-sm">Status do sistema</p>
	// 				<div className="flex items-center gap-2 mt-3">
	// 					<div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
	// 					<span className="font-medium text-green-400">Operacional</span>
	// 				</div>
	// 			</div>
	// 		</div>
	// 	</div>
	// );
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-orange-500/40 transition-all duration-300">
				<div className="flex items-center justify-between">
					<p className="text-zinc-400 text-sm">Contatos</p>
					<i className="bi bi-telephone text-orange-500 text-lg" />
				</div>
				<h2 className="text-xl text-orange-500 mt-2">{support.countContact}</h2>
				<p className="text-xs text-zinc-500 mt-2">Usuários que já interagiram com os bots</p>
			</div>
			<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-orange-500/40 transition-all duration-300">
				<div className="flex items-center justify-between">
					<p className="text-zinc-400 text-sm">Base de conhecimento</p>
					<i className="bi bi-file-earmark-spreadsheet text-orange-500 text-lg" />
				</div>
				<h2 className="text-xl text-orange-500 mt-2">{support.countSpreadsheet} Planilhas</h2>
				<p className="text-xs text-zinc-500 mt-2">Base de dados sincronizada</p>
			</div>
			<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-orange-500/40 transition-all duration-300">
				<div className="flex items-center justify-between">
					<p className="text-zinc-400 text-sm">Status da IA</p>
					<i className="bi bi-cpu text-orange-500 text-lg" />
				</div>
				<div className="flex items-center gap-3 mt-3">
					{(support.system) ? (
						<div className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
							<span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500" />
						</div>
					) : (
						<i className="bi bi-terminal-x text-orange-500" />
					)}
					<span className="text-xl text-orange-500">{(support.system) ? "Operacional" : "Offline"}</span>
				</div>
				<p className="text-xs text-zinc-500 mt-3">Todos os sistemas funcionando normalmente</p>
			</div>
		</div>
	);
}

// 