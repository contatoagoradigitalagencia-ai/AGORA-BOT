import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { saveBotPrompt } from "./useGetInfoBot.js";

/**
 * @author VAMPETA
 * @brief COMPONENTE DE CONFIGURACAO DE PROMPT
 * @param {Object} bot INFORMACOES DO BOT
 * @param {Object} setBot FUNCAO QUE MODIFICA bot
*/
export default function Prompt({ bot, setBot }) {
	const [content, setContent] = useState("");
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setContent(bot?.prompt?.content || "");
	}, [bot?.prompt?.content]);

	async function handleSave() {
		if (saving) return ;
		setSaving(true);
		try {
			await saveBotPrompt(bot, setBot, content);
			toast.success("Prompt salvo com sucesso!");
		} catch (error) {
			toast.error(error?.message || "Erro ao salvar prompt!");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-5" id="prompt">
			<div className="flex flex-col gap-2">
				<h2 className="text-lg font-semibold">Prompt de IA</h2>
				<p className="text-sm text-zinc-400">
					Defina como a IA deve conversar com seus clientes. Produtos, servicos e planos devem ser consultados no Catalogo do MongoDB.
				</p>
				{!bot?.prompt && (
					<p className="text-sm text-orange-300">
						Nenhum prompt cadastrado. Escreva o prompt principal e salve para ativar a configuracao.
					</p>
				)}
			</div>
			<textarea
				className="min-h-56 w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-sm text-zinc-100 outline-none focus:border-orange-500"
				value={content}
				onChange={(event) => setContent(event.target.value)}
				placeholder="Ex: Seja educado, objetivo e nunca invente precos. Consulte o catalogo antes de responder sobre produtos, servicos e planos."
			/>
			<div className="flex justify-end">
				<button
					className="px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
					onClick={handleSave}
					disabled={saving}
				>
					{saving ? "Salvando..." : "Salvar prompt"}
				</button>
			</div>
		</div>
	);
}
