import { Link } from "react-router-dom";

/**
 * @author VAMPETA
 * @brief COMPONENTE DE ATALHOS DO DASHBOARD
*/
export default function Shortcuts() {
    // return (
    //     <>
	// 		<div className="bg-zinc-900 p-5 md:p-6 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
	// 			<div>
	// 				<h2 className="text-base md:text-lg font-semibold mb-1">Em espera de atendimento humanizado</h2>
	// 				<p className="text-zinc-400 text-xs md:text-sm">Veja os contatos aguardando atendimento humano.</p>
	// 			</div>
	// 			<Link className="w-full md:w-auto text-center px-6 py-2 bg-orange-500 text-black rounded-lg font-medium hover:bg-orange-400 transition" to="/human-service">
	// 				Abrir
	// 			</Link>
	// 		</div>
	// 		<div className="bg-zinc-900 p-5 md:p-6 rounded-xl border border-zinc-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
	// 			<div>
	// 				<h2 className="text-base md:text-lg font-semibold mb-1">Ir para conversas</h2>
	// 				<p className="text-zinc-400 text-xs md:text-sm">Visualize e responda mensagens em tempo real.</p>
	// 			</div>
	// 			<Link className="w-full md:w-auto text-center px-6 py-2 bg-orange-500 text-black rounded-lg font-medium hover:bg-orange-400 transition" to="/chat">
	// 				Abrir
	// 			</Link>
	// 		</div>
    //     </>
    // );
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link className="flex flex-col justify-center items-center bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-orange-500 transition" to="/chat">
                <i className="bi bi-whatsapp text-3xl text-orange-500" />
                <p className="mt-3 text-sm">Conversas</p>
            </Link>
            <Link className="flex flex-col justify-center items-center bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-orange-500 transition" to="/human-service">
                <i className="bi bi-hourglass-split text-3xl text-orange-500" />
                <p className="mt-3 text-sm">Em espera</p>
            </Link>
            <Link className="flex flex-col justify-center items-center bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-orange-500 transition" to="/contacts">
                <i className="bi bi-telephone text-3xl text-orange-500" />
                <p className="mt-3 text-sm">Contatos</p>
            </Link>
            <Link className="flex flex-col justify-center items-center bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-orange-500 transition" to="/bot">
                <i className="bi bi-robot text-3xl text-orange-500" />
                <p className="mt-3 text-sm">Configurar IA</p>
            </Link>
        </div>
    );
}