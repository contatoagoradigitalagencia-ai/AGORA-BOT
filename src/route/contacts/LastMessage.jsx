import { formatDate } from "../../utils/functions/formatDate.js";

/**
 * @author VAMPETA
 * @brief COMPONENTE DE INFORMACOES DE ULTIMA MENSAGEM DO CONTATO
 * @param {String} contact INFORMACOES DO CONTATO
 */
export default function LastMessage({ contact }) {
	return (
		<div className="bg-zinc-800 p-4 rounded-lg">
			<p className="text-xs text-zinc-500">Última mensagem</p>
			<p className="text- mt-3">{formatDate(contact.lastMessage)}</p>
		</div>
	);
}