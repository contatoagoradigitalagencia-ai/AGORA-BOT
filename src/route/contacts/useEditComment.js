import { useState, useEffect } from "react";

/**
 * @author VAMPETA
 * @brief HOOK QUE CONTROLA O COMENTARIO DO CONTATO
 * @param {Objetc} contact INFORMACOES DO CONTATO
 */
export function useEditComment(contact) {
	const [editing, setEditing] = useState(false);
	const [comment, setComment] = useState("");

	useEffect(() => {
		setComment(contact.comment || "");
		setEditing(false);
	}, [contact]);
	return ({ editing, setEditing, comment, setComment });
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE SALVA O COMENTARIO NO BACK END
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} phone NUMERO DO CONTATO
 * @param {String} comment COMENTARIO QUE SERA SALVO
 * @param {Object} setEditing FUNCAO DE CONTROLE DA VARIAVEL editing
 * @param {Object} setContact FUNCAO DE CONTROLE DA VARIAVEL contact
 */
export function handleSave(socket, phone, comment, setEditing, setContact) {
	socket.emit("contacts:save_comment", { phone: phone, comment: comment }, (res) => {
		if (res === 200) setContact((prev) => ({ ...prev, comment: comment }));
		setEditing(false);
	});
}