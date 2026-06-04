import { useRef, useState, useEffect } from "react";

/**
 * @author VAMPETA
 * @brief HOOK QUE CONTROLA O PLAYER DO AUDIO
*/
export function usePlayerAudio() {
	const audioRef = useRef(null);
	const [playing, setPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);
	const [playbackRate, setPlaybackRate] = useState(1);

	const handleTimeUpdate = () => {
		const audio = audioRef.current;

		if (!audio) return ;
		setCurrentTime(audio.currentTime);
		setProgress((audio.currentTime / audio.duration) * 100);
	};
	const handleLoaded = () => {
		setDuration(audioRef.current.duration);
		audioRef.current.playbackRate = playbackRate;
	};

	useEffect(() => {
		const audio = audioRef.current;

		if (!audio) return ;
		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("loadedmetadata", handleLoaded);
		return (() => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("loadedmetadata", handleLoaded);
		});
	}, []);
	return ({ audioRef, playing, setPlaying, progress, duration, currentTime, playbackRate, setPlaybackRate });
}