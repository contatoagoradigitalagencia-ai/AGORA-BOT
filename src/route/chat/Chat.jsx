import { useState } from "react";
import { useSocket } from "../../socket/useSocket.js";
import ErrorBoundary from "../../utils/components/ErrorBoundary.jsx";
import Load  from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import Header  from "./header/Header.jsx";
import Messages, { ReplyBar } from "./messages/Messages.jsx";
import Footer  from "./footer/Footer.jsx";

function ChatInner() {
	const { socket, connected, error } = useSocket();
	const [replyTo, setReplyTo]           = useState(null);
	const [conversationId, setConversationId] = useState(null);

	if (!socket) return <Load />;
	return (
		<div className="flex flex-col h-dvh bg-zinc-950 overflow-hidden">
			<Header socket={socket} onConversationId={setConversationId} />
			{!connected && !error && <Load />}
			{connected && (
				<Messages socket={socket} replyTo={replyTo} setReplyTo={setReplyTo} onConversationId={setConversationId} />
			)}
			{error && <Error />}
			{replyTo && <ReplyBar replyTo={replyTo} onCancel={() => setReplyTo(null)} />}
			<Footer socket={socket} replyTo={replyTo} setReplyTo={setReplyTo} conversationId={conversationId} />
		</div>
	);
}

export default function Chat() {
	return <ErrorBoundary><ChatInner /></ErrorBoundary>;
}
