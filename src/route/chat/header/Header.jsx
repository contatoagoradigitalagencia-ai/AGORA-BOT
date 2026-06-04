import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useOverlay } from "../../../overlay/OverlayProvider.jsx";
import { useGetContact } from "./useGetContact.js";

import InfoContact from "./InfoContact.jsx";
import Comment from "./Comment.jsx";
import HumanService from "./HumanService.jsx";

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE SERA RENDERIZADO NO DRAWER
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} phone NUMERO DE TELEFONE DO CONTATO
 */
function Drawer({ socket, phone }) {
	const { contact, setContact, loading } = useGetContact(socket, phone);

	return (
		<div className="flex flex-col gap-6 p-4">
			{loading && (
				<div className="flex items-center justify-center h-full">
					<div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
				</div>
			)}
			{contact && (
				<>
					<InfoContact socket={socket} contact={contact} setContact={setContact} loading={loading} />
					<Comment socket={socket} contact={contact} setContact={setContact} loading={loading} />
					<HumanService socket={socket} contact={contact} setContact={setContact} loading={loading} />
				</>
			)}
		</div>
	);
}

/**
 * @author VAMPETA
 * @brief HEADER DO CHAT
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Header({ socket }) {
	const navigate = useNavigate();
	const { phone } = useParams();
	const { openDrawer } = useOverlay();

	return (
		<header className="flex justify-around items-center px-4 md:px-10 py-4 border-b border-zinc-800">
			<i className="bi bi-arrow-left cursor-pointer text-4xl text-orange-500" onClick={() => navigate("/chat")} />
			<h1 className="text-lg md:text-xl font-semibold text-orange-500">{phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')}</h1>
			<i className="bi bi-three-dots-vertical cursor-pointer text-4xl text-orange-500" onClick={() => openDrawer(<Drawer socket={socket} phone={phone} />)} />
		</header>
	);
}