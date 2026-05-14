import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/auth";
import JournalHeader from "@/components/JournalHeader";
import Icon from "@/components/ui/icon";

const FEEDBACK_API = "https://functions.poehali.dev/8ec90b3f-69bf-49c4-86dc-47fa2f182464";

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

interface PublishedArticle {
  id: number;
  slug: string;
  title: string;
  category: string;
  image_url: string;
  read_time: number;
  published_at: string;
  author_name: string;
}

interface FeedbackItem {
  id: number;
  type: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

type AdminTab = "pending" | "published" | "feedback";

const TYPE_LABELS: Record<string, string> = {
  topic: "Тема",
  question: "Вопрос",
  story: "История",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Новое", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "В работе", color: "bg-amber-100 text-amber-700" },
  done: { label: "Готово", color: "bg-green-100 text-green-700" },
  spam: { label: "Спам", color: "bg-neutral-100 text-neutral-500" },
};

export default function Admin() {
  const { isAuthenticated, isLoading, accessToken } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<AdminTab>("pending");
  const [pending, setPending] = useState<PendingArticle[]>([]);
  const [published, setPublished] = useState<PublishedArticle[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const load = async () => {
    if (!accessToken) return;
    setFetching(true);
    const headers = { Authorization: `Bearer ${accessToken}` };
    const [pendingRes, listRes, feedbackRes] = await Promise.all([
      fetch(`${API_URL}?action=pending-articles`, { headers }),
      fetch(`${API_URL}?action=list`),
      fetch(`${FEEDBACK_API}?action=list`, { headers }),
    ]);
    if (pendingRes.status === 403) {
      setError("Нет доступа. Эта страница только для администратора.");
      setFetching(false);
      return;
    }
    const pendingData = await pendingRes.json();
    const listData = await listRes.json();
    const feedbackData = await feedbackRes.json();
    setPending(pendingData.articles || []);
    setPublished(listData.articles || []);
    setFeedback(feedbackData.items || []);
    setFetching(false);
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/");
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isLoading && accessToken) load();
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
    setPending(prev => prev.filter(a => a.id !== id));
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
    setPending(prev => prev.filter(a => a.id !== rejectId));
    setRejectId(null);
    setRejectReason("");
  };

  const deleteArticle = async () => {
    if (!accessToken || !deleteId) return;
    setProcessing(deleteId);
    await fetch(`${API_URL}?action=delete-article`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ id: deleteId }),
    });
    setProcessing(null);
    setPublished(prev => prev.filter(a => a.id !== deleteId));
    setPending(prev => prev.filter(a => a.id !== deleteId));
    setDeleteId(null);
  };

  const updateFeedbackStatus = async (id: number, status: string, notes: string) => {
    if (!accessToken) return;
    await fetch(`${FEEDBACK_API}?action=update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ id, status, admin_notes: notes }),
    });
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status, admin_notes: notes } : f));
    setSelectedFeedback(null);
  };

  const printFeedback = (item: FeedbackItem) => {
    const win = window.open("", "_blank");
    if (!win) return;
    const typeLabel = TYPE_LABELS[item.type] || item.type;
    const dateStr = new Date(item.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    win.document.write(`
      <html><head><title>Обращение #${item.id}</title>
      <style>body{font-family:sans-serif;max-width:700px;margin:40px auto;color:#111;line-height:1.6}h1{font-size:22px;margin-bottom:4px}p{margin:4px 0}.label{color:#666;font-size:13px}.value{font-size:15px;margin-bottom:12px}.message{background:#f5f5f5;padding:16px;border-radius:8px;font-size:15px;white-space:pre-wrap}.footer{margin-top:30px;font-size:12px;color:#999}@media print{body{margin:20px}}</style>
      </head><body>
      <h1>Обращение #${item.id} — ${typeLabel}</h1>
      <p class="label">Дата</p><p class="value">${dateStr}</p>
      ${item.name ? `<p class="label">Имя</p><p class="value">${item.name}</p>` : ""}
      ${item.email ? `<p class="label">Email</p><p class="value">${item.email}</p>` : ""}
      ${item.subject ? `<p class="label">Тема</p><p class="value">${item.subject}</p>` : ""}
      <p class="label">Сообщение</p><div class="message">${item.message}</div>
      ${item.admin_notes ? `<p class="label" style="margin-top:16px">Заметки редакции</p><p class="value">${item.admin_notes}</p>` : ""}
      <div class="footer">Журнал «Своё» — внутренний документ</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const newFeedbackCount = feedback.filter(f => f.status === "new").length;

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
            <p className="text-sm text-neutral-500">Управление публикациями и обращениями</p>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">{error}</div>
        ) : (
          <>
            <div className="flex gap-1 mb-6 bg-white border border-neutral-200 rounded-xl p-1 w-fit">
              <button
                onClick={() => setTab("pending")}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${tab === "pending" ? "bg-black text-white" : "text-neutral-600 hover:text-black"}`}
              >
                На рассмотрении
                {pending.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {pending.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTab("published")}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${tab === "published" ? "bg-black text-white" : "text-neutral-600 hover:text-black"}`}
              >
                Опубликованные
              </button>
              <button
                onClick={() => setTab("feedback")}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${tab === "feedback" ? "bg-black text-white" : "text-neutral-600 hover:text-black"}`}
              >
                Обращения
                {newFeedbackCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {newFeedbackCount}
                  </span>
                )}
              </button>
            </div>

            {tab === "pending" && (
              pending.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-3">✓</div>
                  <p className="text-neutral-600 font-medium">Нет статей на модерации</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-500">{pending.length} {pending.length === 1 ? "статья" : pending.length < 5 ? "статьи" : "статей"} на рассмотрении</p>
                  {pending.map(article => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      processing={processing}
                      onApprove={() => approve(article.id)}
                      onReject={() => setRejectId(article.id)}
                      onDelete={() => setDeleteId(article.id)}
                      showApprove
                    />
                  ))}
                </div>
              )
            )}

            {tab === "published" && (
              published.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
                  <p className="text-neutral-600">Нет опубликованных статей</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-500">{published.length} опубликованных статей</p>
                  {published.map(article => (
                    <ArticleCard
                      key={article.id}
                      article={article as PendingArticle}
                      processing={processing}
                      onDelete={() => setDeleteId(article.id)}
                      showApprove={false}
                    />
                  ))}
                </div>
              )
            )}

            {tab === "feedback" && (
              feedback.length === 0 ? (
                <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-neutral-600 font-medium">Нет обращений</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-500">{feedback.length} обращений, из них {newFeedbackCount} новых</p>
                  {feedback.map(item => {
                    const st = STATUS_LABELS[item.status] || { label: item.status, color: "bg-neutral-100 text-neutral-600" };
                    const typeLabel = TYPE_LABELS[item.type] || item.type;
                    const dateStr = new Date(item.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
                    return (
                      <div key={item.id} className="bg-white border border-neutral-200 rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                              <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">{typeLabel}</span>
                              {item.name && <span className="text-xs text-neutral-500">{item.name}</span>}
                              {item.email && <span className="text-xs text-neutral-400">{item.email}</span>}
                              <span className="text-xs text-neutral-400">{dateStr}</span>
                            </div>
                            {item.subject && <p className="font-semibold text-sm mb-1">{item.subject}</p>}
                            <p className="text-sm text-neutral-700 line-clamp-2">{item.message}</p>
                            {item.admin_notes && (
                              <p className="text-xs text-neutral-400 mt-1.5 italic">Заметка: {item.admin_notes}</p>
                            )}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => printFeedback(item)}
                              className="p-2 text-neutral-500 hover:text-black border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                              title="Печать"
                            >
                              <Icon name="Printer" size={15} />
                            </button>
                            <button
                              onClick={() => { setSelectedFeedback(item); setAdminNotes(item.admin_notes || ""); }}
                              className="px-3 py-2 text-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer font-medium"
                            >
                              Открыть
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </>
        )}
      </div>

      {rejectId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-3">Отклонить статью</h3>
            <p className="text-sm text-neutral-600 mb-4">Статья вернётся автору как черновик. Автор получит уведомление.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Причина отклонения (необязательно)..."
              rows={3}
              className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-neutral-500 resize-none mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => { setRejectId(null); setRejectReason(""); }} className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer">Отмена</button>
              <button onClick={reject} disabled={processing !== null} className="px-4 py-2 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-2">
                {processing !== null && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-3 text-red-600">Удалить статью</h3>
            <p className="text-sm text-neutral-600 mb-6">Статья будет удалена. Автор получит уведомление. Это действие нельзя отменить.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer">Отмена</button>
              <button onClick={deleteArticle} disabled={processing !== null} className="px-4 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-2">
                {processing !== null && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Обращение #{selectedFeedback.id}</h3>
              <button onClick={() => setSelectedFeedback(null)} className="text-neutral-400 hover:text-black cursor-pointer">
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-neutral-400">Тип:</span> <span className="font-medium">{TYPE_LABELS[selectedFeedback.type] || selectedFeedback.type}</span></div>
                <div><span className="text-neutral-400">Дата:</span> <span>{new Date(selectedFeedback.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}</span></div>
                {selectedFeedback.name && <div><span className="text-neutral-400">Имя:</span> <span>{selectedFeedback.name}</span></div>}
                {selectedFeedback.email && <div><span className="text-neutral-400">Email:</span> <a href={`mailto:${selectedFeedback.email}`} className="text-black underline">{selectedFeedback.email}</a></div>}
              </div>
              {selectedFeedback.subject && (
                <div><p className="text-xs text-neutral-400 mb-1">Тема</p><p className="font-semibold">{selectedFeedback.subject}</p></div>
              )}
              <div>
                <p className="text-xs text-neutral-400 mb-1">Сообщение</p>
                <div className="bg-neutral-50 rounded-xl p-4 text-sm whitespace-pre-wrap">{selectedFeedback.message}</div>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Заметки редакции</label>
                <textarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Внутренние заметки..."
                  rows={2}
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Статус</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(STATUS_LABELS).map(([key, { label, color }]) => (
                    <button
                      key={key}
                      onClick={() => updateFeedbackStatus(selectedFeedback.id, key, adminNotes)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-80 ${color} ${selectedFeedback.status === key ? "ring-2 ring-offset-1 ring-black" : ""}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => printFeedback(selectedFeedback)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <Icon name="Printer" size={14} />
                  Печать
                </button>
                {selectedFeedback.email && (
                  <a
                    href={`mailto:${selectedFeedback.email}?subject=Re: ${selectedFeedback.subject || "Ваше обращение"}`}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <Icon name="Mail" size={14} />
                    Ответить
                  </a>
                )}
                <button
                  onClick={() => updateFeedbackStatus(selectedFeedback.id, selectedFeedback.status, adminNotes)}
                  className="ml-auto px-4 py-2 text-sm bg-black text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Сохранить заметку
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArticleCard({ article, processing, onApprove, onReject, onDelete, showApprove }: {
  article: PendingArticle;
  processing: number | null;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete: () => void;
  showApprove: boolean;
}) {
  const dateStr = article.created_at
    ? new Date(article.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6">
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
          {article.lead && <p className="text-sm text-neutral-600 line-clamp-2">{article.lead}</p>}
          <p className="text-xs text-neutral-400 mt-2">{dateStr}</p>
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
          Просмотр
        </button>
        <div className="flex-1" />
        <button
          onClick={onDelete}
          disabled={processing === article.id}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-40"
        >
          <Icon name="Trash2" size={14} />
          Удалить
        </button>
        {showApprove && onReject && (
          <button
            onClick={onReject}
            disabled={processing === article.id}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-amber-600 border border-amber-200 rounded-full hover:bg-amber-50 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Icon name="X" size={14} />
            Отклонить
          </button>
        )}
        {showApprove && onApprove && (
          <button
            onClick={onApprove}
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
        )}
      </div>
    </div>
  );
}
