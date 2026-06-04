import { useState, useRef } from "react";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ENVIA O ATUAL PROMPT PARA O BACK END FORMULAR SUGESTOES DE MELHORIA COM IA
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} prompt PROMPT ATUAL DO BOT QUE ALIMENTA A IA EM CADA RESPOSTA DE WHATSAPP
 * @param {String} input PROMPT EXPLICATIVO QUE SERA ENVIADO PARA A IA
 * @param {Object} setOutput FUNCAO QUE VAI SALVAR NA VARIAVEL QUE EXIBE A RESPOSTA DO BACK END
 * @param {Object} setThink FUNCAO QUE MODIFICA A VARIAVEL think
*/
function handleImprove(socket, prompt, input, setOutput, setThink) {
	if (!input.trim()) return;
	setThink(true);
	setOutput("");
	socket.emit("bot:prompt_suggestion", { prompt, input }, (res) => {
		setThink(false);
		if (!res || res.error) return ;
		setOutput(res);
	});
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CONTROLA O COMPORTAMENTO DO TEXTAREA AO RECEBER UM INPUT
 * @param {String} value VALOR DO TEXTAREA
 * @param {Object} setInput FUNCAO QUE CONTROLA O VALOR DENTRO DO INPUT
 * @param {Object} textareaRef REFERENCIA DO TEXTAREA
*/
function handleChange(value, setInput, textareaRef) {
	setInput(value);
	textareaRef.current.style.height = "auto";
	textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
}

/**
 * @author VAMPETA
 * @brief COMPONENTE DE MELHORIA DE PROMPT COM IA
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} bot INFORMACOES DO BOT
*/
export default function PromptSuggestion({ socket, bot }) {
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [think, setThink] = useState(false);
	const textareaRef = useRef(null);

	return (
		<div className="flex flex-col gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-4" id="prompt-suggestion">
			<div className="flex flex-col gap-2">
				<h2 className="text-lg font-semibold">Sugestão de Prompt com IA</h2>
				<p className="text-sm text-zinc-400">Descreva abaixo como você gostaria de melhorar o comportamento do bot. Você pode pedir ajustes como deixar as respostas mais formais, mais curtas, mais detalhadas ou adaptadas a um tipo específico de cliente. A IA analisará o prompt atual e sugerirá uma versão otimizada para você.</p>
			</div>
			<div className={`flex flex-col flex-1 min-h-[40vh] bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-zinc-300 whitespace-pre-wrap ${(think) ? "animate-pulse" : ""}`}>
				{output || (
					<div className="flex flex-col justify-center items-center h-full gap-3">
						{(think) ? (<p>Pensando...</p>) : (<p>A sugestão aparecerá aqui...</p>)}
						<i className="bi bi-stars text-4xl" />
					</div>
				)}
			</div>
			<textarea className="bg-zinc-800 border border-zinc-700 rounded p-2 text-sm min-h-[20vh] outline-none resize-none overflow-hidden" ref={textareaRef} value={input} placeholder="Digite seu prompt..." onChange={(element) => handleChange(element.target.value, setInput, textareaRef)} />
			<button className="bg-orange-500 text-black rounded p-2 text-sm w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => handleImprove(socket, bot.prompt, input, setOutput, setThink)}>
				Enviar
			</button>
		</div>
	);
}