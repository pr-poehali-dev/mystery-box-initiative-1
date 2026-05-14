import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/auth";
import JournalHeader from "@/components/JournalHeader";
import Icon from "@/components/ui/icon";

type Tab = "my-articles" | "notifications";
type MyArticle = { id: number; slug: string; title: string; category: string; status: string; read_time: number; created_at: string; published_at: string | null };
type Notification = { id: number; type: string; message: string; article_id: number | null; is_read: boolean; created_at: string };

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const highlightWrite = searchParams.get("highlight") === "write";
  const [tab, setTab] = useState<Tab>("my-articles");
  const [myArticles, setMyArticles] = useState<MyArticle[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/");
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!accessToken) return;
    setDataLoading(true);
    const headers = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };
    Promise.all([
      fetch(`${API_URL}?action=my-articles`, { headers }).then(r => r.json()),
      fetch(`${API_URL}?action=notifications`, { headers }).then(r => r.json()),
    ]).then(([myData, notifData]) => {
      setMyArticles(myData.articles || []);
      setNotifications(notifData.notifications || []);
    }).finally(() => setDataLoading(false));
  }, [accessToken]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAllRead = async () => {
    if (!accessToken || unreadCount === 0) return;
    await fetch(`${API_URL}?action=mark-read`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    });
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const notifIcon = (type: string) => {
    if (type === "approved") return { icon: "CheckCircle", color: "text-green-500" };
    if (type === "rejected") return { icon: "XCircle", color: "text-amber-500" };
    if (type === "deleted") return { icon: "Trash2", color: "text-red-500" };
    return { icon: "Bell", color: "text-neutral-400" };
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <JournalHeader />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-8 bg-white rounded-2xl p-6 border border-neutral-200">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.name || ""} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-2xl font-bold text-neutral-600">
              {user?.name?.[0] || "?"}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold">{user?.name || "Пользователь"}</h1>
            <p className="text-neutral-500 text-sm">{user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(user as { role?: string })?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition-colors cursor-pointer"
              >
                <Icon name="ShieldCheck" size={15} />
                Модерация
              </button>
            )}
            <button
              onClick={() => navigate("/editor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                highlightWrite
                  ? "bg-amber-400 text-black ring-2 ring-amber-400 ring-offset-2 animate-pulse hover:bg-amber-300"
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              <Icon name="PenLine" size={15} />
              Написать статью
            </button>
            <button
              onClick={() => logout().then(() => navigate("/"))}
              className="px-4 py-2 rounded-full text-sm border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Выйти
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-6 bg-white border border-neutral-200 rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab("my-articles")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${tab === "my-articles" ? "bg-black text-white" : "text-neutral-600 hover:text-black"}`}
          >
            Мои статьи
          </button>
          <button
            onClick={() => { setTab("notifications"); markAllRead(); }}
            className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${tab === "notifications" ? "bg-black text-white" : "text-neutral-600 hover:text-black"}`}
          >
            Уведомления
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {dataLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === "my-articles" ? (
          myArticles.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <Icon name="FileText" size={40} className="mx-auto mb-3 opacity-30" />
              <p>Вы ещё не написали ни одной статьи</p>
              <button onClick={() => navigate("/editor")} className="mt-4 text-sm text-black underline cursor-pointer">Написать первую</button>
            </div>
          ) : (
            <div className="space-y-3">
              {myArticles.map(a => (
                <div key={a.id} className="bg-white rounded-xl border border-neutral-200 p-5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${a.status === "published" ? "bg-green-100 text-green-700" : a.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-600"}`}>
                        {a.status === "published" ? "Опубликовано" : a.status === "pending" ? "На модерации" : "Черновик"}
                      </span>
                      <span className="text-xs text-neutral-400">{a.category}</span>
                    </div>
                    <h3 className="font-semibold text-sm leading-snug truncate">{a.title}</h3>
                  </div>
                  <button
                    onClick={() => navigate(`/editor/${a.id}`)}
                    className="text-xs border border-neutral-300 px-3 py-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer shrink-0"
                  >
                    Редактировать
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          notifications.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <Icon name="Bell" size={40} className="mx-auto mb-3 opacity-30" />
              <p>Нет уведомлений</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => {
                const { icon, color } = notifIcon(n.type);
                return (
                  <div key={n.id} className={`bg-white rounded-xl border p-4 flex items-start gap-3 transition-colors ${n.is_read ? "border-neutral-200" : "border-neutral-300 bg-neutral-50"}`}>
                    <Icon name={icon} size={20} className={`${color} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.is_read ? "text-neutral-600" : "text-neutral-900 font-medium"}`}>{n.message}</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {new Date(n.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {!n.is_read && <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}