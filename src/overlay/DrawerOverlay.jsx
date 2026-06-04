import { createPortal } from "react-dom";

/**
 * @author VAMPETA
 * @brief MONTA O ELEMENTO FILHO JUNTO COM O DRAWER
 * @param {Object} children ELEMENTO FILHO A SER RENDERIZADO
 * @param {Function} onClose FUNCAO QUE FECHA O OVERLAY
 * @param {Boolean} closing ESTADO QUE INFORMA SE ESTA FECHANDO
*/
export default function DrawerOverlay({ children, onClose, closing }) {
	return (createPortal(
		<div className="flex flex-col items-end justify-center fixed inset-0 z-50">
			<div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${(closing) ? "opacity-0" : "opacity-100"}`} onClick={onClose} />
			<div className={`flex flex-col relative h-full w-full md:w-[40%] bg-zinc-900 text-white overflow-hidden ${(closing) ? "animate-slideOutRight" : "animate-slideInRight"}`}>
				<div className="flex justify-between items-center w-full p-4 border-b border-zinc-700">
					<img className="w-10 h-10 object-contain animate-spin [animation-duration:5s]" src="/logo.png" />
					<button className="hover:text-orange-500 cursor-pointer" onClick={onClose}>
						<i className="bi bi-x-lg text-3xl" />
					</button>
				</div>
				{children}
			</div>
		</div>,
		document.body
	));
}