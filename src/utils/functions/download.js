import axios from "axios";

/**
 * @author VAMPETA
 * @brief FUNCAO RESPONSAVEL POR FAZER O DOWNLOAD DO ARQUIVO E SALVAR
 * @param {String} url LINK DE DOWNLOAD
 * @param {String} filename NOME DO ARQUIVO
*/
export async function download(url, filename) {				// EU PODERIA USAR toast PARA INDICAR QUE O DOWNLOAD COMECOU
	try {
		const res = await axios({
			url: url,
			method: "GET",
			responseType: "blob",
			onDownloadProgress: (progressEvent) => {
				if (progressEvent.total) {
					const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					console.log(`Download: ${percent}%`);
				}
			}
		});
		const blobUrl = window.URL.createObjectURL(res.data);
		const link = document.createElement("a");

		link.href = blobUrl;
		link.download = filename || "arquivo";
		document.body.appendChild(link);
		link.click();
		link.remove();
		window.URL.revokeObjectURL(blobUrl);
	} catch (error) {
		console.error("Erro ao baixar arquivo:", error);
		alert("Erro ao baixar arquivo");
	}
}