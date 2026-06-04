import { useState } from "react";

import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import Body from "./Body.jsx";

/**
 * @author VAMPETA
 * @brief PAGINA DE DASHBOARD (PAGINA PRINCIPAL DO CLIENTE)
*/
export default function Dashboard() {
	const [open, setOpen] = useState(false);

	return (
		<div className="flex h-dvh bg-black text-white">
			<SideBar open={open} setOpen={setOpen} />
			<main className="flex-1 flex flex-col">
				<Header setOpen={setOpen} title="Dashboard" />
				<Body />
			</main>
		</div>
	);
}
