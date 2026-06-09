/**
 * @brief Normaliza objeto de conta WhatsApp vindo de qualquer endpoint.
 */
export function normalizeWhatsAppAccount(account) {
	if (!account) return null;
	const id = account.id || account._id || null;
	const phoneNumber = account.phoneNumber || account.phone || account.label || "—";
	const rawStatus = account.status || account.lastStatus || "";
	const connected = account.connected === true ||
		["active", "connected", "open", "online", "CONNECTED"].includes(rawStatus);
	return {
		id,
		provider: account.provider || "zapi",
		phoneNumber,
		label: account.label || phoneNumber,
		status: connected ? "connected" : "disconnected",
		connected,
		settings: account.settings || {},
	};
}
