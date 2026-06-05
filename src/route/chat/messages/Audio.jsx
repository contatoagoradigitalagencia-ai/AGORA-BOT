import { memo } from "react";
import { usePlayerAudio } from "../../../utils/hooks/usePlayerAudio.js";
import { download } from "../../../utils/functions/download.js";

function formatTime(time) {
	if (!time || isNaN(time)) return "0:00";
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60).toString().padStart(2, "0");
	return `${minutes}:${seconds}`;
}

function togglePlay(audioRef, playing, setPlaying) {
	if (!audioRef.current) return;
	playing ? audioRef.current.pause() : audioRef.current.play();
	setPlaying(!playing);
}

function handleSeek(e, audioRef) {
	const audio = audioRef.current;
	if (!audio) return;
	const rect    = e.currentTarget.getBoundingClientRect();
	const percent = (e.clientX - rect.left) / rect.width;
	if (audio.duration && !isNaN(audio.duration)) {
		audio.currentTime = percent * audio.duration;
	}
}

function toggleSpeed(audioRef, playbackRate, setPlaybackRate) {
	if (!audioRef.current) return;
	const next = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
	audioRef.current.playbackRate = next;
	setPlaybackRate(next);
}

const Audio = memo(function Audio({ message }) {
	const { audioRef, playing, setPlaying, progress, duration, currentTime, playbackRate, setPlaybackRate } = usePlayerAudio();

	// Suporta tanto media.url (R2) quanto data.audio.link/url (provedor direto)
	const src = message?.media?.url
		|| message?.media?.link
		|| message?.data?.audio?.link
		|| message?.data?.audio?.url
		|| null;

	// Transcrição opcional — nunca quebra se vier null
	const transcript = message?.media?.transcribe
		|| message?.data?.audio?.transcribe
		|| null;

	if (!src) {
		return (
			<div className="flex items-center gap-2 bg-zinc-800 rounded-xl px-4 py-3">
				<i className="bi bi-mic-mute text-zinc-500 text-xl" />
				<p className="text-xs text-zinc-500">Áudio não disponível</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-3 bg-orange-500 rounded-xl px-4 py-4 w-[260px] sm:w-[320px]">
				<audio ref={audioRef} src={src} preload="metadata" />
				<button
					className="flex items-center justify-center bg-white text-orange-500 rounded-full w-8 h-8 shrink-0"
					onClick={() => togglePlay(audioRef, playing, setPlaying)}
				>
					<i className={`bi ${playing ? "bi-pause-fill" : "bi-play-fill"} text-xl`} />
				</button>
				<div className="flex flex-col flex-1 min-w-0">
					<div
						className="w-full h-2 bg-orange-200 rounded cursor-pointer"
						onClick={(e) => handleSeek(e, audioRef)}
					>
						<div className="h-2 bg-white rounded transition-all" style={{ width: `${progress ?? 0}%` }} />
					</div>
					<p className="text-xs text-white mt-1">
						{formatTime(currentTime)}/{formatTime(duration)}
					</p>
				</div>
				<button
					className="w-10 h-8 bg-white text-orange-500 text-xs font-bold rounded shrink-0"
					onClick={() => toggleSpeed(audioRef, playbackRate, setPlaybackRate)}
				>
					{playbackRate}x
				</button>
				<button
					className="w-8 h-8 bg-white text-orange-500 rounded flex items-center justify-center shrink-0"
					onClick={() => download(src, "audio.mp3")}
				>
					<i className="bi bi-download" />
				</button>
			</div>
			{transcript && (
				<p className="text-xs text-zinc-400 italic px-1">{transcript}</p>
			)}
		</div>
	);
});

export default Audio;
