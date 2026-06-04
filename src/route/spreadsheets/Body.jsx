import { useGetSpreadsheet, selectSpreadsheet } from "./useGetSpreadsheet.js";

import Error from "../../screens/Error.jsx";
import Load from "../../screens/Load.jsx";

/**
 * @author VAMPETA
 * @brief PAGINA DE CONFIGURACOES DE PLANILHAS
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Body({ socket }) {
	const { infoSpreadsheets, setInfoSpreadsheets, loading, error } = useGetSpreadsheet(socket);

	if (error) return (<Error />);
	if (loading) return (<Load />);
	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			<div className=" flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg p-5">
				<div>
					<h2 className="text-lg font-semibold">Google Sheets</h2>
					<p className="text-sm text-zinc-400">Tenha acesso diretamente as planilhas clicando aqui</p>
				</div>
				<a className="px-4 py-2 rounded-lg bg-orange-500 text-black hover:bg-orange-400 cursor-pointer" href={`https://docs.google.com/spreadsheets/d/${infoSpreadsheets.url}`} target="_blank">Abrir</a>
			</div>
			<p>Defina quais planilhas serão usadas como fonte de preços de produtos e serviços para a IA responder mensagens no WhatsApp. Somente as planilhas selecionadas serão consideradas na geração das respostas, garantindo informações atualizadas e consistentes. As alterações são aplicadas automaticamente.</p>
			<div className="flex flex-col bg-zinc-900 border border-zinc-800 rounded-lg p-5 gap-4 w-full min-h-80 md:h-100 overflow-y-auto">
				{infoSpreadsheets.pages?.map((spreadsheet, i) => {
					return (
						<button className={`flex justify-between items-center w-full px-3 py-1 cursor-pointer rounded ${(spreadsheet.active) ? "bg-orange-500 text-black" : null} transition duration-1000`} key={i} onClick={() => selectSpreadsheet(socket, infoSpreadsheets, setInfoSpreadsheets, i)}>
							<p>{spreadsheet.page}</p>
							<i className={`bi bi-${(spreadsheet.active) ? "check2" : "x"}  text-xl`} />
						</button>
					);
				})}
			</div>
		</div>
	);
};