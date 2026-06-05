import { useState, useEffect } from "react";
import { apiGet, apiPatch, apiPost, apiList } from "../../api/client.js";

const EMPTY_BOT = {
	account: null,
	config:  null,
	prompt:  null,
	prompts: [],
};

/**
 * Busca configurações do bot.
 * Estratégia:
 *   1. GET /bot-config  (retorna account + config + prompt)
 *   2. Se account vier null, busca diretamente GET /whatsapp-accounts
 */
export function useGetInfoBot() {
	const [bot, setBot]     = useState(EMPTY_BOT);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;

		async function load() {
			try {
				const res = await apiGet("/bot-config");
				const data = res?.data || EMPTY_BOT;

				// Se account veio null, tenta buscar diretamente
				if (!data.account) {
					const accounts = await apiList("/whatsapp-accounts");
					if (accounts.length > 0) {
						const acc = accounts[0];
						// normaliza _id → id
						if (!acc.id && acc._id) acc.id = String(acc._id);
						data.account = acc;
					}
				} else {
					// normaliza _id → id
					if (!data.account.id && data.account._id) {
						data.account.id = String(data.account._id);
					}
				}

				if (active) setBot(data);
			} catch {
				if (active) setError(true);
			} finally {
				if (active) setLoading(false);
			}
		}

		load();
		return () => { active = false; };
	}, []);

	return { bot, setBot, loading, error };
}

export async function updateAutoReply(bot, setBot, autoReply) {
	const accountId = bot?.account?.id || bot?.account?._id;
	if (!accountId) throw new Error("Nenhuma conta WhatsApp encontrada");

	// Backend aceita { autoReply } direto no body
	const res = await apiPatch(`/whatsapp-accounts/${accountId}/settings`, { autoReply });
	const updated = res?.data;

	setBot((prev) => ({
		...prev,
		account: updated || {
			...prev.account,
			settings: { ...(prev.account?.settings || {}), autoReply },
		},
	}));
}

export async function saveBotPrompt(bot, setBot, content) {
	const trimmed = String(content || "").trim();
	if (!trimmed) throw new Error("O prompt não pode ficar vazio");

	const accountId = bot?.account?.id || bot?.account?._id;

	if (bot?.prompt?._id) {
		const res = await apiPatch(`/prompts/${bot.prompt._id}`, { content: trimmed, active: true, type: "bot" });
		setBot((prev) => ({ ...prev, prompt: res?.data || { ...prev.prompt, content: trimmed } }));
		return;
	}

	const created = await apiPost("/prompts", {
		name:    "Prompt principal",
		type:    "bot",
		content: trimmed,
		active:  true,
	});
	const prompt = created?.data;
	if (prompt?._id && accountId) {
		await apiPatch("/bot-config", { whatsappAccountId: accountId, promptId: prompt._id });
	}
	setBot((prev) => ({ ...prev, prompt, prompts: [prompt, ...(prev.prompts || [])] }));
}
