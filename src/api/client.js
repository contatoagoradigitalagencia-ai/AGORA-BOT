import axios from "axios";
import Cookies from "js-cookie";

const DEFAULT_BACKEND_URL = "https://agora-bot-2-api.onrender.com";

function trimSlash(value) {
	return String(value || "").replace(/\/+$/, "");
}

export const API_BASE_URL = trimSlash(
	import.meta.env.VITE_API_URL || `${trimSlash(import.meta.env.VITE_URL_BACK_END || DEFAULT_BACKEND_URL)}/api/v1`
);

export class ApiError extends Error {
	constructor(message, status) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

function clearSession() {
	Cookies.remove("phone", { path: "/" });
	Cookies.remove("idPhone", { path: "/" });
	Cookies.remove("token", { path: "/" });
	Cookies.remove("role", { path: "/" });
	Cookies.remove("name", { path: "/" });
}

function authHeaders() {
	const token = Cookies.get("token");
	const organizationId = Cookies.get("idPhone");

	return {
		...(token ? { Authorization: `Bearer ${token}` } : {}),
		...(organizationId ? { "x-organization-id": organizationId } : {}),
	};
}

function normalizeError(error) {
	const status = error?.response?.status;

	if (status === 401) {
		clearSession();
		window.location.assign("/login");
		return new ApiError("Sessao expirada. Entre novamente.", 401);
	}

	if (status === 404) return new ApiError("Recurso nao encontrado.", 404);
	if (status >= 500) return new ApiError("Erro no servidor. Tente novamente em alguns instantes.", status);
	return new ApiError("Nao foi possivel carregar os dados.", status || 0);
}

export async function apiGet(path, config = {}) {
	try {
		const response = await axios.get(`${API_BASE_URL}${path}`, {
			...config,
			headers: {
				...authHeaders(),
				...(config.headers || {}),
			},
		});

		return response.data;
	} catch (error) {
		throw normalizeError(error);
	}
}

export async function apiPost(path, data = {}, config = {}) {
	try {
		const response = await axios.post(`${API_BASE_URL}${path}`, data, {
			...config,
			headers: {
				...authHeaders(),
				...(config.headers || {}),
			},
		});

		return response.data;
	} catch (error) {
		throw normalizeError(error);
	}
}

export async function apiPatch(path, data = {}, config = {}) {
	try {
		const response = await axios.patch(`${API_BASE_URL}${path}`, data, {
			...config,
			headers: {
				...authHeaders(),
				...(config.headers || {}),
			},
		});

		return response.data;
	} catch (error) {
		throw normalizeError(error);
	}
}

export async function apiList(path, config = {}) {
	try {
		const body = await apiGet(path, config);
		if (Array.isArray(body)) return body;
		if (Array.isArray(body?.data)) return body.data;
		return [];
	} catch (error) {
		if (error.status === 404) return [];
		throw error;
	}
}

export async function apiDelete(path, config = {}) {
	try {
		const response = await axios.delete(`${API_BASE_URL}${path}`, {
			...config,
			headers: {
				...authHeaders(),
				...(config.headers || {}),
			},
		});
		return response.data;
	} catch (error) {
		throw normalizeError(error);
	}
}
