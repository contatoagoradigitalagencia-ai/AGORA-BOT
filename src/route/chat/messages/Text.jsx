import { memo, useMemo } from "react";

import { formattedText } from "../../../utils/components/formattedString.jsx";

/**
 * @author VAMPETA
 * @brief RENDERIZA MENSAGEM DE TEXTO
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Text = memo(function Text({ message }) {
	const text = useMemo(() => formattedText(message.data.text.body), [message.data.text.body]);

	return (
		<p>{text}</p>
	);
});

export default Text;