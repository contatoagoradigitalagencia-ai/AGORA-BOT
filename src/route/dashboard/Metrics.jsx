import Card from "./Card.jsx";

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE CRIA METRICAS GERAIS DO DIA
 * @param {Boolean} loading INFORMA O ESTADO DE LOAD
 * @param {Object} info INFORMACOES DA METRICA
*/
export default function Metrics({ loading, info }) {
	const messagesReceived = Object.values(info?.received || {}).reduce((acc, v) => acc + (v || 0), 0);
	const messagesSent = Object.values(info?.sent || {}).reduce((acc, v) => acc + (v || 0), 0);

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
			<Card loading={loading} text="Mensagens recebidas hoje" value={messagesReceived} />
			<Card loading={loading} text="Mensagens enviadas" value={messagesSent} />
			<Card loading={loading} text="Novos contatos" value={info?.newContacts} />
			<Card loading={loading} text="Redirecionamentos" value={info?.redirects} />
		</div>
	);
}