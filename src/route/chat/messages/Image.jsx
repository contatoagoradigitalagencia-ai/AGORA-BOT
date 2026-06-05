import { memo, useMemo, useState, useRef } from "react";
import { useFullscreen } from "./useFullScreen.js";
import { formattedText } from "../../../utils/components/formattedString.jsx";
import { mediaCaption, mediaSource, warnMissingMediaUrl } from "./mediaSource.js";

const Image = memo(function Image({ message }) {
	const [imageError, setImageError] = useState(false);
	const imgRef = useRef(null);
	const { toggleFullscreen } = useFullscreen();

	const src = mediaSource(message, "image");
	const captionText = mediaCaption(message, "image");
	const caption = useMemo(() =>
		captionText ? formattedText(captionText) : null,
	[captionText]);

	if (!src || imageError) {
		if (!src) warnMissingMediaUrl(message, "image");
		return (
			<div className="flex flex-col items-center p-10 bg-zinc-800 rounded gap-2">
				<i className="bi bi-image text-3xl text-zinc-500" />
				<p className="text-xs text-zinc-500">Imagem não disponível</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<img
				className="w-full h-auto rounded cursor-pointer"
				ref={imgRef}
				src={src}
				loading="lazy"
				alt="Imagem"
				onError={() => setImageError(true)}
				onClick={() => toggleFullscreen(imgRef.current)}
			/>
			{caption && <p>{caption}</p>}
		</div>
	);
});

export default Image;
