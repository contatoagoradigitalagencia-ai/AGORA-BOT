/**
 * @author VAMPETA
 * @brief RENDERIZA O CONTEUDO DA MENSAGEM (OU PARTE DELE DEPENDENDO DO TIPO DE MENSAGEM)
 * @param {Object} context MENSAGEM RESPONDIDA
*/
export default function Location({ context }) {
	if (!context?.wamid) return (null);
	return (
		<a className="flex items-center gap-1" href={"#" + context.wamid}>
			<i className="bi bi-geo-alt-fill text-orange-500 text-sm" />
			<p className="text-white">{(context.data.location.name) ? context.data.location.name : "Localização"}</p>
		</a>
	);
}