import { useState } from "react";

import { useSocket } from "../../socket/useSocket.js";

import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import Body from "./Body.jsx";

/**
 * @author VAMPETA
 * @brief PAGINA DE CONVERSAS
*/
export default function Chats() {
	const [open, setOpen] = useState(false);
	const { socket } = useSocket();

	return (
		<div className="flex h-dvh bg-black text-white">
			<SideBar open={open} setOpen={setOpen} />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header setOpen={setOpen} title="Conversas" />
				<Body socket={socket} />
			</div>
		</div>
	);
}
