import { useEffect, useState, useCallback } from "react";
import { apiGet, apiList, apiPost, apiPatch, apiDelete } from "../../api/client.js";

const BASE = "/admin";
const INTEGRATIONS = `${BASE}/integrations`;

export function useAdmin() {
  const [overview,     setOverview]     = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [logs,         setLogs]         = useState([]);
  const [aiConfigs,    setAiConfigs]    = useState([]);
  const [health,       setHealth]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewBody, organizationData, integrationData, logData, aiData, healthData] = await Promise.all([
        apiGet(`${BASE}/overview`),
        apiList(`${BASE}/organizations`),
        apiList(INTEGRATIONS),
        apiList(`${BASE}/logs`),
        apiList(`${BASE}/ai`),
        apiList(`${BASE}/health`),
      ]);

      setOverview(overviewBody?.data || overviewBody || null);
      setOrganizations(organizationData);
      setIntegrations(integrationData);
      setLogs(logData);
      setAiConfigs(aiData);
      setHealth(healthData);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function loadLogs(filters = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    const data = await apiList(`${BASE}/logs${params.toString() ? `?${params.toString()}` : ""}`);
    setLogs(data);
    return data;
  }

  async function createOrganization(form) {
    const res = await apiPost(`${BASE}/organizations`, form);
    const item = res?.data || res;
    setOrganizations((prev) => [item, ...prev]);
    return item;
  }

  async function updateOrganization(id, form) {
    const res = await apiPatch(`${BASE}/organizations/${id}`, form);
    const item = res?.data || res;
    setOrganizations((prev) => prev.map((org) => (org._id === id || org.id === id) ? item : org));
    return item;
  }

  async function deactivateOrganization(id) {
    await apiDelete(`${BASE}/organizations/${id}`);
    setOrganizations((prev) => prev.map((org) => (
      org._id === id || org.id === id ? { ...org, status: "inactive" } : org
    )));
  }

  async function create(form) {
    const res = await apiPost(INTEGRATIONS, form);
    const item = res?.data || res;
    setIntegrations((prev) => [item, ...prev]);
    return item;
  }

  async function update(id, form) {
    const res = await apiPatch(`${INTEGRATIONS}/${id}`, form);
    const item = res?.data || res;
    setIntegrations((prev) => prev.map((i) => (i._id === id || i.id === id) ? item : i));
    return item;
  }

  async function remove(id) {
    await apiDelete(`${INTEGRATIONS}/${id}`);
    setIntegrations((prev) => prev.map((i) => (
      i._id === id || i.id === id ? { ...i, status: "inactive" } : i
    )));
  }

  async function testConnection(id) {
    const result = await apiPost(`${INTEGRATIONS}/${id}/test`, {});
    setIntegrations((prev) => prev.map((i) =>
      (i._id === id || i.id === id)
        ? {
            ...i,
            status: result.ok ? "active" : "error",
            lastTestResult: result.message || result.error,
            lastTestedAt: result.testedAt || new Date().toISOString(),
          }
        : i
    ));
    return result;
  }

  async function activateIntegration(id) {
    const res = await apiPost(`${INTEGRATIONS}/${id}/activate`, {});
    const item = res?.data || res;
    await load();
    return item;
  }

  async function syncIntegration(id) {
    const res = await apiPost(`${INTEGRATIONS}/${id}/sync`, {});
    await load();
    return res?.data || res;
  }

  async function restartWebhook(id) {
    const res = await apiPost(`${INTEGRATIONS}/${id}/restart-webhook`, {});
    await load();
    return res?.data || res;
  }

  async function updateAi(id, form) {
    const res = await apiPatch(`${BASE}/ai/${id}`, form);
    await load();
    return res?.data || res;
  }

  async function restartAi(organizationId) {
    return apiPost(`${BASE}/ai/restart`, { organizationId });
  }

  async function testPrompt(payload) {
    return apiPost(`${BASE}/ai/test-prompt`, payload);
  }

  return {
    overview,
    organizations,
    integrations,
    logs,
    aiConfigs,
    health,
    loading,
    error,
    loadLogs,
    createOrganization,
    updateOrganization,
    deactivateOrganization,
    create,
    update,
    remove,
    testConnection,
    activateIntegration,
    syncIntegration,
    restartWebhook,
    updateAi,
    restartAi,
    testPrompt,
    refetch: load,
  };
}
