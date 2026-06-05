import { useEffect, useState, useCallback } from "react";
import { apiList, apiPost, apiPatch, apiDelete } from "../../api/client.js";

const ENDPOINT = "/attendants";

export const COLOR_OPTIONS = [
  { value: "orange", label: "Laranja",  bg: "bg-orange-500" },
  { value: "blue",   label: "Azul",     bg: "bg-blue-500"   },
  { value: "green",  label: "Verde",    bg: "bg-green-500"  },
  { value: "purple", label: "Roxo",     bg: "bg-purple-500" },
  { value: "red",    label: "Vermelho", bg: "bg-red-500"    },
  { value: "yellow", label: "Amarelo",  bg: "bg-yellow-500" },
];

export function colorBg(tag) {
  return COLOR_OPTIONS.find(c => c.value === tag)?.bg || "bg-orange-500";
}

export function useAttendants() {
  const [attendants, setAttendants] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiList(ENDPOINT);
      setAttendants(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createAttendant(form) {
    const res  = await apiPost(ENDPOINT, form);
    const item = res?.data || res;
    setAttendants(prev => [item, ...prev]);
    return item;
  }

  async function updateAttendant(id, form) {
    const res  = await apiPatch(`${ENDPOINT}/${id}`, form);
    const item = res?.data || res;
    setAttendants(prev => prev.map(a => (a._id === id || a.id === id) ? item : a));
    return item;
  }

  async function deactivateAttendant(id) {
    await apiDelete(`${ENDPOINT}/${id}`);
    setAttendants(prev => prev.map(a =>
      (a._id === id || a.id === id) ? { ...a, active: false } : a
    ));
  }

  return { attendants, loading, error, createAttendant, updateAttendant, deactivateAttendant, refetch: load };
}
