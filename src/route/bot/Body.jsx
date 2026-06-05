import { useGetInfoBot } from "./useGetInfoBot.js";
import Error from "../../screens/Error.jsx";
import Load from "../../screens/Load.jsx";
import StatusBot from "./StatusBot.jsx";
import Prompt from "./Prompt.jsx";
import GroupSettings from "./GroupSettings.jsx";

function AccountInfo({ account }) {
  const provider = account?.provider?.toUpperCase() || "—";
  const phone = account?.phoneNumber || account?.label || "—";
  const status = account?.status || "—";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-zinc-100">Conta WhatsApp</h2>
        <p className="text-sm text-zinc-400 mt-1">{provider} · {phone}</p>
      </div>
      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
        status === "active" ? "bg-green-900 text-green-300" : "bg-zinc-700 text-zinc-400"
      }`}>
        {status === "active" ? "Ativa" : status}
      </span>
    </div>
  );
}

function EmptyBotState() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
      <h2 className="text-lg font-semibold">Nenhuma conta WhatsApp encontrada</h2>
      <p className="text-sm text-zinc-400 mt-2">
        Cadastre uma conta WhatsApp nas Configurações para ativar o bot.
      </p>
    </div>
  );
}

export default function Body() {
  const { bot, setBot, loading, error } = useGetInfoBot();

  if (error)   return <Error />;
  if (loading) return <Load />;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 overflow-y-auto animate-toastIn">
      {bot?.account ? <AccountInfo account={bot.account} /> : <EmptyBotState />}
      <StatusBot bot={bot} setBot={setBot} />
      <GroupSettings bot={bot} setBot={setBot} />
      <Prompt bot={bot} setBot={setBot} />
    </div>
  );
}
