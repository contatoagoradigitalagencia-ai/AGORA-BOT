import { useState } from "react";
import toast from "react-hot-toast";
import { apiPatch } from "../../api/client.js";

function PasswordField({ label, value, onChange, show, onToggle }) {
	return (
		<div className="flex items-center gap-2">
			<input
				className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2.5 text-sm outline-none focus:border-orange-500 transition"
				type={show ? "text" : "password"}
				value={value}
				onChange={onChange}
				placeholder={label}
			/>
			<button
				className="px-2 text-zinc-500 hover:text-orange-400 transition"
				onClick={onToggle}
				type="button"
				tabIndex={-1}
			>
				<i className={`bi bi-eye${show ? "" : "-slash"}`} />
			</button>
		</div>
	);
}

export default function NewPassword() {
	const [current,  setCurrent]  = useState("");
	const [next,     setNext]     = useState("");
	const [confirm,  setConfirm]  = useState("");
	const [showCurr, setShowCurr] = useState(false);
	const [showNext, setShowNext] = useState(false);
	const [showConf, setShowConf] = useState(false);
	const [saving,   setSaving]   = useState(false);

	async function handleSave() {
		if (!current || !next || !confirm) { toast.error("Preencha todos os campos!"); return; }
		if (next !== confirm)              { toast.error("Confirmação diferente da nova senha!"); return; }
		if (next.length < 5)              { toast.error("Mínimo 5 caracteres!"); return; }

		setSaving(true);
		try {
			await apiPatch("/settings/password", { password: current, newPassword: next });
			toast.success("Senha alterada com sucesso!");
			setCurrent(""); setNext(""); setConfirm("");
		} catch (e) {
			toast.error(e?.message || "Senha atual incorreta.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-5">
			<div>
				<h2 className="text-lg font-semibold">Troca de senha</h2>
				<p className="text-sm text-zinc-400">Preencha os campos abaixo com sua senha atual e a nova senha.</p>
			</div>

			<PasswordField
				label="Senha atual"
				value={current}
				onChange={e => setCurrent(e.target.value)}
				show={showCurr}
				onToggle={() => setShowCurr(p => !p)}
			/>
			<PasswordField
				label="Nova senha"
				value={next}
				onChange={e => setNext(e.target.value)}
				show={showNext}
				onToggle={() => setShowNext(p => !p)}
			/>
			<PasswordField
				label="Confirmação da nova senha"
				value={confirm}
				onChange={e => setConfirm(e.target.value)}
				show={showConf}
				onToggle={() => setShowConf(p => !p)}
			/>

			<button
				className="bg-orange-500 text-black rounded-lg p-2.5 text-sm font-medium w-full hover:bg-orange-400 transition disabled:opacity-60"
				onClick={handleSave}
				disabled={saving}
			>
				{saving ? "Salvando..." : "Salvar"}
			</button>
		</div>
	);
}
