import { useState, useEffect } from "react";

/**
 * @author VAMPETA
 * @brief HOOK QUE BUSCA INFORMACOES DE MENSAGENS RAPIDAS NO BACK END
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} type TIPO DA MENSAGEM
*/
export function useGetQuickMessage(socket, type) {
	const [messages, setMessages] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		socket.emit("quick-messages:get_quick_messages", { type: type }, (res) => {
			if (!res || res.error) return (setError(true));
			setMessages(res);
			setLoading(false);
		});
	}, [socket]);
	return ({ messages, setMessages, loading, error });
}