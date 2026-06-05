export default function Image({ context }) {
	if (!context?.wamid) return null;
	const caption = context?.data?.image?.caption || "Imagem";
	return (
		<a className="flex items-center gap-1" href={"#" + context.wamid}>
			<i className="bi bi-image text-orange-400 text-sm shrink-0" />
			<p className="text-white text-xs truncate">{caption}</p>
		</a>
	);
}
