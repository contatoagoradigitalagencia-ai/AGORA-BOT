import { useState } from "react";

import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief ATUALIZA O STATUS SE O BOT VISUALIZA A MENSAGEM OU NAO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} visualization VARIAVEL COM O ESTADO DE VISUALIZACAO DO BOT
 * @param {Object} setVisualization FUNCAO DE CONTROLE DA VARIAVEL visualization
*/
function updateVisualization(socket, visualization, setVisualization) {
	socket.emit("bot:update_status_visualization", { visualization: !visualization }, (res) => {
		if (res !== 204) return (toast.error(`Erro ao ${(!visualization) ? "ativar" : "desativar"} a visualização do bot!`));
		setVisualization(!visualization);
		toast.success(`Visualização ${(!visualization) ? "ativada" : "desativada"} com sucesso!`);
	});
}

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE MOSTRA SE O BOT ESTA ATIVADO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} bot INFORMACOES DO BOT
*/
export default function Visualization({ socket, bot }) {
	const [visualization, setVisualization] = useState(bot.visualization);

	return (
		<div className="flex flex-col gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-5" id="visualization">
			<div>
				<h2 className="text-lg font-semibold">Visualização de Mensagens</h2>
				<p className="text-sm text-zinc-400">Ative ou desative a visualização das mensagens no WhatsApp.</p>
			</div>
			<label className="flex items-center justify-between cursor-pointer">
				<span className="text-sm text-zinc-300">Visualização {(visualization) ? "ativada" : "desativada"}</span>
				<div className="relative">
					<input type="checkbox" className="sr-only peer" checked={visualization} onChange={() => updateVisualization(socket, visualization, setVisualization)} />
					<div className="w-10 h-5 bg-zinc-700 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
					<div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
				</div>
			</label>
		</div>
	);
}