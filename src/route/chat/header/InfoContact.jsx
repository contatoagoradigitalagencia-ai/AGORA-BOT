import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CONSULTA OU MODIFICA SE O BOT ESTA ATIVO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} contact INFORMACOES DO CONTATO
 * @param {String} setContact MODIFICADOR DE contact
*/
async function botOnOff(socket, contact, setContact) {
	if (!socket) return ;
	socket.emit("chat:on_off", { phone: contact.phone, stateBot: !contact.bot }, (res) => {
		if (res !== 204) return (toast.error(`Erro ao ${(contact.bot) ? "desativar" : "ativar"} bot!`));
		setContact((prev) => ({ ...prev, bot: !prev.bot }));
		toast.success(`Bot ${(contact.bot) ? "desativado" : "ativado"}!`);
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
export default function InfoContact({ socket, contact, setContact, loading }) {
	if (loading) {
		return (
			<div className="flex justify-between animate-pulse">
				<div className="flex flex-col gap-2">
					<div className="h-6 w-40 bg-zinc-700 rounded" />
					<div className="h-4 w-32 bg-zinc-700 rounded" />
				</div>
				<i className="bi bi-robot cursor-pointer text-4xl text-gray-500" />
			</div>
		);
	}
	return (
		<div className="flex justify-between">
			<div>
				<h2 className="text-xl font-semibold">{contact?.name || "Sem nome"}</h2>
				<p className="text-sm text-zinc-400">{contact?.phone.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}</p>
			</div>
			<i className={`bi bi-robot cursor-pointer text-4xl ${(contact.bot) ? "text-orange-500" : "text-gray-500"}`} onClick={() => botOnOff(socket, contact, setContact)} />
		</div>
	);
}