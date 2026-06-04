/**
 * @author VAMPETA
 * @brief HOOK QUE PERMITE O USUARIO CONTROLAR O DIA EXIBIDO NO DASHBOARD
 * @param {String} date DATA DE CONSULTA DE METRICAS
 * @param {Object} setDate FUNCAO QUE CONTROLA date
 */
export default function DateSelector({ date, setDate }) {
	return (
		<div className="flex items-center gap-3">
			<label className="text-sm text-zinc-400">Data:</label>
			<input className="bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-orange-500transition" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
		</div>
	);
}