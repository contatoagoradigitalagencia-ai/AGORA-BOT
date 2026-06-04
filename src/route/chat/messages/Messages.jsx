import { useParams } from "react-router-dom";

import { useLoadMessages } from "./useLoadMessages.js";
import { useScroll } from "./useScroll.js";
import { useChatRealtime } from "./useChatRealtime.js";

import Load from "../../../screens/Load.jsx";
import Error from "../../../screens/Error.jsx";

import FooterMessage from "./FooterMessage.jsx";
import Context from "./context/Context.jsx";
import Text from "./Text.jsx";
import Sticker from "./Sticker.jsx";
import Audio from "./Audio.jsx";
import Image from "./Image.jsx";
import Video from "./Video.jsx";
import Location from "./Location.jsx";
import Contacts from "./Contacts.jsx";
import Reaction from "./Reaction.jsx";
import Document from "./Document.jsx";
import Interactive from "./interactive/Interactive.jsx";

/**
 * @author VAMPETA
 * @brief IDENTIFICA O TIPO CERTO DA MENSAGEM
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
function Message({ message }) {
	switch (message.data?.type) {
		case "text":
			return (<Text message={message} />);
		case "sticker":
			return (<Sticker message={message} />);
		case "audio":
			return (<Audio message={message} />);
		case "image":
			return (<Image message={message} />);
		case "video":
			return (<Video message={message} />);
		case "location":
			return (<Location message={message} />);
		case "contacts":
			return (<Contacts message={message} />);
		case "document":
			return (<Document message={message} />);
		case "interactive":
			return (<Interactive message={message} />);
		default:
			return (<p className="text-red-900"><i>Mensagem do tipo <b>{(message.data?.type) ? message.data?.type : "desconhecida"}</b> não suportada</i></p>);
	}
}

/**
 * @author VAMPETA
 * @brief MENSAGENS DO CHAT
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Messages({ socket }) {
	const { phone } = useParams();
	const { messages, setMessages, error, loadMore, hasMore, loadingMore } = useLoadMessages(socket, phone);
	const { containerRef, bottomRef, handleScroll } = useScroll({ messages, hasMore, loadingMore, loadMore });
	useChatRealtime(socket, phone, setMessages);

	if (error) return (<Error />);
	if (messages === null) return (<Load />);
	if (messages.length === 0) {
		return (
			<div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
				<i className="bi bi-chat-right-text text-white text-5xl" />
				<p className="text-white">Nenhuma mensagem</p>
			</div>
		);
	}
	return (
		<div className="flex-1 overflow-y-auto" ref={containerRef} onScroll={handleScroll}>
			{loadingMore && (
				<div className="flex items-center justify-center mt-2">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
				</div>
			)}
			{messages.map((message) => (
				<div key={message.wamid} id={message.wamid} className={`flex ${message.direction === "outbound" ? "justify-end" : "justify-start"}`} >
					<div className="inline-block relative bg-gray-400 m-4 px-3 py-2 rounded max-w-[80%] break-words whitespace-pre-wrap">
						{message.context && <Context message={message} />}
						<>
							<Message message={message} />
							<FooterMessage message={message} />
						</>
						{message.react && <Reaction reaction={message.react} />}
					</div>
				</div>
			))}
			<div ref={bottomRef} />
		</div>
	);
}