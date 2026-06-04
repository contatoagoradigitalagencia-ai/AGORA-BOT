import { useEditComment, handleSave } from "./useEditComment.js";

/**
 * @author VAMPETA
 * @brief COMPONENTE DE COMENTARIO DO CONTATO
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} contact INFORMACOES DO CONTATO
 * @param {String} setContact MODIFICADOR DE contact
 */
export default function Comment({ socket, contact, setContact }) {
	const { editing, setEditing, comment, setComment } = useEditComment(contact);

	return (
		<div className="bg-zinc-800 p-4 rounded-lg flex flex-col gap-3">
			<div className="flex justify-between items-center">
				<p className="text-xs text-zinc-500">Comentário</p>
				{!editing && (
					<button className="text-xs text-orange-500 hover:underline cursor-pointer" onClick={() => setEditing(true)}>
						Editar
					</button>
				)}
			</div>
			{editing ? (
				<>
					<textarea className="w-full p-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-orange-500 resize-none" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
					<div className="flex gap-2">
						<button className="flex-1 bg-orange-500 text-black py-1.5 rounded-lg hover:bg-orange-400 transition cursor-pointer" onClick={() => handleSave(socket, contact.phone, comment, setEditing, setContact)}>
							Salvar
						</button>
						<button className="flex-1 bg-zinc-700 py-1.5 rounded-lg hover:bg-zinc-600 transition cursor-pointer"
							onClick={() => {
								setComment(contact.comment || "");
								setEditing(false);
							}}
						>
							Cancelar
						</button>
					</div>
				</>
			) : (
				<p className="text-sm text-zinc-300 whitespace-pre-wrap">{contact.comment || "Sem comentário"}</p>
			)}
		</div>
	);
}