import { memo, useMemo } from "react";

import { formattedText } from "../../../../../../utils/components/formattedString.jsx";

/**
 * @author VAMPETA
 * @brief RENDERIZA MENSAGEM DE TEXTO
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Text = memo(function Text({ message }) {
	const text = useMemo(() => formattedText(message.text.body), [message.text.body]);

	return (
		<p>{text}</p>
	);
});

export default Text;