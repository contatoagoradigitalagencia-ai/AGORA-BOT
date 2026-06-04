import { memo, useMemo } from "react";

import { useGetFileInfo } from "./useGetFileInfo.js";
import { download } from "../../../utils/functions/download.js";
import { formattedText } from "../../../utils/components/formattedString.jsx";

/**
 * @author VAMPETA
 * @brief COMPONENTE RESPONSAVEL POR RENDERIZAR O ICONE CORRETO
 * @param {String} type TIPO DO ARQUIVO
*/
function IconFile({ type }) {
	switch (type) {
		case "Imagem":
			return (<i className="bi bi-file-earmark-image text-white text-4xl" />);
		case "Áudio":
			return (<i className="bi bi-file-earmark-music text-white text-4xl" />);
		case "Vídeo":
			return (<i className="bi bi-file-earmark-play text-white text-4xl" />);
		case "pdf":
			return (<i className="bi bi-file-earmark-pdf text-white text-4xl" />);
		case "zip":
			return (<i className="bi bi-file-earmark-zip text-white text-4xl" />);
		default:
			return (<i className="bi bi-file-earmark-text text-white text-4xl" />);
	}
}

/**
 * @author VAMPETA
 * @brief MENSAGENS DE DOCUMENTO DO CHAT
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Document = memo(function Document({ message }) {
	const src = (message.direction === "outbound") ? message.data.document.link : message.data.document.url;
	const { info } = useGetFileInfo(src);
	const text = useMemo(() => ((message?.data?.document?.caption) ? formattedText(message.data.document.caption) : null), [message?.data?.document?.caption]);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-3 bg-orange-500 rounded px-4 py-5 w-[70vw]">
				<div className="flex gap-3 min-w-0">
					<IconFile type={info.type} />
					<div className=" flex flex-col min-w-0 text-white">
						<p className="truncate">{message.data.document.filename}</p>
						<p className="text-xs opacity-80 whitespace-nowrap shrink-0">{(info.size) ? `${info.size} - ${info.type}` : "Carregando tamanho..."}</p>
					</div>
				</div>
				<div className="flex gap-3 text-orange-500">
					<a className="flex items-center justify-center w-12 h-10 bg-white cursor-pointer rounded" href={src} target="_blank" rel="noopener noreferrer">
						Abrir
					</a>
					<button className="w-12 h-10 bg-white cursor-pointer rounded" onClick={() => download(src, message.data.document.filename)}>
						<i className="bi bi-download text-xl" />
					</button>
				</div>
			</div>
			{text && <p>{text}</p>}
		</div>
	);
});

export default Document;