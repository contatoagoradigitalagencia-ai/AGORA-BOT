import { useReplyWindow } from "./useReplyWindow.js";
import ChatComposer from "./chatComposer/ChatComposer.jsx";

function MetaWindowExpired() {
	return (
		<div className="flex flex-col items-center gap-2 px-4 py-3 border-t border-zinc-800 bg-zinc-950 shrink-0">
			<div className="flex items-center gap-2 text-yellow-400 text-xs">
				<i className="bi bi-clock-history" />
				<span>Fora da janela de 24h da Meta. Use um template aprovado para iniciar nova conversa.</span>
			</div>
			<button
				className="px-4 py-1.5 rounded-lg border border-yellow-500/30 text-yellow-400 text-xs hover:bg-yellow-500/10 transition"
				onClick={() => window.open("https://business.facebook.com/wa/manage/message-templates/", "_blank")}
			>
				Gerenciar templates Meta →
			</button>
		</div>
	);
}

export default function Footer({ socket, replyTo, setReplyTo }) {
	const { replyWindow, windowState } = useReplyWindow(socket);
	const isMetaExpired = windowState?.provider === "meta" && !replyWindow;

	if (isMetaExpired) return <MetaWindowExpired />;

	return <ChatComposer socket={socket} replyTo={replyTo} setReplyTo={setReplyTo} />;
}
