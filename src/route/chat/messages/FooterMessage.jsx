import { formatDate } from "../../../utils/functions/formatDate.js";

function Visualization({ status }) {
	const map = {
		sending:   <i className="bi bi-clock ml-2 text-xs text-gray-500" />,
		sent:      <i className="bi bi-check ml-2 text-base text-gray-500" />,
		delivered: <i className="bi bi-check-all ml-2 text-base text-gray-500" />,
		read:      <i className="bi bi-check-all ml-2 text-base text-blue-500" />,
		played:    <i className="bi bi-check-all ml-2 text-base text-blue-500" />,
		failed:    <i className="bi bi-exclamation-triangle-fill ml-2 text-base text-yellow-500" />,
	};
	return map[status] || null;
}

export default function FooterMessage({ message }) {
	const isAudio = message?.data?.type === "audio" || message?.type === "audio";
	const isVoice = message?.data?.audio?.voice === true;

	return (
		<div className={`flex ${isAudio ? "justify-between" : "justify-end"} items-center mt-1`}>
			{isAudio && (
				<i className={`bi ${isVoice ? "bi-mic-fill" : "bi-music-note-beamed"} text-xs ${message?.status === "played" ? "text-blue-400" : "text-gray-400"}`} />
			)}
			<div className="flex items-center gap-0.5">
				<span className="text-xs text-gray-400">{formatDate(message?.timestamp || message?.occurredAt)}</span>
				{message?.status && <Visualization status={message.status} />}
			</div>
		</div>
	);
}
