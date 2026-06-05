import NewPassword from "./NewPassword.jsx";

export default function Body() {
	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			<NewPassword />
		</div>
	);
}
