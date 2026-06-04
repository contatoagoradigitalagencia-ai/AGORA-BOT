import { useQuickMessages } from "./useQuickMessages.js";

import Text from "./Text.jsx";
import Audio from "./Audio.jsx";
import Image from "./Image.jsx";
import Video from "./Video.jsx";
import Location from "./Location.jsx";
import Document from "./Document.jsx";

import { sendReadyMessage } from "./sendReadyMessage.js";
import { useOverlay } from "../../../../../../overlay/OverlayProvider.jsx";

/**
 * @author VAMPETA
 * @brief IDENTIFICA O TIPO CERTO DA MENSAGEM
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
function QuickMessage({ message }) {
	switch (message.type) {
		case "text":
			return (<Text message={message} />);
		case "audio":
			return (<Audio message={message} />);
		case "image":
			return (<Image message={message} />);
		case "video":
			return (<Video message={message} />);
		case "location":
			return (<Location message={message} />);
		case "document":
			return (<Document message={message} />);
		default:
			return (<p className="text-red-900"><i>Mensagem do tipo <b>{message.type}</b> não suportada</i></p>);
	}
}

/**
 * @author VAMPETA
 * @brief IDENTIFICA O TIPO CERTO DA MENSAGEM
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} type TIPO DA MENSAGEM
 * @param {String} phone NUMERO QUE VAI RECEBER A MENSAGEM
*/
export default function QuickMessages({ socket, type, phone }) {
	const { messages } = useQuickMessages(socket, type);
	const { closeOverlay } = useOverlay();

	return (
		<div className="flex-1 overflow-y-auto p-4">
			{messages === null && (
				<div className="flex items-center justify-center h-full">
					<div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
				</div>
			)}
			{Array.isArray(messages) && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{messages.map((message, i) => (
						<div className="bg-gray-400 text-black hover:bg-gray-600 p-3 rounded cursor-pointer transition break-words" key={i} onClick={() => { sendReadyMessage(socket, phone, message), closeOverlay() }}>
							<QuickMessage message={message} />
						</div>
					))}
				</div>
			)}
		</div>
	);
}