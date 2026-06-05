import { useEffect, useState, useCallback } from "react";
import { apiGet, apiList, apiPost, apiPatch, apiDelete } from "../../api/client.js";

const BASE = "/admin";
const INTEGRATIONS = `${BASE}/integrations`;

export function useAdmin() {
  const [overview,     setOverview]     = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [logs,         setLogs]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [overviewBody, organizationData, integrationData, logData] = await Promise.all([
        apiGet(`${BASE}/overview`),
        apiList(`${BASE}/organizations`),
        apiList(INTEGRATIONS),
        apiList(`${BASE}/logs`),
      ]);

      setOverview(overviewBody?.data || overviewBody || null);
      setOrganizations(organizationData);
      setIntegrations(integrationData);
      setLogs(logData);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

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

  return {
    overview,
    organizations,
    integrations,
    logs,
    loading,
    error,
    createOrganization,
    updateOrganization,
    deactivateOrganization,
    create,
    update,
    remove,
    testConnection,
    activateIntegration,
    refetch: load,
  };
}
