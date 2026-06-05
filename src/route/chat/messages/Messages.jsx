import { useParams } from "react-router-dom";
import { useLoadMessages } from "./useLoadMessages.js";
import { useScroll } from "./useScroll.js";
import { useChatRealtime } from "./useChatRealtime.js";
import Load  from "../../../screens/Load.jsx";
import Error from "../../../screens/Error.jsx";
import FooterMessage from "./FooterMessage.jsx";
import Context from "./context/Context.jsx";
import Audio from "./Audio.jsx";
import Image from "./Image.jsx";
import Video from "./Video.jsx";
import Location from "./Location.jsx";
import Contacts from "./Contacts.jsx";
import Document from "./Document.jsx";
import Interactive from "./interactive/Interactive.jsx";

// ── Renderizador de texto inline ──────────────────────────────────────────────
function TextBody({ body }) {
	if (!body) return null;
	// Negrito **texto** e quebra de linha
	const parts = body.split(/(\*[^*]+\*|\n)/g);
	return (
		<p className="whitespace-pre-wrap break-words">
			{parts.map((part, i) => {
				if (part.startsWith("*") && part.endsWith("*"))
					return <strong key={i}>{part.slice(1, -1)}</strong>;
				if (part === "\n") return <br key={i} />;
				return part;
			})}
		</p>
	);
}

// ── Reply preview ─────────────────────────────────────────────────────────────
function ReplyPreview({ preview }) {
	if (!preview) return null;
	return (
		<div className="mb-1 rounded border-l-2 border-orange-400 bg-black/20 px-2 py-1">
			<p className="text-xs font-semibold text-orange-300 truncate">
				{preview.senderName || (preview.direction === "inbound" ? "Cliente" : "Bot")}
			</p>
			<p className="text-xs text-zinc-400 truncate">{preview.text || "[mídia]"}</p>
		</div>
	);
}

// ── Roteador de tipo de mensagem ──────────────────────────────────────────────
function MessageContent({ message }) {
	const type = message.data?.type;
	const data = message.data || {};

	if (type === "text" || !type) {
		const body = data.text?.body ?? message.text ?? "";
		return <TextBody body={body} />;
	}
	if (type === "audio")       return <Audio    message={message} />;
	if (type === "image")       return <Image    message={message} />;
	if (type === "video")       return <Video    message={message} />;
	if (type === "location")    return <Location message={message} />;
	if (type === "contacts")    return <Contacts message={message} />;
	if (type === "document")    return <Document message={message} />;
	if (type === "interactive") return <Interactive message={message} />;
	// Fallback — mostra texto se existir
	const fallback = data.text?.body ?? message.text ?? "";
	if (fallback) return <TextBody body={fallback} />;
	return <p className="text-xs text-zinc-500 italic">[{type}]</p>;
}

// ── Balão de mensagem ─────────────────────────────────────────────────────────
function MessageBubble({ message }) {
	const isOut = message.direction === "outbound";

	const bubbleColor = isOut
		? (message.aiGenerated ? "bg-zinc-700" : "bg-orange-600")
		: "bg-zinc-800";

	const label = isOut
		? (message.aiGenerated ? "IA" : (message.sentByAttendantName || "Atendente"))
		: null;

	return (
		<div className={`flex ${isOut ? "justify-end" : "justify-start"} px-3 py-0.5`}>
			<div className={`relative ${bubbleColor} px-3 py-2 rounded-xl max-w-[75%] break-words`}>
				{/* Label do remetente */}
				{label && (
					<p className="text-xs text-zinc-400 mb-0.5">{label} respondeu</p>
				)}
				{/* Reply preview */}
				{message.replyToPreview && <ReplyPreview preview={message.replyToPreview} />}
				{/* Conteúdo */}
				{message.context && <Context message={message} />}
				<MessageContent message={message} />
				<FooterMessage message={message} />
			</div>
		</div>
	);
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Messages({ socket }) {
	const { phone } = useParams();
	const isGroup = phone?.includes('-group') || phone?.includes('@g.us');
	const { messages, setMessages, error, loadMore, hasMore, loadingMore } = useLoadMessages(socket, phone);
	const { containerRef, bottomRef, handleScroll } = useScroll({ messages, hasMore, loadingMore, loadMore });
	useChatRealtime(socket, phone, setMessages);

	if (error) return <Error />;
	if (messages === null) return <Load />;

	if (messages.length === 0) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-500">
				<i className={`bi ${isGroup ? 'bi-people' : 'bi-chat-right-text'} text-4xl`} />
				<p className="text-sm">{isGroup ? 'Grupo — nenhuma mensagem salva ainda' : 'Nenhuma mensagem ainda'}</p>
				<p className="text-xs text-zinc-600">{isGroup ? 'Mensagens de grupo aparecem apenas quando alguém enviar.' : 'As mensagens aparecerão aqui quando o contato enviar uma.'}</p>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto py-2" ref={containerRef} onScroll={handleScroll}>
			{loadingMore && (
				<div className="flex justify-center py-2">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
				</div>
			)}
			{messages.map((message) => (
				<MessageBubble
					key={message.wamid || message._id || message.id}
					message={message}
				/>
			))}
			<div ref={bottomRef} />
		</div>
	);
}
