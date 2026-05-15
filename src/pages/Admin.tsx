import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/auth";
import JournalHeader from "@/components/JournalHeader";
import Icon from "@/components/ui/icon";
import ArticlesTab from "./admin/ArticlesTab";
import FeedbackTab from "./admin/FeedbackTab";
import SubscriptionsTab, { Subscription } from "./admin/SubscriptionsTab";
import { PendingArticle, PublishedArticle, FeedbackItem, AdminTab, TYPE_LABELS, FEEDBACK_API } from "./admin/types";

export default function Admin() {
  const { isAuthenticated, isLoading, accessToken } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<AdminTab>("pending");
  const [pending, setPending] = useState<PendingArticle[]>([]);
  const [published, setPublished] = useState<PublishedArticle[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = async () => {
    if (!accessToken) return;
    setFetching(true);
    const headers = { Authorization: `Bearer ${accessToken}` };
    const [pendingRes, listRes, feedbackRes, subsRes] = await Promise.all([
      fetch(`${API_URL}?action=pending-articles`, { headers }),
      fetch(`${API_URL}?action=list`),
      fetch(`${FEEDBACK_API}?action=list`, { headers }),
      fetch(`${FEEDBACK_API}?action=subscriptions`, { headers }),
    ]);
    if (pendingRes.status === 403) {
      setError("Нет доступа. Эта страница только для администратора.");
      setFetching(false);
      return;
    }
    const pendingData = await pendingRes.json();
    const listData = await listRes.json();
    const feedbackData = await feedbackRes.json();
    const subsData = await subsRes.json();
    setPending(pendingData.articles || []);
    setPublished(listData.articles || []);
    setFeedback(feedbackData.items || []);
    setSubscriptions(subsData.items || []);
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

  const confirmSubscription = async (id: number) => {
    if (!accessToken) return;
    await fetch(`${FEEDBACK_API}?action=confirm-subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ id }),
    });
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: "confirmed", confirmed_at: new Date().toISOString() } : s));
  };

  const rejectSubscription = async (id: number) => {
    if (!accessToken) return;
    await fetch(`${FEEDBACK_API}?action=reject-subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ id }),
    });
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: "rejected" } : s));
  };

  const updateFeedbackStatus = async (id: number, status: string, notes: string) => {
    if (!accessToken) return;
    await fetch(`${FEEDBACK_API}?action=update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ id, status, admin_notes: notes }),
    });
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status, admin_notes: notes } : f));
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
  const pendingSubsCount = subscriptions.filter(s => s.status === "pending").length;

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
              <button
                onClick={() => setTab("subscriptions")}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${tab === "subscriptions" ? "bg-black text-white" : "text-neutral-600 hover:text-black"}`}
              >
                Подписки
                {pendingSubsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {pendingSubsCount}
                  </span>
                )}
              </button>
            </div>

            {(tab === "pending" || tab === "published") && (
              <ArticlesTab
                tab={tab}
                pending={pending}
                published={published}
                processing={processing}
                onApprove={approve}
                onSetRejectId={setRejectId}
                onSetDeleteId={setDeleteId}
                rejectId={rejectId}
                rejectReason={rejectReason}
                onRejectReasonChange={setRejectReason}
                onRejectConfirm={reject}
                onRejectCancel={() => { setRejectId(null); setRejectReason(""); }}
                deleteId={deleteId}
                onDeleteConfirm={deleteArticle}
                onDeleteCancel={() => setDeleteId(null)}
              />
            )}

            {tab === "feedback" && (
              <FeedbackTab
                feedback={feedback}
                newFeedbackCount={newFeedbackCount}
                onUpdateStatus={updateFeedbackStatus}
                onPrint={printFeedback}
              />
            )}

            {tab === "subscriptions" && (
              <SubscriptionsTab
                subscriptions={subscriptions}
                onConfirm={confirmSubscription}
                onReject={rejectSubscription}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}