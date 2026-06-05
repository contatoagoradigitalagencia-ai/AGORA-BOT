import { memo } from "react";

const Sticker = memo(function Sticker({ message }) {
	const src = message?.data?.sticker?.link || message?.data?.sticker?.url || null;
	if (!src) return <p className="text-xs text-zinc-500 italic">[figurinha]</p>;
	return (
		<div className="flex justify-center">
			<img className="w-28 h-auto object-contain m-1 select-none rounded-xl" src={src} alt="Figurinha" />
		</div>
	);
});

export default Sticker;
