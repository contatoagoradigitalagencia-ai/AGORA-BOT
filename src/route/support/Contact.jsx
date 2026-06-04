/**
 * @author VAMPETA
 * @brief CARD DE CONTATOS DO SUPORTE
*/
export default function Contact() {
	return (
		<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4">
			<div>
				<h2 className="text-lg font-semibold">Canais de atendimento</h2>
				<p className="text-sm text-zinc-400">Escolha a melhor forma para entrar em contato com nossa equipe.</p>
			</div>
			<div className="flex flex-col gap-3">
				<a className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-orange-500 transition cursor-pointer" href="https://wa.me/5521971107509?text=Gostaria%20de%20suporte%20com%20o%20Agora%20Bot" target="_blank">
					<div className="flex items-center gap-3">
						<i className="bi bi-whatsapp text-2xl text-green-500" />
						<div className="text-start">
							<p className="font-medium">WhatsApp</p>
							<p className="text-xs text-zinc-400">Fale diretamente com nossa equipe</p>
						</div>
					</div>
					<i className="bi bi-arrow-right text-zinc-400" />
				</a>
				<a className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-orange-500 transition cursor-pointer" href="https://www.instagram.com/agoradigital_agencia" target="_blank">
					<div className="flex items-center gap-3">
						<i className="bi bi-instagram text-2xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent" />
						<div className="text-start">
							<p className="font-medium">Instagram</p>
							<p className="text-xs text-zinc-400">Acompanhe novidades e atualizações</p>
						</div>
					</div>
					<i className="bi bi-arrow-right text-zinc-400" />
				</a>
				<a className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-orange-500 transition cursor-pointer" href={(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) ? "mailto:contatoagoradigitalagencia@gmail.com?subject=Suporte%20Agora%20Bot&body=Gostaria%20de%20suporte%20com%20o%20Agora%20Bot" : "https://mail.google.com/mail/?view=cm&fs=1&to=contatoagoradigitalagencia@gmail.com&su=Suporte%20Agora%20Bot&body=Gostaria%20de%20suporte%20com%20o%20Agora%20Bot"} target="_blank">
					<div className="flex items-center gap-3">
						<i className="bi bi-envelope text-2xl text-orange-500" />
						<div className="text-start">
							<p className="font-medium">E-mail</p>
							<p className="text-xs text-zinc-400">Receba suporte detalhado por email</p>
						</div>
					</div>
					<i className="bi bi-arrow-right text-zinc-400" />
				</a>
			</div>
		</div>
	);
}