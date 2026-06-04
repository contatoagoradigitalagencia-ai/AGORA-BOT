import { useState } from "react";
import { useParams } from "react-router-dom";

import { useGetQuickMessage } from "./useGetQuickMessage.js";

import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import List from "./List.jsx";
import Editor from "./Editor.jsx";

/**
 * @author VAMPETA
 * @brief COMPONENTE COM CONFIGURACOES DE MENSAGENS RAPIDAS DE TEXTO
 * @param {Hook} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Body({ socket }) {
	const { type } = useParams();
	const { messages, setMessages, loading, error } = useGetQuickMessage(socket, type);
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [view, setView] = useState("list");
	const [search, setSearch] = useState("");
	const selected = messages.find((m) => (m.id === selectedMessage));
	const filteredMessages = messages.filter((m) => (m.name.toLowerCase().includes(search.toLowerCase()) || m.message.text.body.toLowerCase().includes(search.toLowerCase())));

	if (error) return (<Error />);
	if (loading) return (<Load />);
	return (
		<div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 lg:gap-6 h-full min-h-0 overflow-hidden">
			<List socket={socket} messages={messages} setMessages={setMessages} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} view={view} setView={setView} search={search} setSearch={setSearch} selected={selected} filteredMessages={filteredMessages} />
			<Editor socket={socket} messages={messages} setMessages={setMessages} selectedMessage={selectedMessage} setSelectedMessage={setSelectedMessage} view={view} setView={setView} search={search} setSearch={setSearch} selected={selected} filteredMessages={filteredMessages} />
		</div>
	);
}