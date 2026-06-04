/**
 * @author VAMPETA
 * @brief COMPONENTE QUE CRIA UM CARD
 * @param {Boolean} loading INFORMA O ESTADO DE LOAD
 * @param {String} text TEXTO DESCRITIVO DO CARD
 * @param {Number} value VALOR QUE DEVE SER EXIBIDO JUNTO COM A DESCRICAO
*/
export default function Card({ loading, text, value }) {
	return (
		<div className={`bg-zinc-900 p-5 rounded-xl border border-zinc-800 min-h-[100px] flex items-center ${(loading) ? "animate-pulse" : ""}`}>
			{!loading && (
				<div>
					<p className="text-xs md:text-sm text-zinc-400">{text}</p>
					<h2 className={`text-xl md:text-2xl font-bold mt-2 ${value && "text-orange-500"}`}>{value || 0}</h2>
				</div>
			)}
		</div>
	);
}