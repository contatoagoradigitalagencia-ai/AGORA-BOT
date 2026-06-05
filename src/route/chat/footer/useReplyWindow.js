import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * Verifica a janela de envio por provedor.
 * Retorna: { allowed, reason, provider, requiresTemplate }
 * Z-API: sempre allowed=true
 * Meta: allowed depende da janela de 24h
 */
export function useReplyWindow(socket) {
	const { phone } = useParams();
	const [window, setWindow] = useState({ allowed: true, reason: "loading", provider: null });

	useEffect(() => {
		if (!socket || !phone) return;

		let timeout = setTimeout(() => {
			setWindow({ allowed: true, reason: "timeout_fail_open", provider: null });
		}, 3000);

		socket.emit("chat:reply_window", { phone }, (res) => {
			clearTimeout(timeout);
			if (res === null || res === undefined) {
				setWindow({ allowed: true, reason: "no_response_fail_open", provider: null });
			} else if (typeof res === "boolean") {
				// Compatibilidade com resposta antiga (true/false)
				setWindow({ allowed: res, reason: res ? "open" : "meta_24h_window_expired", provider: "meta" });
			} else {
				setWindow(res);
			}
		});

		return () => clearTimeout(timeout);
	}, [socket, phone]);

	// Compatibilidade: replyWindow (boolean) para código legado
	return {
		replyWindow:      window.allowed,
		windowState:      window,
		setReplyWindow:   (v) => setWindow(prev => ({ ...prev, allowed: v })),
	};
}
