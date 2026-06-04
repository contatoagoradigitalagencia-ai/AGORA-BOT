import { useState } from "react";

import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ENVIA A NOVA MENSAGEM PARA O BACK END
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} input NOVA MENSAGEM
*/
export function handleSave(socket, input) {
	const latitude = (input.latitude === "") ? null : parseFloat(input.latitude);
	const longitude = (input.longitude === "") ? null : parseFloat(input.longitude);

	if (!(input.name && input.address && latitude != null && longitude != null) && !(!input.name && !input.address && latitude == null && longitude == null) ) return ;
	socket.emit("bot:update_location", { name: input.name, address: input.address, latitude: latitude, longitude: longitude }, (res) => {
		if (res !== 204) return (toast.error("Erro ao salvar!"));
		toast.success("Salvo com sucesso!");
	});
}

/**
 * @author VAMPETA
 * @brief COMPONENTE PARA SALVAR MENSAGEM DE LOCALIZACAO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Object} bot INFORMACOES DO BOT
*/
export default function Location({ socket, bot }) {
	const [input, setInput] = useState(bot.location || {});

	return (
		<div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-5" id="location">
			<div>
				<h2 className="text-lg font-semibold">Localização do estabelecimento</h2>
				<p className="text-sm text-zinc-400">Informe os dados do endereço para que o bot possa compartilhar com o cliente quando necessário.</p>
			</div>
			<input className="bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" type="text" value={input?.name || ""} onChange={(e) => setInput((prev) => ({ ...prev, name: e.target.value }))} placeholder="Ex: Loja Centro" />
			<textarea className="bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none resize-none min-h-[70px]" value={input?.address || ""} onChange={(e) => setInput((prev) => ({ ...prev, address: e.target.value }))} placeholder="Ex: Estamos localizados no centro da cidade, próximo à praça principal." />
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
				<input className="flex-1 bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" type="number" step="any" value={input?.latitude || ""} onChange={(e) => setInput((prev) => ({ ...prev, latitude: e.target.value }))} placeholder="Latitude" />
				<input className="flex-1 bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" type="number" step="any" value={input?.longitude || ""} onChange={(e) => setInput((prev) => ({ ...prev, longitude: e.target.value }))} placeholder="Longitude" />
			</div>
			<p className="text-xs text-zinc-500"> Dica: você pode obter latitude e longitude pelo Google Maps. </p>
			<button className="bg-orange-500 text-black rounded p-2 text-sm w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => handleSave(socket, input)}>
				Salvar
			</button>
		</div>
	);
}