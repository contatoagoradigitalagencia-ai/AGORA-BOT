import { useEffect, useState, useCallback } from "react";
import { apiList } from "../../api/client.js";

function normalizeQueue(queue, contacts, conversations) {
	const contactsById = new Map(contacts.map(c => [String(c._id), c]));
	const convsById    = new Map(conversations.map(c => [String(c._id), c]));

	return queue.map(item => {
		const contact = contactsById.get(String(item.contactId)) || {};
		const conv    = convsById.get(String(item.conversationId)) || {};

		return {
			id:             String(item._id),
			conversationId: String(item.conversationId),
			phone:          contact.phone || String(item.contactId),
			name:           contact.name  || "Sem nome",
			assignedToName: conv.assignedToName || conv.metadata?.assignedToName || "",
			lastMessage:    conv.lastMessagePreview || "",
			timestamp:      item.createdAt || item.updatedAt,
			status:         item.status,
		};
	});
}

export function useLoadMessagesWaiting() {
	const [chats, setChats] = useState(null);
	const [error, setError] = useState(false);

	const load = useCallback(async () => {
		try {
			const [queue, contacts, conversations] = await Promise.all([
				apiList("/human-queue"),
				apiList("/contacts"),
				apiList("/conversations"),
			]);
			setChats(normalizeQueue(
				queue.filter(q => q.status !== "resolved"),
				contacts,
				conversations,
			));
			setError(false);
		} catch {
			setError(true);
			setChats([]);
		}
	}, []);

	useEffect(() => { load(); }, [load]);

	return { chats, setChats, error, refetch: load };
}
