import { memo, useMemo, useState, useRef } from "react";

import Image from "../Image.jsx";
import Video from "../Video.jsx";
import Document from "../Document.jsx";

/**
 * @author VAMPETA
 * @brief HEADER DA MENSAGEM INTERACTIVE DO TIPO BUTTON
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
function Header({ message }) {
	switch (message.data.interactive.header?.type) {
		case "text":
			return (<p className="text-lg font-bold">{message.data.interactive.header.text}</p>);
		case "image":
			return (<Image message={{ data: message.data.interactive.header, direction: "outbound" }} />);
		case "video":
			return (<Video message={{ data: message.data.interactive.header, direction: "outbound" }} />);
		case "document":
			return (<Document message={{ data: message.data.interactive.header, direction: "outbound" }} />);
		default:
			return (null);
	}
}

/**
 * @author VAMPETA
 * @brief BODY DA MENSAGEM INTERACTIVE DO TIPO BUTTON
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
function Body({ message }) {
	return (
		<p>{message.data.interactive.body.text}</p>
	);
}

/**
 * @author VAMPETA
 * @brief FOOTER DA MENSAGEM INTERACTIVE DO TIPO BUTTON
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
function Footer({ message }) {
	return (
		<span className="text-sm text-gray-700">{message.data.interactive.footer?.text}</span>
	);
}

/**
 * @author VAMPETA
 * @brief BUTTONS DA MENSAGEM INTERACTIVE DO TIPO BUTTON
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
function Buttons({ message }) {
	return (
		<div className="flex gap-2 text-white">
			{message.data.interactive.action.buttons.map((button, i) => (
				<button className="flex-1 px-6 py-2 bg-orange-500 rounded hover:bg-orange-400 transition cursor-not-allowed" key={i}>{button.reply.title}</button>
			))}
		</div>
	);
}

/**
 * @author VAMPETA
 * @brief RENDERIZA MENSAGEM DE INTERACTIVE DO TIPO BUTTON
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Button = memo(function Button({ message }) {
	return (
		<div className="flex flex-col gap-2">
			<Header message={message} />
			<Body message={message} />
			<Footer message={message} />
			<Buttons message={message} />
		</div>
	);
});

export default Button;