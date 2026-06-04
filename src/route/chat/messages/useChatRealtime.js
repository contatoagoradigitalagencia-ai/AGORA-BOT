import { useEffect } from "react";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CONTROLA O COMPORTAMENTO DE QUANDO CHEGA NOVA MENSAGEM
 * @param {Object} setMessages DEFINE O VALOR DE messages
 * @param {String} phone NUMERO DO CLIENTE QUE ESTA CONVERSANDO COM O BOT
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
function handleNewMessage(setMessages, phone, socket) {
	return ((newMessage) => {
		if (newMessage.phone !== phone) return ;
		setMessages((prev) => ((prev) ? [...prev, newMessage] : [newMessage]));
		socket.emit("chats:update_human_viewed", { phone: newMessage.phone }, (res) => {});
	});
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CONTROLA O COMPORTAMENTO DE QUANDO CHEGA NOVA VISUALIZACAO DE MENSAGEM
 * @param {Object} setMessages DEFINE O VALOR DE messages
 * @param {String} from NUMERO DO CLIENTE QUE ESTA CONVERSANDO COM O BOT
*/
function handleUpdateView(setMessages, from) {
	return (({ phone, wamid, status }) => {
		if (phone !== from) return ;
		setMessages((prev) => {
			if (!prev) return (prev);
			return (prev.map((message) => (message.wamid === wamid) ? { ...message, status } : message));
		});
	});
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CONTROLA O COMPORTAMENTO DE QUANDO CHEGA NOVA REACAO DE MENSAGEM
 * @param {Object} setMessages DEFINE O VALOR DE messages
 * @param {String} from NUMERO DO CLIENTE QUE ESTA CONVERSANDO COM O BOT
*/
function handleNewReact(setMessages, from) {
	return (({ phone, wamid, react }) => {
		if (phone !== from) return ;
		setMessages((prev) => {
			if (!prev) return (prev);
			return (prev.map((message) => (message.wamid === wamid) ? { ...message, react } : message));
		});
	});
}

/**
 * @author VAMPETA
 * @brief HOOK QUE ADICIONA OS EVENTOS ON DE WEBSOCKET
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} phone NUMERO DO CLIENTE QUE ESTA CONVERSANDO COM O BOT
 * @param {Object} setMessages FUNCAO QUE CONTROLA A VARIAVEL "messages"
*/
export function useChatRealtime(socket, phone, setMessages) {
	useEffect(() => {
		const onNewMessage = handleNewMessage(setMessages, phone, socket);
		const onUpdateView = handleUpdateView(setMessages, phone);
		const onNewReact = handleNewReact(setMessages, phone);
		socket.on("chat:new_message", onNewMessage);
		socket.on("chat:update_view", onUpdateView);
		socket.on("chat:new_react", onNewReact);
		return (() => {
			socket.off("chat:new_message", onNewMessage);
			socket.off("chat:update_view", onUpdateView);
			socket.off("chat:new_react", onNewReact);
		})
	}, [socket]);
}