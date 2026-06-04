import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ENVIA A MENSAGEM PRONTA DE TODOS OS TIPOS PARA O SERVIDOR
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} phone NUMERO DO CLIENTE QUE ESTA CONVERSANDO COM O BOT
 * @param {String} message MENSAGEM A SER ENVIADA
*/
export async function sendReadyMessage(socket, phone, message) {
	if (!phone || !message || !message.type || !message[message.type]) return (toast.error("Mesagem Rápida não enviada"));
	socket.emit("chat:send_message", { phone: phone, message: message }, (res) => {
		if (res !== 204 && res.error) return (toast.error("Mesagem Rápida não enviada"));
	});
}