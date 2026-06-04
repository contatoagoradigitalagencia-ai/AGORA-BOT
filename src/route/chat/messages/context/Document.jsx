/**
 * @author VAMPETA
 * @brief RENDERIZA O CONTEUDO DA MENSAGEM (OU PARTE DELE DEPENDENDO DO TIPO DE MENSAGEM)
 * @param {Object} context MENSAGEM RESPONDIDA
*/
export default function Document({ context }) {
	if (!context?.wamid) return (null);
	return (
		<a className="flex items-center gap-1" href={"#" + context.wamid}>
			<i className="bi bi-file-earmark-text text-orange-500 text-sm" />
			<p className="text-white">{(context.data.document.filename) ? context.data.document.filename : "Documento"}</p>
		</a>
	);
}