import { Link } from "react-router-dom";

/**
 * @author VAMPETA
 * @brief PAGINA NOT FOUND
*/
export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-dvh bg-black text-white">
            <div className="relative flex items-center justify-center">
                <div className="absolute w-24 h-24 bg-orange-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <img src="/logo.png" className="w-16 h-16 object-contain animate-bounce [animation-duration:2s]"  />
            </div>
            <p className="mt-6 text-lg animate-pulse">Página não encontrada</p>
            <Link to="/" className="mt-8 px-6 py-2 bg-orange-500 text-black font-medium rounded-lg hover:bg-orange-400 transition">Voltar para página inicial</Link>
        </div>
    );
}