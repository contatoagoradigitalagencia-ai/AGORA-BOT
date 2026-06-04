import { memo } from "react";

/**
 * @author VAMPETA
 * @brief RENDERIZA A REACAO DA MENSAGEM SE OUVER
 * @param {String} context MENSAGEM RESPONDIDA
*/
const Location = memo(function Text({ reaction }) {
	return (
		<div className="absolute -bottom-3 right-5 text-sm flex items-center animate-bounce">
			{reaction}
		</div>
	);
});

export default Location;