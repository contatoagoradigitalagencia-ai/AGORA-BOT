import Cookies from "js-cookie";
import axios from "axios";

import server from "../../server.js";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE FAZ O UPLOAD DO ARQUIVO
 * @param {File} file ARQUIVO QUE SERA ENVIADO
*/
export async function uploadFile(file) {
	if (!file) return (null);
	const formData = new FormData();
	const token = Cookies.get("token");

	if (!token) return (null);
	formData.append("file", file);
	try {
		const res = await axios({
			method: "POST",
			url: `${server}/upload`,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "multipart/form-data"
			},
			data: formData
		});
		if (res.status !== 200) return (null);
		return (res.data.url);
	} catch (error) {
		return (null);
	}
}