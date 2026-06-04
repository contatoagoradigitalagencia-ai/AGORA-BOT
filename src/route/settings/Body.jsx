import NewPassword from "./NewPassword";

/**
 * @author VAMPETA
 * @brief PAGINA DE CONFIGURACOES
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Body({ socket }) {
	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			<NewPassword socket={socket} />
		</div>
	);
};