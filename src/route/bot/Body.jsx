import { useGetInfoBot } from "./useGetInfoBot.js";

import Error from "../../screens/Error.jsx";
import Load from "../../screens/Load.jsx";
import StatusBot from "./StatusBot.jsx";
import Prompt from "./Prompt.jsx";

function EmptyBotState() {
	return (
		<div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
			<h2 className="text-lg font-semibold">Nenhuma conta WhatsApp encontrada</h2>
			<p className="text-sm text-zinc-400 mt-2">
				A tela Bot esta pronta para configurar a IA, mas ainda nao existe uma conexao WhatsApp cadastrada para esta organizacao.
			</p>
		</div>
	);
}

/**
 * @author VAMPETA
 * @brief PAGINA DE CONFIGURACOES DO BOT
*/
export default function Body() {
	const { bot, setBot, loading, error } = useGetInfoBot();

	if (error) return (<Error />);
	if (loading) return (<Load />);
	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			{!bot?.account && <EmptyBotState />}
			<StatusBot bot={bot} setBot={setBot} />
			<Prompt bot={bot} setBot={setBot} />
		</div>
	);
}
