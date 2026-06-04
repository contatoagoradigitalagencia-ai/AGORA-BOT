import { useState, useEffect } from "react";

/**
 * @author VAMPETA
 * @brief HOOK QUE DEIXA IMAGEM OU VIDEO EM MODO TELA CHEIA
*/
export function useFullscreen() {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const getFullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
	const enterFullscreen = (element) => {
		const el = element || document.documentElement;
		const request = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
		if (request) request.call(el);
	};
	const exitFullscreen = () => {
		const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
		if (exit) exit.call(document);
	};
	const toggleFullscreen = (element) => {
		if (!getFullscreenElement()) {
			enterFullscreen(element);
		} else {
			exitFullscreen();
		}
	};

	useEffect(() => {
		const handleChange = () => setIsFullscreen(!!getFullscreenElement());

		document.addEventListener("fullscreenchange", handleChange);
		document.addEventListener("webkitfullscreenchange", handleChange);
		document.addEventListener("mozfullscreenchange", handleChange);
		document.addEventListener("MSFullscreenChange", handleChange);
		return (() => {
			document.removeEventListener("fullscreenchange", handleChange);
			document.removeEventListener("webkitfullscreenchange", handleChange);
			document.removeEventListener("mozfullscreenchange", handleChange);
			document.removeEventListener("MSFullscreenChange", handleChange);
		});
	}, []);
	return ({ isFullscreen, toggleFullscreen });
}