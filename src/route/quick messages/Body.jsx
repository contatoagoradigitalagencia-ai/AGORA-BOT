import { Link } from "react-router-dom";

/**
 * @author VAMPETA
 * @brief CARD QUE REDIRECIONA PARA A PAGINA ESPECIFICA DE MENSAGEM RAPIDA
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
 * @param {String} route ROTA DA PAGINA DO TIPO DA MENSAGEM
 * @param {String} type TIPO DA MENSAGEM
 * @param {String} icon ICONE DO CARD
 * @param {String} deactivated INDICA SE O COMPONENTE ESTA DESATIVADO
*/
function Card({ route, type, icon, deactivated }) {
	return (
		<div className="flex flex-col relative gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:bg-zinc-800 transition">
			{deactivated && (
				<div className="flex items-center justify-center absolute inset-0 bg-black/80 border border-zinc-800 rounded-lg z-10">
					<p className="text-orange-500">Indisponível no momento</p>
				</div>
			)}
			<i className={`bi ${icon} text-xl text-orange-500`} />
			<div>
				<p className="text-sm font-medium">{type}</p>
				<p className="text-xs text-zinc-400">Criar nova mensagem </p>
			</div>
			<Link className="text-xs text-orange-500 hover:underline" to={`/quick-messages/${route}`}>Ver mensagens →</Link>
		</div>
	);
}

/**
 * @author VAMPETA
 * @brief PAGINA DE MENSAGENS RAPIDAS
 * @param {Object} socket SOCKET DE CONEXAO COM O BACK END
*/
export default function Body({ socket }) {
	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			<div className="flex flex-col gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
				<h2 className="text-lg font-semibold">Mensagens rápidas</h2>
				<p className="text-sm text-zinc-400">Crie mensagens prontas para agilizar seu atendimento. Escolha um tipo abaixo para começar.</p>
				<ul className="text-sm text-zinc-400 list-disc pl-5">
					<li>Use mensagens curtas e objetivas</li>
					<li>Adicione mídia para enriquecer</li>
					<li>Padronize respostas frequentes</li>
				</ul>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
				<Card route="text" type="Texto" icon="bi-chat-dots" />
				<Card route="sticker" type="Figurinha" icon="bi-emoji-smile" deactivated />
				<Card route="audio" type="Áudio" icon="bi-mic" />
				<Card route="image" type="Imagem" icon="bi-image" />
				<Card route="video" type="Vídeo" icon="bi-camera-video" />
				<Card route="location" type="Localização" icon="bi-geo-alt" />
				<Card route="contact" type="Contato" icon="bi-person-lines-fill" deactivated/>
				<Card route="document" type="Documento" icon="bi-file-earmark" />
				<Card route="button" type="Botões" icon="bi-ui-checks" deactivated />
				<Card route="list" type="Lista" icon="bi-list-ul" deactivated />
				<Card route="template" type="Template" icon="bi-layout-text-window" deactivated />
			</div>
		</div>
	);
}