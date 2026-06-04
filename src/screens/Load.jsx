/**
 * @author VAMPETA
 * @brief COMPOENENTE DE LOAD
*/
export default function Load() {
	return (
		<div className="flex items-center justify-center h-dvh w-full bg-black">
			<img className="w-20 h-20 animate-spin object-contain" src="/logo.png" alt="Loading" />
		</div>
	);
}