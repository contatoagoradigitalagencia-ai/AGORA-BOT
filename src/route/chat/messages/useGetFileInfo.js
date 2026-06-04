import { useState, useEffect } from "react";

import axios from "axios";

/**
 * @author VAMPETA
 * @brief FUNCAO RESPONSAVEL POR DESCOBRIR O TAMANHO DO ARQUIVO
 * @param {String} url LINK DO ARQUIVO
*/
async function getFileInfo(url) {
	try {
		const res = await axios({
			url: url,
			method: "HEAD"
		});
		const size = (res.headers["content-length"]) ? parseInt(res.headers["content-length"], 10) : null;
		const type = res.headers["content-type"] || null;

		return ({ size, type });
	} catch (error) {
		console.error("Erro ao obter tamanho:", error);
		return ({ size: null, type: null });
	}
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE CONVERTE O NUMERO DE BYTES EM UNIDADES DE MEDIDAS MAIS LEGIVEIS
 * @param {Number} bytes NUMERO DE BYTES
*/
function formatFileSize(bytes) {
	if (bytes === null || bytes === undefined) return ("");
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));

	return ((bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i]);
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE IDENTIFICA O TIPO DE ARQUIVO
 * @param {String} type TYPO DO ARQUIVO
*/
function formatFileType(type) {
	if (!type) return ("file");
	if (type.includes("image")) return ("Imagem");
	if (type.includes("audio")) return ("Áudio");
	if (type.includes("video")) return ("Vídeo");
	if (type.includes("pdf")) return ("pdf");
	if (type.includes("zip")) return ("zip");
	return ("file");
}

/**
 * @author VAMPETA
 * @brief HOOK RESPONSAVEL POR DESCOBRIR O TAMANHO DO ARQUIVO
 * @param {String} url LINK DO ARQUIVO
*/
export function useGetFileInfo(url) {
	const [info, setInfo] = useState({ size: null, type: null });

	useEffect(() => {
		if (!url) return ;
		let isMounted = true;
		async function getInfo() {
			const res = await getFileInfo(url);
			const formatted = {
				size: formatFileSize(res.size),
				type: formatFileType(res.type)
			};

			if (isMounted) setInfo(formatted);
		}

		getInfo();
		return (() => { isMounted = false });
	}, [url]);
	return ({ info });
}