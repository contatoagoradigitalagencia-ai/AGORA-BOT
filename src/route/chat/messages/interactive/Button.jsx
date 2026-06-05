import { memo } from "react";
import Image from "../Image.jsx";
import Video from "../Video.jsx";
import Document from "../Document.jsx";

function Header({ message }) {
	const type = message?.data?.interactive?.header?.type;
	const header = message?.data?.interactive?.header;
	if (!header) return null;
	if (type === "text") return <p className="text-base font-bold">{header?.text}</p>;
	if (type === "image") return <Image message={{ data: header, direction: "outbound" }} />;
	if (type === "video") return <Video message={{ data: header, direction: "outbound" }} />;
	if (type === "document") return <Document message={{ data: header, direction: "outbound" }} />;
	return null;
}

function Body({ message }) {
	const text = message?.data?.interactive?.body?.text;
	if (!text) return null;
	return <p className="text-sm">{text}</p>;
}

function Footer({ message }) {
	const text = message?.data?.interactive?.footer?.text;
	if (!text) return null;
	return <span className="text-xs text-gray-400">{text}</span>;
}

function Buttons({ message }) {
	const buttons = message?.data?.interactive?.action?.buttons;
	if (!buttons?.length) return null;
	return (
		<div className="flex gap-2 text-white flex-wrap">
			{buttons.map((button, i) => (
				<button key={i} className="flex-1 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-400 transition cursor-not-allowed text-sm">
					{button?.reply?.title || button?.title || "Botão"}
				</button>
			))}
		</div>
	);
}

const Button = memo(function Button({ message }) {
	return (
		<div className="flex flex-col gap-2 max-w-[280px]">
			<Header message={message} />
			<Body message={message} />
			<Footer message={message} />
			<Buttons message={message} />
		</div>
	);
});

export default Button;
