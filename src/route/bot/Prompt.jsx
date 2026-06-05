import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { saveBotPrompt } from "./useGetInfoBot.js";

const MAX_INSTRUCTIONS = 10;

/**
 * Prompt de IA — instruções curtas (uma por linha).
 * Cada instrução vira uma linha no prompt final enviado ao Groq.
 * Evita prompts pesados e reduz tokens.
 */
export default function Prompt({ bot, setBot }) {
	const [instructions, setInstructions] = useState([""]);
	const [saving, setSaving] = useState(false);

	// Sincroniza com o prompt salvo no banco
	useEffect(() => {
		const raw = bot?.prompt?.content || "";
		const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
		setInstructions(lines.length > 0 ? lines : [""]);
	}, [bot?.prompt?.content]);

	function handleChange(index, value) {
		setInstructions(prev => prev.map((item, i) => i === index ? value : item));
	}

	function handleAdd() {
		if (instructions.length >= MAX_INSTRUCTIONS) return;
		setInstructions(prev => [...prev, ""]);
	}

	function handleRemove(index) {
		if (instructions.length === 1) return;
		setInstructions(prev => prev.filter((_, i) => i !== index));
	}

	async function handleSave() {
		if (saving) return;
		const lines = instructions.map(i => i.trim()).filter(Boolean);
		if (lines.length === 0) {
			toast.error("Adicione ao menos uma instrução.");
			return;
		}
		setSaving(true);
		try {
			await saveBotPrompt(bot, setBot, lines.join("\n"));
			toast.success("Prompt salvo com sucesso!");
		} catch (err) {
			toast.error(err?.message || "Erro ao salvar prompt!");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-5" id="prompt">
			<div className="flex flex-col gap-1">
				<h2 className="text-lg font-semibold">Prompt de IA</h2>
				<p className="text-sm text-zinc-400">
					Adicione instruções curtas, uma por campo. Quanto mais simples, melhor o resultado.
				</p>
				{!bot?.prompt && (
					<p className="text-sm text-orange-300">
						Nenhum prompt cadastrado. Adicione instruções e salve para ativar a IA.
					</p>
				)}
			</div>

			{/* Exemplos */}
			<div className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 text-xs text-zinc-400 flex flex-col gap-1">
				<span className="text-zinc-300 font-medium">Exemplos:</span>
				<span>Seja educado e profissional</span>
				<span>Responda de forma clara e objetiva</span>
				<span>Não invente informações</span>
			</div>

			{/* Lista de instruções */}
			<div className="flex flex-col gap-2">
				<span className="text-xs text-zinc-500">Adicione instruções curtas para o comportamento da IA.</span>
				{instructions.map((instruction, index) => (
					<div key={index} className="flex items-center gap-2">
						<input
							className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500"
							value={instruction}
							onChange={e => handleChange(index, e.target.value)}
							placeholder="Ex: Seja educado e direto"
							maxLength={200}
						/>
						<button
							className="p-2 text-zinc-500 hover:text-red-400 transition disabled:opacity-30"
							onClick={() => handleRemove(index)}
							disabled={instructions.length === 1}
							title="Remover instrução"
						>
							🗑
						</button>
					</div>
				))}
			</div>

			{/* Adicionar + Salvar */}
			<div className="flex items-center justify-between">
				<button
					className="text-sm text-orange-400 hover:text-orange-300 transition disabled:opacity-40"
					onClick={handleAdd}
					disabled={instructions.length >= MAX_INSTRUCTIONS}
				>
					+ Adicionar instrução
				</button>
				<button
					className="px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-400 transition disabled:opacity-60 disabled:cursor-not-allowed font-medium"
					onClick={handleSave}
					disabled={saving}
				>
					{saving ? "Salvando..." : "Salvar"}
				</button>
			</div>
		</div>
	);
}
