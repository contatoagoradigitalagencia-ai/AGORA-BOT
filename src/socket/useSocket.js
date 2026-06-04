import { useContext } from "react";

import { SocketContext } from "./SocketProvider.jsx";

/**
 * @author VAMPETA
 * @brief HOOK QUE EXPORTA O CONTEXTO DO SOCKET
*/
export function useSocket() {
	return (useContext(SocketContext));
}