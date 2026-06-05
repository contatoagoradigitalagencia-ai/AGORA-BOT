import { memo, useMemo } from "react";
import { formattedText } from "../../../utils/components/formattedString.jsx";

const Text = memo(function Text({ message }) {
	const body = message?.data?.text?.body ?? message?.text ?? "";
	const text = useMemo(() => body ? formattedText(body) : null, [body]);
	if (!text) return null;
	return <p className="whitespace-pre-wrap break-words text-sm">{text}</p>;
});

export default Text;
