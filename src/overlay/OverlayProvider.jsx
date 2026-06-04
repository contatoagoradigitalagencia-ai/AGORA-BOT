import { createContext, useContext, useState } from "react";

import ModalOverlay from "./ModalOverlay.jsx";
import DrawerOverlay from "./DrawerOverlay.jsx";

const OverlayContext = createContext();

/**
 * @author VAMPETA
 * @brief FECHA OVERLAY COM ANIMACAO
 * @param {Function} setClosing FUNCAO QUE DEFINE O VALOR DE closing
 * @param {Function} setOverlay FUNCAO QUE DEFINE O VALOR DE overlay
*/
function closeOverlay(setClosing, setOverlay) {
	setClosing(true);
	setTimeout(() => {
		setOverlay(null);
		setClosing(false);
	}, 200);
}

/**
 * @author VAMPETA
 * @brief ABRE O MODAL
 * @param {Function} setOverlay FUNCAO QUE DEFINE O VALOR DE overlay
 * @param {Object} component ELEMENTO FILHO A SER RENDERIZADO
*/
function openModal(setOverlay, component) {
	setOverlay({ type: "modal", content: component });
}

/**
 * @author VAMPETA
 * @brief ABRE O DRAWER
 * @param {Function} setOverlay FUNCAO QUE DEFINE O VALOR DE overlay
 * @param {Object} component ELEMENTO FILHO A SER RENDERIZADO
*/
function openDrawer(setOverlay, component) {
	setOverlay({ type: "drawer", content: component });
}

/**
 * @author VAMPETA
 * @brief MONTA O ELEMENTO FILHO JUNTO COM A TELA DE OVERLAY
 * @param {Object} children ELEMENTO FILHO A SER RENDERIZADO
*/
export function OverlayProvider({ children }) {
	const [overlay, setOverlay] = useState(null);
	const [closing, setClosing] = useState(false);

	return (
		<OverlayContext.Provider value={{ openModal: (component) => openModal(setOverlay, component), openDrawer: (component) => openDrawer(setOverlay, component), closeOverlay: () => closeOverlay(setClosing, setOverlay) }}>
			{children}
			{(overlay?.type === "modal") && (
				<ModalOverlay onClose={() => closeOverlay(setClosing, setOverlay)} closing={closing}>
					{overlay.content}
				</ModalOverlay>
			)}
			{(overlay?.type === "drawer") && (
				<DrawerOverlay onClose={() => closeOverlay(setClosing, setOverlay)} closing={closing}>
					{overlay.content}
				</DrawerOverlay>
			)}
		</OverlayContext.Provider>
	);
}

/**
 * @author VAMPETA
 * @brief HOOK A SER EXPORTADO
*/
export function useOverlay() {
	return (useContext(OverlayContext));
}