/**
 * @author VAMPETA
 * @brief COMPOENENTE INFORMATIVO QUE A PAGINA ESTA EM CONSTRUCAO
*/
export default function UnderConstruction() {
	return (
		<div className="flex flex-col items-center justify-center h-dvh w-full bg-black">
			<i className="bi bi-gear text-orange-500 text-5xl animate-spin [animation-duration:5s]" />
			<p className="text-white">Página em construção</p>
		</div>
	);
}
