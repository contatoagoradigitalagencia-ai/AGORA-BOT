export default function Video({ context }) {
	if (!context?.wamid) return null;
	const caption = context?.data?.video?.caption || "Vídeo";
	return (
		<a className="flex items-center gap-1" href={"#" + context.wamid}>
			<i className="bi bi-film text-orange-400 text-sm shrink-0" />
			<p className="text-white text-xs truncate">{caption}</p>
		</a>
	);
}
