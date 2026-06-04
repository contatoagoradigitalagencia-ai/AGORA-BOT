import { useState } from "react";

import { useSocket } from "../../socket/useSocket.js";

import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import Body from "./Body.jsx";

/**
 * @author VAMPETA
 * @brief PAGINA DE CONTATOS EM ESPERA PARA ATENDIMENTO HUMANO
*/
export default function HumanService() {
	const [open, setOpen] = useState(false);
	const { socket } = useSocket();

	return (
		<div className="flex h-dvh bg-black text-white">
			<SideBar open={open} setOpen={setOpen} />
			<main className="flex flex-1 flex-col">
				<Header setOpen={setOpen} title="Atendimento humano" />
				<Body socket={socket} />
			</main>
		</div>
	);
}
