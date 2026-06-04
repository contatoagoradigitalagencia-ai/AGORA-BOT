import { Link } from "react-router-dom";

/**
 * @author VAMPETA
 * @brief CARD DE PERGUNTAS E RESPOSTAS PRONTAS
*/
export default function FAQ() {
	return (
		<div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-[500px]">
			<div className="mb-4 shrink-0">
				<h2 className="text-lg font-semibold">Perguntas frequentes</h2>
				<p className="text-sm text-zinc-400">As dúvidas mais comuns dos usuários.</p>
			</div>
			<div className="flex flex-col gap-3 overflow-y-auto pr-1">
				<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<i className="bi bi-question-circle text-orange-500" />
						<h3 className="font-medium">Bot não respondendo?</h3>
					</div>
					<p className="text-sm text-zinc-400">Acesse a aba "<Link className="underline" to="/bot" target="_blank">Bot</Link>" e verifique se a opção "Status do Bot" está ativada. Também confirme se o bot está ativo na conversa desejada ou na aba "<Link className="underline" to="/contacts" target="_blank">Contatos</Link>".</p>
				</div>
				<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<i className="bi bi-question-circle text-orange-500" />
						<h3 className="font-medium">O bot não está respondedo como esperado?</h3>
					</div>
					<p className="text-sm text-zinc-400">Na aba "<Link className="underline" to="/bot" target="_blank">Bot</Link>" revise a seção "Prompt de IA" e configure corretamente as instruções de comportamento do bot. Você também pode utilizar a opção "Sugestão de Prompt com IA" para gerar sugestões automaticamente.</p>
				</div>
				<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<i className="bi bi-question-circle text-orange-500" />
						<h3 className="font-medium">O bot não responde com os produtos das planilhas?</h3>
					</div>
					<p className="text-sm text-zinc-400">Na aba "<Link className="underline" to="/spreadsheets" target="_blank">Planilhas</Link>" verifique se a página da planilha está marcada como ativa. Quando uma planilha está em uso, ela aparece destacada na cor laranja.</p>
				</div>
				<div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
					<div className="flex items-center gap-2 mb-2">
						<i className="bi bi-question-circle text-orange-500" />
						<h3 className="font-medium">O redirecionamento para atendimento humano não funciona?</h3>
					</div>
					<p className="text-sm text-zinc-400">Na aba "<Link className="underline" to="/bot" target="_blank">Bot</Link>" verifique a seção "Atendimento Humano" e confirme se existem números cadastrados e se a opção está ativada.</p>
				</div>
			</div>
		</div>
	);
}