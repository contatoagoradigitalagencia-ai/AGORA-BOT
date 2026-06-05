import { useEffect, useState, useCallback } from "react";
import { apiList, apiPost, apiPatch, apiDelete } from "../../api/client.js";

const ENDPOINTS = {
	products: "/products",
	services: "/services",
	plans:    "/plans",
};

const EMPTY_CATALOG = { products: [], services: [], plans: [] };

export function useCatalog() {
	const [catalog, setCatalog] = useState(EMPTY_CATALOG);
	const [error,   setError]   = useState(false);
	const [loading, setLoading] = useState(true);

	const fetchAll = useCallback(async () => {
		try {
			const [products, services, plans] = await Promise.all([
				apiList(ENDPOINTS.products),
				apiList(ENDPOINTS.services),
				apiList(ENDPOINTS.plans),
			]);
			setCatalog({ products, services, plans });
			setError(false);
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => { fetchAll(); }, [fetchAll]);

	async function createItem(section, form) {
		const created = await apiPost(ENDPOINTS[section.key], form);
		const item = created?.data || created;
		setCatalog(prev => ({ ...prev, [section.key]: [item, ...prev[section.key]] }));
	}

	async function updateItem(section, id, form) {
		const updated = await apiPatch(`${ENDPOINTS[section.key]}/${id}`, form);
		const item = updated?.data || updated;
		setCatalog(prev => ({
			...prev,
			[section.key]: prev[section.key].map(i => i._id === id ? item : i),
		}));
	}

	async function deleteItem(section, id) {
		await apiDelete(`${ENDPOINTS[section.key]}/${id}`);
		setCatalog(prev => ({
			...prev,
			[section.key]: prev[section.key].filter(i => i._id !== id),
		}));
	}

	return { catalog, loading, error, createItem, updateItem, deleteItem };
}
