import { useState } from "react";

import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ENVIA A NOVA MENSAGEM PARA O BACK END
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} input NOVA MENSAGEM
*/
export function handleSave(socket, input) {
	socket.emit("bot:update_message_not_supported", { message: input }, (res) => {
		if (res !== 204) return (toast.error("Erro ao salvar!"));
		toast.success("Salvo com sucesso!");
	});
}

/**
 * @author VAMPETA
 * @brief COMPONENTE PARA SALVAR MENSAGEM DE MENSAGEM NAO SUPORTADA
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} bot INFORMACOES DO BOT
*/
export default function MessageNotSupported({ socket, bot }) {
	const [input, setInput] = useState(bot.messageNotSupported || "");

	return (
		<div className="flex flex-col gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-5" id="message-not-supported">
			<div>
				<h2 className="text-lg font-semibold">Mensagem para mídia não suportada</h2>
				<p className="text-sm text-zinc-400">Resposta enviada quando o cliente envia áudio, vídeo ou outro formato não suportado.</p>
			</div>
			<textarea className="bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none resize-none min-h-[70px]" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ex: No momento não consigo processar esse tipo de mensagem. Pode enviar em texto?" />
			<p className="text-xs text-zinc-500">Dica: peça para o cliente enviar a mensagem em texto.</p>
			<button className="bg-orange-500 text-black rounded p-2 text-sm w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => handleSave(socket, input)}>
				Salvar
			</button>
		</div>
	);
}