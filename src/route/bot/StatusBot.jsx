import { useState } from "react";

import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief ATUALIZA O STATUS SE O BOT ESTA ATIVADO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} status VARIAVEL COM O ESTADO DO BOT LIDAGO OU DESLIGADO
 * @param {Object} setStatus FUNCAO DE CONTROLE DA VARIAVEL status
*/
function updateStatusBot(socket, status, setStatus) {
	socket.emit("bot:update_status_bot", { status: !status }, (res) => {
		if (res !== 204) return (toast.error(`Erro ao ${(!status) ? "ativar" : "desativar"} o bot!`));
		setStatus(!status);
		toast.success(`Bot ${(!status) ? "ativado" : "desativado"} com sucesso!`);
	});
}

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE MOSTRA SE O BOT ESTA ATIVADO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} bot INFORMACOES DO BOT
*/
export default function StatusBot({ socket, bot }) {
	const [status, setStatus] = useState(bot.activated);

	return (
		<div className="flex flex-col gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-5" id="status-bot">
			<div>
				<h2 className="text-lg font-semibold">Status do Bot</h2>
				<p className="text-sm text-zinc-400">Ative ou desative as respostas automáticas da IA no WhatsApp.</p>
			</div>
			<label className="flex items-center justify-between cursor-pointer">
				<span className="text-sm text-zinc-300">Visualização {(status) ? "ativada" : "desativada"}</span>
				<div className="relative">
					<input type="checkbox" className="sr-only peer" checked={status} onChange={() => updateStatusBot(socket, status, setStatus)} />
					<div className="w-10 h-5 bg-zinc-700 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
					<div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
				</div>
			</label>
		</div>
	);
}