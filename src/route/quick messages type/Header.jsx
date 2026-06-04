import { useNavigate } from "react-router-dom";

/**
 * @author VAMPETA
 * @brief HEADER DAS ROTAS DE NOVAS MENSAGENS (SERVE PARA TODAS AS ROTAS DE NOVAS MENSAGENS)
 * @param {String} title TITULO DO HEADER
*/
export default function Header({ title }) {
	const navigate = useNavigate();

	return (
		<header className="flex items-center px-4 md:px-10 py-4 border-b border-zinc-800">
			<i className="bi bi-arrow-left cursor-pointer text-4xl text-orange-500" onClick={() => navigate("/quick-messages")} />
			<h1 className="w-full text-center text-lg md:text-xl font-semibold text-white">{title}</h1>
		</header>
	);
}