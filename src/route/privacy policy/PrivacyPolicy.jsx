import { InfoPage, InfoSection } from "../../utils/components/InfoPage.jsx";

export default function PrivacyPolicy() {
	return (
		<InfoPage title="Política de Privacidade">
			<div className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-4">
				<h1 className="text-lg font-bold text-zinc-100 mb-1">Política de Privacidade — Agora Bot 2</h1>
				<p className="text-xs text-zinc-500">Última atualização: Junho de 2026</p>
			</div>

			<InfoSection title="1. Dados coletados" icon="📋">
				<p>O sistema pode coletar e armazenar as seguintes informações durante sua operação:</p>
				<ul className="list-disc list-inside flex flex-col gap-1 pl-2">
					<li>Nome e número de telefone dos contatos que enviam mensagens</li>
					<li>Histórico de conversas (mensagens enviadas e recebidas)</li>
					<li>Dados de catálogo cadastrados pelo operador (produtos, serviços, planos)</li>
					<li>Métricas operacionais (volume de mensagens, tempo de resposta)</li>
					<li>Informações de conta do operador (telefone de acesso, organização)</li>
					<li>Logs de uso da IA e de ações no painel</li>
				</ul>
			</InfoSection>

			<InfoSection title="2. Finalidade do uso" icon="🎯">
				<p>Os dados coletados são usados exclusivamente para:</p>
				<ul className="list-disc list-inside flex flex-col gap-1 pl-2">
					<li>Viabilizar o funcionamento do atendimento automatizado via WhatsApp</li>
					<li>Exibir histórico de conversas no painel do operador</li>
					<li>Gerar respostas contextuais pela IA com base no histórico recente</li>
					<li>Produzir métricas e relatórios operacionais para o gestor</li>
					<li>Manter a segurança e integridade do sistema</li>
				</ul>
				<p>Os dados <strong className="text-zinc-300">não são usados para fins publicitários</strong> e não são vendidos a terceiros.</p>
			</InfoSection>

			<InfoSection title="3. Armazenamento" icon="🗄️">
				<p>Os dados são armazenados em banco de dados MongoDB Atlas hospedado em infraestrutura de nuvem com controles de acesso por organização. Cada operador acessa apenas os dados da sua própria organização.</p>
				<p>Conversas e contatos são armazenados indefinidamente enquanto a conta estiver ativa, salvo solicitação de exclusão pelo titular ou pelo operador.</p>
			</InfoSection>

			<InfoSection title="4. Compartilhamento" icon="🔗">
				<p>Os dados podem ser compartilhados com os seguintes serviços terceiros, estritamente para viabilizar o funcionamento da plataforma:</p>
				<ul className="list-disc list-inside flex flex-col gap-1 pl-2">
					<li><strong className="text-zinc-300">Meta Platforms</strong> — processamento de mensagens via WhatsApp Cloud API</li>
					<li><strong className="text-zinc-300">Z-API</strong> — integração alternativa com WhatsApp</li>
					<li><strong className="text-zinc-300">Groq</strong> — processamento de linguagem natural para respostas da IA</li>
					<li><strong className="text-zinc-300">Vercel / Render</strong> — hospedagem da aplicação</li>
				</ul>
				<p>Cada um desses serviços possui sua própria política de privacidade. Recomendamos sua leitura.</p>
			</InfoSection>

			<InfoSection title="5. Segurança" icon="🔐">
				<p>Adotamos as seguintes medidas de segurança:</p>
				<ul className="list-disc list-inside flex flex-col gap-1 pl-2">
					<li>Autenticação por JWT com expiração configurável</li>
					<li>Tokens de API armazenados criptografados no banco de dados</li>
					<li>Isolamento de dados por organização via middleware</li>
					<li>Comunicação via HTTPS em todos os endpoints</li>
				</ul>
				<p>Nenhum sistema é 100% seguro. Em caso de suspeita de comprometimento, entre em contato imediatamente com o suporte.</p>
			</InfoSection>

			<InfoSection title="6. Retenção de dados" icon="📅">
				<p>Os dados são retidos enquanto a conta do operador estiver ativa. Após o encerramento da conta, os dados podem ser mantidos por até 90 dias para fins de auditoria, antes da exclusão definitiva.</p>
				<p>Logs de sistema podem ser mantidos por períodos distintos conforme necessidade operacional.</p>
			</InfoSection>

			<InfoSection title="7. Direitos dos titulares" icon="👤">
				<p>Os titulares dos dados (contatos que interagem via WhatsApp) têm os seguintes direitos, conforme a LGPD:</p>
				<ul className="list-disc list-inside flex flex-col gap-1 pl-2">
					<li>Acesso aos dados armazenados</li>
					<li>Correção de dados incorretos</li>
					<li>Exclusão de dados pessoais</li>
					<li>Informação sobre compartilhamento com terceiros</li>
					<li>Revogação do consentimento de uso</li>
				</ul>
				<p>O operador é responsável por atender às solicitações dos titulares. A Agora Digital oferece suporte técnico para viabilizar a exclusão de dados quando solicitado.</p>
			</InfoSection>

			<InfoSection title="8. Contato" icon="📬">
				<p>Para questões relacionadas à privacidade, proteção de dados ou solicitações dos titulares, entre em contato:</p>
				<ul className="list-disc list-inside flex flex-col gap-1 pl-2">
					<li>WhatsApp: <a href="https://wa.me/5521971107509" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition">+55 21 97110-7509</a></li>
					<li>E-mail: <span className="text-zinc-300">contatoagoradigitalagencia@gmail.com</span></li>
				</ul>
			</InfoSection>
		</InfoPage>
	);
}
