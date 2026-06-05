import { useSocket } from "../../socket/useSocket.js";
import ErrorBoundary from "../../utils/components/ErrorBoundary.jsx";

import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import Header from "./header/Header.jsx";
import Messages from "./messages/Messages.jsx";
import Footer from "./footer/Footer.jsx"

/**
 * @author VAMPETA
 * @brief COMPONENTE PRINCIPAL DO CHAT
*/
function ChatInner() {
	const { socket, connected, error } = useSocket();

	if (!socket) return (<Load />);
	return (
		<div className="flex flex-col h-dvh bg-black overflow-hidden">
			<Header socket={socket} />
			{!connected && !error && <Load />}
			{connected && <Messages socket={socket} />}
			{error && <Error />}
			<Footer socket={socket} />
		</div>
	);
}

export default function Chat() {
	return <ErrorBoundary><ChatInner /></ErrorBoundary>;
}
