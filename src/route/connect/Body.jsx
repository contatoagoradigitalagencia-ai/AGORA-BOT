import Load from "../../screens/Load.jsx";
import { useWhatsAppAccount } from "./useWhatsAppAccount.js";

/**
 * @brief Corpo da página /connect — status real + QR Code
 */
export default function Body() {
	const { account, loading, error, qr, qrLoading, statusLoading, generateQr, refreshStatus } = useWhatsAppAccount();

	if (loading) return <Load />;

	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn max-w-xl">

			{/* Conta */}
			<div className="flex flex-col gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-5">
				<div>
					<h2 className="text-lg font-semibold">Conta WhatsApp</h2>
					<p className="text-sm text-zinc-400">Status da conexão com o WhatsApp via Z-API.</p>
				</div>

				{!account ? (
					<p className="text-sm text-zinc-400">
						Nenhuma conta configurada. Peça ao administrador para preparar sua integração.
					</p>
				) : (
					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<span className="text-sm text-zinc-400">Número</span>
							<span className="text-sm font-mono text-white">{account.phoneNumber}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-zinc-400">Provedor</span>
							<span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">{account.provider}</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-zinc-400">Status</span>
							{account.connected
								? <span className="flex items-center gap-1.5 text-sm font-semibold text-green-400">🟢 Conectado</span>
								: <span className="flex items-center gap-1.5 text-sm font-semibold text-red-400">🔴 Desconectado</span>
							}
						</div>
					</div>
				)}

				<button
					onClick={refreshStatus}
					disabled={statusLoading || !account}
					className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
				>
					<i className={`bi bi-arrow-clockwise ${statusLoading ? "animate-spin" : ""}`} />
					Atualizar status
				</button>
			</div>

			{/* QR Code */}
			{account && !account.connected && (
				<div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-5">
					<div>
						<h2 className="text-lg font-semibold">Conectar via QR Code</h2>
						<p className="text-sm text-zinc-400">
							Abra o WhatsApp no celular &rsaquo; Dispositivos conectados &rsaquo; Conectar dispositivo &rsaquo; Escanear QR.
						</p>
					</div>

					{qr ? (
						<div className="flex flex-col items-center gap-3">
							<img src={qr} alt="QR Code WhatsApp" className="w-56 h-56 rounded-lg border border-zinc-700 object-contain" />
							<p className="text-xs text-zinc-500">Aguardando conexão... (atualiza automaticamente)</p>
						</div>
					) : (
						<button
							onClick={generateQr}
							disabled={qrLoading}
							className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							<i className={`bi bi-qr-code text-lg ${qrLoading ? "animate-pulse" : ""}`} />
							{qrLoading ? "Gerando QR Code..." : "Gerar QR Code"}
						</button>
					)}
				</div>
			)}

			{/* Conectado — sem QR */}
			{account?.connected && (
				<div className="flex flex-col gap-2 bg-zinc-900 border border-green-500/20 rounded-lg p-5">
					<p className="text-sm text-green-400 font-semibold">✅ WhatsApp conectado e pronto para uso.</p>
					<p className="text-xs text-zinc-500">Não é necessário escanear o QR Code novamente enquanto a conexão estiver ativa.</p>
				</div>
			)}

			{/* Erro */}
			{error && (
				<div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400">
					{error}
				</div>
			)}
		</div>
	);
}
