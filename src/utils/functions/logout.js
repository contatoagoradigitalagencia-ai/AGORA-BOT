import Cookies from "js-cookie";

/**
 * @author VAMPETA
 * @brief PAGINA DE CONVERSAS
 * @param navigate FUNCAO DE NAVEGACAO DE ROTA
*/
export function logout(navigate) {
	Cookies.remove("phone", { path: "/" });
	Cookies.remove("idPhone", { path: "/" });
	Cookies.remove("token", { path: "/" });
	navigate("/");
}