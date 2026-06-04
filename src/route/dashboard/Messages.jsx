import Card from "./Card.jsx";

/**
 * @author VAMPETA
 * @brief COMPONENTE QUE CRIA METRICAS DE MENSAGENS RECEBIDAS E ENVIADAS DO DIA SELECIONADO
 * @param {Boolean} loading INFORMA O ESTADO DE LOAD
 * @param {Object} info INFORMACOES DA METRICA
*/
export default function Messages({ loading, info }) {
	return (
		<>
			<div>
				<div className="flex items-center gap-3 mb-4">
					<h2 className="text-sm md:text-base font-semibold text-zinc-200 whitespace-nowrap">Mensagens recebidas hoje</h2>
					<div className="flex-1 h-px bg-zinc-800" />
				</div>
				<div className="grid grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
					<Card loading={loading} text="Texto" value={info.received?.text} />
					<Card loading={loading} text="Figurinha" value={info.received?.sticker} />
					<Card loading={loading} text="Áudio" value={info.received?.audio} />
					<Card loading={loading} text="Imagem" value={info.received?.image} />
					<Card loading={loading} text="Vídeo" value={info.received?.video} />
					<Card loading={loading} text="Localização" value={info.received?.location} />
					<Card loading={loading} text="Contato" value={info.received?.contacts} />
					<Card loading={loading} text="Documento" value={info.received?.document} />
				</div>
			</div>
			<div>
				<div className="flex items-center gap-3 mb-4">
					<h2 className="text-sm md:text-base font-semibold text-zinc-200 whitespace-nowrap">Mensagens enviadas hoje</h2>
					<div className="flex-1 h-px bg-zinc-800" />
				</div>
				<div className="grid grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
					<Card loading={loading} text="Texto" value={info.sent?.text} />
					<Card loading={loading} text="Figurinha" value={info.sent?.sticker} />
					<Card loading={loading} text="Áudio" value={info.sent?.audio} />
					<Card loading={loading} text="Imagem" value={info.sent?.image} />
					<Card loading={loading} text="Vídeo" value={info.sent?.video} />
					<Card loading={loading} text="Localização" value={info.sent?.location} />
					<Card loading={loading} text="Contato" value={info.sent?.contacts} />
					<Card loading={loading} text="Documento" value={info.sent?.document} />
					<Card loading={loading} text="Botão" value={info.sent?.button} />
				</div>
			</div>
		</>
	);
}