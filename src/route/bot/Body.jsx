import { useGetInfoBot } from "./useGetInfoBot.js";

import Error from "../../screens/Error.jsx";
import Load from "../../screens/Load.jsx";
import StatusBot from "./StatusBot.jsx";
import Visualization from "./Visualization.jsx";
import Prompt from "./Prompt.jsx";
import PromptSuggestion from "./PromptSuggestion.jsx";
import MessageNotSupported from "./MessageNotSupported.jsx";
import Location from "./Location.jsx";
import MessageNewContact from "./MessageNewContact.jsx";
import Redirect from "./Redirect.jsx";
// import OpeningHours from "./OpeningHours.jsx";

/**
 * @author VAMPETA
 * @brief PAGINA DE CONFIGURACOES DO BOT
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Body({ socket }) {
	const { bot, setBot, loading, error } = useGetInfoBot(socket);

	if (error) return (<Error />);
	if (loading) return (<Load />);
	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			<StatusBot socket={socket} bot={bot} />
			<Visualization socket={socket} bot={bot} />
			<Prompt socket={socket} bot={bot} setBot={setBot} />
			<PromptSuggestion socket={socket} bot={bot} />
			<MessageNotSupported socket={socket} bot={bot} />
			<Location socket={socket} bot={bot} />
			<MessageNewContact socket={socket} bot={bot} />
			<Redirect socket={socket} bot={bot} />
			{/* <OpeningHours /> */}
		</div>
	);
};