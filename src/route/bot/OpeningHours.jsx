/**
 * @author VAMPETA
 * @brief COMPONENTE PARA SALVAR HORARIO DE FUNCIONAMENTO
*/
export default function OpeningHours() {
	return (
		<div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col gap-4">
			<div>
				<h2 className="text-lg font-semibold">Horário de atendimento</h2>
				<p className="text-sm text-zinc-400">Informe os horários em que há atendimento humano ou funcionamento do local.</p>
			</div>
			<label className="flex items-center justify-between cursor-pointer">
				<span className="text-sm text-zinc-300">Exibir horário de atendimento</span>
				<div className="relative">
					<input type="checkbox" className="sr-only peer" />
					<div className="w-10 h-5 bg-zinc-700 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
					<div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
				</div>
			</label>
			<textarea className="bg-zinc-800 border border-zinc-700 rounded p-2 text-sm outline-none resize-none min-h-[90px]" placeholder={`Ex: Segunda a sexta: 08h às 18h Sábado: 09h às 13h`} />
			<p className="text-xs text-zinc-500">Dica: o bot continua respondendo fora do horário, mas pode avisar o cliente.</p>
			<button className="bg-orange-500 text-black rounded p-2 text-sm w-full hover:bg-orange-400 transition cursor-pointer" onClick={() => alert("ainda nao configurado")}>
				Salvar
			</button>
		</div>
	);
}