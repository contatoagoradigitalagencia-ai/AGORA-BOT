import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief ADICIONA UM CAMPO DE DIGITACAO DE PROMPT
 * @param {Object} setFields FUNCAO QUE MODIFICA fields
*/
export function addField(setFields) {
	setFields((prev) => ([...prev, ""]));
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ATUALIZA O CAMPO CADA VEZ QUE UMA NOVA LETRA E INSERIDA
 * @param {Object} setFields FUNCAO QUE MODIFICA fields
 * @param {Object} value NOVO VALOR DO CAMPO
 * @param {Object} index INDEX DO COMPONENTE NO ARRAY DE COMPONENTES
*/
export function updateField(setFields, value, index) {
	setFields((prev) => (prev.map((item, i) => ((i === index) ? value : item))));
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE APAGA UM CAMPO DE DIGITACAO DE PROMPT
 * @param {Object} setFields FUNCAO QUE MODIFICA fields
 * @param {Object} index INDEX DO COMPONENTE NO ARRAY DE COMPONENTES
*/
export function removeField(setFields, index) {
	setFields((prev) => (prev.filter((_, i) => (i !== index))));
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ENVIA O NOVO PROMPT PARA O BACK END
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} fields ARRAI COM OS CONTEUDOS DOS CAMPOS DE PROMPTS
*/
export function handleSave(socket, fields) {
	const prompt = buildPrompt(fields.filter((f) => (f.trim() !== "")));

	socket.emit("bot:update_prompt", { prompt: prompt }, (res) => {
		if (res !== 204) return (toast.error("Erro ao salvar!"));
		toast.success("Salvo com sucesso!");
	});
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE TRANFORMA O PROMPT DE UMA UNICA STRING EM UM ARRAY DE INSTRUCOES
 * @param {String} promptString STRING CONTENDO O PROMPT COM CARACTERES ESPECIAIS COMO \n E -
*/
export function parsePrompt(promptString) {
	return (promptString.split("\n").map((item) => (item.replace(/^- /, "").trim())).filter((item) => (item !== "")));
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE TRANFORMA O ARRAY DE STRINGS EM UMA UNICA STRING COM O PROMPT
 * @param {Array<String>} fields ARRAY DE STRINGS COM INSTRUCOES
*/
export function buildPrompt(fields) {
	return (fields.filter((f) => (f.trim() !== "")).map((f) => (`- ${f}`)).join("\n"));
}