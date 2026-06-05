import { InfoPage, InfoSection } from "../../utils/components/InfoPage.jsx";

export default function TermsOfUSe() {
	return (
		<InfoPage title="Termos de Uso">
			<div className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4">
				<h1 className="text-lg font-bold text-zinc-100 mb-1">Termos de Uso — Agora Bot 2</h1>
				<p className="text-xs text-zinc-500">Última atualização: Junho de 2026</p>
			</div>

			<InfoSection title="1. Uso autorizado" icon="✅">
				<p>O Agora Bot 2 é uma plataforma de atendimento via WhatsApp com suporte a inteligência artificial. O uso é autorizado exclusivamente para fins comerciais legítimos, atendimento ao cliente e automação de processos internos da organização contratante.</p>
				<p>É vedado o uso para envio de spam, conteúdo enganoso, prática de atividades ilegais ou qualquer ação que viole os Termos de Serviço da Meta Platforms ou da Z-API.</p>
			</InfoSection>

			<InfoSection title="2. Responsabilidade do operador" icon="⚖️">
				<p>O operador — empresa ou pessoa física que utiliza a plataforma — é integralmente responsável pelo conteúdo das mensagens enviadas, pela configuração do bot e pela supervisão das respostas automáticas.</p>
				<p>A Agora Digital não se responsabiliza por perdas comerciais, respostas incorretas da IA ou banimentos de número decorrentes de uso inadequado da plataforma.</p>
			</InfoSection>

			<InfoSection title="3. Uso da inteligência artificial" icon="🤖">
				<p>A IA incorporada ao sistema tem caráter auxiliar. Decisões comerciais relevantes, propostas de alto valor e situações sensíveis devem ser revisadas e aprovadas por um atendente humano antes do envio.</p>
				<p>A plataforma não garante que as respostas geradas pela IA sejam sempre precisas, completas ou adequadas para todas as situações. O operador deve monitorar as conversas regularmente.</p>
			</InfoSection>

			<InfoSection title="4. Integrações WhatsApp" icon="📱">
				<p>O uso da integração com WhatsApp está sujeito às políticas da Meta Platforms (WhatsApp Cloud API) e da Z-API. O operador é responsável por manter suas credenciais seguras e por respeitar os limites de envio estabelecidos pelos provedores.</p>
				<p>Números bloqueados ou banidos pelo WhatsApp em decorrência de uso inadequado não são responsabilidade da Agora Digital.</p>
			</InfoSection>

			<InfoSection title="5. Dados comerciais" icon="💼">
				<p>Produtos, serviços, planos e preços cadastrados no catálogo são de responsabilidade do operador. A plataforma apenas armazena e exibe essas informações conforme configurado.</p>
				<p>Mantenha o catálogo atualizado para garantir que a IA forneça informações corretas aos clientes.</p>
			</InfoSection>

			<InfoSection title="6. Limitações do sistema" icon="⚠️">
				<p>O Agora Bot 2 pode estar sujeito a instabilidades decorrentes de indisponibilidade dos provedores de IA (Groq), WhatsApp (Meta/Z-API) ou da infraestrutura de hospedagem. A Agora Digital não garante disponibilidade contínua de 100%.</p>
				<p>Em caso de falhas, o operador deve ter um plano de contingência para atendimento manual.</p>
			</InfoSection>

			<InfoSection title="7. Suspensão de uso" icon="🚫">
				<p>O acesso à plataforma pode ser suspenso em caso de uso que viole estes termos, atividades ilegais, inadimplência ou por solicitação do próprio operador.</p>
				<p>Em caso de suspensão, os dados da organização podem ser mantidos por até 90 dias antes da exclusão definitiva.</p>
			</InfoSection>

			<InfoSection title="8. Atualizações" icon="🔄">
				<p>Estes termos podem ser atualizados periodicamente. Alterações relevantes serão comunicadas com antecedência mínima de 7 dias. O uso continuado da plataforma após as atualizações implica aceitação dos novos termos.</p>
				<p>Em caso de dúvidas, entre em contato pelo suporte disponível no painel.</p>
			</InfoSection>
		</InfoPage>
	);
}
