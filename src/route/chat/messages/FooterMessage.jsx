import { formatDate } from "../../../utils/functions/formatDate.js";

/**
 * @author VAMPETA
 * @brief CRIA O ICONE DE STATUS DE VIZUALIZACAO DE MENSAGEM
 * @param {String} status STATUS DE VISUALIZACAO DA MENSAGEM
*/
function Visualization({ status }) {
	switch (status) {
		case "sending":
			return (<i className="bi bi-clock ml-2 leading-none text-xs text-gray-700"/>);
		case "sent":
			return (<i className="bi bi-check ml-2 leading-none text-xl text-gray-700"/>);
		case "delivered":
			return (<i className="bi bi-check-all ml-2 leading-none text-xl text-gray-700"/>);
		case "read":
			return (<i className="bi bi-check-all ml-2 leading-none text-xl text-blue-700"/>);
		case "played":
			return (<i className="bi bi-check-all ml-2 leading-none text-xl text-blue-700"/>);
		case "failed":
			return (<i className="bi bi-exclamation-triangle-fill ml-2 leading-none text-xl text-yellow-500"/>);
		default:
			return (<i className="bi bi-x-circle-fill ml-2 leading-none text-xl text-red-500"/>);
	}
}

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE CONTEM DATA HORA DE ENVIO DA MENSAGEM E CASO SEJA UMA MENSAGEM ENVIADA PELO BOT E ADICIONADO O STATUS DE VISUALIZACAO
 * @param {Object} message DADOS DA MENSAGEM
*/
export default function FooterMessage({ message }) {
	if (message.data?.audio) {
		return (
			<div className="flex justify-between items-center">
				{(message.data.audio.voice === true) ? (
					<i className={`bi bi-mic-fill ${(message.status === "played") ? "text-blue-600" : "text-gray-700"}`} />
				) : (
					<i className="bi bi-music-note-beamed text-gray-700" />
				)}
				<div className="flex items-center justify-end mt-1">
					<span className="text-xs text-gray-700">{formatDate(message.timestamp)}</span>
					{message.status && <Visualization status={message.status} />}
				</div>
			</div>
		);
	}
	return (
		<div className="flex items-center justify-end mt-1">
			<span className="text-xs text-gray-700">{formatDate(message.timestamp)}</span>
			{message.status && <Visualization status={message.status} />}
		</div>
	);
}