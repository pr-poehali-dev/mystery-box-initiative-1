import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/auth";
import JournalHeader from "@/components/JournalHeader";
import Icon from "@/components/ui/icon";

interface PendingArticle {
  id: number;
  slug: string;
  title: string;
  lead: string;
  category: string;
  image_url: string;
  read_time: number;
  created_at: string;
  author_name: string;
  author_avatar: string;
}

export default function Admin() {
  const { user, isAuthenticated, isLoading, accessToken } = useAuth();
  const navigate = useNavigate();

  const [articles, setArticles] = useState<PendingArticle[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const load = async () => {
    if (!accessToken) return;
    setFetching(true);
    const res = await fetch(`${API_URL}?action=pending-articles`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (res.status === 403) {
      setError("Нет доступа. Эта страница только для администратора.");
    } else {
      setArticles(data.articles || []);
    }
    setFetching(false);
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isLoading && accessToken) {
      load();
    }
  }, [isLoading, accessToken]);

  const approve = async (id: number) => {
    if (!accessToken) return;
    setProcessing(id);
    await fetch(`${API_URL}?action=approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ id }),
    });
    setProcessing(null);
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const reject = async () => {
    if (!accessToken || !rejectId) return;
    setProcessing(rejectId);
    await fetch(`${API_URL}?action=reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ id: rejectId, reason: rejectReason }),
    });
    setProcessing(null);
    setArticles(prev => prev.filter(a => a.id !== rejectId));
    setRejectId(null);
    setRejectReason("");
  };

  if (isLoading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <JournalHeader />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <Icon name="ShieldCheck" size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">Панель модерации</h1>
            <p className="text-sm text-neutral-500">Статьи, ожидающие публикации</p>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
            <div className="text-4xl mb-3">✓</div>
            <p className="text-neutral-600 font-medium">Нет статей на модерации</p>
            <p className="text-sm text-neutral-400 mt-1">Все чисто!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-neutral-500">{articles.length} {articles.length === 1 ? "статья" : articles.length < 5 ? "статьи" : "статей"} на рассмотрении</p>
            {articles.map(article => (
              <div key={article.id} className="bg-white border border-neutral-200 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {article.author_avatar ? (
                        <img src={article.author_avatar} alt={article.author_name} className="w-6 h-6 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                          {article.author_name?.[0] || "?"}
                        </div>
                      )}
                      <span className="text-sm text-neutral-500">{article.author_name}</span>
                      <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">{article.category}</span>
                      <span className="text-xs text-neutral-400">{article.read_time} мин</span>
                    </div>
                    <h2 className="text-lg font-bold text-black mb-1 line-clamp-2">{article.title}</h2>
                    {article.lead && (
                      <p className="text-sm text-neutral-600 line-clamp-2">{article.lead}</p>
                    )}
                    <p className="text-xs text-neutral-400 mt-2">
                      Отправлено: {new Date(article.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {article.image_url && (
                    <img src={article.image_url} alt="" className="w-20 h-20 object-cover rounded-lg shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => window.open(`/article/${article.slug}`, "_blank")}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-600 border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <Icon name="Eye" size={14} />
                    Предпросмотр
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => setRejectId(article.id)}
                    disabled={processing === article.id}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Icon name="X" size={14} />
                    Отклонить
                  </button>
                  <button
                    onClick={() => approve(article.id)}
                    disabled={processing === article.id}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-black text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {processing === article.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Icon name="Check" size={14} />
                    )}
                    Опубликовать
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {rejectId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-3">Отклонить статью</h3>
            <p className="text-sm text-neutral-600 mb-4">Статья вернётся автору как черновик. Вы можете указать причину.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Причина отклонения (необязательно)..."
              rows={3}
              className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-neutral-500 resize-none mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setRejectId(null); setRejectReason(""); }}
                className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                onClick={reject}
                disabled={processing !== null}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-2"
              >
                {processing !== null ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
