import toast from "react-hot-toast";

import { uploadFile } from "../../utils/functions/uploadFile.js";

const messageType = {
	text: {
		type: "text",
		text: {
			body: ""
		}
	},
	audio: {
		type: "audio",
		audio: {
			link: "",
			voice: true
		}
	},
	image: {
		type: "image",
		image: {
			link: "",
			caption: "",
			file: File
		}
	},
	video: {
		type: "video",
		video: {
			link: "",
			caption: "",
			file: File
		}
	},
	location: {
		type: "location",
		location: {
			name: "",
			address: "",
			latitude: "",
			longitude: ""
		}
	},
	document: {
		type: "document",
		document: {
			link: "",
			filename: "",
			caption: ""
		}
	}
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CRIA UMA NOVA MENSAGEM
 * @param {String} type TYPO DA NOVA MENSAGEM
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Function} setSelectedMessage DEFINE QUAL A MENSAGEM ESTA SELECIONADA
 * @param {Function} setView CONTROLA A VISUALIZACAO ATUAL (LISTA OU EDITOR)
*/
export function handleNew(type, setMessages, setSelectedMessage, setView) {
	const newId = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
	const newMessage = {
		name: "Nova mensagem",
		id: newId,
		isNew: true,
		message: messageType[type]
	};

	setMessages((prev) => ([newMessage, ...prev]));
	setSelectedMessage(newId);
	setView("editor");
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE SELECIONA UMA MENSAGEM E ABRE O EDITOR
 * @param {String} id IDENTIFICADOR DA MENSAGEM
 * @param {Function} setSelectedMessage DEFINE QUAL A MENSAGEM ESTA SELECIONADA
 * @param {Function} setView CONTROLA A VISUALIZACAO ATUAL (LISTA OU EDITOR)
*/
export function handleSelect(id, setSelectedMessage, setView) {
	setSelectedMessage(id);
	setView("editor");
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ATUALIZA O CAMPO
 * @param {String} name NOVO NOME DA MENSAGEM
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Number} selectedMessage ID DA MENSAGEM ATUALMENTE SELECIONADA
*/
export function handleUpdateName(name, setMessages, selectedMessage) {
	setMessages((prev) => (prev.map((msg) => ((msg.id === selectedMessage) ? { ...msg, name: name } : msg))));
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ATUALIZA O CAMPO
 * @param {String} field CAMPO DA MENSAGEM A SER ATUALIZADO
 * @param {String} value VALOR DO CAMPO
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Number} selectedMessage ID DA MENSAGEM ATUALMENTE SELECIONADA
*/
export function handleUpdateFields(field, value, setMessages, selectedMessage) {
	setMessages((prev) =>
		prev.map((msg) => {
			if (msg.id !== selectedMessage) return (msg);
			const type = msg.message.type;
			return ({
				...msg,
				message: {
					...msg.message,
					[type]: {
						...(msg.message[type] || {}),
						[field]: value
					}
				}
			});
		})
	);
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE APAGA A MENSAGEM
 * @param {Function} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} id IDENTIFICADOR DA MENSAGEM
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Function} setSelectedMessage DEFINE QUAL A MENSAGEM ESTA SELECIONADA
 * @param {Function} setView CONTROLA A VISUALIZACAO ATUAL (LISTA OU EDITOR)
*/
export function handleDelete(socket, id, setMessages, setSelectedMessage, setView) {
	if (id.startsWith("id-")) {
		setMessages((prev) => (prev.filter((m) => (m.id !== id))));
		setSelectedMessage(null);
		setView("list");
		return (toast.success("Mensagem deletada!"));
	}
	socket.emit("quick-messages:delete_quick_message", { id: id }, (res) => {
		if (res !== 204) return (toast.error("Erro ao deletar mensagem!"));
		setMessages((prev) => (prev.filter((m) => (m.id !== id))));
		setSelectedMessage(null);
		setView("list");
		toast.success("Mensagem deletada!");
	});
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CANCELA A CRIACAO DA MENSAGEM (AINDA NAO FUNCIONA BEM COM CANCELAR A EDICAO DA MENSAGEM)
 * @param {object} selected INFORMACOES DA MENSAGEM SELECIONADA
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Function} setSelectedMessage DEFINE QUAL A MENSAGEM ESTA SELECIONADA
 * @param {Function} setView CONTROLA A VISUALIZACAO ATUAL (LISTA OU EDITOR)
*/
export function handleCancel(selected, setMessages, setSelectedMessage, setView) {
	if (selected?.isNew) {
		setMessages((prev) => (prev.filter((m) => (m.id !== selected.id))));
		setSelectedMessage(null);
	}
	setView("list");
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE PROCESSA ALGUNS DETALHES DA MENSAGEM ANTES DE ENVIAR PARA O BACK END (NO CASO DA IMAGEM GERA UM LINK HOSPEDADO)
 * @param {object} selected INFORMACOES DA MENSAGEM SELECIONADA
*/
async function processMessage(selected) {
	let url = null;

	switch (selected.message.type) {
		case "audio":
			if (!selected.message.audio.file) return ;
			url = await uploadFile(selected.message.audio.file);
			if (!url) return (toast.error("Erro ao salvar audio"));
			selected.message.audio.link = url;
			delete selected.message.audio.file;
			break;
		case "image":
			if (!selected.message.image.file) return ;
			url = await uploadFile(selected.message.image.file);
			if (!url) return (toast.error("Erro ao salvar imagem"));
			selected.message.image.link = url;
			delete selected.message.image.file;
			break;
		case "video":
			if (!selected.message.video.file) return ;
			url = await uploadFile(selected.message.video.file);
			if (!url) return (toast.error("Erro ao salvar vídeo"));
			selected.message.video.link = url;
			delete selected.message.video.file;
			break;
		case "location":
			selected.message.location.latitude = parseFloat(selected.message.location.latitude);
			selected.message.location.longitude = parseFloat(selected.message.location.longitude);
			break;
		case "document":
			if (!selected.message.document.file) return ;
			url = await uploadFile(selected.message.document.file);
			if (!url) return (toast.error("Erro ao salvar documento"));
			selected.message.document.link = url;
			selected.message.document.filename = selected.message.document.file.name;
			delete selected.message.document.file;
			break;
	}
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE SALVA E ATUALZA O CONTEUDO DA MENSAGEM NO BACK END
 * @param {Function} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} selected INFORMACOES DA MENSAGEM SELECIONADA
 * @param {Function} setMessages ATUALIZA A LISTA DE MENSAGENS NO ESTADO
 * @param {Function} setSelectedMessage DEFINE QUAL A MENSAGEM ESTA SELECIONADA
 * @param {Function} setView CONTROLA A VISUALIZACAO ATUAL (LISTA OU EDITOR)
*/
export async function handleSave(socket, selected, setMessages, setSelectedMessage, setView) {
	await processMessage(selected);
	socket.emit("quick-messages:save_quick_message", { id: (selected.isNew) ? undefined : selected.id, name: selected.name, message: selected.message }, (res) => {
		if (!res || res.error) return (toast.error("Erro ao salvar mensagem!"));
		setMessages((prev) => {
			if (selected.isNew) return ([{ ...selected, id: res.id, isNew: false }, ...prev.filter((m) => (m.id !== selected.id))]);
			return (prev.map((msg) => ((msg.id === selected.id) ? { ...msg, ...selected, id: res.id } : msg)));
		});
		setSelectedMessage(res.id);
		setView("list");
		toast.success("Mensagem salva com sucesso!");
	});
}
