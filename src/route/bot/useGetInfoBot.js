import { useState, useEffect } from "react";
import { apiGet, apiPatch, apiPost } from "../../api/client.js";

const EMPTY_BOT = {
	account: null,
	config: null,
	prompt: null,
	prompts: [],
};

/**
 * @author VAMPETA
 * @brief HOOK QUE BUSCA INFORMACOES DE CONFIGURACOES DO BOT
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export function useGetInfoBot() {
	const [bot, setBot] = useState(EMPTY_BOT);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;

		apiGet("/bot-config")
			.then((res) => {
				if (!active) return ;
				setBot(res?.data || EMPTY_BOT);
			})
			.catch(() => {
				if (!active) return ;
				setError(true);
			})
			.finally(() => {
				if (!active) return ;
				setLoading(false);
			});

		return (() => {
			active = false;
		});
	}, []);

	return ({ bot, setBot, loading, error });
}

export async function updateAutoReply(bot, setBot, autoReply) {
	if (!bot?.account?._id) throw new Error("Nenhuma conta WhatsApp encontrada");
	const res = await apiPatch(`/whatsapp-accounts/${bot.account._id}/settings`, { autoReply });
	setBot((prev) => ({
		...prev,
		account: res?.data || { ...prev.account, settings: { ...(prev.account?.settings || {}), autoReply } },
	}));
}

export async function saveBotPrompt(bot, setBot, content) {
	const trimmed = String(content || "").trim();
	if (!trimmed) throw new Error("O prompt nao pode ficar vazio");

	if (bot?.prompt?._id) {
		const res = await apiPatch(`/prompts/${bot.prompt._id}`, { content: trimmed, active: true, type: "bot" });
		setBot((prev) => ({ ...prev, prompt: res?.data || { ...prev.prompt, content: trimmed } }));
		return ;
	}

	const created = await apiPost("/prompts", {
		name: "Prompt principal",
		type: "bot",
		content: trimmed,
		active: true,
	});
	const prompt = created?.data;
	if (prompt?._id && bot?.account?._id) {
		await apiPatch("/bot-config", { whatsappAccountId: bot.account._id, promptId: prompt._id });
	}
	setBot((prev) => ({ ...prev, prompt, prompts: [prompt, ...(prev.prompts || [])] }));
}
