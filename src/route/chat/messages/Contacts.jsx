import { memo } from "react";

const Contacts = memo(function Contacts({ message }) {
	const contacts = message?.data?.contacts;
	if (!contacts?.length) return <p className="text-xs text-zinc-500 italic">[contato]</p>;
	const contact = contacts[0];
	const name  = contact?.name?.formatted_name || "Contato";
	const phones = contact?.phones || [];
	const emails = contact?.emails || [];

	return (
		<div className="p-3 bg-orange-500 text-white rounded-xl w-[260px]">
			<div className="flex items-center gap-2 mb-3">
				<i className="bi bi-person-circle text-2xl" />
				<div className="overflow-hidden">
					<p className="font-semibold truncate">{name}</p>
					{contact?.org?.company && <p className="text-xs text-orange-100 truncate">{contact.org.company}</p>}
				</div>
			</div>
			{phones.length > 0 && (
				<div className="flex flex-col gap-1 border-t border-orange-400 pt-2">
					{phones.map((p, i) => (
						<a key={i} className="flex items-center gap-2 text-xs hover:text-orange-200 transition" href={`tel:${p?.phone}`}>
							<i className="bi bi-telephone" />{p?.phone}
						</a>
					))}
				</div>
			)}
			{emails.length > 0 && (
				<div className="flex flex-col gap-1 border-t border-orange-400 pt-2 mt-1">
					{emails.map((e, i) => (
						<a key={i} className="flex items-center gap-2 text-xs hover:text-orange-200 transition" href={`mailto:${e?.email}`}>
							<i className="bi bi-envelope" />{e?.email}
						</a>
					))}
				</div>
			)}
		</div>
	);
});

export default Contacts;
