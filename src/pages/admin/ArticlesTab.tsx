import { useState } from "react";
import Icon from "@/components/ui/icon";
import ArticleCard from "./ArticleCard";
import { PendingArticle, PublishedArticle } from "./types";

interface Props {
  tab: "pending" | "published";
  pending: PendingArticle[];
  published: PublishedArticle[];
  processing: number | null;
  onApprove: (id: number) => void;
  onSetRejectId: (id: number) => void;
  onSetDeleteId: (id: number) => void;
  rejectId: number | null;
  rejectReason: string;
  onRejectReasonChange: (v: string) => void;
  onRejectConfirm: () => void;
  onRejectCancel: () => void;
  deleteId: number | null;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}

export default function ArticlesTab({
  tab,
  pending,
  published,
  processing,
  onApprove,
  onSetRejectId,
  onSetDeleteId,
  rejectId,
  rejectReason,
  onRejectReasonChange,
  onRejectConfirm,
  onRejectCancel,
  deleteId,
  onDeleteConfirm,
  onDeleteCancel,
}: Props) {
  return (
    <>
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
                onApprove={() => onApprove(article.id)}
                onReject={() => onSetRejectId(article.id)}
                onDelete={() => onSetDeleteId(article.id)}
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
                onDelete={() => onSetDeleteId(article.id)}
                showApprove={false}
              />
            ))}
          </div>
        )
      )}

      {rejectId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-3">Отклонить статью</h3>
            <p className="text-sm text-neutral-600 mb-4">Статья вернётся автору как черновик. Автор получит уведомление.</p>
            <textarea
              value={rejectReason}
              onChange={e => onRejectReasonChange(e.target.value)}
              placeholder="Причина отклонения (необязательно)..."
              rows={3}
              className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-neutral-500 resize-none mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={onRejectCancel} className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer">Отмена</button>
              <button onClick={onRejectConfirm} disabled={processing !== null} className="px-4 py-2 text-sm bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-2">
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
              <button onClick={onDeleteCancel} className="px-4 py-2 text-sm border border-neutral-300 rounded-full hover:bg-neutral-50 transition-colors cursor-pointer">Отмена</button>
              <button onClick={onDeleteConfirm} disabled={processing !== null} className="px-4 py-2 text-sm bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-2">
                {processing !== null && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
