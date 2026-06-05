import { useState } from "react";
import toast from "react-hot-toast";
import { updateAutoReply } from "./useGetInfoBot.js";

export default function StatusBot({ bot, setBot }) {
	const [saving, setSaving] = useState(false);
	const account = bot?.account;
	const accountId = account?.id || account?._id;
	const status = account?.settings?.autoReply === true;

	async function handleChange() {
		if (!accountId || saving) return;
		const next = !status;
		setSaving(true);
		try {
			await updateAutoReply(bot, setBot, next);
			toast.success(`IA ${next ? "ativada" : "pausada"} com sucesso!`);
		} catch (e) {
			toast.error(e?.message || `Erro ao ${next ? "ativar" : "pausar"} a IA!`);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex flex-col gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-5">
			<div>
				<h2 className="text-lg font-semibold">Status do Bot</h2>
				<p className="text-sm text-zinc-400">Ative ou desative as respostas automáticas da IA no WhatsApp.</p>
			</div>
			<label className={`flex items-center justify-between ${accountId ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}>
				<span className="text-sm text-zinc-300">
					IA {status ? "ativa" : "pausada"}
					{saving && <span className="ml-2 text-xs text-zinc-500">salvando...</span>}
				</span>
				<div className="relative">
					<input
						type="checkbox"
						className="sr-only peer"
						checked={status}
						onChange={handleChange}
						disabled={!accountId || saving}
					/>
					<div className="w-10 h-5 bg-zinc-700 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
					<div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
				</div>
			</label>
			{!accountId && (
				<p className="text-xs text-orange-300">
					Nenhuma conta WhatsApp encontrada. Cadastre uma nas Configurações.
				</p>
			)}
		</div>
	);
}
