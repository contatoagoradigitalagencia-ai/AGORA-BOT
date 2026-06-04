import { useParams } from "react-router-dom";

import { useOverlay } from "../../../../../overlay/OverlayProvider.jsx";

import IA from "./IA/IA.jsx";
import QuickMessages from "./QuickMessages/QuickMessages.jsx";

/**
 * @author VAMPETA
 * @brief BOTAO DE OPCAO
 * @param {String} icon ICONE A SER USADO
 * @param {String} label DESCRICAO DO BOTAO
 * @param {Function} onClick FUNCAO A SER EXECUTADA
*/
function Option({ icon, label, onClick }) {
	return (
		<button className="flex flex-col items-center gap-2">
			<div className="h-20 w-20 bg-zinc-900 rounded-xl flex items-center justify-center hover:bg-zinc-700 cursor-pointer" onClick={onClick}>
				<i className={`bi ${icon} text-xl text-orange-500`} />
			</div>
			<span className="text-white text-sm">{label}</span>
		</button>
	);
}

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL POR EXIBIR O MENU DE OPCOES
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Options({ socket }) {
	const { phone } = useParams();
	const { openModal } = useOverlay();

	return (
		<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 p-6 min-h-full">
			<Option icon="bi-stars" label="IA" onClick={() => openModal(<IA socket={socket} phone={phone} />)} />
			<Option icon="bi-chat-left-text" label="Texto" onClick={() => openModal(<QuickMessages socket={socket} type="text" phone={phone} />)} />
			<Option icon="bi-mic" label="Áudio" onClick={() => openModal(<QuickMessages socket={socket} type="audio" phone={phone} />)} />
			<Option icon="bi-image" label="Imagem" onClick={() => openModal(<QuickMessages socket={socket} type="image" phone={phone} />)} />
			<Option icon="bi-film" label="Vídeo" onClick={() => openModal(<QuickMessages socket={socket} type="video" phone={phone} />)} />
			<Option icon="bi-geo-alt" label="Localização" onClick={() => openModal(<QuickMessages socket={socket} type="location" phone={phone} />)} />
			<Option icon="bi-file-earmark-text" label="Documento" onClick={() => openModal(<QuickMessages socket={socket} type="document" phone={phone} />)} />
		</div>
	);
}