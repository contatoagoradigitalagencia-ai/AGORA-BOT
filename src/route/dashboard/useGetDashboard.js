import { useState, useEffect } from "react";
import { apiList } from "../../api/client.js";

const EMPTY_INFO = { received: {}, sent: {}, newContacts: 0, redirects: 0 };

function sameDay(value, date) {
	if (!value) return false;
	return new Date(value).toLocaleDateString("sv-SE") === date;
}

function countMessages(messages, direction, date) {
	return messages
		.filter((message) => message.direction === direction && sameDay(message.occurredAt || message.createdAt, date))
		.reduce((acc, message) => {
			const type = message.type || "text";
			acc[type] = (acc[type] || 0) + 1;
			return acc;
		}, {});
}

/**
 * @author VAMPETA
 * @brief HOOK QUE CONTROLA O LOAD DO DASHBOARD
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} date DATA DE CONSULTA DE METRICAS
 */
export function useGetDashboard(date) {
	const [info, setInfo] = useState(EMPTY_INFO);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		let active = true;

		Promise.all([
			apiList("/messages"),
			apiList("/contacts"),
		]).then(([messages, contacts]) => {
			if (!active) return ;
			setInfo({
				received: countMessages(messages, "inbound", date),
				sent: countMessages(messages, "outbound", date),
				newContacts: contacts.filter((contact) => sameDay(contact.createdAt, date)).length,
				redirects: 0,
			});
		}).catch(() => {
			if (!active) return ;
			setError(true);
			setInfo(EMPTY_INFO);
		}).finally(() => {
			if (!active) return ;
			setLoading(false);
		});

		return (() => {
			active = false;
		});
	}, [date]);
	return ({ info, loading, error });
}
