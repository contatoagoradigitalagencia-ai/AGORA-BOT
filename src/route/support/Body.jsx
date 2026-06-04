import { useGetInfoSupport } from "./useGetInfoSupport.js";

import Load from "../../screens/Load.jsx";
import Error from "../../screens/Error.jsx";
import Status from "./Status.jsx";
import Contact from "./Contact.jsx";
import FAQ from "./FAQ.jsx";

/**
 * @author VAMPETA
 * @brief BODY DA ROTA /support
*/
export default function Body({ socket }) {
	const { support, setSupport, loading, error } = useGetInfoSupport(socket);

	if (error) return (<Error />);
	if (loading) return (<Load />);
	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			<Status support={support} />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Contact />
				<FAQ />
			</div>
			{/* <div className="flex flex-col gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
				<div>
					<h2 className="text-lg font-semibold">Documentação e Guias</h2>
					<p className="text-sm text-zinc-400">Acesse tutoriais e conteúdos para aprender a utilizar a plataforma.</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
					<button className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-orange-500 transition text-start cursor-pointer">
						<div className="flex items-center gap-2 mb-3">
							<i className="bi bi-book text-orange-500 text-xl" />
							<h3 className="font-medium">Primeiros passos</h3>
						</div>
						<p className="text-sm text-zinc-400">Aprenda a configurar sua conta rapidamente.</p>
					</button>
					<button className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-orange-500 transition text-start cursor-pointer">
						<div className="flex items-center gap-2 mb-3">
							<i className="bi bi-robot text-orange-500 text-xl" />
							<h3 className="font-medium">Configuração do Bot</h3>
						</div>
						<p className="text-sm text-zinc-400">Personalize o comportamento da IA.</p>
					</button>
					<button className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-orange-500 transition text-start cursor-pointer">
						<div className="flex items-center gap-2 mb-3">
							<i className="bi bi-bar-chart text-orange-500 text-xl" />
							<h3 className="font-medium">Métricas e Dashboard</h3>
						</div>
						<p className="text-sm text-zinc-400">Entenda os dados e estatísticas da plataforma.</p>
					</button>
					<button className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-orange-500 transition text-start cursor-pointer">
						<div className="flex items-center gap-2 mb-3">
							<i className="bi bi-shield-lock text-orange-500 text-xl" />
							<h3 className="font-medium">Segurança</h3>
						</div>
						<p className="text-sm text-zinc-400">Veja boas práticas de segurança e privacidade.</p>
					</button>
				</div>
			</div> */}
		</div>
	);
}