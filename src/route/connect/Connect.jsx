import { useState } from "react";
import { SideBar, Header } from "../../utils/components/Sidebar.jsx";
import Body from "./Body.jsx";

/**
 * @brief Página /connect — Conectar WhatsApp via QR Code
 */
export default function Connect() {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex h-dvh bg-black text-white">
			<SideBar open={open} setOpen={setOpen} />
			<main className="flex flex-1 flex-col">
				<Header setOpen={setOpen} title="Conectar WhatsApp" />
				<Body />
			</main>
		</div>
	);
}
