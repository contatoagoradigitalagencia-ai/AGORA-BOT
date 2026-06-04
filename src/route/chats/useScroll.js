import { useRef, useCallback } from "react";

/**
 * @author VAMPETA
 * @brief SCROLL INFINITO DAS CONVERSAS
 * @param {Boolean} hasMore INDICA SE EXISTEM CONVERSAS ANTERIORES DISPONIVEIS PARA CARREGAMENTO
 * @param {Boolean} loadingMore INDICA SE UMA OPERACAO DE CARREGAMENTO ADICIONAL JA ESTA EM ANDAMENTO
 * @param {Function} loadMore FUNCAO RESPONSAVEL POR BUSCAR CONVERSAS ANTERIORES
 */
export function useScroll({ hasMore, loadingMore, loadMore }) {
	const containerRef = useRef(null);
	const handleScroll = useCallback((e) => {
		const el = e.currentTarget;
		const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
		if (distanceFromBottom < 50 && hasMore && !loadingMore) loadMore();
	}, [hasMore, loadingMore, loadMore]);
	return ({ containerRef, handleScroll });
}