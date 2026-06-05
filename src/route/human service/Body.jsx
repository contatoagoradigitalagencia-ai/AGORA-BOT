import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useLoadMessagesWaiting } from "./useLoadMessagesWaiting.js";
import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import { formatDate } from "../../utils/functions/formatDate.js";
import { apiPost } from "../../api/client.js";

function QueueCard({ chat, onAssume, onClose }) {
	const [assuming, setAssuming] = useState(false);
	const [closing,  setClosing]  = useState(false);

	async function handleAssume() {
		setAssuming(true);
		try { await onAssume(chat); toast.success("Conversa assumida!"); }
		catch { toast.error("Erro ao assumir conversa."); }
		finally { setAssuming(false); }
	}

	async function handleClose(resumeBot) {
		setClosing(true);
		try { await onClose(chat, resumeBot); toast.success("Atendimento encerrado!"); }
		catch { toast.error("Erro ao encerrar."); }
		finally { setClosing(false); }
	}

	const name = chat.name && chat.name !== "Sem nome"
		? chat.name
		: chat.phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
			<div className="flex flex-col gap-1 flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<span className="font-medium text-zinc-100 truncate">{name}</span>
					{chat.assignedToName && (
						<span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full shrink-0">
							{chat.assignedToName}
						</span>
					)}
					{!chat.assignedToName && (
						<span className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full shrink-0">
							Sem responsável
						</span>
					)}
				</div>
				{chat.lastMessage && (
					<p className="text-xs text-zinc-500 truncate">{chat.lastMessage}</p>
				)}
				<span className="text-xs text-zinc-600">{formatDate(chat.timestamp)}</span>
			</div>
			<div className="flex gap-2 shrink-0">
				<Link
					to={`/chat/${chat.phone}`}
					className="px-3 py-1.5 text-xs rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
				>
					Ver chat
				</Link>
				<button
					className="px-3 py-1.5 text-xs rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-400 transition disabled:opacity-50"
					onClick={handleAssume}
					disabled={assuming || closing}
				>
					{assuming ? "..." : "Assumir"}
				</button>
				<button
					className="px-3 py-1.5 text-xs rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
					onClick={() => handleClose(true)}
					disabled={closing || assuming}
				>
					{closing ? "..." : "Encerrar"}
				</button>
			</div>
		</div>
	);
}

// precisa de useState no escopo do componente
import { useState } from "react";

export default function Body() {
	const { chats, setChats, error, refetch } = useLoadMessagesWaiting();

	if (error)         return <Error />;
	if (chats === null) return <Load />;

	async function handleAssume(chat) {
		await apiPost(`/conversations/${chat.conversationId}/assign`, {
			userId:   "me",
			userName: "Atendente",
		});
		await refetch();
	}

	async function handleClose(chat, resumeBot) {
		await apiPost(`/conversations/${chat.conversationId}/close-human`, { resumeBot });
		setChats(prev => prev.filter(c => c.conversationId !== chat.conversationId));
	}

	if (chats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center flex-1 gap-3 text-zinc-500">
				<i className="bi bi-check-circle text-4xl text-green-500" />
				<p className="text-sm">Nenhum atendimento em aberto</p>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-3 animate-toastIn">
			<p className="text-xs text-zinc-500">{chats.length} {chats.length === 1 ? "conversa" : "conversas"} em espera</p>
			{chats.map(chat => (
				<QueueCard
					key={chat.id}
					chat={chat}
					onAssume={handleAssume}
					onClose={handleClose}
				/>
			))}
		</div>
	);
}
