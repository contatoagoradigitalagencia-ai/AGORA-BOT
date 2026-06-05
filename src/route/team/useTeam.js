import { useEffect, useState, useCallback } from "react";
import { apiList, apiPost, apiPatch, apiDelete } from "../../api/client.js";

const ENDPOINT = "/users";

export const ROLES = [
  { value: "owner",   label: "Proprietário" },
  { value: "admin",   label: "Administrador" },
  { value: "manager", label: "Gerente" },
  { value: "seller",  label: "Vendedor" },
  { value: "agent",   label: "Atendente" },
  { value: "viewer",  label: "Visualizador" },
];

export function roleLabel(role) {
  return ROLES.find(r => r.value === role)?.label || role || "—";
}

export function useTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiList(ENDPOINT);
      setMembers(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createMember(form) {
    const res  = await apiPost(ENDPOINT, form);
    const item = res?.data || res;
    setMembers(prev => [item, ...prev]);
    return item;
  }

  async function updateMember(id, form) {
    const res  = await apiPatch(`${ENDPOINT}/${id}`, form);
    const item = res?.data || res;
    setMembers(prev => prev.map(m => (m._id === id || m.id === id) ? item : m));
    return item;
  }

  async function deactivateMember(id) {
    await apiDelete(`${ENDPOINT}/${id}`);
    setMembers(prev => prev.map(m =>
      (m._id === id || m.id === id) ? { ...m, active: false } : m
    ));
  }

  return { members, loading, error, createMember, updateMember, deactivateMember, refetch: load };
}
