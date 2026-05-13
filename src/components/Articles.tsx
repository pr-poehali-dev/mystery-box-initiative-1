import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { articles, categoryColors, type Category } from "@/data/articles";

const categories = ["Все", "Традиции", "Кухня", "Люди", "Места"] as const;

export default function Articles() {
  const [active, setActive] = useState<string>("Все");
  const navigate = useNavigate();

  const filtered = active === "Все"
    ? articles
    : articles.filter((a) => a.category === active);

  const [featured, ...rest] = filtered;

  return (
    <section id="articles-section" className="bg-white border-t border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-neutral-200 pb-8">
          <h2 className="text-2xl font-bold uppercase tracking-tight">Статьи</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 text-xs uppercase tracking-widest border transition-all duration-200 cursor-pointer ${
                  active === cat
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-500 border-neutral-300 hover:border-neutral-500 hover:text-black"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {featured && (
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-12 cursor-pointer group border border-neutral-200 hover:border-neutral-400 transition-colors duration-200"
            onClick={() => navigate(`/article/${featured.slug}`)}
          >
            <div className="overflow-hidden h-64 lg:h-auto">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            <div className="p-8 lg:p-10 flex flex-col justify-between bg-neutral-50">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm font-medium ${categoryColors[featured.category as Category]}`}>
                    {featured.category}
                  </span>
                  <span className="text-neutral-400 text-xs">{featured.readTime} мин</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 leading-tight mb-4 group-hover:underline underline-offset-4 decoration-neutral-400">
                  {featured.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed text-sm lg:text-base">
                  {featured.lead}
                </p>
              </div>
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
                <span className="text-neutral-400 text-xs">{featured.date}</span>
                <span className="text-xs uppercase tracking-widest text-neutral-500 group-hover:text-black transition-colors">
                  Читать →
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article) => (
            <div
              key={article.id}
              className="cursor-pointer group border border-neutral-200 hover:border-neutral-400 transition-colors duration-200"
              onClick={() => navigate(`/article/${article.slug}`)}
            >
              <div className="overflow-hidden h-48">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm font-medium ${categoryColors[article.category as Category]}`}>
                    {article.category}
                  </span>
                  <span className="text-neutral-400 text-xs">{article.readTime} мин</span>
                </div>
                <h4 className="font-bold text-neutral-900 leading-snug mb-2 group-hover:underline underline-offset-2 decoration-neutral-400 text-base">
                  {article.title}
                </h4>
                <p className="text-neutral-500 text-sm leading-relaxed line-clamp-2">{article.lead}</p>
                <p className="text-neutral-400 text-xs mt-4">{article.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}