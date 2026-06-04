import { Link } from "react-router-dom";
import { useState } from "react";

import { useGetContacts } from "./useGetContacts.js";
import { useOverlay } from "../../overlay/OverlayProvider.jsx";

import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import InfoContact from "./InfoContact.jsx";
import LastMessage from "./LastMessage.jsx";
import Comment from "./Comment.jsx";

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE SERA RENDERIZADO NO DRAWER
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {Objetc} contact INFORMACOES DO CONTATO
 * @param {Object} setContact FUNCAO DE CONTROLE DA VARIAVEL contact
 */
function Drawer({ socket, selected }) {
	const [contact, setContact] = useState(selected);
	const { closeOverlay } = useOverlay();

	if (!contact) return (null);
	return (
		<div className="flex flex-col gap-6 p-4">
			<InfoContact socket={socket} contact={contact} setContact={setContact} />
			<LastMessage contact={contact} />
			<Comment socket={socket} contact={contact} setContact={setContact} />
			<Link className="text-center bg-orange-500 text-black py-2 rounded-lg hover:bg-orange-400" to={`/chat/${contact.phone}`} onClick={closeOverlay}>Abrir conversa</Link>
		</div>
	);
}

/**
 * @author VAMPETA
 * @brief PAGINA DE CONTATOS
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Body({ socket }) {
	const { contacts, loading, error } = useGetContacts(socket);
	const { openDrawer } = useOverlay();
	const [selected, setSelected] = useState(null);
	const [search, setSearch] = useState("");

	if (error) return (<Error />);
	if (loading) return (<Load />);
	const filtered = contacts.filter((contact) => (contact.name || "").toLowerCase().includes(search.toLowerCase()));
	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			<input className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-orange-500" type="text" placeholder="Buscar contatos..." value={search} onChange={(e) => setSearch(e.target.value)} />
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
				{filtered.map((contact, i) => (
					<div className="group bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:bg-orange-500 transition cursor-pointer" key={i} onClick={() => openDrawer(<Drawer socket={socket} selected={contact} />)}>
						<p className="font-semibold truncate">{contact.name || "Sem nome"}</p>
						<span className="text-xs text-zinc-500">{contact.phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')}</span>
					</div>
				))}
			</div>
		</div>
	);
};