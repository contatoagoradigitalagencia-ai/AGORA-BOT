import { memo, useMemo, useState, useRef } from "react";
import { useFullscreen } from "./useFullScreen.js";
import { formattedText } from "../../../utils/components/formattedString.jsx";

const Image = memo(function Image({ message }) {
	const [imageError, setImageError] = useState(false);
	const imgRef = useRef(null);
	const { toggleFullscreen } = useFullscreen();

	const src = message?.data?.image?.link || message?.data?.image?.url || null;
	const caption = useMemo(() =>
		message?.data?.image?.caption ? formattedText(message.data.image.caption) : null,
	[message?.data?.image?.caption]);

	if (!src || imageError) {
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
