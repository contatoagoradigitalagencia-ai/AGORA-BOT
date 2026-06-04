import { useState } from "react";

import toast from "react-hot-toast";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE ENVIA A NOVA SENHA PARA O BACK END
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} password SENHA ANTIGA
 * @param {String} newPassword NOVA SENHA
 * @param {String} confirmationPassword CONFIRMACAO DA NOVA SENHA
*/
export function handleSave(socket, password, newPassword, confirmationPassword) {
	if (!password || !newPassword || !confirmationPassword) return (toast.error("Preencha todos os campos!"));
	if (newPassword !== confirmationPassword) return (toast.error("Confirmação de senha diferente da nova senha!"));
	if (newPassword.length < 5) return (toast.error("A senha precisa ter no mínimo 5 dígitos!"));
	socket.emit("settings:update_password", { password: password, newPassword: newPassword }, (res) => {
		if (res !== 204) return (toast.error(res.error));
		toast.success("Senha alterada com sucesso!");
	});
}

/**
 * @author VAMPETA
 * @brief COMPONENTE PARA TROCAR DE SENHA
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function NewPassword({ socket }) {
	const [password, setPassword] = useState({ input: "", visualization: false });
	const [newPassword, setNewPassword] = useState({ input: "", visualization: false });
	const [confirmationPassword, setConfirmationPassword] = useState({ input: "", visualization: false });

	return (
		<div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-5">
			<div>
				<h2 className="text-lg font-semibold">Troca de senha</h2>
				<p className="text-sm text-zinc-400">Se desejar alterar sua senha, preencha os campos abaixo com sua senha atual e uma nova senha. Certifique-se de escolher uma combinação segura para proteger sua conta.</p>
			</div>
			<div className="flex items-center gap-2">
				<input className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" type={(password.visualization) ? "text" : "password"} value={password?.input || ""} onChange={(e) => setPassword((prev) => ({ ...prev, input: e.target.value }))} placeholder="Senha antiga" />
				<button className="px-2 text-orange-500 hover:text-orange-400 cursor-pointer" onClick={() => setPassword((prev) => ({ ...prev, visualization: !prev.visualization }))}>
					<i className={`bi bi-eye${(password.visualization) ? "" : "-slash"}`} />
				</button>
			</div>
			<div className="flex items-center gap-2">
				<input className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" type={(newPassword.visualization) ? "text" : "password"} value={newPassword?.input || ""} onChange={(e) => setNewPassword((prev) => ({ ...prev, input: e.target.value }))} placeholder="Nova senha" />
				<button className="px-2 text-orange-500 hover:text-orange-400 cursor-pointer" onClick={() => setNewPassword((prev) => ({ ...prev, visualization: !prev.visualization }))}>
					<i className={`bi bi-eye${(newPassword.visualization) ? "" : "-slash"}`} />
				</button>
			</div>
			<div className="flex items-center gap-2">
				<input className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none" type={(confirmationPassword.visualization) ? "text" : "password"} value={confirmationPassword?.input || ""} onChange={(e) => setConfirmationPassword((prev) => ({ ...prev, input: e.target.value }))} placeholder="Confirmação da nova senha" />
				<button className="px-2 text-orange-500 hover:text-orange-400 cursor-pointer" onClick={() => setConfirmationPassword((prev) => ({ ...prev, visualization: !prev.visualization }))}>
					<i className={`bi bi-eye${(confirmationPassword.visualization) ? "" : "-slash"}`} />
				</button>
			</div>
			<button className="bg-orange-500 text-black rounded p-2 text-sm w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => handleSave(socket, password.input, newPassword.input, confirmationPassword.input)}>
				Salvar
			</button>
		</div>
	);
}