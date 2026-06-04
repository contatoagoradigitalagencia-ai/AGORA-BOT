/**
 * @author VAMPETA
 * @brief CONVERTE A DATA TIMESTAMP PARA STRING NO FORMATO "dd/mm/aaaa hh:mm"
 * @param {String} timestamp DATA A SER CONVERTIDA
 * @return {String} DATA E HORA FORMATADA
*/
export function formatDate(timestamp) {
	if (!timestamp) return ("");
	return (new Date(timestamp).toLocaleString("pt-BR", {
		timeZone: "America/Sao_Paulo",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false
	}));
}