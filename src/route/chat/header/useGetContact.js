import { useState, useEffect } from "react";

/**
 * @author VAMPETA
 * @brief HOOK QUE BUSCA INFORMACOES DO CONTATO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} phone NUMERO DO CONTATO
 */
export function useGetContact(socket, phone, props) {
	const [contact, setContact] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!socket || !phone) return;
		socket.emit("chat:info_contact", { phone: phone }, (res) => {
			if (!res || res.error) return ;
			setContact(res);
			setLoading(false);
			if (res.conversationId && props?.onConversationId) {
				props.onConversationId(res.conversationId);
			}
		});
	}, [socket]);
	return ({ contact, setContact, loading });
}