import { useParams } from "react-router-dom";

import Text from "./Text.jsx";
import Sticker from "./Sticker.jsx";
import Audio from "./Audio.jsx";
import Image from "./Image.jsx";
import Video from "./Video.jsx";
import Location from "./Location.jsx";
import Contacts from "./Contacts.jsx";
import Document from "./Document.jsx";
import Interactive from "./Interactive.jsx";

/**
 * @author VAMPETA
 * @brief RENDERIZA O PREVIEW DO TIPO CERTO DA MENSAGEM
 * @param {Object} context MENSAGEM RESPONDIDA
*/
function MessageContext({ context }) {
	switch (context.data?.type) {
		case "text":
			return (<Text context={context} />);
		case "sticker":
			return (<Sticker context={context} />);
		case "audio":
			return (<Audio context={context} />);
		case "image":
			return (<Image context={context} />);
		case "video":
			return (<Video context={context} />);
		case "location":
			return (<Location context={context} />);
		case "contacts":
			return (<Contacts context={context} />);
		case "document":
			return (<Document context={context} />);
		case "interactive":
			return (<Interactive context={context} />);
		default:
			return (<p className="text-red-900"><i>Pré-visualização de mensagem do tipo <b>{(context.data?.type) ? context.data?.type : "desconhecida"}</b> não suportada</i></p>);
	}
}

/**
 * @author VAMPETA
 * @brief RENDERIZA O CONTEXTO DA MENSAGEM CASO FOR UMA RESPOSTA A OUTRA MENSAGEM
 * @param {Object} message MENSAGEM COM O CONTEXTO A SER RENDERIZADO
*/
export default function Context({ message }) {
	const { phone } = useParams();

	return (
		<div className="mb-2 p-2 rounded bg-gray-500 border-l-4 border-orange-400">
			<p className="text-xs text-orange-300 font-semibold">{(message.context.direction === "inbound") ? phone : "Bot"}</p>
			<MessageContext context={message.context} />
		</div>
	);
}