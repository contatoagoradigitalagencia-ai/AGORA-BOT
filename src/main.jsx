import { Navigate } from "react-router-dom";
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./socket/SocketProvider.jsx";
import { OverlayProvider } from "./overlay/OverlayProvider.jsx";

import Cookies from "js-cookie";

import "./style/index.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import Home from "./route/home/home.jsx";
import Login from "./route/login/Login.jsx";
import Dashboard from "./route/dashboard/Dashboard.jsx";
import Chats from "./route/chats/Chats.jsx";
import Chat from "./route/chat/Chat.jsx";
import HumanService from "./route/human service/HumanService.jsx";
import Contacts from "./route/contacts/Contacts.jsx";
import QuickMessages from "./route/quick messages/QuickMessages.jsx";
import QuickMessagesType from "./route/quick messages type/QuickMessagesType.jsx";
import Bot from "./route/bot/Bot.jsx";
import Spreadsheets from "./route/spreadsheets/Spreadsheets.jsx";
import Settings from "./route/settings/Settings.jsx";
import Guide from "./route/guide/Guide.jsx";
import TermsOfUSe from "./route/terms of use/TermsOfUse.jsx";
import PrivacyPolicy from "./route/privacy policy/PrivacyPolicy.jsx";
import Support from "./route/support/Support.jsx";
import NotFound from "./route/NotFound/NotFound.jsx";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE VERIFICA SE O USUARIO TEM COOKIES PARA LOGIN
 * @param children ELEMENTO FILHO
*/
function ProtectedRoute({ children }) {
	const phone = Cookies.get("phone");
	const idPhone = Cookies.get("idPhone");
	const token = Cookies.get("token");

	if (!phone || !idPhone || !token) return (<Navigate to="/" replace />);
	return (children);
}

createRoot(document.getElementById("root")).render(
	// <StrictMode>
		<>
			<Toaster position="top-center" toastOptions={{ className: "!bg-zinc-900 !text-white !border !border-zinc-800 !shadow-lg !rounded-lg !px-4 !py-3",
				success: { className: "!bg-zinc-900 !text-white !border !border-green-500/40 !shadow-lg" },
				error: { className: "!bg-zinc-900 !text-white !border !border-red-500/40 !shadow-lg" }
			}} />
			<BrowserRouter>
				<SocketProvider>
					<OverlayProvider>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/login" element={<Login />} />
							<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
							<Route path="/chat" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
							<Route path="/chat/:phone" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
							<Route path="/human-service" element={<ProtectedRoute><HumanService /></ProtectedRoute>} />
							<Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
							<Route path="/quick-messages" element={<ProtectedRoute><QuickMessages /></ProtectedRoute>} />
							<Route path="/quick-messages/:type" element={<ProtectedRoute><QuickMessagesType /></ProtectedRoute>} />
							<Route path="/bot" element={<ProtectedRoute><Bot /></ProtectedRoute>} />
							<Route path="/spreadsheets" element={<ProtectedRoute><Spreadsheets /></ProtectedRoute>} />
							<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
							<Route path="/guide" element={<ProtectedRoute><Guide /></ProtectedRoute>} />
							<Route path="/terms-of-use" element={<ProtectedRoute><TermsOfUSe /></ProtectedRoute>} />
							<Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
							<Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</OverlayProvider>
				</SocketProvider>
			</BrowserRouter>
		</>
	// </StrictMode>
);