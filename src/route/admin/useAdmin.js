import { useEffect, useState, useCallback } from "react";
import { apiList, apiPost, apiPatch, apiDelete } from "../../api/client.js";

const BASE = "/admin/integrations";

export function useAdmin() {
  const [integrations, setIntegrations] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiList(BASE);
      setIntegrations(data);
      setError(false);
    } catch { setError(true); }
    finally   { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create(form) {
    const res  = await apiPost(BASE, form);
    const item = res?.data || res;
    setIntegrations(prev => [item, ...prev]);
    return item;
  }

  async function update(id, form) {
    const res  = await apiPatch(`${BASE}/${id}`, form);
    const item = res?.data || res;
    setIntegrations(prev => prev.map(i => (i._id === id || i.id === id) ? item : i));
    return item;
  }

  async function remove(id) {
    await apiDelete(`${BASE}/${id}`);
    setIntegrations(prev => prev.filter(i => i._id !== id && i.id !== id));
  }

  async function testConnection(id) {
    const res = await apiPost(`${BASE}/${id}/test`, {});
    const result = res?.data || res;
    // Atualiza status local
    setIntegrations(prev => prev.map(i =>
      (i._id === id || i.id === id)
        ? { ...i, status: result.ok ? 'active' : 'error', lastTestResult: result.message, lastTestedAt: new Date().toISOString() }
        : i
    ));
    return result;
  }

  return { integrations, loading, error, create, update, remove, testConnection, refetch: load };
}
