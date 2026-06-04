import { createContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import createSocket from "./config_socket.js";

import { logout } from "../utils/functions/logout.js";

export const SocketContext = createContext(null);

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE FAZ A CONEXAO COM O SOCKET
 * @param children ELEMENTO FILHO
*/
export function SocketProvider({ children }) {
	const navigate = useNavigate();
	const socketRef = useRef(null);
	const [socket, setSocket] = useState(null);
	const [connected, setConnected] = useState(false);
	const [error, setError] = useState(false);
	const [token, setToken] = useState(() => Cookies.get("token"));

	useEffect(() => {
		const interval = setInterval(() => {
			const newToken = Cookies.get("token");

			setToken((prev) => ((prev !== newToken) ? newToken : prev));
		}, 2000);

		return (() => clearInterval(interval));
	}, [token]);
	useEffect(() => {
		if (!token) {
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current = null;
			}
			setSocket(null);
			setConnected(false);
			setError(false);
			return ;
		}
		if (socketRef.current) socketRef.current.disconnect();
		const newSocket = createSocket(token);
		newSocket.on("connect", () => {
// console.log("Conectado");
			setConnected(true);
			setError(false);
		});
		newSocket.on("connect_error", (error) => {
			console.log("Erro:", error.message);
			setError(true);
			setConnected(false);
			if (error.message === "Token inválido") logout(navigate);
		});
		newSocket.on("disconnect", () => {
// console.log("Desconectado");
			setConnected(false);
		});
		newSocket.connect();
		socketRef.current = newSocket;
		setSocket(newSocket);
		return (() => newSocket.disconnect());
	}, [token]);

	return (
		<SocketContext.Provider value={{ socket, connected, error }}>
			{children}
		</SocketContext.Provider>
	);
}