import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import JournalHeader from "@/components/JournalHeader";
import Icon from "@/components/ui/icon";

const FEEDBACK_API = "https://functions.poehali.dev/8ec90b3f-69bf-49c4-86dc-47fa2f182464";

type FeedbackType = "topic" | "question" | "story";

const TYPES: { id: FeedbackType; emoji: string; label: string; description: string; placeholder: string }[] = [
  {
    id: "topic",
    emoji: "✍️",
    label: "Предложить тему",
    description: "Знаете интересную историю, традицию или человека? Расскажите — мы обязательно рассмотрим.",
    placeholder: "Опишите тему, которую хотите предложить. Чем подробнее — тем лучше...",
  },
  {
    id: "question",
    emoji: "🙋",
    label: "Задать вопрос редакции",
    description: "Есть вопрос о журнале, публикациях или сотрудничестве? Спрашивайте.",
    placeholder: "Напишите ваш вопрос...",
  },
  {
    id: "story",
    emoji: "💬",
    label: "Поделиться историей",
    description: "У вас есть личная история, связанная с традициями, культурой или народами России? Мы хотим её услышать.",
    placeholder: "Расскажите вашу историю...",
  },
];

export default function Feedback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get("type") as FeedbackType) || "question";

  const [activeType, setActiveType] = useState<FeedbackType>(initialType);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const current = TYPES.find(t => t.id === activeType)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Напишите сообщение");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${FEEDBACK_API}?action=send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeType, name, email, subject, message }),
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
      } else {
        setError(data.error || "Ошибка при отправке");
      }
    } catch {
      setError("Не удалось отправить. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <JournalHeader />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black transition-colors mb-8 cursor-pointer"
        >
          <Icon name="ArrowLeft" size={15} />
          Назад
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Написать редакции</h1>
          <p className="text-neutral-500">Выберите тему обращения и заполните форму</p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Сообщение отправлено</h2>
            <p className="text-neutral-500 mb-6">Редакция получила ваше обращение. Если вы оставили email — мы ответим в течение нескольких дней.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSent(false); setMessage(""); setName(""); setEmail(""); setSubject(""); }}
                className="px-5 py-2 rounded-full border border-neutral-300 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Отправить ещё одно
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                На главную
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="flex border-b border-neutral-100">
              {TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveType(t.id)}
                  className={`flex-1 py-4 px-3 text-center text-sm font-medium transition-colors cursor-pointer ${activeType === t.id ? "bg-black text-white" : "text-neutral-600 hover:bg-neutral-50"}`}
                >
                  <span className="block text-lg mb-0.5">{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="bg-neutral-50 rounded-xl p-4">
                <p className="text-sm text-neutral-600">{current.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Ваше имя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Необязательно"
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">Email для ответа</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Необязательно"
                    className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Тема</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Кратко о чём речь..."
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Сообщение <span className="text-red-400">*</span></label>
                <textarea
                  value={message}
                  onChange={e => { setMessage(e.target.value); setError(""); }}
                  placeholder={current.placeholder}
                  rows={6}
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl font-medium text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Отправляем..." : "Отправить сообщение"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
