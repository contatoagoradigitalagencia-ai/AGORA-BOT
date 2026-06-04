import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE REMOVE O NUMERO DA LISTA DE ESPERA DE ATENDIMENTO HUMANO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} contact INFORMACOES DO CONTATO
 * @param {String} setContact MODIFICADOR DE contact
*/
async function removeWaitingService(socket, contact, setContact) {
	if (!socket) return ;
	socket.emit("human-service:remove_waiting_service", { phone: contact.phone }, (res) => {
		if (res !== 204) return (toast.error("Erro ao remover contato da lista de espera para atendimento!"));
		setContact((prev) => ({ ...prev, humanService: { ...prev.humanService, waiting: false } }));
		toast.success("Contato removido da lista de espera de atendimento!");
	});
}

/**
 * @author VAMPETA
 * @brief COMPONENTE DE INFORMACOES DE CONTATO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} contact INFORMACOES DO CONTATO
 * @param {String} setContact MODIFICADOR DE contact
 * @param {Boolean} loading INFORMA SE ESTA CARREGANDO INFORMACOES
 */
export default function HumanService({ socket, contact, setContact, loading }) {
	if (loading || !contact.humanService.waiting) return (<></>);
	return (
		<div className="bg-zinc-800 p-4 rounded-lg flex flex-col gap-3">
			O atendimento humano está ativo. Clique no botão abaixo para encerrá-lo.
			<button className="w-full md:w-auto text-center px-6 py-2 bg-orange-500 text-black rounded-lg font-medium hover:bg-orange-400 transition cursor-pointer" onClick={() => removeWaitingService(socket, contact, setContact)}>
				Encerrar atendimento
			</button>
		</div>
	);
}