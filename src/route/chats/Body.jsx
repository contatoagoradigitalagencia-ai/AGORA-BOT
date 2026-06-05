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
	const { chats, setChats, error, loadMore, hasMore, loadingMore } = useLoadChats();
	const { containerRef, handleScroll } = useScroll({ hasMore, loadingMore, loadMore });

	useChatsRealTime(socket, setChats);
	if (error) return (<Error />);
	if (chats === null) return (<Load />);
	if (chats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center flex-1 overflow-y-auto">
				<i className="bi bi-chat-right-text text-white text-5xl" />
				<p className="text-white">Nenhuma conversa encontrada</p>
			</div>
		);
	}
	return (
		<div className="flex-1 overflow-y-auto px-1 animate-toastIn" ref={containerRef} onScroll={handleScroll}>
			{chats.map((chat) => {
				const phone = chat.phone || '';
				const isGroup = chat.isGroup || phone.includes('-group');
				const displayName = chat.contactName
					|| (isGroup ? 'Grupo' : phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3'));
				const displayPhone = !isGroup && chat.contactName
					? phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
					: null;
				return (
				<Link className={`flex items-center gap-3 w-full py-3 px-4 my-1 ${(!chat.lastMessage.humanViewed) ? "bg-zinc-800" : "bg-zinc-900"} rounded-xl border border-zinc-800 text-white hover:border-orange-500 transition`} key={chat.phone} to={`/chat/${chat.phone}`}>
					{/* Avatar */}
					<div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
						<i className={`bi ${isGroup ? 'bi-people-fill' : 'bi-person-fill'} text-zinc-400`} />
					</div>
					{/* Info */}
					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-center">
							<p className="font-medium truncate">{displayName}</p>
							<span className="ml-2 shrink-0 text-xs text-zinc-500">{formatDate(chat.lastMessage.timestamp)}</span>
						</div>
						{displayPhone && <p className="text-xs text-zinc-500">{displayPhone}</p>}
						<p className="truncate text-xs text-zinc-400">
							<TypeMessage type={chat.lastMessage.type} />
							{chat.lastMessage.text}
						</p>
					</div>
					{!chat.lastMessage.humanViewed && <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />}
				</Link>
				);
			})}
			{loadingMore && (
				<div className="flex items-center justify-center my-4">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
				</div>
			)}
		</div>
	);
}
