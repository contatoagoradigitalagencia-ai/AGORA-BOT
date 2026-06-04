/**
 * @author VAMPETA
 * @brief COMPOENENTE DE ERRO
*/
export default function Error() {
	return (
		<div className="flex flex-col items-center justify-center h-dvh w-full bg-black">
			<i className="bi bi-tux text-orange-500 text-5xl" />
			<p className="text-white">Infelizmente aconteceu um erro</p>
		</div>
	);
}