import { useState, useEffect } from "react";

/**
 * @author VAMPETA
 * @brief HOOK QUE BUSCA INFORMACOES DE CONFIGURACOES DO BOT
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export function useGetInfoBot(socket) {
	const [bot, setBot] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		socket.emit("bot:get_info_bot", {}, (res) => {
			if (!res || res.error) return (setError(true));
			setBot(res);
			setLoading(false);
		});
	}, [socket]);
	return ({ bot, setBot, loading, error });
}