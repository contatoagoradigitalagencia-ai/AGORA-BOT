import { memo, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { formattedText } from "../../../utils/components/formattedString.jsx";
import { mediaCaption, mediaSource, warnMissingMediaUrl } from "./mediaSource.js";

const Video = memo(function Video({ message }) {
	const [videoError, setVideoError] = useState(false);
	const { ref, inView } = useInView({ triggerOnce: true });

	const src = mediaSource(message, "video");
	const captionText = mediaCaption(message, "video");
	const text = useMemo(() =>
		captionText ? formattedText(captionText) : null,
	[captionText]);

	if (!src) warnMissingMediaUrl(message, "video");

	return (
		<div ref={ref} className="flex flex-col gap-2">
			{!videoError && src && inView ? (
				<video className="w-full h-auto rounded" controls preload="metadata" playsInline src={src} onError={() => setVideoError(true)} />
			) : (
				<div className="flex flex-col items-center p-10 bg-zinc-800 rounded gap-2">
					<i className="bi bi-film text-3xl text-zinc-500" />
					<p className="text-xs text-zinc-500">Vídeo não disponível</p>
				</div>
			)}
			{text && <p>{text}</p>}
		</div>
	);
});

export default Video;
