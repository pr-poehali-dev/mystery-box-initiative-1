import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/auth";
import JournalHeader from "@/components/JournalHeader";
import { articles as staticArticles } from "@/data/articles";
import Icon from "@/components/ui/icon";

type Tab = "saved" | "my-articles";

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout, accessToken } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("saved");
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  type MyArticle = {id:number;slug:string;title:string;category:string;status:string;read_time:number;created_at:string;published_at:string|null};
  const [myArticles, setMyArticles] = useState<MyArticle[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/");
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (!accessToken) return;
    setDataLoading(true);

    const headers = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };

    Promise.all([
      fetch(`${API_URL}?action=saved`, { headers }).then(r => r.json()),
      fetch(`${API_URL}?action=my-articles`, { headers }).then(r => r.json()),
    ]).then(([savedData, myData]) => {
      setSavedSlugs(savedData.slugs || []);
      setMyArticles(myData.articles || []);
    }).finally(() => setDataLoading(false));
  }, [accessToken]);

  const savedArticles = staticArticles.filter(a => savedSlugs.includes(a.slug));

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
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
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
          {([["saved", "Сохранённые"], ["my-articles", "Мои статьи"]] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${tab === key ? "bg-black text-white" : "text-neutral-600 hover:text-black"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {dataLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === "saved" ? (
          savedArticles.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <Icon name="Bookmark" size={40} className="mx-auto mb-3 opacity-30" />
              <p>Нет сохранённых статей</p>
              <button onClick={() => navigate("/")} className="mt-4 text-sm text-black underline cursor-pointer">Читать журнал</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedArticles.map(a => (
                <div key={a.id} onClick={() => navigate(`/article/${a.slug}`)}
                  className="bg-white rounded-xl border border-neutral-200 overflow-hidden cursor-pointer hover:border-neutral-400 transition-colors group">
                  <img src={a.image} alt={a.title} className="w-full h-36 object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  <div className="p-4">
                    <span className="text-xs text-neutral-400 uppercase tracking-wider">{a.category}</span>
                    <h3 className="font-semibold text-sm mt-1 leading-snug group-hover:underline">{a.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
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
        )}
      </div>
    </div>
  );
}