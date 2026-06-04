import { useState } from "react";
import { Link } from "react-router-dom";

import { useGetDashboard } from "./useGetDashboard.js";

import DateSelector from "./DateSelector.jsx";
import Metrics from "./Metrics.jsx"
import Shortcuts from "./Shortcuts.jsx"
import Messages from "./Messages.jsx"
import Error from "../../screens/Error.jsx";

/**
 * @author VAMPETA
 * @brief BODY DA ROTA /dashboard
*/
export default function Body() {
	const [date, setDate] = useState(new Date().toLocaleDateString("sv-SE"));
	const { info, loading, error } = useGetDashboard(date);

	if (error) return (<Error />);

	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
			<DateSelector date={date} setDate={setDate} />
			<Metrics loading={loading} info={info} />
			<Shortcuts />
			<Messages loading={loading} info={info} />
		</div>
	);
}
