import { Link } from "react-router-dom";

import { useLoadChats } from "./useLoadChats.js";
import { useScroll } from "./useScroll.js";
import { useChatsRealTime } from "./useChatsRealtime.jsx";

import { formatDate } from "../../utils/functions/formatDate.js";

import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE VERIFICA O TIPO DA MENSAGEM E RENDERIZA O ICONE CORRETO
 * @param {String} type TIPO DA MENSAGEM
*/
function TypeMessage({ type }) {
	switch (type) {
		case "sticker":
			return (<i className="bi bi-subtract mr-2 text-orange-500" />);
		case "audio":
			return (<i className="bi bi-mic-fill mr-2 text-orange-500" />);
		case "image":
			return (<i className="bi bi-image mr-2 text-orange-500" />);
		case "video":
			return (<i className="bi bi-film mr-2 text-orange-500" />);
		case "location":
			return (<i className="bi bi-geo-alt-fill mr-2 text-orange-500" />);
		case "contacts":
			return (<i className="bi bi-person-vcard mr-2 text-orange-500" />);
		case "document":
			return (<i className="bi bi-file-earmark-text mr-2 text-orange-500" />);
		case "interactive":
			return (<i className="bi bi-list-ul mr-2 text-orange-500" />);
		default:
			return (null);
	}
}

/**
 * @author VAMPETA
 * @brief PAGINA DE CONVERSAS
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Body({ socket }) {
	const { chats, setChats, error, loadMore, hasMore, loadingMore } = useLoadChats(socket);
	const { containerRef, handleScroll } = useScroll({ hasMore, loadingMore, loadMore });

	useChatsRealTime(socket, setChats);
	if (error) return (<Error />);
	if (chats === null) return (<Load />);
	if (chats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center flex-1 overflow-y-auto">
				<i className="bi bi-chat-right-text text-white text-5xl" />
				<p className="text-white">Nenhum histórico de conversa</p>
			</div>
		);
	}
	return (
		<div className="flex-1 overflow-y-auto px-1 animate-toastIn" ref={containerRef} onScroll={handleScroll}>
			{chats.map((chat) => (
				<Link className={`flex flex-col justify-center w-full h-20 my-3 px-6 ${(!chat.lastMessage.humanViewed) ? "bg-zinc-600" : "bg-zinc-900"} rounded border border-zinc-800 text-white hover:bg-orange-500 transition`} key={chat.phone} to={`/chat/${chat.phone}`}>
					<div className="flex justify-between">
						<p>{chat.phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}</p>
						{!chat.lastMessage.humanViewed && <i className="bi bi-chat-left-dots" />}
					</div>
					<div className="flex justify-between items-center">
						<p className="truncate flex-1">
							<TypeMessage type={chat.lastMessage.type} />
							{chat.lastMessage.text}
						</p>
						<span className="ml-2 shrink-0 text-xs text-gray-400">{formatDate(chat.lastMessage.timestamp)}</span>
					</div>
				</Link>
			))}
			{loadingMore && (
				<div className="flex items-center justify-center my-4">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
				</div>
			)}
		</div>
	);
}