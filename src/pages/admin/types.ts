export interface PendingArticle {
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

export interface PublishedArticle {
  id: number;
  slug: string;
  title: string;
  category: string;
  image_url: string;
  read_time: number;
  published_at: string;
  author_name: string;
}

export interface FeedbackItem {
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

export type AdminTab = "pending" | "published" | "feedback";

export const TYPE_LABELS: Record<string, string> = {
  topic: "Тема",
  question: "Вопрос",
  story: "История",
};

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Новое", color: "bg-blue-100 text-blue-700" },
  in_progress: { label: "В работе", color: "bg-amber-100 text-amber-700" },
  done: { label: "Готово", color: "bg-green-100 text-green-700" },
  spam: { label: "Спам", color: "bg-neutral-100 text-neutral-500" },
};

export const FEEDBACK_API = "https://functions.poehali.dev/8ec90b3f-69bf-49c4-86dc-47fa2f182464";
