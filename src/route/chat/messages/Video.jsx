import { memo, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import { formattedText } from "../../../utils/components/formattedString.jsx";

/**
 * @author VAMPETA
 * @brief MENSAGENS DE VIDEO DO CHAT
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Video = memo(function Video({ message }) {
	const [videoError, setVideoError] = useState(false);
	const { ref, inView } = useInView({ triggerOnce: true });
	const src = (message.direction === "outbound") ? message.data.video.link : message.data.video.url;
	const text = useMemo(() => ((message?.data?.video?.caption) ? formattedText(message.data.video.caption) : null), [message?.data?.video?.caption]);

	return (
		<div ref={ref} className="flex flex-col gap-2">
			{(!videoError && src && inView) ? (
				<video className="w-full h-auto rounded" controls preload="metadata" playsInline src={src} onError={() => setVideoError(true)} />
			) : (
				<div className="flex flex-col items-center p-20 bg-gray-300 rounded">
					<i className="bi bi-image text-4xl" />
					<p>Vídeo não disponível</p>
				</div>
			)}
			{text && <p>{text}</p>}
		</div>
	);
});

export default Video;