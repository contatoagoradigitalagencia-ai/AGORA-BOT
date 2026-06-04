import { useState } from "react";

/**
 * @author VAMPETA
 * @brief FUNCAO QUE SELECIONA O ARQUIVO A SER ENVIADO
 * @param {Object} e INFORMACOES SOBRE O INPUT
 * @param {Function} setFile FUNCAO QUE SALVA O ARQUIVO EM file
 * @param {Function} onChange FUNCAO DE MUDANCA DO INPUT
 */
function handleSelect(e, setFile, onChange) {
	const selected = e.target.files[0];
	if (!selected) return ;
	setFile(selected);
	onChange && onChange(selected);
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE REMOVE O ARQUIVO QUE JA FOI SELECIONADO
 * @param {Function} setFile FUNCAO QUE SALVA O ARQUIVO EM file
 * @param {Function} onChange FUNCAO DE MUDANCA DO INPUT
 */
function handleRemove(setFile, onChange) {
	setFile(null);
	onChange && onChange(null);
}

/**
 * @author VAMPETA
 * @brief FUNCAO QUE RETORNA UMA STRING FORMATADA COM O TAMANHO DO ARQUIVO
 * @param {Number} bytes NUMERO DE BYTES DO ARQUIVO
 */
function formatFileSize(bytes) {
	if (bytes < 1024) return (`${bytes} B`);
	if (bytes < 1024 * 1024) return (`${(bytes / 1024).toFixed(1)} KB`);
	return (`${(bytes / (1024 * 1024)).toFixed(1)} MB`);
}

/**
 * @author VAMPETA
 * @brief COMPONENTE DE UPLOAD DE ARQUIVO COM REMOCAO
 * @param {Function} onChange RETORNA O ARQUIVO SELECIONADO
 * @param {string} accept TIPOS ACEITOS
 */
export default function FileUpload({ onChange, accept }) {
	const [file, setFile] = useState(null);

	return (
		<div className="flex flex-col gap-2">
			<label className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${(file) ? "border-orange-500 bg-orange-500/5" : "border-zinc-700 hover:border-zinc-500"}`}>
				<div className="flex flex-col items-center">
					<i className={` text-4xl ${(file) ? "bi bi-file-earmark-check text-orange-500" : "bi bi-image text-orange-500"}`} />
					{(file) ? (
						<>
							<span className="mt-3 text-sm text-zinc-200 max-w-full truncate">{file.name}</span>
							<span className="mt-1 text-xs text-zinc-500">{formatFileSize(file.size)}</span>
						</>
					) : (
						<span className="mt-3 text-sm text-zinc-400">Selecione o arquivo</span>
					)}
				</div>
				<input className="hidden" type="file" accept={accept} onChange={(e) => handleSelect(e, setFile, onChange)} />
			</label>
			{file && (
				<button className="bg-orange-500 text-black w-full rounded p-2 text-sm hover:opacity-90 transition cursor-pointer" onClick={() => handleRemove(setFile, onChange)}>
					Remover arquivo
				</button>
			)}
		</div>
	);
}