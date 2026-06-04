import Button from "./Button.jsx";

/**
 * @author VAMPETA
 * @brief IDENTIFICA O TIPO CERTO DA MENSAGEM INTERACTIVE
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
export default function Interactive({ message }) {
	switch (message.data?.interactive.type) {
		case "button":
			return (<Button message={message} />);
		default:
			return (<p className="text-red-900"><i>Mensagem interactive do tipo <b>{(message.data?.interactive.type) ? message.data?.interactive.type : "desconhecida"}</b> não suportada</i></p>);
	}
}