import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiPost } from "../../../../../api/client.js";
import toast from "react-hot-toast";

const ACCEPT = {
  image:    "image/jpeg,image/png,image/webp,image/gif",
  audio:    "audio/ogg,audio/mpeg,audio/mp4,audio/webm",
  document: "application/pdf,.doc,.docx,.xls,.xlsx,.zip,.txt",
};

const MAX_MB = 20;

export default function MediaUpload({ socket, conversationId }) {
  const { phone } = useParams();
  const [preview,   setPreview]   = useState(null); // { file, type, dataUrl }
  const [sending,   setSending]   = useState(false);
  const [showMenu,  setShowMenu]  = useState(false);
  const fileRef = useRef(null);

  function openPicker(type) {
    setShowMenu(false);
    fileRef.current.accept = ACCEPT[type] || "*/*";
    fileRef.current.dataset.mediaType = type;
    fileRef.current.click();
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Máximo ${MAX_MB}MB.`);
      return;
    }
    const type = e.target.dataset.mediaType || "document";
    const dataUrl = await new Promise(resolve => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.readAsDataURL(file);
    });
    setPreview({ file, type, dataUrl });
    e.target.value = "";
  }

  async function handleSend() {
    if (!preview || sending) return;
    setSending(true);
    try {
      const base64 = preview.dataUrl.split(",")[1];
      if (!conversationId) throw new Error("conversationId não encontrado");

      await apiPost(`/conversations/${conversationId}/messages/media`, {
        fileBase64: base64,
        mimeType:   preview.file.type,
        fileName:   preview.file.name,
        type:       preview.type,
      });

      toast.success("Mídia enviada!");
      setPreview(null);
    } catch (e) {
      toast.error(e?.message || "Erro ao enviar mídia.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="relative">
      {/* Botão de anexo */}
      <button
        className="p-2 text-zinc-500 hover:text-orange-400 transition"
        onClick={() => setShowMenu(v => !v)}
        title="Anexar"
      >
        <i className="bi bi-paperclip text-xl" />
      </button>

      {/* Menu */}
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute bottom-10 left-0 z-50 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden min-w-[140px]">
            {[
              { type: "image",    icon: "bi-image",          label: "Imagem"    },
              { type: "document", icon: "bi-file-earmark",   label: "Documento" },
              { type: "audio",    icon: "bi-mic",            label: "Áudio"     },
            ].map(item => (
              <button
                key={item.type}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-zinc-700 transition text-left"
                onClick={() => openPicker(item.type)}
              >
                <i className={`bi ${item.icon} text-orange-400`} />
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Input oculto */}
      <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />

      {/* Preview */}
      {preview && (
        <div className="absolute bottom-12 left-0 z-50 bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-xl w-72">
          <div className="flex items-center gap-3 mb-3">
            {preview.type === "image" ? (
              <img src={preview.dataUrl} alt="preview" className="w-20 h-20 object-cover rounded-lg" />
            ) : (
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                <i className={`bi ${preview.type === "audio" ? "bi-mic" : "bi-file-earmark"} text-2xl text-orange-400`} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{preview.file.name}</p>
              <p className="text-xs text-zinc-500">{(preview.file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 py-1.5 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:bg-zinc-800 transition"
              onClick={() => setPreview(null)}
              disabled={sending}
            >
              Cancelar
            </button>
            <button
              className="flex-1 py-1.5 rounded-lg bg-orange-500 text-black text-sm font-medium hover:bg-orange-400 transition disabled:opacity-60"
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
