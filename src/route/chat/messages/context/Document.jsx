export default function Document({ context }) {
	if (!context?.wamid) return null;
	const filename = context?.data?.document?.filename || context?.data?.document?.fileName || "Documento";
	return (
		<a className="flex items-center gap-1" href={"#" + context.wamid}>
			<i className="bi bi-file-earmark-text text-orange-400 text-sm shrink-0" />
			<p className="text-white text-xs truncate">{filename}</p>
		</a>
	);
}
