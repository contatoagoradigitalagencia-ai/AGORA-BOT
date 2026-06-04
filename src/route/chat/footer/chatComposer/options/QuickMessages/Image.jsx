import { memo, useMemo } from "react";

import { formattedText } from "../../../../../../utils/components/formattedString.jsx";

/**
 * @author VAMPETA
 * @brief RENDERIZA MENSAGEM DE TEXTO
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Image = memo(function Image({ message }) {
	const caption = useMemo(() => formattedText(message.image.caption), [message.image.caption]);

	return (
		<div className="flex flex-col gap-2">
			{(message) ? (
				<img className="w-full h-auto rounded" src={message.image.link} loading="lazy" alt="Imagem da mensagem" />
			) : (
				<div className="flex flex-col items-center p-20 bg-gray-300 rounded">
					<i className="bi bi-image text-4xl" />
					<p>Imagem não disponível</p>
				</div>
			)}
			{caption && <p>{caption}</p>}
		</div>
	);
});

export default Image;