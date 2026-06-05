export default function Text({ context }) {
	if (!context?.wamid) return null;
	const body = context?.data?.text?.body || context?.text || "Texto";
	return (
		<a className="flex items-center gap-1" href={"#" + context.wamid}>
			<p className="text-white text-xs truncate">{body}</p>
		</a>
	);
}
