import { useState, useEffect } from "react";

import { parsePrompt, buildPrompt } from "./prompt.js";

/**
 * @author VAMPETA
 * @brief HOOK QUE SINCRONIZA A VARIAVEL bot COM A VARIAVEL fields
 * @param {Object} bot INFORMACOES DO BOT
 * @param {Object} setBot FUNCAO QUE MODIFICA bot
*/
export function usePrompt(bot, setBot) {
	const [fields, setFields] = useState(parsePrompt(bot.prompt || ""));

	useEffect(() => {
		const prompt = buildPrompt(fields);

		setBot((prev) => {
			if (prev.prompt === prompt) return (prev);
			return ({ ...prev, prompt });
		});
	}, [fields]);
	return ({ fields, setFields });
}