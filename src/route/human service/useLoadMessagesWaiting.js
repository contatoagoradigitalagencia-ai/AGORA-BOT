import { useEffect, useState, useCallback } from "react";
import { apiList } from "../../api/client.js";

function normalizeQueue(queue, contacts, conversations) {
  const byContact = new Map(contacts.map(c => [String(c._id), c]));
  const byConv    = new Map(conversations.map(c => [String(c._id), c]));

  return queue
    .filter(q => q.status !== "resolved")
    .map(item => {
      const contact = byContact.get(String(item.contactId)) || {};
      const conv    = byConv.get(String(item.conversationId)) || {};
      return {
        id:                   String(item._id),
        conversationId:       String(item.conversationId),
        phone:                contact.phone || String(item.contactId),
        name:                 contact.name  || "Sem nome",
        assignedAttendantName: conv.metadata?.assignedToName || conv.assignedToName || item.assignedAttendantName || "",
        lastMessage:          conv.lastMessagePreview || "",
        timestamp:            item.createdAt || item.updatedAt,
        status:               item.status,
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
      setChats(normalizeQueue(queue, contacts, conversations));
      setError(false);
    } catch {
      setError(true);
      setChats([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { chats, setChats, error, refetch: load };
}
