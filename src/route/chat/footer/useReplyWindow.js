import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * Verifica se a janela de 24h está aberta.
 * - Z-API: sempre aberta (sem restrição de janela)
 * - Meta: consulta o backend via socket
 * - Se backend não responder em 3s: assume aberta (fail-open)
 */
export function useReplyWindow(socket) {
	const { phone } = useParams();
	const [replyWindow, setReplyWindow] = useState(true); // padrão: aberta

	useEffect(() => {
		if (!socket || !phone) return;

		let timeout;

		// Timeout de segurança: se backend não responder, mantém aberta
		timeout = setTimeout(() => setReplyWindow(true), 3000);

		socket.emit("chat:reply_window", { phone }, (res) => {
			clearTimeout(timeout);
			// res === null/undefined = evento não implementado = sem restrição
			// res === true = janela aberta
			// res === false = janela fechada (apenas Meta > 24h)
			if (res === null || res === undefined) {
				setReplyWindow(true);
			} else {
				setReplyWindow(Boolean(res));
			}
		});

		return () => clearTimeout(timeout);
	}, [socket, phone]);

	return { replyWindow, setReplyWindow };
}
