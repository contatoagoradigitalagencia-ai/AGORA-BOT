import { useState } from "react";
import toast from "react-hot-toast";
import { apiPatch } from "../../api/client.js";

export default function NewPassword() {
	const [password,             setPassword]             = useState({ input: "", show: false });
	const [newPassword,          setNewPassword]          = useState({ input: "", show: false });
	const [confirmationPassword, setConfirmationPassword] = useState({ input: "", show: false });
	const [saving, setSaving] = useState(false);

	async function handleSave() {
		const current = password.input.trim();
		const next    = newPassword.input.trim();
		const confirm = confirmationPassword.input.trim();

		if (!current || !next || !confirm) { toast.error("Preencha todos os campos!"); return; }
		if (next !== confirm)              { toast.error("Confirmação de senha diferente da nova senha!"); return; }
		if (next.length < 5)              { toast.error("A senha precisa ter no mínimo 5 caracteres!"); return; }

		setSaving(true);
		try {
			await apiPatch("/settings/password", { password: current, newPassword: next });
			toast.success("Senha alterada com sucesso!");
			setPassword({ input: "", show: false });
			setNewPassword({ input: "", show: false });
			setConfirmationPassword({ input: "", show: false });
		} catch (e) {
			toast.error(e?.message || "Erro ao alterar senha. Verifique a senha atual.");
		} finally {
			setSaving(false);
		}
	}

	function Field({ label, state, setState }) {
		return (
			<div className="flex items-center gap-2">
				<input
					className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500 transition"
					type={state.show ? "text" : "password"}
					value={state.input}
					onChange={e => setState(prev => ({ ...prev, input: e.target.value }))}
					placeholder={label}
					onKeyDown={e => { if (e.key === "Enter") handleSave(); }}
				/>
				<button
					className="px-2 text-zinc-500 hover:text-orange-400 transition"
					onClick={() => setState(prev => ({ ...prev, show: !prev.show }))}
					type="button"
					tabIndex={-1}
				>
					<i className={`bi bi-eye${state.show ? "" : "-slash"}`} />
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-5">
			<div>
				<h2 className="text-lg font-semibold">Troca de senha</h2>
				<p className="text-sm text-zinc-400">
					Preencha os campos abaixo com sua senha atual e a nova senha.
				</p>
			</div>
			<Field label="Senha atual"            state={password}             setState={setPassword} />
			<Field label="Nova senha"              state={newPassword}          setState={setNewPassword} />
			<Field label="Confirmação da nova senha" state={confirmationPassword} setState={setConfirmationPassword} />
			<button
				className="bg-orange-500 text-black rounded-lg p-2.5 text-sm font-medium w-full hover:bg-orange-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
				onClick={handleSave}
				disabled={saving}
			>
				{saving ? "Salvando..." : "Salvar"}
			</button>
		</div>
	);
}
