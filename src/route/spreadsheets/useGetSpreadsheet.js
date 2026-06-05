import { useEffect, useState } from "react";

import { apiList } from "../../api/client.js";

const EMPTY_CATALOG = {
	products: [],
	services: [],
	plans: [],
};

/**
 * @author VAMPETA
 * @brief HOOK QUE BUSCA O CATALOGO INTERNO NO AGORA BOT 2
*/
export function useCatalog() {
	const [catalog, setCatalog] = useState(EMPTY_CATALOG);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;

		Promise.all([
			apiList("/products"),
			apiList("/services"),
			apiList("/plans"),
		])
			.then(([products, services, plans]) => {
				if (!active) return ;
				setCatalog({ products, services, plans });
			})
			.catch(() => {
				if (!active) return ;
				setError(true);
			})
			.finally(() => {
				if (!active) return ;
				setLoading(false);
			});

		return (() => {
			active = false;
		});
	}, []);

	return ({ catalog, loading, error });
}
