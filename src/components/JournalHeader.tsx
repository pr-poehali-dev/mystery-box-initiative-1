import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";

export default function JournalHeader() {
  const navigate = useNavigate();
  const [search, setSearch] = useState(false);
  const { user, isAuthenticated, isLoading, login } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 h-14 gap-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span className="text-2xl font-black tracking-tighter leading-none text-black">О·Р</span>
          <span className="text-[10px] bg-black text-white px-1.5 py-0.5 font-bold uppercase tracking-wide ml-1">
            журнал
          </span>
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-2 shrink-0">
          {search ? (
            <input
              autoFocus
              onBlur={() => setSearch(false)}
              placeholder="Поиск..."
              className="border border-neutral-300 rounded-full px-3 py-1 text-sm outline-none w-40"
            />
          ) : (
            <button onClick={() => setSearch(true)} className="p-2 hover:bg-neutral-100 rounded-full cursor-pointer">
              <Icon name="Search" size={18} className="text-neutral-600" />
            </button>
          )}

          {!isLoading && (
            isAuthenticated ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name || ""} className="w-8 h-8 rounded-full object-cover border border-neutral-200" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-bold text-neutral-600">
                    {user?.name?.[0] || "?"}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-neutral-800 max-w-[120px] truncate">
                  {user?.name?.split(" ")[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-1.5 bg-neutral-900 text-white text-sm px-4 py-1.5 rounded-full font-medium hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                <Icon name="LogIn" size={14} />
                <span className="hidden sm:inline">Войти</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}