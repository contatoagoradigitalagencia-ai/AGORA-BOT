import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Options from "./options/Options.jsx";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ADICIONA O VALOR DA TECLA DIGITADA AO TEXTEAREA E AUMENTA O TAMANHO DO TEXTAREA SE NECESSARIO
 * @param {Object} setMessage MODIFICADOR DA VARIAVEL message
 * @param {String} value VALOR ANTES DE INCREMENTAR O TEXTAREA
 * @param {Object} textareaRef REFERENCIA DO TEXTEAREA
*/
function handleInput(setMessage, value, textareaRef) {
	setMessage(value);
	textareaRef.current.style.height = "auto";
	textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ENVIA A MENSAGEM PARA O SERVIDOR
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} phone NUMERO DO CLIENTE QUE ESTA CONVERSANDO COM O BOT
 * @param {String} message MENSAGEM A SER ENVIADA
 * @param {Object} setMessage MODIFICADOR DA VARIAVEL message
 * @param {Object} textareaRef REFERENCIA DA TAG textarea
*/
function sendText(socket, phone, message, setMessage, textareaRef) {
	if (!message.trim()) return ;
	const data = {
		type: "text",
		text: {
			body: message
		}
	};
	socket.emit("chat:send_message", { phone: phone, message: data }, (res) => {
		if (res !== 204 || res.error) return (toast.error("Mesagem não enviada"));
	});
	setMessage("");
	textareaRef.current.style.height = "auto";
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CONTROLA A ACAO DA TECLA ENTER E ENVIA A MENSAGEM
 * @param {String} phone NUMERO DO CLIENTE QUE ESTA CONVERSANDO COM O BOT
 * @param {Object} element ELEMENTO DO TEXTAREA
 * @param {Object} setMessage MODIFICADOR DA VARIAVEL message
 * @param {String} value VALOR ANTES DE INCREMENTAR O TEXTAREA
 * @param {Object} textareaRef REFERENCIA DO TEXTEAREA
*/
function handleKeyDown(phone, element, socket, message, setMessage, textareaRef) {
	if (element.key === "Enter" && !element.shiftKey) {
		element.preventDefault();
		sendText(socket, phone, message, setMessage, textareaRef);
	}
}

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL POR GERAR O CAMPO DE DIGITACAO DA MENSAGEM E BOTAO DE ENVIAR
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function ChatComposer({ socket }) {
	const { phone } = useParams();
	const [message, setMessage] = useState("");
	const textareaRef = useRef(null);
	const [options, setOptions] = useState(false);

	return (
		<>
			<div className="flex items-center gap-2 px-3 py-2 border-zinc-800 border-t border-b">
				<button className="text-gray-400 hover:text-white text-xl cursor-pointer" onClick={() => setOptions((prev) => !prev)}>
					<i className="bi bi-three-dots" />
				</button>
				<div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 flex items-end">
					<textarea ref={textareaRef} rows={1} value={message} onChange={(element) => handleInput(setMessage, element.target.value, textareaRef)} onKeyDown={(element) => handleKeyDown(phone, element, socket, message, setMessage, textareaRef)} placeholder="Digite uma mensagem" className="w-full bg-transparent resize-none outline-none text-white placeholder-gray-400 max-h-40 overflow-y-auto" />
				</div>
				<button onClick={() => sendText(socket, phone, message, setMessage, textareaRef)} className={`flex items-center justify-center h-10 w-10 bg-orange-500 transition-colors text-white rounded-full ${(message) ? "cursor-pointer hover:bg-orange-400" : ""}`}>
					<i className="bi bi-send-fill text-lg" />
				</button>
			</div>
			<div className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${(options) ? "max-h-90" : "max-h-0"}`}>
				<Options socket={socket} />
			</div>
		</>
	);
}