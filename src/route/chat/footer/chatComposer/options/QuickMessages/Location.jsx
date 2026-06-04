import { memo } from "react";

/**
 * @author VAMPETA
 * @brief RENDERIZA MENSAGEM DE LOCALIZACAO
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Location = memo(function Location({ message }) {
	return (
		<>
			<div className="flex items-center justify-center py-4 rounded bg-orange-500">
				<i className="bi bi-geo-alt-fill text-white text-6xl" />
			</div>
			<p>{message.location.name}</p>
			<p className="text-sm text-gray-600">{message.location.address}</p>
		</>
	);
});

export default Location;