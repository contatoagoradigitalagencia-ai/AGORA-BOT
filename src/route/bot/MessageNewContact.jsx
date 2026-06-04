import { useState } from "react";

import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ENVIA A NOVA MENSAGEM PARA O BACK END
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} input NOVA MENSAGEM
*/
export function handleSave(socket, input) {
	socket.emit("bot:update_message_new_contact", { message: input }, (res) => {
		if (res !== 204) return (toast.error("Erro ao salvar!"));
		toast.success("Salvo com sucesso!");
	});
}

/**
 * @author VAMPETA
 * @brief COMPONENTE PARA SALVAR MENSAGEM DE NOVO CONTATO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} bot INFORMACOES DO BOT
*/
export default function MessageNewContact({ socket, bot }) {
	const [input, setInput] = useState(bot.messageNewContact || "");

	return (
		<div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-5" id="message-new-contact">
			<div>
				<h2 className="text-lg font-semibold">Mensagem de boas-vindas</h2>
				<p className="text-sm text-zinc-400">Mensagem enviada automaticamente quando o cliente entra em contato pela primeira vez.</p>
			</div>
			<textarea className="bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none resize-none min-h-[90px]" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ex: Olá! Seja bem-vindo 😊 Como posso te ajudar hoje?" />
			<p className="text-xs text-zinc-500">Dica: seja amigável e convide o cliente a continuar a conversa.</p>
			<button className="bg-orange-500 text-black rounded p-2 text-sm w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => handleSave(socket, input)}>
				Salvar
			</button>
		</div>
	);
}