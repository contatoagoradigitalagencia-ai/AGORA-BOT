import { memo, useMemo } from "react";

import { usePlayerAudio } from "../../../../../../utils/hooks/usePlayerAudio.js";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE FORMATA O TEMPO DO AUDIO
 * @param {Number} time TEMPO QUE VAI SER FORMATADO
*/
function formatTime(time) {
	if (!time) return ("0:00");
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60).toString().padStart(2, "0");
	return (`${minutes}:${seconds}`);
};

/**
 * @author VAMPETA
 * @brief FUNCAO RESPONSAVEL POR CONTROLAR A REPRODUCAO DO AUDIO (PLAY / PAUSE)
 * @param {Object} audioRef REFERENCIA DO ELEMENTO HTML <audio>
 * @param {Boolean} playing ESTADO ATUAL DA REPRODUCAO DO AUDIO
 * @param {Function} setPlaying FUNCAO RESPONSAVEL POR ATUALIZAR O ESTADO DE REPRODUCAO
*/
function togglePlay(audioRef, playing, setPlaying) {
	if (!audioRef.current) return;
	(playing) ? audioRef.current.pause() : audioRef.current.play();
	setPlaying(!playing);
};

/**
 * @author VAMPETA
 * @brief FUNCAO RESPONSAVEL POR ALTERAR A POSICAO DO AUDIO AO CLICAR NA BARRA DE PROGRESSO
 * @param {Object} e EVENTO DE CLICK DISPARADO NA BARRA DE PROGRESSO
 * @param {Object} audioRef REFERENCIA DO ELEMENTO HTML <audio>
*/
function handleSeek(e, audioRef) {
	const audio = audioRef.current;
	const rect = e.currentTarget.getBoundingClientRect();
	const percent = (e.clientX - rect.left) / rect.width;

	audio.currentTime = percent * audio.duration;
};

/**
 * @author VAMPETA
 * @brief RENDERIZA MENSAGEM DE AUDIO
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Audio = memo(function Audio({ message }) {
	const { audioRef, playing, setPlaying, progress, duration, currentTime, playbackRate, setPlaybackRate } = usePlayerAudio();

	return (
		<>
			<div className="flex items-center gap-3 bg-orange-500 rounded-xl px-4 py-5 w-full">
				<audio ref={audioRef} src={message.audio.link} preload="metadata" />
				<button className="flex items-center justify-center bg-white text-orange-500 rounded-full w-8 h-8 cursor-pointer" onClick={(e) => { e.stopPropagation(), togglePlay(audioRef, playing, setPlaying) }}>
					{(playing) ? (
						<i className="bi bi-pause-fill text-xl" />
					) : (
						<i className="bi bi-play-fill text-xl" />
					)}
				</button>
				<div className="flex flex-col flex-1">
					<div className="w-full h-2 bg-orange-200 rounded cursor-pointer" onClick={(e) => { e.stopPropagation(), handleSeek(e, audioRef) }}>
						<div className="h-2 bg-white rounded" style={{ width: `${progress}%` }} />
					</div>
					<div className="flex justify-between text-xs text-white mt-2">
						{`${formatTime(currentTime)}/${formatTime(duration)}`}
						<span className="text-white text-xs font-medium">
							{(message.audio?.voice) ? "Mensagem de voz" : "Áudio"}
							<i className={`bi ${(message.audio?.voice) ? "bi-mic-fill" : "bi-volume-up-fill"} text-white pl-1`} />
						</span>
					</div>
				</div>
			</div>
			<p className="my-1">{message.audio?.transcribe}</p>
		</>
	);
});

export default Audio;