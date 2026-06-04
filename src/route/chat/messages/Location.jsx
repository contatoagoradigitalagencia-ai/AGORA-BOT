import { memo } from "react";

/**
 * @author VAMPETA
 * @brief RENDERIZA MENSAGEM DE LOCALIZACAO
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Location = memo(function Location({ message }) {
	return (
		<a className="flex flex-col gap-2 w-[70vw] max-w-xs" href={`https://www.google.com/maps?q=${message.data.location.latitude},${message.data.location.longitude}`} target="_blank" rel="noopener noreferrer">
			<div className="flex items-center justify-center py-4 rounded bg-orange-500">
				<i className="bi bi-geo-alt-fill text-white text-6xl" />
			</div>
			<p>{message.data.location.name}</p>
			<p className="text-sm text-gray-600">{message.data.location.address}</p>
		</a>
	);
});

export default Location;