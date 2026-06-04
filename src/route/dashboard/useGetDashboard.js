import { useState, useEffect } from "react";

/**
 * @author VAMPETA
 * @brief HOOK QUE CONTROLA O LOAD DO DASHBOARD
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} date DATA DE CONSULTA DE METRICAS
 */
export function useGetDashboard(socket, date) {
	const [info, setInfo] = useState({ received: {}, sent: {}, newContacts: 0 });
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!socket) return ;
		setLoading(true);
		socket.emit("dashboard:info", { date: date }, (res) => {
			if (!res) return ;
			setInfo(res);
			setLoading(false);
		});
	}, [socket, date]);
	return ({ info, loading });
}