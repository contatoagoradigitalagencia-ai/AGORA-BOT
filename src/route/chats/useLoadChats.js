import { useEffect, useState, useCallback } from "react";
import { apiList } from "../../api/client.js";

function normalizeText(message) {
	if (!message) return "Sem mensagens";
	if (message.text) return message.text;
	if (message.type && message.type !== "text") return message.type;
	return "Sem mensagens";
}

function normalizeChats(conversations, contacts, messages) {
	const contactsById = new Map(contacts.map((contact) => [String(contact._id), contact]));
	const lastMessageByConversation = new Map();

	for (const message of messages) {
		const conversationId = String(message.conversationId || "");
		if (!conversationId || lastMessageByConversation.has(conversationId)) continue;
		lastMessageByConversation.set(conversationId, message);
	}

	return conversations.map((conversation) => {
		const contact = contactsById.get(String(conversation.contactId)) || {};
		const lastMessage = lastMessageByConversation.get(String(conversation._id));

		return {
			id: conversation._id,
			phone: contact.phone || String(conversation._id),
			contactName: contact.name || "Sem nome",
			lastMessage: {
				humanViewed: true,
				type: lastMessage?.type || "text",
				text: normalizeText(lastMessage),
				timestamp: lastMessage?.occurredAt || conversation.lastMessageAt || conversation.updatedAt || conversation.createdAt,
			},
		};
	});
}

/**
 * @author VAMPETA
 * @brief HOOK QUE CONTROLA O LOAD DAS CONVERSAS (CURSOR COMPOSTO)
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 */
export function useLoadChats() {
	const [chats, setChats] = useState(null);
	const [error, setError] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		let active = true;

		Promise.all([
			apiList("/conversations"),
			apiList("/contacts"),
			apiList("/messages"),
		]).then(([conversations, contacts, messages]) => {
			if (!active) return ;
			setChats(normalizeChats(conversations, contacts, messages));
			setHasMore(false);
		}).catch(() => {
			if (!active) return ;
			setError(true);
			setChats([]);
			setHasMore(false);
		});

		return (() => {
			active = false;
		});
	}, []);

	const loadMore = useCallback(() => {
		if (loadingMore || !hasMore) return ;
		setLoadingMore(true);
		setLoadingMore(false);
	}, [loadingMore, hasMore]);

	return ({ chats, setChats, error, loadMore, hasMore, loadingMore });
}
