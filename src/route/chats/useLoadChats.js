import { useEffect, useState, useRef, useCallback } from "react";

/**
 * @author VAMPETA
 * @brief HOOK QUE CONTROLA O LOAD DAS CONVERSAS (CURSOR COMPOSTO)
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 */
export function useLoadChats(socket) {
	const [chats, setChats] = useState(null);
	const [error, setError] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const cursorRef = useRef(null);

	useEffect(() => {
		if (!socket) return ;
		socket.emit("chats:load_chats", {}, (res) => {
			if (!res || res.error) return (setError(true));
			setChats(res.chats);
			setHasMore(res.hasMore);
			cursorRef.current = res.nextCursor;
		});
	}, [socket]);
	const loadMore = useCallback(() => {
		if (!socket || loadingMore || !hasMore) return ;
		setLoadingMore(true);
		socket.emit("chats:load_chats", { dateLastChat: cursorRef.current }, (res) => {
			if (!res || res.error || !Array.isArray(res.chats)) {
				setLoadingMore(false);
				return ;
			}
			setChats((prev) => [...(prev ?? []), ...res.chats]);
			setHasMore(res.hasMore);
			cursorRef.current = res.nextCursor;
			setLoadingMore(false);
		});
	}, [socket, loadingMore, hasMore]);
	return ({ chats, setChats, error, loadMore, hasMore, loadingMore });
}