import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user, accessToken } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const paymentRef = useRef<HTMLDivElement>(null);

  const plan = PLANS.find(p => p.id === selectedPlan);

  // Подгружаем скрипт Robokassa только на этой странице
  useEffect(() => {
    return () => {
      document.getElementById("robokassa-script")?.remove();
    };
  }, []);

  // Когда переходим к оплате — вставляем скрипт, он сам найдёт div по id
  useEffect(() => {
    if (!showPayment) return;
    const existing = document.getElementById("robokassa-script");
    if (existing) existing.remove();

    setTimeout(() => {
      const script = document.createElement("script");
      script.id = "robokassa-script";
      script.type = "text/javascript";
      script.src = "https://auth.robokassa.ru/Merchant/PaymentForm/FormSS.js?EncodedInvoiceId=YOQirW945kOXeiXg4W8-Kg";
      document.head.appendChild(script);

      // Скроллим к виджету
      setTimeout(() => {
        paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }, 100);
  }, [showPayment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Укажите email для связи"); return; }
    if (!consent) { setError("Необходимо согласие на обработку персональных данных"); return; }

    setLoading(true);
    setError("");
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch(`${FEEDBACK_API}?action=subscribe`, {
        method: "POST",
        headers,
        body: JSON.stringify({ name, email, plan: selectedPlan, amount: plan?.amount, message }),
      });
      const data = await res.json();
      if (data.ok) {
        if (selectedPlan === "reader") {
          setShowPayment(true);
        } else {
          navigate("/support/thanks");
        }
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

        {/* Карточки тарифов */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {PLANS.map(p => (
            <button
              key={p.id}
              onClick={() => { setSelectedPlan(p.id); setShowPayment(false); }}
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
            </button>
          ))}
        </div>

        {/* Форма */}
        {selectedPlan && !showPayment && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h3 className="font-bold text-lg mb-1">Оформить поддержку — {plan?.name}</h3>
            <p className="text-sm text-neutral-500 mb-5">
              {selectedPlan === "reader"
                ? "Заполните данные — после этого откроется форма оплаты"
                : "Оставьте контакты, и редакция свяжется с вами для оформления"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5">Комментарий</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Дополнительные вопросы или пожелания"
                  rows={3}
                  className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => { setConsent(e.target.checked); setError(""); }}
                  className="mt-0.5 accent-black"
                />
                <span className="text-xs text-neutral-500">
                  Я соглашаюсь с{" "}
                  <Link to="/privacy" className="underline hover:text-black">политикой конфиденциальности</Link>
                  {" "}и{" "}
                  <Link to="/offer" className="underline hover:text-black">публичной офертой</Link>
                </span>
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Сохраняем..." : selectedPlan === "reader" ? "Перейти к оплате →" : "Отправить заявку"}
              </button>
            </form>
          </div>
        )}

        {/* Виджет оплаты Robokassa */}
        {showPayment && selectedPlan === "reader" && (
          <div ref={paymentRef} className="bg-white rounded-2xl border border-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={18} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-base">Заявка сохранена!</h3>
                <p className="text-xs text-neutral-500">Осталось оплатить — и ваш статус активируется после подтверждения</p>
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-5 mt-4">
              <p className="text-sm text-neutral-600 mb-4 text-center">Оплатите подписку «Читатель» — 300 ₽/мес</p>
              {/* Robokassa монтирует кнопку сюда */}
              <div id="robokassa-reader" className="flex justify-center" />
            </div>

            <p className="text-xs text-neutral-400 text-center mt-4">
              После оплаты редакция подтвердит подписку в течение 1–2 рабочих дней
            </p>
          </div>
        )}

        {/* Для прочих пакетов — экран спасибо */}
        {!showPayment && !selectedPlan && (
          <p className="text-center text-sm text-neutral-400">Выберите пакет поддержки выше</p>
        )}
      </div>
    </div>
  );
}
