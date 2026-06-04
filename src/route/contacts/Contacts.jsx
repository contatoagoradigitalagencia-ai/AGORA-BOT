import { useState } from "react";

import { useSocket } from "../../socket/useSocket.js";

import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import Body from "./Body.jsx";

/**
 * @author VAMPETA
 * @brief PAGINA DE CONTATOS
*/
export default function Contacts() {
	const [open, setOpen] = useState(false);
	const { socket } = useSocket();

	return (
		<div className="flex h-dvh bg-black text-white">
			<SideBar open={open} setOpen={setOpen} />
			<main className="flex flex-1 flex-col">
				<Header setOpen={setOpen} title="Contatos" />
				<Body socket={socket} />
			</main>
		</div>
	);
}
