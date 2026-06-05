import { InfoPage, InfoSection, InfoCard } from "../../utils/components/InfoPage.jsx";

export default function Guide() {
	return (
		<InfoPage title="Guia">
			<div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-5 py-4">
				<h1 className="text-lg font-bold text-orange-400 mb-1">Guia do Agora Bot 2</h1>
				<p className="text-sm text-zinc-400">
					O Agora Bot 2 centraliza mensagens, contatos, conversas, catálogo comercial e atendimento com IA em um único painel operacional.
				</p>
			</div>

			<InfoSection title="Como usar o painel" icon="🗂️">
				<p>O menu lateral dá acesso a todas as funcionalidades. Use <strong className="text-zinc-300">Conversas</strong> para visualizar e responder mensagens recebidas. Use <strong className="text-zinc-300">Dashboard</strong> para acompanhar métricas gerais de atendimento.</p>
				<p>A navegação é protegida por login. Ao sair, use o botão <strong className="text-zinc-300">Logout</strong> no rodapé do menu.</p>
			</InfoSection>

			<InfoSection title="Como acompanhar conversas" icon="💬">
				<p>Acesse <strong className="text-zinc-300">Conversas</strong> no menu lateral. Cada conversa representa um contato que enviou mensagem pelo WhatsApp conectado.</p>
				<p>Clique em uma conversa para abrir o histórico completo. Você pode enviar mensagens manualmente a qualquer momento, mesmo com a IA ativa.</p>
			</InfoSection>

			<InfoSection title="Como pausar ou ativar a IA" icon="🤖">
				<p>Acesse <strong className="text-zinc-300">Bot</strong> no menu lateral. O toggle <strong className="text-zinc-300">Status do Bot</strong> controla se a IA responde automaticamente.</p>
				<p>Quando <strong className="text-zinc-300">Ativo</strong>: toda mensagem recebida gera uma resposta automática da IA.</p>
				<p>Quando <strong className="text-zinc-300">Pausado</strong>: as mensagens chegam normalmente mas nenhuma resposta automática é enviada.</p>
				<p className="text-orange-300">⚠️ Pause a IA durante atendimentos sensíveis ou quando o número estiver sob risco de banimento por flood.</p>
			</InfoSection>

			<InfoSection title="Como cadastrar produtos, serviços e planos" icon="📦">
				<p>Acesse <strong className="text-zinc-300">Catálogo</strong> no menu lateral. A fonte de dados é o MongoDB — não o Google Sheets.</p>
				<p>Use as abas <strong className="text-zinc-300">Produtos</strong>, <strong className="text-zinc-300">Serviços</strong> e <strong className="text-zinc-300">Planos</strong> para organizar o catálogo.</p>
				<p>Clique em <strong className="text-zinc-300">+ Novo</strong> para abrir o painel lateral de cadastro. Preencha nome, preço, descrição e condições. Use <strong className="text-zinc-300">Salvar e criar outro</strong> para cadastrar vários itens em sequência.</p>
				<p>A IA usa o catálogo para responder perguntas sobre preços e serviços. Mantenha os dados atualizados para respostas precisas.</p>
			</InfoSection>

			<InfoSection title="Como usar atendimento humano" icon="👤">
				<p>Acesse <strong className="text-zinc-300">Atendimento humano</strong> para ver conversas que foram encaminhadas para um atendente.</p>
				<p>Uma conversa entra em fila humana quando: o cliente solicita falar com um humano, ou uma palavra-chave configurada no Bot é detectada.</p>
				<p>Após assumir o atendimento, a IA para de responder naquele contato automaticamente.</p>
			</InfoSection>

			<InfoSection title="Boas práticas de atendimento" icon="✅">
				<InfoCard icon="🎯" title="Mantenha o catálogo completo">
					Produtos sem preço ou sem descrição geram respostas vagas da IA. Preencha todos os campos relevantes.
				</InfoCard>
				<InfoCard icon="📝" title="Use instruções curtas no prompt">
					O prompt da IA deve ser formado por instruções simples e diretas. Evite textos longos — eles aumentam o consumo de tokens e reduzem a precisão.
				</InfoCard>
				<InfoCard icon="🔇" title="Pause a IA durante campanhas">
					Em disparos de mensagens em massa, pause a IA para evitar que ela responda múltiplas vezes ao mesmo contato.
				</InfoCard>
				<InfoCard icon="👥" title="Use atendimento humano para negociações">
					Propostas comerciais, objeções complexas e situações de crise devem ser tratadas por um atendente humano.
				</InfoCard>
			</InfoSection>

			<InfoSection title="Quando revisar o prompt da IA" icon="🔧">
				<p>Revise o prompt quando:</p>
				<ul className="list-disc list-inside flex flex-col gap-1 pl-2">
					<li>A IA inventar preços ou condições que não existem no catálogo</li>
					<li>As respostas estiverem muito longas ou confusas</li>
					<li>O tom não estiver alinhado com a marca</li>
					<li>A IA não estiver encaminhando corretamente para atendimento humano</li>
					<li>Houver muitas reclamações de clientes sobre as respostas</li>
				</ul>
				<p>Acesse <strong className="text-zinc-300">Bot → Prompt de IA</strong> e ajuste as instruções. Cada instrução deve ser curta e objetiva.</p>
			</InfoSection>
		</InfoPage>
	);
}
