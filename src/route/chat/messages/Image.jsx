import { memo, useMemo, useState, useRef } from "react";

import { useFullscreen } from "./useFullScreen.js";

import { formattedText } from "../../../utils/components/formattedString.jsx";

/**
 * @author VAMPETA
 * @brief MENSAGENS DE IMAGEM DO CHAT
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Image = memo(function Image({ message }) {
	const [imageError, setImageError] = useState(false);
	const imgRef = useRef(null);
	const { toggleFullscreen } = useFullscreen();
	const src = (message.direction === "outbound") ? message.data.image.link : message.data.image.url;
	const caption = useMemo(() => ((message?.data?.image?.caption) ? formattedText(message.data.image.caption) : null), [message?.data?.image?.caption]);

	return (
		<div className="flex flex-col gap-2">
			{(!imageError && src) ? (
				<img className="w-full h-auto rounded" ref={imgRef} src={src} loading="lazy" alt="Imagem da mensagem" onError={() => setImageError(true)} onClick={() => toggleFullscreen(imgRef.current)} />
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