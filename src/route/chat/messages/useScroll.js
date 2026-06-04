import { useRef, useCallback, useLayoutEffect } from "react";

/**
 * @author VAMPETA
 * @brief HOOK RESPONSAVEL POR CONTROLAR O COMPORTAMENTO DO SCROLL
 * @param {Array<Object>} messages LISTA DE MENSAGENS
 * @param {Boolean} hasMore INDICA SE EXISTEM MENSAGENS ANTERIORES DISPONIVEIS PARA CARREGAMENTO
 * @param {Boolean} loadingMore INDICA SE UMA OPERACAO DE CARREGAMENTO ADICIONAL JA ESTA EM ANDAMENTO
 * @param {Function} loadMore FUNCAO RESPONSAVEL POR BUSCAR MENSAGENS ANTERIORES
*/
export function useScroll({ messages, hasMore, loadingMore, loadMore }) {
	const containerRef = useRef(null);
	const bottomRef = useRef(null);
	const stateRef = useRef({ isFirstLoad: true, isPrepending: false, prevScrollHeight: 0, isAtBottom: true, });
	const handleScroll = useCallback((e) => {
		const el = e.currentTarget;
		const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);

		stateRef.current.isAtBottom = distanceFromBottom < 50;
		if (el.scrollTop <= 0 && hasMore && !loadingMore) {
			stateRef.current.prevScrollHeight = el.scrollHeight;
			stateRef.current.isPrepending = true;
			loadMore();
		}
	}, [hasMore, loadingMore, loadMore]);

	useLayoutEffect(() => {
		const el = containerRef.current;
		if (!el || !messages?.length) return;
		const state = stateRef.current;
		if (state.isFirstLoad) {
			el.scrollTop = el.scrollHeight;
			state.isFirstLoad = false;
			return ;
		}
		if (state.isPrepending) {
			const diff = el.scrollHeight - state.prevScrollHeight;
			el.scrollTop = diff;
			state.isPrepending = false;
			return ;
		}
		if (state.isAtBottom && bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	return ({ containerRef, bottomRef, handleScroll });
}