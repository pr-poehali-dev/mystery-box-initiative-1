import { useState } from "react";
import Icon from "@/components/ui/icon";

const PLAN_LABELS: Record<string, string> = {
  reader: "Читатель",
  friend: "Друг редакции",
  expert: "Эксперт",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Ожидает",     color: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Подтверждён", color: "bg-green-100 text-green-700" },
  rejected:  { label: "Отклонён",   color: "bg-red-100 text-red-600" },
};

export interface Subscription {
  id: number;
  name: string | null;
  email: string;
  plan: string;
  amount: number;
  status: string;
  message: string | null;
  user_id: number | null;
  confirmed_at: string | null;
  created_at: string;
}

interface Props {
  subscriptions: Subscription[];
  onConfirm: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
}

export default function SubscriptionsTab({ subscriptions, onConfirm, onReject }: Props) {
  const [processing, setProcessing] = useState<number | null>(null);

  const handleConfirm = async (id: number) => {
    setProcessing(id);
    await onConfirm(id);
    setProcessing(null);
  };

  const handleReject = async (id: number) => {
    setProcessing(id);
    await onReject(id);
    setProcessing(null);
  };

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-400">
        <Icon name="CreditCard" size={40} className="mx-auto mb-3 opacity-30" />
        <p>Нет заявок на подписку</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {subscriptions.map(s => {
        const st = STATUS_LABELS[s.status] || { label: s.status, color: "bg-neutral-100 text-neutral-600" };
        const isPending = s.status === "pending";
        return (
          <div key={s.id} className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${st.color}`}>{st.label}</span>
                  <span className="text-xs font-medium text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
                    {PLAN_LABELS[s.plan] || s.plan} — {s.amount.toLocaleString("ru-RU")} ₽/мес
                  </span>
                  {!s.user_id && (
                    <span className="text-[10px] text-neutral-400 border border-neutral-200 px-2 py-0.5 rounded-full">без аккаунта</span>
                  )}
                </div>
                <p className="font-semibold text-sm">{s.name || "Без имени"}</p>
                <p className="text-xs text-neutral-500">{s.email}</p>
                {s.message && (
                  <p className="text-xs text-neutral-400 mt-1 italic">«{s.message}»</p>
                )}
                <p className="text-xs text-neutral-400 mt-2">
                  {new Date(s.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  {s.confirmed_at && ` · подтверждён ${new Date(s.confirmed_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}`}
                </p>
              </div>

              {isPending && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleConfirm(s.id)}
                    disabled={processing === s.id}
                    className="flex items-center gap-1.5 bg-green-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Icon name="CheckCircle" size={13} />
                    {processing === s.id ? "..." : "Подтвердить"}
                  </button>
                  <button
                    onClick={() => handleReject(s.id)}
                    disabled={processing === s.id}
                    className="flex items-center gap-1.5 border border-neutral-300 text-neutral-600 text-xs px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Icon name="X" size={13} />
                    Отклонить
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
