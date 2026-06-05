import { useEffect, useState, useCallback } from "react";
import { apiList, apiPost, apiPatch, apiDelete } from "../../api/client.js";

export const SECTIONS = {
	products: { key: "products", endpoint: "/products", label: "Produtos",  singular: "Produto"  },
	services: { key: "services", endpoint: "/services", label: "Serviços",  singular: "Serviço"  },
	plans:    { key: "plans",    endpoint: "/plans",    label: "Planos",    singular: "Plano"    },
};

const EMPTY = { products: [], services: [], plans: [] };

export function useCatalog() {
	const [catalog,  setCatalog]  = useState(EMPTY);
	const [error,    setError]    = useState(false);
	const [loading,  setLoading]  = useState(true);

	const fetchAll = useCallback(async () => {
		setLoading(true);
		try {
			const [products, services, plans] = await Promise.all([
				apiList(SECTIONS.products.endpoint),
				apiList(SECTIONS.services.endpoint),
				apiList(SECTIONS.plans.endpoint),
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

	async function createItem(sectionKey, form) {
		const res  = await apiPost(SECTIONS[sectionKey].endpoint, form);
		const item = res?.data || res;
		setCatalog(prev => ({ ...prev, [sectionKey]: [item, ...prev[sectionKey]] }));
		return item;
	}

	async function updateItem(sectionKey, id, form) {
		const res  = await apiPatch(`${SECTIONS[sectionKey].endpoint}/${id}`, form);
		const item = res?.data || res;
		setCatalog(prev => ({
			...prev,
			[sectionKey]: prev[sectionKey].map(i => (i._id === id ? item : i)),
		}));
		return item;
	}

	async function deleteItem(sectionKey, id) {
		await apiDelete(`${SECTIONS[sectionKey].endpoint}/${id}`);
		setCatalog(prev => ({
			...prev,
			[sectionKey]: prev[sectionKey].filter(i => i._id !== id),
		}));
	}

	async function duplicateItem(sectionKey, item) {
		const { _id, id, createdAt, updatedAt, __v, ...rest } = item;
		const copy = { ...rest, name: `${rest.name} (cópia)`, active: false };
		return createItem(sectionKey, copy);
	}

	async function toggleActive(sectionKey, item) {
		return updateItem(sectionKey, item._id, { active: !item.active });
	}

	return { catalog, loading, error, createItem, updateItem, deleteItem, duplicateItem, toggleActive, refetch: fetchAll };
}
