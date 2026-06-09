import { useState, useEffect, useRef } from "react";
import { apiFetch } from "../../utils/functions/api.js";
import { normalizeWhatsAppAccount } from "../../utils/functions/normalizeWhatsAppAccount.js";

/**
 * @brief Hook que busca a conta WhatsApp da org e expõe ações de status/QR.
 */
export function useWhatsAppAccount() {
	const [account, setAccount] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [qr, setQr] = useState(null);
	const [qrLoading, setQrLoading] = useState(false);
	const [statusLoading, setStatusLoading] = useState(false);
	const pollingRef = useRef(null);

	async function fetchAccount() {
		setLoading(true);
		setError("");
		try {
			const res = await apiFetch("/api/v1/whatsapp-accounts/me");
			const json = await res.json();
			if (!res.ok) { setError(json.error || "Erro ao carregar conta."); return; }
			setAccount(normalizeWhatsAppAccount(json.data));
		} catch {
			setError("Erro de conexão com o servidor.");
		} finally {
			setLoading(false);
		}
	}

	async function refreshStatus() {
		if (!account?.id) return;
		setStatusLoading(true);
		try {
			const res = await apiFetch(`/api/v1/whatsapp-accounts/${account.id}/status`, { method: "POST" });
			const json = await res.json();
			if (res.ok) {
				setAccount(prev => ({ ...prev, connected: json.data.connected, status: json.data.status }));
				if (json.data.connected) {
					setQr(null);
					stopPolling();
				}
			}
		} catch {
			// silencia erros de polling
		} finally {
			setStatusLoading(false);
		}
	}

	async function generateQr() {
		if (!account?.id) {
			setError("Nenhuma conta WhatsApp configurada para esta organização.");
			return;
		}
		setQrLoading(true);
		setError("");
		try {
			const res = await apiFetch(`/api/v1/whatsapp-accounts/${account.id}/qr`, { method: "POST" });
			const json = await res.json();
			if (!res.ok) { setError(json.error || "Erro ao gerar QR Code."); return; }
			const raw = json.data?.qr;
			if (!raw) { setError("QR Code não disponível. Tente novamente."); return; }
			const qrImage = raw.startsWith("data:image") ? raw : `data:image/png;base64,${raw}`;
			setQr(qrImage);
			startPolling();
		} catch {
			setError("Erro de conexão ao gerar QR Code.");
		} finally {
			setQrLoading(false);
		}
	}

	function startPolling() {
		stopPolling();
		pollingRef.current = setInterval(async () => {
			if (!account?.id) return;
			try {
				const res = await apiFetch(`/api/v1/whatsapp-accounts/${account.id}/status`, { method: "POST" });
				const json = await res.json();
				if (res.ok && json.data?.connected) {
					setAccount(prev => ({ ...prev, connected: true, status: "connected" }));
					setQr(null);
					stopPolling();
				}
			} catch { /* silencia */ }
		}, 3000);
	}

	function stopPolling() {
		if (pollingRef.current) {
			clearInterval(pollingRef.current);
			pollingRef.current = null;
		}
	}

	useEffect(() => {
		fetchAccount();
		return () => stopPolling();
	}, []);

	return { account, loading, error, qr, qrLoading, statusLoading, generateQr, refreshStatus, fetchAccount };
}
