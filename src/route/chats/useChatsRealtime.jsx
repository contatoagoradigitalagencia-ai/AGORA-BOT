import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { NotifyMessage } from "./NotifyMessage.jsx";

/**
 * @author VAMPETA
 * @brief IDENTIFICA O TIPO DA MENSAGEM E RETORNA O TEXTO CORRETO
 * @param {Object} data CONTEUDO DA MENSAGEM
 */
function textChat(data) {
	switch (data.type) {
		case "text":
			return (data.text.body);
		case "sticker":
			return ("Figurinha");
		case "audio":
			return ("Áudio");
		case "image":
			return ((data.image.caption) ? data.image.caption : "Imagem");
		case "video":
			return ((data.video.caption) ? data.video.caption : "Vídeo");
		case "location":
			return ((data.location.name) ? data.location.name : "Localização");
		case "contacts":
			return (data.contacts[0].name.formatted_name);
		case "document":
			return ((data.document.filename) ? data.document.filename : "Documento");
		case "interactive":
			return (data.interactive.body.text);
		default:
			return (null);
	}
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CONTROLA O CONTEUDO DA LISTA DE CHATS ATUALIZANDO A ORDEM E EXIBINDO AS NOVAS MENSAGENS
 * @param {Object} setChats FUNCAO QUE CONTROLA A VARIAVEL "chats"
 * @param {Object} navigate FUNCAO DE CONTROLE DE ROTA
 */
function handleNewMessage(setChats, navigate) {
	return ((newMessage) => {
		setChats((prev) => {
			const index = prev.findIndex((chat) => (chat.phone === newMessage.phone));
			if (index === -1) return (prev);
			const chat = prev[index];
			const newChats = [...prev];
			newChats.splice(index, 1);
			newChats.unshift({
				...chat,
				lastMessage: {
					...chat.lastMessage,
					humanViewed: false,
					type: newMessage.data.type,
					text: textChat(newMessage.data),
					timestamp: newMessage.timestamp
				}
			});
			return (newChats);
		});
		toast.custom(
			(t) => (<NotifyMessage navigate={navigate} t={t} newMessage={newMessage} />),
			{
				duration: 5000,
				id: newMessage.phone,
				removeDelay: 200
			}
		);
	});
}

/**
 * @author VAMPETA
 * @brief HOOK QUE ADICIONA OS EVENTOS ON DE WEBSOCKET
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} setChats FUNCAO QUE CONTROLA A VARIAVEL "chats"
 */
export function useChatsRealTime(socket, setChats) {
	const navigate = useNavigate();

	useEffect(() => {
		const onNewMessage = handleNewMessage(setChats, navigate);
		socket.on("chat:new_message", onNewMessage);
		return (() => {
			socket.off("chat:new_message", onNewMessage);
		})
	}, [socket, setChats, navigate]);
}