import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CONTROLA O EVENTO DE CLICK DA FUNCAO
 * @param {String} id ID DA NOTIFICACAO
 * @param {Object} navigate FUNCAO DE CONTROLE DE ROTA
 * @param {String} phone NUMERO QUE ENVIOU A MENSAGEM
 */
function clickNotify(id, navigate, phone) {
	toast.dismiss(id);
	navigate(`/chat/${phone}`);
}

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE VERIFICA O TIPO DA MENSAGEM E RENDERIZA O ICONE CORRETO
 * @param {String} type TIPO DA MENSAGEM
*/
function IconeChat({ type }) {
	switch (type) {
		case "sticker":
			return (<i className="bi bi-subtract mr-2 text-white" />);
		case "audio":
			return (<i className="bi bi-mic-fill mr-2 text-white" />);
		case "image":
			return (<i className="bi bi-image mr-2 text-white" />);
		case "video":
			return (<i className="bi bi-film mr-2 text-white" />);
		case "location":
			return (<i className="bi bi-geo-alt-fill mr-2 text-white" />);
		case "contacts":
			return (<i className="bi bi-person-vcard mr-2 text-white" />);
		case "document":
			return (<i className="bi bi-file-earmark-text mr-2 text-white" />);
		case "interactive":
			return (<i className="bi bi-list-ul mr-2 text-white" />);
		default:
			return (null);
	}
}

/**
 * @author VAMPETA
 * @brief IDENTIFICA O TIPO DA MENSAGEM E RETORNA O TEXTO CORRETO
 * @param {Object} data CONTEUDO DA MENSAGEM
 */
function textChat(data) {
	switch (data.type) {
		case "text":
			return (data.text.body);
		case "sticker":
			return ("Figurinha");
		case "audio":
			return ("Áudio");
		case "image":
			return ((data.image.caption) ? data.image.caption : "Imagem");
		case "video":
			return ((data.video.caption) ? data.video.caption : "Vídeo");
		case "location":
			return ((data.location.name) ? data.location.name : "Localização");
		case "contacts":
			return (data.contacts[0].name.formatted_name);
		case "document":
			return ((data.document.filename) ? data.document.filename : "Documento");
		case "interactive":
			return (data.interactive.body.text);
		default:
			return (null);
	}
}

/**
 * @author VAMPETA
 * @brief COMPONENTE DE NOTIFICACAO DE MENSAGEM
 * @param {Object} t OBJETO PASSADO COMO PARAMETRO PELA LIB toast
 * @param {Object} newMessage NOVA MENSAGEM RECEBIDA
 */
export function NotifyMessage({ navigate, t, newMessage }) {
	return (
		<div className={`flex justify-between w-[80vw] rounded text-white bg-orange-500 ${t.visible ? "animate-toastIn" : "animate-toastOut"}`}>
			<div className="flex flex-col w-[80%] h-full px-4 py-3 cursor-pointer" onClick={() => clickNotify(t.id, navigate, newMessage.phone)}>
				<span>{newMessage.phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}</span>
				<span className="truncate">
					<IconeChat type={newMessage.data.type} />
					{textChat(newMessage.data)}
				</span>
			</div>
			<button className="flex justify-center items-center w-[20%] cursor-pointer opacity-70 hover:opacity-100" onClick={() => toast.dismiss(t.id)}>
				<i className="bi bi-x-square text-4xl"/>
			</button>
		</div>
	);
}