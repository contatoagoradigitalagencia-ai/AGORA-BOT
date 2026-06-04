import { memo } from "react";

/**
 * @author VAMPETA
 * @brief RENDERIZA MENSAGEM DE CONTATO
 * @param {Object} message MENSAGEM A SER RENDERIZADA
*/
const Contacts = memo(function Contacts({ message }) {
	return (
		<div className="p-3 bg-orange-500 text-white rounded w-[70vw] max-w-xs">
			<div className="flex items-center gap-3 ml-2 mb-3">
				<div className="flex flex-col overflow-hidden">
					<p className="font-semibold truncate">{message.data.contacts[0].name.formatted_name}</p>
					{message.data.contacts[0]?.org?.company && (<p className="text-xs text-gray-100 truncate">{message.data.contacts[0].org.company}</p>)}
				</div>
			</div>
			<div className="border-t border-white my-2" />
			<div className="flex flex-col gap-6">
				{(message.data.contacts[0].phones) ? (
					<div className="flex flex-col gap-2">
						<p>Telefone:</p>
						{message.data.contacts[0].phones?.map((phone, i) => (
							<a className="flex items-center gap-2 text-sm hover:text-blue-300 transition" key={i} href={`tel:${phone.phone}`}>
								<i className="bi bi-telephone text-base" />
								{phone.phone}
							</a>
						))}
					</div>
				) : null}
				{(message.data.contacts[0].emails) ? (
					<div className="flex flex-col gap-2">
						<p>Email:</p>
						{message.data.contacts[0].emails?.map((email, i) => (
							<a className="flex items-center gap-2 text-sm hover:text-blue-300 transition" key={i} href={`mailto:${email.email}`}>
								<i className="bi bi-envelope text-base" />
								{email.email}
							</a>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
});

export default Contacts;