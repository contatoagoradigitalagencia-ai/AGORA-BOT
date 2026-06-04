import { useState, useEffect } from "react";

/**
 * @author VAMPETA
 * @brief HOOK QUE BUSCA INFORMACOES QUE SERA EXIBIDA NA ROTA /support
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export function useGetInfoSupport(socket) {
	const [support, setSupport] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		socket.emit("support:get_info_support", {}, (res) => {
			if (!res || res.error) return (setError(true));
			setSupport(res);
			setLoading(false);
		});
	}, [socket]);
	return ({ support, setSupport, loading, error });
}