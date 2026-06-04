import { memo, useMemo } from "react";

import { formattedText } from "../../../../../../utils/components/formattedString.jsx";

/**
 * @author VAMPETA
 * @brief RENDERIZA MENSAGEM DE DOCUMENTO
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Document = memo(function Document({ message }) {
	const caption = useMemo(() => (formattedText(message.document.caption)), [message.document.caption]);

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between gap-3 bg-orange-500 rounded px-4 py-5 w-full">
				<div className="flex gap-3 min-w-0">
					<i className="bi bi-file-earmark-text text-white text-4xl" />
					<p className="text-white truncate">{message.document.filename}</p>
				</div>
				<a className="flex items-center justify-center w-12 h-10 bg-white text-orange-500 cursor-pointer rounded" href={message.document.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
					Abrir
				</a>
			</div>
			{caption && <p>{caption}</p>}
		</div>
	);
});

export default Document;