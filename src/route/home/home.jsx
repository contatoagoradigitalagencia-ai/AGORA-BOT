import { Link } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * @author VAMPETA
 * @brief PAGINA HOME
*/
export default function Home() {
	const phone = Cookies.get("phone");
	const idPhone = Cookies.get("idPhone");
	const token = Cookies.get("token");

	return (
		<div className="min-h-dvh bg-black text-white flex flex-col">
			<header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
				<div className="flex items-center gap-2 text-orange-500 font-bold text-xl">
					<img className="w-8 h-8 animate-spin [animation-duration:5s]" src="/logo.png" />
					<span>Agora Digital</span>
				</div>
				<Link className="px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-400 transition" to={(phone && idPhone && token) ? "/dashboard" : "/login"} >
					{(phone && idPhone && token) ? "Dashboard" : "Login"}
				</Link>
			</header>
			<section className="flex flex-col items-center justify-center text-center px-6 py-20 gap-6">
				<h1 className="text-3xl md:text-5xl font-bold max-w-3xl leading-tight">Automatize seu atendimento no WhatsApp de forma simples e eficiente</h1>
				<p className="text-zinc-400 max-w-xl text-sm md:text-base">Envie, receba e gerencie mensagens utilizando a API oficial do WhatsApp. Crie automações, respostas rápidas e bots para escalar seu atendimento.</p>
				<a className="mt-4 px-8 py-3 bg-orange-500 text-black font-medium rounded-lg hover:bg-orange-400 transition" href="https://wa.me/5521971107509?text=Olá,%20gostaria%20de%20começar%20a%20usar%20o%20bot" target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
			</section>
			<section className="px-6 py-20 border-t border-zinc-800">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl font-bold">Cansado de perder clientes no WhatsApp?</h2>
					<div className="mt-10 grid md:grid-cols-2 gap-6 text-left">
						<div className="bg-zinc-900 border border-red-900/30 rounded-lg p-6">
							<h3 className="text-red-400 font-semibold">Sem o Agora Digital</h3>
							<ul className="text-sm text-zinc-400 mt-3 space-y-2">
								<li>• Respostas demoradas</li>
								<li>• Conversas desorganizadas</li>
								<li>• Clientes sem retorno</li>
							</ul>
						</div>
						<div className="bg-zinc-900 border border-green-900/30 rounded-lg p-6">
							<h3 className="text-green-400 font-semibold">Com o Agora Digital</h3>
							<ul className="text-sm text-zinc-400 mt-3 space-y-2">
								<li>• Respostas automáticas 24h</li>
								<li>• Tudo organizado em um painel</li>
								<li>• Mais vendas e conversões</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
			<section className="px-6 py-16 border-t border-zinc-800">
				<div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
					<div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
						<i className="bi bi-chat-dots text-orange-500 text-2xl"></i>
						<h3 className="mt-3 font-semibold">Envio de mensagens</h3>
						<p className="text-zinc-400 text-sm mt-2">Envie mensagens de texto, mídia, localização e documentos de forma rápida.</p>
					</div>
					<div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
						<i className="bi bi-lightning text-orange-500 text-2xl"></i>
						<h3 className="mt-3 font-semibold">Automação inteligente</h3>
						<p className="text-zinc-400 text-sm mt-2">Crie fluxos automáticos com bots para responder seus clientes 24h.</p>
					</div>
					<div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
						<i className="bi bi-speedometer2 text-orange-500 text-2xl"></i>
						<h3 className="mt-3 font-semibold">Alta performance</h3>
						<p className="text-zinc-400 text-sm mt-2">Interface rápida e otimizada para gerenciar grandes volumes de mensagens.</p>
					</div>
				</div>
			</section>
			<section className="px-6 py-16 border-t border-zinc-800">
				<div className="max-w-3xl mx-auto text-center">
					<h2 className="text-2xl md:text-3xl font-bold">Sobre o Agora Digital</h2>
					<p className="text-zinc-400 mt-4 text-sm md:text-base leading-relaxed">O Agora Digital foi criado para simplificar a comunicação entre empresas e clientes através do WhatsApp. Utilizando a API oficial, nossa plataforma permite centralizar conversas, automatizar respostas e melhorar a experiência do usuário, tudo em um único lugar.</p>
				</div>
			</section>
			<footer className="text-center text-xs text-zinc-500 py-6 border-t border-zinc-800">
				© {new Date().getFullYear()} Agora Digital. Todos os direitos reservados.
			</footer>
		</div>
	);
}