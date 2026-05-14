import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/auth";

interface Article {
  id: number;
  slug: string;
  title: string;
  lead: string;
  category: string;
  image_url: string;
  read_time: number;
  published_at: string;
  author_name: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Традиции": "bg-amber-100 text-amber-700",
  "Кухня": "bg-green-100 text-green-700",
  "Люди": "bg-blue-100 text-blue-700",
  "Места": "bg-purple-100 text-purple-700",
  "Народы": "bg-rose-100 text-rose-700",
  "Музыка": "bg-indigo-100 text-indigo-700",
  "Ремёсла": "bg-orange-100 text-orange-700",
  "Природа": "bg-teal-100 text-teal-700",
  "История": "bg-yellow-100 text-yellow-700",
  "Искусство": "bg-pink-100 text-pink-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export default function Feed({ activeCategory }: { activeCategory: string }) {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}?action=list`)
      .then(r => r.json())
      .then(data => setArticles(data.articles || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "Все" || !activeCategory
    ? articles
    : articles.filter(a => a.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const visible = showAll ? rest : rest.slice(0, 4);

  if (loading) {
    return (
      <div className="flex-1 min-w-0 flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!featured) {
    return (
      <div className="flex-1 min-w-0 py-20 text-center text-neutral-400">
        <p>Нет статей в этой рубрике</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base font-bold">{featured.category}</span>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-400">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>

        <div
          className="flex gap-4 cursor-pointer group p-4 rounded-xl hover:bg-neutral-50 transition-colors border border-neutral-100"
          onClick={() => navigate(`/article/${featured.slug}`)}
        >
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-neutral-900 leading-snug mb-2 group-hover:text-neutral-600 transition-colors">
              {featured.title}
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2 mb-3">
              {featured.lead}
            </p>
            <div className="flex items-center gap-3 text-neutral-400 text-xs">
              <span>{formatDate(featured.published_at)}</span>
              <span>·</span>
              <span>{featured.read_time} мин чтения</span>
              {featured.author_name && <><span>·</span><span>{featured.author_name}</span></>}
            </div>
          </div>
          {featured.image_url && (
            <div className="w-28 h-20 shrink-0 rounded-lg overflow-hidden">
              <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-neutral-200">
        {visible.map((article) => (
          <div
            key={article.id}
            className="flex items-center gap-4 py-4 border-b border-neutral-100 cursor-pointer group hover:bg-neutral-50 transition-colors px-2 rounded-lg"
            onClick={() => navigate(`/article/${article.slug}`)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${CATEGORY_COLORS[article.category] || "bg-neutral-100 text-neutral-600"}`}>
                  {article.category}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-neutral-500 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-neutral-400 text-xs">
                <span>{formatDate(article.published_at)}</span>
                <span>·</span>
                <span>{article.read_time} мин</span>
              </div>
            </div>
            {article.image_url && (
              <div className="w-16 h-12 shrink-0 rounded-md overflow-hidden">
                <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            )}
          </div>
        ))}

        {!showAll && rest.length > 4 && (
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-black transition-colors mt-4 cursor-pointer"
          >
            Показать ещё ↓
          </button>
        )}
      </div>
    </div>
  );
}
