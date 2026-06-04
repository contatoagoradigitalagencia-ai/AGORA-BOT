import { useEffect, useState, useRef, useCallback } from "react";

/**
 * @author VAMPETA
 * @brief HOOK QUE CONTROLA O LOAD DAS CONVERSAS
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 */
export function useLoadMessagesWaiting(socket) {
	const [chats, setChats] = useState(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!socket) return ;
		socket.emit("human-service:get_messages_waiting_service", {}, (res) => {
			if (!res || res.error) return (setError(true));
			setChats(res);
		});
	}, [socket]);
	return ({ chats, setChats, error });
}