import { useParams } from "react-router-dom";

import { handleNew, handleSelect } from "./functions.js";

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL PELO CONTEUDO DA LISTA DE MENSAGENS
 * @param {String} name NOME DA MENSAGEM
 * @param {String} preview PARTE DO CONTEUDO DA MENSAGEM
*/
function ContentList({ name, preview }) {
	return (
		<>
			<p className="text-sm text-white font-medium">{name}</p>
			<p className="text-xs text-zinc-400 line-clamp-1">{preview || "Sem conteúdo"}</p>
		</>
	);
}

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL PELA LISTA DE MENSAGENS
 * @param {Hook} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function List({ socket, messages, setMessages, selectedMessage, setSelectedMessage, view, setView, search, setSearch, selected, filteredMessages }) {
	const { type } = useParams();

	return (
		<div className={`${view === "list" ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-72 2xl:w-80 bg-zinc-900 border border-zinc-800 rounded-lg p-3 min-h-0`}>
			<div className="flex flex-col gap-3">
				<button className="bg-orange-500 text-black rounded p-2 text-sm hover:opacity-90 transition cursor-pointer" onClick={() => handleNew(type, setMessages, setSelectedMessage, setView, selectedMessage)}>
					+ Nova mensagem
				</button>
				<input className="text-white bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
			</div>
			<div className="flex flex-col gap-2 mt-3 overflow-y-auto flex-1 min-h-0 pr-1">
				{messages.length === 0 && (
					<div className="flex flex-col items-center justify-center text-center gap-3 mt-6 text-zinc-400">
						<div className="relative">
							<div className="absolute inset-0 bg-orange-500/10 blur-lg rounded-full"></div>
							<i className="bi bi-chat-square-text text-5xl text-3xl text-orange-500 relative"></i>
						</div>
						<p className="text-sm text-zinc-300 font-medium">Você ainda não tem mensagens</p>
						<span className="text-xs text-zinc-500 max-w-[180px]">Clique em "Nova mensagem" para começar</span>
					</div>
				)}
				{messages.length > 0 && filteredMessages.length === 0 && (
					<div className="mt-3">
						<div className="flex items-center justify-between bg-zinc-800/50 border border-zinc-700 rounded p-3">
							<div className="flex items-center gap-3">
								<div className="w-1 h-8 bg-orange-500 rounded-full"></div>
								<div>
									<p className="text-sm text-zinc-300">Nenhum resultado</p>
									<p className="text-xs text-orange-500">"{search}"</p>
								</div>
							</div>
							<button className="text-orange-500 px-2 py-1 rounded hover:text-orange-400 cursor-pointer" onClick={() => setSearch("")}>
								<i className="bi bi-x-circle" />
							</button>
						</div>
					</div>
				)}
				{filteredMessages.map((msg) => (
					<div className={`p-3 rounded border cursor-pointer transition ${(selectedMessage === msg.id) ? "bg-zinc-800 border-orange-500" : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"}`} key={msg.id} onClick={() => handleSelect(msg.id, setSelectedMessage, setView)}>
						{msg.message.type === "text" && <ContentList name={msg.name} preview={msg.message.text.body} />}
						{msg.message.type === "audio" && <ContentList name={msg.name} preview="Áudio" />}
						{msg.message.type === "image" && <ContentList name={msg.name} preview={msg.message.image.caption || "Foto"} />}
						{msg.message.type === "video" && <ContentList name={msg.name} preview={msg.message.video.caption || "Vídeo"} />}
						{msg.message.type === "location" && <ContentList name={msg.name} preview={msg.message.location.name || "Localização"} />}
						{msg.message.type === "document" && <ContentList name={msg.name} preview={msg.message.document.filename} />}
					</div>
				))}
			</div>
		</div>
	);
}