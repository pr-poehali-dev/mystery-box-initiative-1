import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { articles, categoryColors, type Category } from "@/data/articles";

const categoryMap: Record<string, Category[]> = {
  "Традиции": ["Традиции"],
  "Кухня": ["Кухня"],
  "Люди": ["Люди"],
  "Места": ["Места"],
};

export default function Feed({ activeCategory }: { activeCategory: string }) {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const filtered = activeCategory === "Все" || !categoryMap[activeCategory]
    ? articles
    : articles.filter((a) => categoryMap[activeCategory].includes(a.category));

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const visible = showAll ? rest : rest.slice(0, 4);

  return (
    <div className="flex-1 min-w-0">
      {featured && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-bold">{featured.category}</span>
            <Icon name="ChevronRight" size={16} className="text-neutral-400" />
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
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime} мин чтения</span>
              </div>
            </div>
            <div className="w-28 h-20 shrink-0 rounded-lg overflow-hidden">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-neutral-200">
        {visible.map((article) => (
          <div
            key={article.id}
            className="flex items-center gap-4 py-4 border-b border-neutral-100 cursor-pointer group hover:bg-neutral-50 transition-colors px-2 rounded-lg"
            onClick={() => navigate(`/article/${article.slug}`)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${categoryColors[article.category as Category]}`}>
                  {article.category}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-neutral-500 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-neutral-400 text-xs">
                <span>{article.date}</span>
                <span>·</span>
                <span>{article.readTime} мин</span>
              </div>
            </div>
            <div className="w-16 h-12 shrink-0 rounded-md overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
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

function Icon({ name, size, className }: { name: string; size: number; className?: string }) {
  if (name === "ChevronRight") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
        <path d="M9 18l6-6-6-6" />
      </svg>
    );
  }
  return null;
}
