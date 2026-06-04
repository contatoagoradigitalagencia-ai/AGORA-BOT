import { useState } from "react";

import { useSocket } from "../../socket/useSocket.js";

import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import Body from "./Body.jsx";

/**
 * @author VAMPETA
 * @brief PAGINA DE DASHBOARD (PAGINA PRINCIPAL DO CLIENTE)
*/
export default function Dashboard() {
	const [open, setOpen] = useState(false);
	const { socket, connected, error } = useSocket();

	if (!socket) return (<Load />);
	return (
		<div className="flex h-dvh bg-black text-white">
			<SideBar open={open} setOpen={setOpen} />
			<main className="flex-1 flex flex-col">
				<Header setOpen={setOpen} title="Dashboard" />
				{!connected && !error && <Load />}
				{connected && <Body socket={socket} />}
				{error && <Error />}
			</main>
		</div>
	);
}