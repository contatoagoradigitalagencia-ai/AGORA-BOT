import { InfoPage, InfoSection, InfoCard } from "../../utils/components/InfoPage.jsx";

const SUPPORT_WA = "https://wa.me/5521971107509";

export default function Support() {
	return (
		<InfoPage title="Suporte">
			{/* CTA principal */}
			<div className="rounded-xl border border-orange-500/30 bg-orange-500/5 px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-base font-bold text-orange-400 mb-1">Precisa de ajuda?</h1>
					<p className="text-sm text-zinc-400">Nossa equipe atende pelo WhatsApp em horário comercial (Seg–Sex, 9h–18h).</p>
				</div>
				<a
					href={SUPPORT_WA}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition shrink-0"
				>
					<i className="bi bi-whatsapp text-base" />
					Falar com suporte
				</a>
			</div>

			{/* Problemas comuns */}
			<InfoSection title="Problemas comuns" icon="🔧">
				<div className="grid gap-3 sm:grid-cols-2">
					<InfoCard icon="🤖" title="Bot não responde">
						Verifique se a IA está ativa na tela Bot. Confirme se a conta WhatsApp está conectada e com status "Ativo". Se usar Z-API, verifique se a instância está conectada no painel da Z-API.
					</InfoCard>
					<InfoCard icon="💬" title="Mensagens não aparecem">
						Confirme se o webhook está configurado corretamente no provedor (Z-API ou Meta). Verifique os logs do backend no Render. Confirme que o número está sincronizado com a organização correta.
					</InfoCard>
					<InfoCard icon="⚡" title="IA floodando mensagens">
						Pause a IA imediatamente na tela Bot. Verifique se existe loop de auto-resposta entre dois bots. Confirme que a opção "fromMe" está sendo ignorada no backend.
					</InfoCard>
					<InfoCard icon="📦" title="Catálogo não salva">
						Verifique se você está logado com a organização correta. Confirme que o backend (Render) está online. Tente recarregar a página e cadastrar novamente.
					</InfoCard>
					<InfoCard icon="🔐" title="Login não funciona">
						Confirme que o telefone está cadastrado no sistema. Senhas são armazenadas com hash — se esqueceu, entre em contato com o suporte para reset. Limpe os cookies do navegador e tente novamente.
					</InfoCard>
					<InfoCard icon="🔄" title="Página em loading infinito">
						Pode ser problema de conexão com o backend ou socket. Verifique se o backend está online no Render. Recarregue a página. Se persistir, entre em contato com o suporte.
					</InfoCard>
				</div>
			</InfoSection>

			{/* Antes de chamar suporte */}
			<InfoSection title="Antes de chamar o suporte" icon="✅">
				<p>Para resolver mais rápido, verifique antes de entrar em contato:</p>
				<ul className="list-disc list-inside flex flex-col gap-1.5 pl-2">
					<li>O backend está online? Acesse <span className="text-zinc-300">agora-bot-2-api.onrender.com/health</span></li>
					<li>A conta WhatsApp está ativa na tela Bot?</li>
					<li>O erro aparece no console do navegador? (F12 → Console)</li>
					<li>O problema é em produção ou ambiente local?</li>
					<li>O problema começou após alguma atualização?</li>
				</ul>
			</InfoSection>

			{/* Informações para o suporte */}
			<InfoSection title="Informações que devem ser enviadas" icon="📋">
				<p>Ao entrar em contato, informe:</p>
				<ul className="list-disc list-inside flex flex-col gap-1.5 pl-2">
					<li>Descrição do problema (o que acontece, o que esperava acontecer)</li>
					<li>Tela ou rota onde o erro ocorre (ex: /bot, /spreadsheets)</li>
					<li>Mensagem de erro exata (do console ou da tela)</li>
					<li>Provedor de WhatsApp utilizado (Z-API ou Meta)</li>
					<li>Horário aproximado em que o problema ocorreu</li>
					<li>Print ou gravação de tela se possível</li>
				</ul>
			</InfoSection>

			{/* Canais */}
			<InfoSection title="Canais de suporte" icon="📞">
				<div className="grid gap-3 sm:grid-cols-2">
					<InfoCard icon="💬" title="WhatsApp (principal)">
						Atendimento rápido pelo WhatsApp. Resposta em até 2h em horário comercial.{" "}
						<a href={SUPPORT_WA} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition">
							+55 21 97110-7509
						</a>
					</InfoCard>
					<InfoCard icon="📧" title="E-mail">
						Para questões documentais, contratos e privacidade.{" "}
						<span className="text-zinc-300">contatoagoradigitalagencia@gmail.com</span>
					</InfoCard>
				</div>
			</InfoSection>

			{/* Status */}
			<InfoSection title="Status do sistema" icon="🟢">
				<p className="text-zinc-300 font-medium">Verifique a disponibilidade dos serviços:</p>
				<div className="flex flex-col gap-2 mt-1">
					{[
						{ name: "Backend API (Render)",   url: "https://agora-bot-2-api.onrender.com/health" },
						{ name: "Frontend (Vercel)",      url: "https://agora-bot.vercel.app" },
						{ name: "Meta API",               url: "https://developers.facebook.com/status" },
					].map(s => (
						<a
							key={s.name}
							href={s.url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 hover:border-zinc-600 transition"
						>
							<span className="text-sm text-zinc-300">{s.name}</span>
							<span className="text-xs text-zinc-500 flex items-center gap-1">
								Verificar <i className="bi bi-box-arrow-up-right" />
							</span>
						</a>
					))}
				</div>
			</InfoSection>
		</InfoPage>
	);
}
