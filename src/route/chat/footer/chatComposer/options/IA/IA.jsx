import { useState, useRef } from "react";
import toast from "react-hot-toast";

import { useOverlay } from "../../../../../../overlay/OverlayProvider.jsx";

/**
 * @author VAMPETA
 * @brief CONTROLA ALTURA DO TEXTAREA
 * @param {Function} setInput FUNCAO QUE MODIFICAR O VALOR DE input
 * @param {Object} value VALOR DO TEXTEAREA
 * @param {Object} ref REFERENCIA DO TEXTEAREA
*/
function handleChange(setInput, value, ref) {
	setInput(value);
	ref.current.style.height = "auto";
	ref.current.style.height = ref.current.scrollHeight + "px";
}

/**
 * @author VAMPETA
 * @brief COPIA O TEXTO PARA A AREA DE TRANFERENCIA (CTRL + C DO WINDOWS)
 * @param {Object} text RESPOSTA DA IA
*/
async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		toast.success("Texto copiado!");
	} catch (error) {
		toast.error("Erro ao copiar texto");
	}
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ENVIA A MENSAGEM PARA O SERVIDOR
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} phone NUMERO DO CLIENTE QUE ESTA CONVERSANDO COM O BOT
 * @param {String} message MENSAGEM A SER ENVIADA
 * @param {Function} closeOverlay FUNCAO QUE FECHA O MODAL
*/
function sendText(socket, phone, message, closeOverlay) {
	if (!message.trim()) return ;
	const data = {
		type: "text",
		text: {
			body: message
		}
	};
	socket.emit("chat:send_message", { phone: phone, message: data }, (res) => {
		if (res !== 204 || res.error) return (toast.error("Mesagem não enviada"));
		closeOverlay();
		toast.success("Resposta enviada!");
	});
}

/**
 * @author VAMPETA
 * @brief CONSULTA O BACK END PARA GERAR UMA SUGESTAO DE RESPOSTA
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} phone NUMERO DO CLIENTE QUE ESTA CONVERSANDO COM O BOT
 * @param {String} input INPUT ESCRITO PELO USUARIO ORIENTANDO A IA
 * @param {Function} setThink FUNCAO QUE MODIFICAR O VALOR DE think
 * @param {Function} setOutput FUNCAO QUE MODIFICAR O VALOR DE output
*/
function handleGenerate(socket, phone, input, setThink, setOutput) {
	setThink(true);
	setOutput("");
	socket.emit("chat:response_suggestion", { phone: phone, input: input }, (res) => {
		setThink(false);
		if (!res || res.error) return (setOutput("Erro ao gerar sugestão, tente novamente."));
		setOutput(res);
	});
}

/**
 * @author VAMPETA
 * @brief MODAL DE SUGESTAO IA
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} phone NUMERO DO CLIENTE QUE ESTA CONVERSANDO COM O BOT
*/
export default function IA({ socket, phone }) {
	const { closeOverlay } = useOverlay();
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [think, setThink] = useState(false);
	const [edit, setEdit] = useState(false);
	const inputRef = useRef(null);
	const outputRef = useRef(null);

	return (
		<div className="flex flex-col gap-4 h-full p-4">
			<div className="flex items-center gap-3">
				<i className="bi bi-stars text-2xl text-orange-500" />
				<div className="flex flex-col">
					<h2 className="text-lg font-semibold text-white">Sugestão IA</h2>
					<p className="text-sm text-zinc-400">Gere respostas rápidas para o atendimento.</p>
				</div>
			</div>
			<div className={`flex flex-col flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-300 whitespace-pre-wrap ${(think) ? "animate-pulse" : ""}`}>
				{(edit) ? (
					<textarea className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-sm text-zinc-300 outline-none resize-none overflow-hidden focus:border-orange-500" ref={outputRef} value={output} onChange={(e) => handleChange(setOutput, e.target.value, outputRef)} />
				) : (
					output || (
						<div className="flex flex-col justify-center items-center h-full gap-3 text-zinc-500">
							{(think) ? (
								<p>Pensando...</p>
							) : (
								<p>A resposta aparecerá aqui...</p>
							)}
							<i className="bi bi-stars text-4xl" />
						</div>
					)
				)}
			</div>
			<textarea className=" bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm text-white outline-none resize-none overflow-hidden focus:border-orange-500" ref={inputRef} value={input} placeholder="Digite o contexto da resposta..." onChange={(e) => handleChange(setInput, e.target.value, inputRef)} />
			<div className="flex flex-col gap-3">
				{output && (
					<div className="flex gap-3">
						<button className=" bg-orange-500 text-black rounded-lg p-3 text-sm font-medium w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => copyText(output)}>
							Copiar
						</button>
						<button className=" bg-orange-500 text-black rounded-lg p-3 text-sm font-medium w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => setEdit(!edit)}>
							{edit ? "Visualizar" : "Editar"}
						</button>
						<button className=" bg-orange-500 text-black rounded-lg p-3 text-sm font-medium w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => sendText(socket, phone, output, closeOverlay)}>
							Enviar
						</button>
					</div>
				)}
				<button className=" bg-orange-500 text-black rounded-lg p-3 text-sm font-medium w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => handleGenerate(socket, phone, input, setThink, setOutput)}>
					Gerar resposta
				</button>
			</div>
		</div>
	);
}