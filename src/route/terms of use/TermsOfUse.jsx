import { useState } from "react";

import { useSocket } from "../../socket/useSocket.js";

import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
// import Body from "./Body.jsx";
import UnderConstruction from "../../screens/UnderConstruction.jsx";

/**
 * @author VAMPETA
 * @brief PAGINA DE TERMOS DE USO
*/
export default function TermsOfUSe() {
	const [open, setOpen] = useState(false);
	const { socket, connected, error } = useSocket();

	if (!socket) return (<Load />);
	return (
		<div className="flex h-dvh bg-black text-white">
			<SideBar open={open} setOpen={setOpen} />
			<main className="flex flex-1 flex-col">
				<Header setOpen={setOpen} title="Termos de uso" />
				{!connected && !error && <Load />}
				{/* {connected && <Body socket={socket} />} */}
				<UnderConstruction />
				{error && <Error />}
			</main>
		</div>
	);
}