import { memo, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";

import { formattedText } from "../../../../../../utils/components/formattedString.jsx";

/**
 * @author VAMPETA
 * @brief RENDERIZA MENSAGEM DE TEXTO
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Video = memo(function Video({ message }) {
    const [videoError, setVideoError] = useState(false);
    const { ref, inView } = useInView({ triggerOnce: true });
	const caption = useMemo(() => formattedText(message.video.caption), [message.video.caption]);

    return (
        <div ref={ref} className="flex flex-col gap-2">
            {(!videoError && message.video.link && inView) ? (
                <video className="w-full h-auto rounded" controls preload="metadata" playsInline src={message.video.link} onError={() => setVideoError(true)} />
            ) : (
                <div className="flex flex-col items-center p-20 bg-gray-300 rounded">
                    <i className="bi bi-image text-4xl" />
                    <p>Vídeo não disponível</p>
                </div>
            )}
            {caption && <p>{caption}</p>}
        </div>
    );
});

export default Video;