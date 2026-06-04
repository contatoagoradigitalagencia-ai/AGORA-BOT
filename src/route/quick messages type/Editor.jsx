import { useState } from "react";

import { handleUpdateName, handleUpdateFields, handleDelete, handleCancel, handleSave } from "./functions.js";

import FileUpload from "../../utils/components/FileUpload.jsx";

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL PELO CONTEUDO DA LISTA DE MENSAGENS DO TIPO TEXT
 * @param {Object} content INFORMACOES DA MENSAGEM
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Number} selectedMessage ID DA MENSAGEM ATUALMENTE SELECIONADA
*/
function FieldsText({ content, setMessages, selectedMessage }) {
	return (
		<>
			<textarea className="text-white bg-zinc-800 border border-zinc-700 rounded p-2 text-sm min-h-[140px] outline-none" value={content.message.text.body ?? ""} placeholder="Digite a mensagem..." onChange={(e) => handleUpdateFields("body", e.target.value, setMessages, selectedMessage)} />
		</>
	);
}

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL PELO CONTEUDO DA LISTA DE MENSAGENS DO TIPO AUDIO
 * @param {Object} content INFORMACOES DA MENSAGEM
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Number} selectedMessage ID DA MENSAGEM ATUALMENTE SELECIONADA
*/
function FieldsAudio({ content, setMessages, selectedMessage }) {
	const isVoice = content.message.audio?.voice ?? false;

	return (
		<div className="flex flex-col gap-3">
			<FileUpload accept="audio/mpeg, audio/ogg, audio/mp4, audio/aac" onChange={(file) => handleUpdateFields("file", file, setMessages, selectedMessage)} />
			<div className="flex bg-zinc-800 border border-zinc-700 rounded p-1">
				<button className={`flex-1 flex items-center justify-center gap-2 px-2 py-1.5 text-xs rounded transition cursor-pointer ${(!isVoice) ? "bg-orange-500 text-black" : "text-zinc-400 hover:text-white"}`} onClick={() => handleUpdateFields("voice", false, setMessages, selectedMessage)}>
					<i className="bi bi-music-note" />
					Música
				</button>
				<button className={`flex-1 flex items-center justify-center gap-2 px-2 py-1.5 text-xs rounded transition cursor-pointer ${(isVoice) ? "bg-orange-500 text-black" : "text-zinc-400 hover:text-white"}`} onClick={() => handleUpdateFields("voice", true, setMessages, selectedMessage)}>
					<i className="bi bi-mic" />
					Voz
				</button>
			</div>
			<p className="text-xs text-zinc-500">{(isVoice) ? "Será enviado como áudio de voz no WhatsApp" : "Será enviado como arquivo de música"}</p>
		</div>
	);
}

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL PELO CONTEUDO DA LISTA DE MENSAGENS DO TIPO IMAGE
 * @param {Object} content INFORMACOES DA MENSAGEM
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Number} selectedMessage ID DA MENSAGEM ATUALMENTE SELECIONADA
*/
function FieldsImage({ content, setMessages, selectedMessage }) {
	return (
		<>
			<FileUpload accept="image/jpeg, image/png, image/webp" onChange={(file) => handleUpdateFields("file", file, setMessages, selectedMessage)} />
			<textarea className="text-white bg-zinc-800 border border-zinc-700 rounded p-2 text-sm min-h-[140px] outline-none" value={content.message.image.caption ?? ""} placeholder="Digite a mensagem..." onChange={(e) => handleUpdateFields("caption", e.target.value, setMessages, selectedMessage)} />
		</>
	);
}

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL PELO CONTEUDO DA LISTA DE MENSAGENS DO TIPO VIDEO
 * @param {Object} content INFORMACOES DA MENSAGEM
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Number} selectedMessage ID DA MENSAGEM ATUALMENTE SELECIONADA
*/
function FieldsVideo({ content, setMessages, selectedMessage }) {
	return (
		<>
			<FileUpload accept="video/mp4" onChange={(file) => handleUpdateFields("file", file, setMessages, selectedMessage)} />
			<textarea className="text-white bg-zinc-800 border border-zinc-700 rounded p-2 text-sm min-h-[140px] outline-none" value={content.message.video.caption ?? ""} placeholder="Digite a mensagem..." onChange={(e) => handleUpdateFields("caption", e.target.value, setMessages, selectedMessage)} />
		</>
	);
}

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL PELO CONTEUDO DA LISTA DE MENSAGENS DO TIPO LOCATION
 * @param {Object} content INFORMACOES DA MENSAGEM
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Number} selectedMessage ID DA MENSAGEM ATUALMENTE SELECIONADA
*/
function FieldsLocation({ content, setMessages, selectedMessage }) {
	return (
		<>
			<input className="flex-1 text-white bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" type="text" value={content.message.location.name ?? ""} placeholder="Digite o nome do endereço..." onChange={(e) => handleUpdateFields("name", e.target.value, setMessages, selectedMessage)} />
			<textarea className="text-white bg-zinc-800 border border-zinc-700 rounded p-2 text-sm min-h-[140px] outline-none" type="text" value={content.message.location.address ?? ""} placeholder="Digite o endereço..." onChange={(e) => handleUpdateFields("address", e.target.value, setMessages, selectedMessage)} />
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
				<input className="flex-1 text-white bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" type="number" step="any" value={content.message.location.latitude ?? ""} placeholder="Digite a latidute..." onChange={(e) => handleUpdateFields("latitude", e.target.value, setMessages, selectedMessage)} />
				<input className="flex-1 text-white bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" type="number" step="any" value={content.message.location.longitude ?? ""} placeholder="Digite a longitude..." onChange={(e) => handleUpdateFields("longitude", e.target.value, setMessages, selectedMessage)} />
			</div>
		</>
	);
}

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL PELO CONTEUDO DA LISTA DE MENSAGENS DO TIPO DOCUMENT
 * @param {Object} content INFORMACOES DA MENSAGEM
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Number} selectedMessage ID DA MENSAGEM ATUALMENTE SELECIONADA
*/
function FieldsDocument({ content, setMessages, selectedMessage }) {
	return (
		<>
			<FileUpload accept="*" onChange={(file) => handleUpdateFields("file", file, setMessages, selectedMessage)} />
			<textarea className="text-white bg-zinc-800 border border-zinc-700 rounded p-2 text-sm min-h-[140px] outline-none" value={content.message.document.caption ?? ""} placeholder="Digite a mensagem..." onChange={(e) => handleUpdateFields("caption", e.target.value, setMessages, selectedMessage)} />
		</>
	);
}

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL PELO EDITOR DA MENSAGEM (POR ENQUANTO AINDA EXISTE PREVIEW MAS ACHO QUE VOU REMOVER)
 * @param {Hook} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Editor({ socket, messages, setMessages, selectedMessage, setSelectedMessage, view, setView, search, setSearch, selected, filteredMessages }) {
	return (
		<div className={`${view === "editor" ? "flex" : "hidden"} lg:flex flex-1 flex-col bg-zinc-900 border border-zinc-800 rounded-lg p-4 gap-4 h-full`}>
			{!selected && (
				<div className="flex flex-1 items-center justify-center">
					<div className="relative w-full max-w-md flex flex-col items-center text-center gap-4">
						<div className="absolute -top-6 -left-6 w-40 h-24 bg-zinc-800 border border-zinc-700 rounded-lg opacity-40 rotate-[-6deg]"></div>
						<div className="absolute -bottom-6 -right-6 w-40 h-24 bg-zinc-800 border border-zinc-700 rounded-lg opacity-40 rotate-[6deg]"></div>
						<div className="flex flex-col items-center relative p-6 gap-3">
							<i className="bi bi-chat-square-text text-5xl text-orange-500" />
							<h2 className="text-zinc-200 font-semibold">Nenhuma mensagem aberta</h2>
							<p className="text-sm text-zinc-500 max-w-xs leading-relaxed">Selecione uma mensagem existente ou crie uma nova para começar a editar seu conteúdo.</p>
						</div>
					</div>
				</div>
			)}
			{selected && (
				<>
					<input className="text-white bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" type="text" value={selected.name} placeholder="Digite o nome da mensagem..." onChange={(e) => handleUpdateName(e.target.value, setMessages, selectedMessage)} />
					{selected.message.type === "text" && <FieldsText content={selected} setMessages={setMessages} selectedMessage={selectedMessage} />}
					{selected.message.type === "audio" && <FieldsAudio content={selected} setMessages={setMessages} selectedMessage={selectedMessage} />}
					{selected.message.type === "image" && <FieldsImage content={selected} setMessages={setMessages} selectedMessage={selectedMessage} />}
					{selected.message.type === "video" && <FieldsVideo content={selected} setMessages={setMessages} selectedMessage={selectedMessage} />}
					{selected.message.type === "location" && <FieldsLocation content={selected} setMessages={setMessages} selectedMessage={selectedMessage} />}
					{selected.message.type === "document" && <FieldsDocument content={selected} setMessages={setMessages} selectedMessage={selectedMessage} />}
					<div className="flex justify-center gap-5">
						<button className="bg-orange-500 text-black w-full rounded p-2 text-sm hover:opacity-90 transition cursor-pointer" onClick={() => handleCancel(selected, setMessages, setSelectedMessage, setView)}>
							Cancelar
						</button>
						<button className="bg-orange-500 text-black w-full rounded p-2 text-sm hover:opacity-90 transition cursor-pointer" onClick={() => handleDelete(socket, selected.id, setMessages, setSelectedMessage, setView)}>
							Apagar
						</button>
						<button className="bg-orange-500 text-black w-full rounded p-2 text-sm hover:opacity-90 transition cursor-pointer" onClick={() => handleSave(socket, selected, setMessages, setSelectedMessage, setView)}>
							Salvar
						</button>
					</div>
				</>
			)}
		</div>
	);
}