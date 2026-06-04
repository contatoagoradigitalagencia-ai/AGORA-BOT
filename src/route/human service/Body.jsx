import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useLoadMessagesWaiting } from "./useLoadMessagesWaiting.js";

import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";

import { formatDate } from "../../utils/functions/formatDate.js";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CONSULTA OU MODIFICA SE O BOT ESTA ATIVO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} phone NUMERO DO CONTATO QUE FOI ATENDIDO
 * @param {Funciton} setChats FUNCAO MODIFICADORA DA LISTA DE CONTATOS
*/
function removeWaitingService(socket, phone, setChats) {
	if (!socket) return ;
	socket.emit("human-service:remove_waiting_service", { phone: phone }, (res) => {
		if (res !== 204) return (toast.error("Erro ao remover contato da lista de espera para atendimento!"));
		setChats((prev) => prev.filter((chat) => (chat.phone !== phone)));
		toast.success("Contato removido da lista de espera de atendimento!");
	});
}

/**
 * @author VAMPETA
 * @brief PAGINA DE MENSAGENS RAPIDAS
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Body({ socket }) {
	const { chats, setChats, error } = useLoadMessagesWaiting(socket);

	if (error) return (<Error />);
	if (chats === null) return (<Load />);
	if (chats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center flex-1 overflow-y-auto">
				<i className="bi bi-chat-right-text text-white text-5xl" />
				<p className="text-white">Sem espera por atendimento humano</p>
			</div>
		);
	}
	return (
		<div className="flex-1 overflow-y-auto px-1 animate-toastIn">
			{chats.map((chat) => (
				<div className="flex justify-between items-center w-full h-20 my-3 bg-zinc-900 rounded border border-zinc-800 text-white transition" key={chat.phone}>
					<Link className="flex flex-col justify-center w-[60%] md:w-[80%] h-full px-6 gap-2 hover:bg-orange-500" to={`/chat/${chat.phone}`}>
						<p>{chat.phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}</p>
						<span className="text-xs text-gray-400">{formatDate(chat.timestamp)}</span>
					</Link>
					<div className="flex flex-col justify-center items-center w-[40%] md:w-[20%] h-full px-6">
						<button className="w-full md:w-auto text-center px-0 md:px-6 py-2 bg-orange-500 text-black rounded-lg font-medium hover:bg-orange-400 transition cursor-pointer" onClick={() => removeWaitingService(socket, chat.phone, setChats)}>
							Encerrar
						</button>
					</div>
				</div>
			))}
		</div>
	);
}