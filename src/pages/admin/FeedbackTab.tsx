import { useState } from "react";
import Icon from "@/components/ui/icon";
import { FeedbackItem, TYPE_LABELS, STATUS_LABELS } from "./types";

interface Props {
  feedback: FeedbackItem[];
  newFeedbackCount: number;
  onUpdateStatus: (id: number, status: string, notes: string) => void;
  onPrint: (item: FeedbackItem) => void;
}

export default function FeedbackTab({ feedback, newFeedbackCount, onUpdateStatus, onPrint }: Props) {
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const openItem = (item: FeedbackItem) => {
    setSelectedFeedback(item);
    setAdminNotes(item.admin_notes || "");
  };

  const closeItem = () => setSelectedFeedback(null);

  return (
    <>
      {feedback.length === 0 ? (
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
                      onClick={() => onPrint(item)}
                      className="p-2 text-neutral-500 hover:text-black border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer"
                      title="Печать"
                    >
                      <Icon name="Printer" size={15} />
                    </button>
                    <button
                      onClick={() => openItem(item)}
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
      )}

      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Обращение #{selectedFeedback.id}</h3>
              <button onClick={closeItem} className="text-neutral-400 hover:text-black cursor-pointer">
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
                      onClick={() => { onUpdateStatus(selectedFeedback.id, key, adminNotes); closeItem(); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-80 ${color} ${selectedFeedback.status === key ? "ring-2 ring-offset-1 ring-black" : ""}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => onPrint(selectedFeedback)}
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
                  onClick={() => { onUpdateStatus(selectedFeedback.id, selectedFeedback.status, adminNotes); closeItem(); }}
                  className="ml-auto px-4 py-2 text-sm bg-black text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Сохранить заметку
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
