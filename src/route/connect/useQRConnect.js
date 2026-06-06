import { useState, useCallback, useEffect, useRef } from "react";
import { apiList, apiPost, apiGet } from "../../api/client.js";

export function useQRConnect() {
  const [account,    setAccount]    = useState(null);
  const [qr,         setQr]         = useState(null);
  const [status,     setStatus]     = useState("disconnected");
  const [loading,    setLoading]    = useState(true);
  const [qrLoading,  setQrLoading]  = useState(false);
  const [error,      setError]      = useState(null);
  const pollRef = useRef(null);

  // Carrega conta da org
  const loadAccount = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiList("/whatsapp-accounts/me");
      const acc  = data?.[0] || null;
      setAccount(acc);
      if (acc?.connectionStatus) setStatus(acc.connectionStatus);
      else if (acc?.status === "active") setStatus("connected");
      else setStatus("disconnected");
      setError(null);
    } catch (e) {
      setError("Não foi possível carregar a conta.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAccount(); }, [loadAccount]);

  // Verifica status real na Z-API
  const checkStatus = useCallback(async () => {
    if (!account?._id) return;
    try {
      const res = await apiGet(`/whatsapp-accounts/${account._id}/status`);
      const data = res?.data || res;
      const connected = data?.connected === true;
      setStatus(connected ? "connected" : "disconnected");
      if (connected) { setQr(null); stopPolling(); }
      return connected;
    } catch { return false; }
  }, [account]);

  // Poll de status a cada 3s enquanto QR está visível
  const startPolling = useCallback(() => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const connected = await checkStatus();
      if (connected) stopPolling();
    }, 3000);
  }, [checkStatus]);

  function stopPolling() {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }

  useEffect(() => () => stopPolling(), []);

  // Gera QR Code
  const generateQR = useCallback(async () => {
    if (!account?._id || qrLoading) return;
    setQrLoading(true);
    setError(null);
    try {
      const res  = await apiPost(`/whatsapp-accounts/${account._id}/qr`, {});
      const data = res?.data || res;
      if (data?.status === "already_connected") {
        setStatus("connected");
        setQr(null);
      } else if (data?.qr) {
        setQr(data.qr);
        setStatus("waiting_scan");
        startPolling();
      }
    } catch (e) {
      setError(e?.message || "Erro ao gerar QR Code.");
    } finally {
      setQrLoading(false);
    }
  }, [account, qrLoading, startPolling]);

  // Desconectar
  const disconnect = useCallback(async () => {
    if (!account?._id) return;
    try {
      await apiPost(`/whatsapp-accounts/${account._id}/disconnect`, {});
      setStatus("disconnected");
      setQr(null);
    } catch (e) {
      setError(e?.message || "Erro ao desconectar.");
    }
  }, [account]);

  // Reconectar (restart)
  const restart = useCallback(async () => {
    if (!account?._id) return;
    try {
      await apiPost(`/whatsapp-accounts/${account._id}/restart`, {});
      setStatus("disconnected");
      setQr(null);
    } catch (e) {
      setError(e?.message || "Erro ao reconectar.");
    }
  }, [account]);

  return {
    account, qr, status, loading, qrLoading, error,
    generateQR, checkStatus, disconnect, restart, loadAccount,
  };
}
