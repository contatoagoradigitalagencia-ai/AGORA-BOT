import { useSocket } from "../../socket/useSocket.js";

import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import Header from "./Header.jsx";
import Body from "./Body.jsx";

/**
 * @author VAMPETA
 * @brief COMPONENTE PRINCIPAL DO CHAT
*/
export default function QuickMessagesType() {
	const { socket, connected, error } = useSocket();

	if (!socket) return (<Load />);
	return (
		<div className="flex flex-col h-dvh bg-black overflow-hidden">
			<Header title="Mensagens de rápidas" />
			{!connected && !error && <Load />}
			{connected && <Body socket={socket} />}
			{error && <Error />}
		</div>
	);
}
