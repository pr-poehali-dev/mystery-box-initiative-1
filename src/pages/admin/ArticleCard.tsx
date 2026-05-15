import Icon from "@/components/ui/icon";
import { PendingArticle } from "./types";

interface Props {
  article: PendingArticle;
  processing: number | null;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete: () => void;
  showApprove: boolean;
}

export default function ArticleCard({ article, processing, onApprove, onReject, onDelete, showApprove }: Props) {
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
