import { useLocation, useNavigate, Link } from "react-router-dom";

import { logout } from "../functions/logout.js";

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE EXIBE O MENU DE OPCOES NA LATERAL DAS PAGINAS PRINCIPAIS
 * @param {Object} close FUNCAO DE FECHAMENTO DO MENU
*/
function SidebarContent({ close }) {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-col flex-1 min-h-0">
				<div className="flex gap-2 p-6 text-2xl font-bold text-orange-500">
					<img src="/logo.png" className="w-8 h-8 object-contain animate-spin [animation-duration:5s]" />
					<span>Agora Digital</span>
				</div>
				<nav className="flex flex-col flex-1 overflow-y-auto gap-2 px-4">
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/dashboard") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/dashboard" onClick={close}>
						<i className="bi bi-clipboard-data text-xl" />
						<span>Dashboard</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/chat") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/chat" onClick={close}>
						<i className="bi bi-whatsapp text-xl" />
						<span>Conversas</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/human-service") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/human-service" onClick={close}>
						<i className="bi bi-hourglass-split text-xl" />
						<span>Atendimento humano</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/contacts") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/contacts" onClick={close}>
						<i className="bi bi-telephone text-xl" />
						<span>Contatos</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/quick-messages") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/quick-messages" onClick={close}>
						<i className="bi bi-chat-right-text text-xl" />
						<span>Mensagens rápidas</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/bot") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/bot" onClick={close}>
						<i className="bi bi-robot text-xl" />
						<span>Bot</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/spreadsheets") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/spreadsheets" onClick={close}>
						<i className="bi bi-file-earmark-spreadsheet text-xl" />
						<span>Planilhas</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/settings") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/settings" onClick={close}>
						<i className="bi bi-gear text-xl" />
						<span>Configurações</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/guide") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/guide" onClick={close}>
						<i className="bi bi-book text-xl" />
						<span>Guia</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/terms-of-use") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/terms-of-use" onClick={close}>
						<i className="bi bi-file-text text-xl" />
						<span>Termos de Uso</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/privacy-policy") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/privacy-policy" onClick={close}>
						<i className="bi bi-shield-check text-xl" />
						<span>Política de Privacidade</span>
					</Link>
					<Link className={`flex items-center gap-1 px-4 py-2 rounded-lg ${(location.pathname === "/support") ? "bg-orange-500 text-black" : "hover:bg-zinc-800"}`} to="/support" onClick={close}>
						<i className="bi bi-headset text-xl" />
						<span>Suporte</span>
					</Link>
				</nav>
			</div>
			<div className="p-4">
				<button className="w-full px-4 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-400 transition cursor-pointer"
					onClick={() => {
						logout(navigate);
						if (close) close();
					}}
				>
					Logout
				</button>
			</div>
		</div>
	);
}

/**
 * @author VAMPETA
 * @brief HEADER DA ROTA /dashboard
 * @param {Object} navigate FUNCAO DE NAVEGACAO DE PAGINA
 * @param {Object} close FUNCAO QUE FECHA O Sidebar
*/
export function SideBar({ open, setOpen }) {
	return (
		<>
			{open && <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setOpen(false)} />}
			<aside className={`fixed md:static top-0 left-0 z-50 w-64 h-full bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`} >
				<div className="flex flex-col h-full">
					<SidebarContent close={() => setOpen(false)} />
				</div>
			</aside>
		</>
	);
}

/**
 * @author VAMPETA
 * @brief HEADER QUE ACOMPANHA O Sidebar
 * @param {Object} setOpen CONTROLA SE O Sidebar ESTA ABERTO OU FECHADO
 * @param {String} titile TITULO A SER EXIBIDO NO CABECALHO
*/
export function Header({ setOpen, title }) {
	return (
		<header className="flex items-center px-4 md:px-6 py-4 border-b border-zinc-800">
			<button className="md:hidden" onClick={() => setOpen(true)}>
				<i className="bi bi-list text-3xl" />
			</button>
			<h1 className="flex-1 text-center text-lg md:text-xl font-semibold md:text-start">{title}</h1>
		</header>
	);
}