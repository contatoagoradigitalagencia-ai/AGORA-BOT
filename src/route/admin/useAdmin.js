import { useEffect, useState, useCallback } from "react";
import { apiGet, apiList, apiPost, apiPatch, apiDelete } from "../../api/client.js";

const BASE = "/admin";
const INTEGRATIONS = `${BASE}/integrations`;
const DEFAULT_OVERVIEW = {
  organizationsCount: 0,
  activeOrganizationsCount: 0,
  whatsappAccounts: 0,
  conversationsCount: 0,
  messagesCount: 0,
  integrations: { active: 0, pending: 0, error: 0, zapi: 0, meta: 0 },
  latestError: null,
  latestTest: null,
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function dataObject(value, fallback = {}) {
  if (value?.data && typeof value.data === "object" && !Array.isArray(value.data)) return value.data;
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return fallback;
}

async function safeList(path, fallback = []) {
  try {
    return asArray(await apiList(path));
  } catch (error) {
    console.error("[ADMIN API ERROR]", path, error);
    return fallback;
  }
}

async function safeGet(path, fallback = null) {
  try {
    const body = await apiGet(path);
    return dataObject(body, fallback);
  } catch (error) {
    console.error("[ADMIN API ERROR]", path, error);
    return fallback;
  }
}

export function useAdmin() {
  const [overview,     setOverview]     = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [logs,         setLogs]         = useState([]);
  const [aiConfigs,    setAiConfigs]    = useState([]);
  const [health,       setHealth]       = useState([]);
  const [sectionErrors, setSectionErrors] = useState({});
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const errors = {};
    const [overviewData, organizationData, integrationData, logData, aiData, healthData] = await Promise.all([
      safeGet(`${BASE}/overview`, DEFAULT_OVERVIEW).then((data) => data || DEFAULT_OVERVIEW),
      safeList(`${BASE}/organizations`).catch(() => { errors.organizations = true; return []; }),
      safeList(INTEGRATIONS).catch(() => { errors.integrations = true; return []; }),
      safeList(`${BASE}/logs`).catch(() => { errors.logs = true; return []; }),
      safeList(`${BASE}/ai`).catch(() => { errors.ai = true; return []; }),
      safeList(`${BASE}/health`).catch(() => { errors.health = true; return []; }),
    ]);

    setOverview({ ...DEFAULT_OVERVIEW, ...(overviewData || {}) });
    setOrganizations(asArray(organizationData));
    setIntegrations(asArray(integrationData));
    setLogs(asArray(logData));
    setAiConfigs(asArray(aiData));
    setHealth(asArray(healthData));
    setSectionErrors(errors);
    setError(false);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function loadLogs(filters = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    const path = `${BASE}/logs${params.toString() ? `?${params.toString()}` : ""}`;
    try {
      const data = await apiList(path);
      setLogs(asArray(data));
      setSectionErrors((prev) => ({ ...prev, logs: false }));
      return asArray(data);
    } catch (error) {
      console.error("[ADMIN API ERROR]", path, error);
      setLogs([]);
      setSectionErrors((prev) => ({ ...prev, logs: true }));
      return [];
    }
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
    sectionErrors,
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
