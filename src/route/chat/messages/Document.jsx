import { memo, useMemo } from "react";
import { useGetFileInfo } from "./useGetFileInfo.js";
import { download } from "../../../utils/functions/download.js";
import { formattedText } from "../../../utils/components/formattedString.jsx";

function IconFile({ type }) {
	if (type === "Imagem")  return <i className="bi bi-file-earmark-image text-white text-4xl" />;
	if (type === "Áudio")   return <i className="bi bi-file-earmark-music text-white text-4xl" />;
	if (type === "Vídeo")   return <i className="bi bi-file-earmark-play text-white text-4xl" />;
	if (type === "pdf")     return <i className="bi bi-file-earmark-pdf text-white text-4xl" />;
	if (type === "zip")     return <i className="bi bi-file-earmark-zip text-white text-4xl" />;
	return <i className="bi bi-file-earmark-text text-white text-4xl" />;
}

const Document = memo(function Document({ message }) {
	const src = message?.data?.document?.link || message?.data?.document?.url || null;
	const filename = message?.data?.document?.filename || "documento";
	const { info } = useGetFileInfo(src);
	const text = useMemo(() =>
		message?.data?.document?.caption ? formattedText(message.data.document.caption) : null,
	[message?.data?.document?.caption]);

	if (!src) {
		return (
			<div className="flex items-center gap-2 bg-zinc-800 rounded px-4 py-3">
				<i className="bi bi-file-earmark-text text-zinc-500 text-2xl" />
				<p className="text-xs text-zinc-500">Documento não disponível</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-3 bg-orange-500 rounded px-4 py-5 w-[70vw]">
				<div className="flex gap-3 min-w-0">
					<IconFile type={info?.type} />
					<div className="flex flex-col min-w-0 text-white">
						<p className="truncate">{filename}</p>
						<p className="text-xs opacity-80 whitespace-nowrap shrink-0">
							{info?.size ? `${info.size} - ${info.type}` : "Carregando..."}
						</p>
					</div>
				</div>
				<div className="flex gap-3 text-orange-500">
					<a className="flex items-center justify-center w-12 h-10 bg-white cursor-pointer rounded text-sm" href={src} target="_blank" rel="noopener noreferrer">Abrir</a>
					<button className="w-12 h-10 bg-white cursor-pointer rounded" onClick={() => download(src, filename)}>
						<i className="bi bi-download text-xl" />
					</button>
				</div>
			</div>
			{text && <p>{text}</p>}
		</div>
	);
});

export default Document;
