import Cookies from "js-cookie";
import server from "../../server.js";

/**
 * @brief Wrapper de fetch com Authorization e x-organization-id automáticos.
 */
export async function apiFetch(path, options = {}) {
	const token = Cookies.get("token");
	const orgId = Cookies.get("idPhone");
	const res = await fetch(`${server}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { "Authorization": `Bearer ${token}` } : {}),
			...(orgId ? { "x-organization-id": orgId } : {}),
			...(options.headers || {}),
		},
	});
	return res;
}
