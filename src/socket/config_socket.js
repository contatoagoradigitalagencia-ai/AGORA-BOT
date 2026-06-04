import { io } from "socket.io-client";
import server from "../server.js";

/**
 * @author VAMPETA
 * @brief CRIA O SOCKET COM OS PARAMETROS
 * @param {String} token TOKEN DE ACESSO
 * @return {Object} RETORNA O SOCKET CRIADO
*/
export default function createSocket(token) {
	return (io(server, {
		autoConnect: false,
		transports: ["websocket"],
		auth: {
			token: token
		}
	}));
}