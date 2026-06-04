import { useState, useEffect } from "react";

/**
 * @author VAMPETA
 * @brief HOOK DE CONTROLE DO BOTAO DE FULLSCREEN
*/
export function useFullscreen() {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const getFullscreenElement = () => (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
	const enterFullscreen = () => {
		const element = document.documentElement;
		const request = element.requestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullScreen || element.msRequestFullscreen;
		if (request) request.call(element);
	};
	const exitFullscreen = () => {
		const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
		if (exit) exit.call(document);
	};
	const toggleFullscreen = () => {
		if (!getFullscreenElement()) {
			enterFullscreen();
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