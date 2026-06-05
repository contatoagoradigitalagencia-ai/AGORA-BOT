import { useState, useRef } from "react";
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
import toast from "react-hot-toast";

// ── Text renderer ────────────────────────────────────────────────────────────
function TextBody({ body }) {
	if (!body) return null;
	return (
		<p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
			{body.split(/(\*[^*]+\*)/g).map((part, i) =>
				part.startsWith("*") && part.endsWith("*")
					? <strong key={i}>{part.slice(1, -1)}</strong>
					: part
			)}
		</p>
	);
}

// ── Reply preview block ──────────────────────────────────────────────────────
function ReplyPreview({ preview }) {
	if (!preview) return null;
	const sender = preview.senderName || (preview.direction === "inbound" ? "Cliente" : "Bot");
	return (
		<div className="mb-1 rounded-lg border-l-2 border-orange-400 bg-black/20 px-2 py-1 cursor-pointer">
			<p className="text-xs font-semibold text-orange-300 truncate">{sender}</p>
			<p className="text-xs text-zinc-400 truncate">{preview.text || "[mídia]"}</p>
		</div>
	);
}

// ── Message type router ──────────────────────────────────────────────────────
function MessageContent({ message }) {
	const type = message.data?.type;
	const data = message.data || {};
	const fallbackText = data.text?.body ?? message.text ?? "";

	if (type === "audio")       return <Audio    message={message} />;
	if (type === "image")       return <Image    message={message} />;
	if (type === "video")       return <Video    message={message} />;
	if (type === "location")    return <Location message={message} />;
	if (type === "contacts")    return <Contacts message={message} />;
	if (type === "document")    return <Document message={message} />;
	if (type === "interactive") return <Interactive message={message} />;
	if (fallbackText) return <TextBody body={fallbackText} />;
	if (type && type !== "text") return <p className="text-xs text-zinc-400 italic">[{type}]</p>;
	return null;
}

// ── Context menu ─────────────────────────────────────────────────────────────
function ContextMenu({ message, onReply, onClose }) {
	const text = message.data?.text?.body || message.text || "";

	function copy() {
		navigator.clipboard.writeText(text).then(() => toast.success("Copiado!"));
		onClose();
	}

	return (
		<div className="absolute z-50 right-0 top-full mt-1 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden text-sm min-w-[140px]">
			<button className="w-full px-4 py-2.5 text-left hover:bg-zinc-700 transition flex items-center gap-2" onClick={() => { onReply(); onClose(); }}>
				↩ Responder
			</button>
			{text && (
				<button className="w-full px-4 py-2.5 text-left hover:bg-zinc-700 transition flex items-center gap-2" onClick={copy}>
					📋 Copiar
				</button>
			)}
		</div>
	);
}

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message, onReply }) {
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef(null);
	const isOut = message.direction === "outbound";

	const bubbleColor = isOut
		? (message.aiGenerated ? "bg-zinc-700" : "bg-orange-600")
		: "bg-zinc-800";

	const senderLabel = isOut
		? (message.aiGenerated ? "IA" : (message.sentByAttendantName || null))
		: null;

	return (
		<div className={`flex ${isOut ? "justify-end" : "justify-start"} px-4 py-0.5 group`}>
			<div className="relative max-w-[70%]">
				{/* Context menu trigger */}
				<button
					className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition z-10 bg-zinc-700 hover:bg-zinc-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
					onClick={() => setShowMenu(v => !v)}
				>
					⌄
				</button>

				{showMenu && (
					<>
						<div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
						<div ref={menuRef} className={`absolute z-50 top-4 ${isOut ? "right-0" : "left-0"}`}>
							<ContextMenu message={message} onReply={() => onReply(message)} onClose={() => setShowMenu(false)} />
						</div>
					</>
				)}

				<div className={`${bubbleColor} px-3 py-2 rounded-2xl break-words`}>
					{senderLabel && <p className="text-xs text-zinc-400 mb-0.5">{senderLabel} respondeu</p>}
					{message.replyToPreview && <ReplyPreview preview={message.replyToPreview} />}
					{message.context && <Context message={message} />}
					<MessageContent message={message} />
					<FooterMessage message={message} />
				</div>
			</div>
		</div>
	);
}

// ── Reply bar ────────────────────────────────────────────────────────────────
export function ReplyBar({ replyTo, onCancel }) {
	if (!replyTo) return null;
	const text = replyTo.data?.text?.body || replyTo.text || "[mídia]";
	const sender = replyTo.direction === "inbound" ? "Cliente" : (replyTo.aiGenerated ? "IA" : "Atendente");
	return (
		<div className="flex items-center gap-3 bg-zinc-800 border-t border-zinc-700 px-4 py-2">
			<div className="flex-1 border-l-2 border-orange-400 pl-2">
				<p className="text-xs font-semibold text-orange-300">{sender}</p>
				<p className="text-xs text-zinc-400 truncate">{text}</p>
			</div>
			<button className="text-zinc-500 hover:text-zinc-200 text-lg" onClick={onCancel}>✕</button>
		</div>
	);
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Messages({ socket, replyTo, setReplyTo }) {
	const { phone } = useParams();
	const isGroup = phone?.includes("-group") || phone?.includes("@g.us");
	const { messages, setMessages, error, loadMore, hasMore, loadingMore } = useLoadMessages(socket, phone);
	const { containerRef, bottomRef, handleScroll } = useScroll({ messages, hasMore, loadingMore, loadMore });
	useChatRealtime(socket, phone, setMessages);

	if (error) return <Error />;
	if (messages === null) return <Load />;

	if (messages.length === 0) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-500">
				<i className={`bi ${isGroup ? "bi-people" : "bi-chat-right-text"} text-4xl`} />
				<p className="text-sm">{isGroup ? "Grupo — nenhuma mensagem salva" : "Nenhuma mensagem ainda"}</p>
				<p className="text-xs text-zinc-600">As mensagens aparecerão aqui em tempo real.</p>
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
					onReply={setReplyTo}
				/>
			))}
			<div ref={bottomRef} />
		</div>
	);
}
