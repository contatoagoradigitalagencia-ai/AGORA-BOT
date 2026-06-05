import { memo } from "react";

const Location = memo(function Location({ message }) {
	const loc = message?.data?.location;
	const lat  = loc?.latitude;
	const lng  = loc?.longitude;
	const name = loc?.name || "Localização";
	const addr = loc?.address || "";

	if (!lat || !lng) {
		return (
			<div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-4 py-3">
				<i className="bi bi-geo-alt text-zinc-500 text-xl" />
				<p className="text-xs text-zinc-500">Localização não disponível</p>
			</div>
		);
	}

	return (
		<a className="flex flex-col gap-2 w-[260px]" href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer">
			<div className="flex items-center justify-center py-4 rounded-xl bg-orange-500">
				<i className="bi bi-geo-alt-fill text-white text-6xl" />
			</div>
			{name && <p className="text-sm font-medium">{name}</p>}
			{addr && <p className="text-xs text-zinc-400">{addr}</p>}
		</a>
	);
});

export default Location;
