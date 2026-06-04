import { useEffect, useState } from "react";
import { apiList } from "../../api/client.js";

function normalizeQueue(queue, contacts) {
	const contactsById = new Map(contacts.map((contact) => [String(contact._id), contact]));

	return queue.map((item) => {
		const contact = contactsById.get(String(item.contactId)) || {};

		return {
			id: item._id,
			phone: contact.phone || String(item.contactId || item._id),
			name: contact.name || "Sem nome",
			timestamp: item.createdAt || item.updatedAt,
		};
	});
}

/**
 * @author VAMPETA
 * @brief HOOK QUE CONTROLA O LOAD DAS CONVERSAS
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 */
export function useLoadMessagesWaiting() {
	const [chats, setChats] = useState(null);
	const [error, setError] = useState(false);

	useEffect(() => {
		let active = true;

		Promise.all([
			apiList("/human-queue"),
			apiList("/contacts"),
		]).then(([queue, contacts]) => {
			if (!active) return ;
			setChats(normalizeQueue(queue, contacts));
		}).catch(() => {
			if (!active) return ;
			setError(true);
			setChats([]);
		});

		return (() => {
			active = false;
		});
	}, []);

	return ({ chats, setChats, error });
}
