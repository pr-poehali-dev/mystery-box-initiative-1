import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import JournalHeader from "@/components/JournalHeader";
import Icon from "@/components/ui/icon";

const FEEDBACK_API = "https://functions.poehali.dev/8ec90b3f-69bf-49c4-86dc-47fa2f182464";

const PLANS = [
  {
    id: "reader",
    name: "Читатель",
    amount: 300,
    emoji: "📖",
    description: "Поддержать журнал и получать уведомления о новых материалах первым",
    features: ["Благодарность в журнале", "Ранний доступ к материалам", "Ежемесячная рассылка редакции"],
    highlight: false,
  },
  {
    id: "friend",
    name: "Друг редакции",
    amount: 1000,
    emoji: "🤝",
    description: "Стать другом журнала и участвовать в закрытых обсуждениях редакции",
    features: ["Всё из плана Читатель", "Упоминание в журнале", "Доступ к закрытым обсуждениям", "Приглашение на редакционные встречи"],
    highlight: true,
  },
  {
    id: "expert",
    name: "Эксперт",
    amount: 3000,
    emoji: "🏅",
    description: "Выступать экспертом журнала, участвовать в материалах и влиять на темы публикаций",
    features: ["Всё из плана Друг редакции", "Статус эксперта журнала", "Участие в материалах как эксперт", "Влияние на темы публикаций", "Персональное интервью с редактором"],
    highlight: false,
  },
];

export default function Support() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);

  const plan = PLANS.find(p => p.id === selectedPlan);

  useEffect(() => {
    const el = document.getElementById("robokassa-reader");
    if (el && (window as Window & { Robokassa?: { CreatePaymentForm?: (id: string) => void } }).Robokassa?.CreatePaymentForm) {
      (window as Window & { Robokassa?: { CreatePaymentForm?: (id: string) => void } }).Robokassa!.CreatePaymentForm!("robokassa-reader");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Укажите email для связи");
      return;
    }
    if (!consent) {
      setError("Необходимо согласие на обработку персональных данных");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${FEEDBACK_API}?action=subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, plan: selectedPlan, amount: plan?.amount, message }),
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

      <div className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-black transition-colors mb-8 cursor-pointer"
        >
          <Icon name="ArrowLeft" size={15} />
          Назад
        </button>

        <div className="mb-10 text-center">
          <div className="text-4xl mb-3">❤️</div>
          <h1 className="text-3xl font-bold mb-3">Поддержать журнал</h1>
          <p className="text-neutral-500 max-w-lg mx-auto">
            «Своё» существует благодаря людям, которым важно сохранить живую культуру России. Ваша поддержка помогает нам делать больше материалов.
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Heart" size={32} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Спасибо!</h2>
            <p className="text-neutral-500 mb-2">Ваша заявка принята. Редакция свяжется с вами по email в течение 1–2 рабочих дней.</p>
            <p className="text-sm text-neutral-400 mb-6">Мы расскажем как оформить поддержку и ответим на все вопросы.</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              На главную
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {PLANS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`relative text-left rounded-2xl border-2 p-5 transition-all cursor-pointer ${
                    selectedPlan === p.id
                      ? "border-black bg-black text-white"
                      : p.highlight
                      ? "border-neutral-800 bg-white hover:border-black"
                      : "border-neutral-200 bg-white hover:border-neutral-400"
                  }`}
                >
                  {p.highlight && selectedPlan !== p.id && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold tracking-wide whitespace-nowrap">
                      ПОПУЛЯРНЫЙ
                    </span>
                  )}
                  <div className="text-2xl mb-3">{p.emoji}</div>
                  <div className="font-bold text-lg mb-1">{p.name}</div>
                  <div className={`text-2xl font-bold mb-3 ${selectedPlan === p.id ? "text-white" : "text-black"}`}>
                    {p.amount.toLocaleString("ru-RU")} ₽
                    <span className={`text-sm font-normal ml-1 ${selectedPlan === p.id ? "text-neutral-300" : "text-neutral-500"}`}>/мес</span>
                  </div>
                  <p className={`text-xs leading-relaxed mb-4 ${selectedPlan === p.id ? "text-neutral-300" : "text-neutral-500"}`}>{p.description}</p>
                  <ul className="space-y-1.5">
                    {p.features.map(f => (
                      <li key={f} className={`flex items-start gap-2 text-xs ${selectedPlan === p.id ? "text-neutral-200" : "text-neutral-600"}`}>
                        <Icon name="Check" size={13} className={`shrink-0 mt-0.5 ${selectedPlan === p.id ? "text-white" : "text-green-600"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {p.id === "reader" && (
                    <div id="robokassa-reader" className="mt-4" onClick={e => e.stopPropagation()} />
                  )}
                </button>
              ))}
            </div>

            {selectedPlan && (
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-bold text-lg mb-1">Оформить поддержку — {plan?.name}</h3>
                <p className="text-sm text-neutral-500 mb-5">Оставьте контакты, и редакция свяжется с вами для оформления</p>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5">Email <span className="text-red-400">*</span></label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError(""); }}
                        placeholder="your@email.com"
                        className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                      />
                      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">Комментарий</label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Есть вопросы или пожелания?"
                      rows={3}
                      className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={e => { setConsent(e.target.checked); setError(""); }}
                      className="mt-0.5 shrink-0 w-4 h-4 cursor-pointer accent-black"
                    />
                    <span className="text-xs text-neutral-500 leading-relaxed">
                      Я соглашаюсь на обработку персональных данных в соответствии с{" "}
                      <Link to="/privacy" className="text-black underline hover:text-neutral-600" target="_blank">
                        Политикой конфиденциальности
                      </Link>
                    </span>
                  </label>

                  <div className="flex items-center gap-4 pt-1">
                    <button
                      type="submit"
                      disabled={loading || !consent}
                      className="flex-1 bg-black text-white py-3 rounded-xl font-medium text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? "Отправляем..." : `Оформить — ${plan?.amount.toLocaleString("ru-RU")} ₽/мес`}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!selectedPlan && (
              <div className="text-center py-6 text-neutral-400 text-sm">
                Выберите план выше, чтобы оформить поддержку
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}