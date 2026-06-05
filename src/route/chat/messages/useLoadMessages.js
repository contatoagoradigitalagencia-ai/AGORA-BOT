import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Carrega mensagens via socket.emit("chat:load_messages").
 * O backend normaliza o formato antes de enviar.
 */
export function useLoadMessages(socket, phone) {
	const [messages,    setMessages]    = useState(null);
	const [error,       setError]       = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore,     setHasMore]     = useState(true);
	const cursorRef = useRef(null);

	useEffect(() => {
		if (!socket || !phone) return;

		setMessages(null);
		setError(false);
		cursorRef.current = null;

		socket.emit("chat:load_messages", { phone }, (res) => {
			if (!res || res.error) {
				console.error("[Chat] load_messages error:", res?.error);
				setError(true);
				return;
			}
			console.log("[Chat] messages loaded:", res.messages?.length, res.messages?.[0]);
			setMessages(res.messages || []);
			setHasMore(res.hasMore ?? false);
			cursorRef.current = res.nextCursor;
		});
	}, [socket, phone]);

	const loadMore = useCallback(() => {
		if (!socket || loadingMore || !hasMore || !cursorRef.current) return;
		setLoadingMore(true);
		socket.emit("chat:load_messages", { phone, beforeId: cursorRef.current }, (res) => {
			if (!res || res.error || !res.messages?.length) {
				setLoadingMore(false);
				return;
			}
			setMessages(prev => [...(res.messages || []), ...(prev ?? [])]);
			setHasMore(res.hasMore ?? false);
			cursorRef.current = res.nextCursor;
			setLoadingMore(false);
		});
	}, [socket, phone, loadingMore, hasMore]);

	return { messages, setMessages, error, loadMore, hasMore, loadingMore };
}
