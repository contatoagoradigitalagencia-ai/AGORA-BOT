import { useReplyWindow } from "./useReplyWindow.js";

import ChatComposer from "./chatComposer/ChatComposer.jsx";

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL POR INFORMAR QUE A JANELA DE RESPOSTA PASSOU DAS 24 HORAS
*/
function OutsideResponseWindow() {
	return (
		<div className="flex items-center justify-center h-14 border-zinc-800 border-t shrink-0">
			<p className="text-red-500">Fora da janela de 24 horas</p>
		</div>
	);
}

/**
 * @author VAMPETA
 * @brief FOOTER DO CHAT
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Footer({ socket }) {
	const { replyWindow } = useReplyWindow(socket);

	return (
		<>
			{(replyWindow) ? <ChatComposer socket={socket} /> : <OutsideResponseWindow />}
		</>
	);
}