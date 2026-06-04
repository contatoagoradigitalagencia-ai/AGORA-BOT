import { useState } from "react";

import { IMaskInput } from "react-imask";

import { behaviorIMaskInput, addField, updateField, removeField, handleSaveStatus, handleSaveNumbers, handleSaveMessage } from "./redirect.js";

/**
 * @author VAMPETA
 * @brief COMPONENTE PARA SALVAR MENSAGEM DE REDIRECIONAMENTO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} bot INFORMACOES DO BOT
*/
export default function Redirect({ socket, bot }) {
	const [status, setStatus] = useState(bot.redirect.activated);
	const [fields, setFields] = useState(bot.redirect.numbers || []);
	const [input, setInput] = useState(bot.redirect.message || "");

	return (
		<div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-3" id="redirect">
			<div>
				<h2 className="text-lg font-semibold">Atendimento humano</h2>
				<p className="text-sm text-zinc-400">Configure como o bot deve encaminhar o cliente para um atendente humano.</p>
			</div>
			<label className="flex items-center justify-between cursor-pointer">
				<span className="text-sm text-zinc-300">Redirecionamento {(status) ? "ativada" : "desativada"}</span>
				<div className="relative">
					<input type="checkbox" className="sr-only peer" checked={status} onChange={() => handleSaveStatus(socket, status, setStatus)} />
					<div className="w-10 h-5 bg-zinc-700 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
					<div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
				</div>
			</label>
			<div className="flex flex-col gap-2">
				{fields.map((field, index) => (
					<div key={index} className="flex gap-2">
						<IMaskInput className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 outline-none focus:border-orange-500" mask="+55 (00) 00000-0000" type="tel" unmask={true} value={field?.replace(/^55/, "")} onAccept={(value, mask) => behaviorIMaskInput(mask, updateField, setFields, index)} placeholder="+55 21 99999-9999" />
						<button className="px-2 text-red-400 hover:text-red-300 cursor-pointer" onClick={() => removeField(setFields, index)}>
							<i className="bi bi-trash text-xl" />
						</button>
					</div>
				))}
			</div>
			<p className="text-xs text-zinc-500">Os números serão acionados na ordem em que aparecem, do primeiro ao último. {(bot?.redirect?.numbers?.length) > 0 && (<> Próximo atendente: <strong>{bot.redirect.numbers[0]}</strong>.</>)}</p>
			<div className="flex justify-between">
				<button className="text-sm text-orange-500 hover:underline cursor-pointer" onClick={() => addField(setFields)}>
					+ Adicionar número
				</button>
				<button className="px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-400 transition cursor-pointer" onClick={() => handleSaveNumbers(socket, fields)}>
					Salvar
				</button>
			</div>
			<textarea className="bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none resize-none min-h-[80px]" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ex: Vou te encaminhar para um atendente humano, aguarde um momento." />
			<p className="text-xs text-zinc-500">Dica: use essa opção quando o bot não conseguir ajudar ou a solicitação for mais complexa.</p>
			<button className="bg-orange-500 text-black rounded p-2 text-sm w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => handleSaveMessage(socket, input)}>
				Salvar
			</button>
		</div>
	);
}