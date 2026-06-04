/**
 * @author VAMPETA
 * @brief RENDERIZA O CONTEUDO DA MENSAGEM (OU PARTE DELE DEPENDENDO DO TIPO DE MENSAGEM)
 * @param {Object} context MENSAGEM RESPONDIDA
*/
export default function Contacts({ context }) {
	if (!context?.wamid) return (null);
	return (
		<a className="flex items-center gap-1" href={"#" + context.wamid}>
			<i className="bi bi-person-vcard text-orange-500 text-sm" />
			<p className="text-white">{(context.data.contacts[0].name.formatted_name) ? context.data.contacts[0].name.formatted_name : "Contato"}</p>
		</a>
	);
}