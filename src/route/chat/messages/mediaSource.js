function firstValue(...values) {
	return values.find((value) => typeof value === "string" && value.trim()) || null;
}

export function mediaSource(message, key) {
	const typed = message?.data?.[key] || {};

	return firstValue(
		message?.media?.url,
		typed.url,
		message?.data?.url,
		typed.link,
		message?.data?.link,
		message?.media?.link,
		message?.media?.providerUrl,
		typed.providerUrl
	);
}

export function mediaCaption(message, key) {
	const typed = message?.data?.[key] || {};

	return firstValue(
		message?.media?.caption,
		typed.caption,
		message?.data?.text?.body,
		message?.text
	);
}

export function warnMissingMediaUrl(message, key) {
	if (!import.meta.env.DEV) return;
	console.warn("[MEDIA UI MISSING URL]", {
		type: key,
		messageId: message?.wamid || message?._id || message?.id,
		hasMedia: Boolean(message?.media),
		dataKeys: Object.keys(message?.data || {}),
		mediaKeys: Object.keys(message?.media || {}),
	});
}
