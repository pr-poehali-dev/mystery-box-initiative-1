import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { articles, categoryColors, type Category } from "@/data/articles";
import JournalHeader from "@/components/JournalHeader";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/auth";

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAuth();
  const [saved, setSaved] = useState(false);
  const [savingState, setSavingState] = useState(false);
  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    if (!accessToken || !slug) return;
    fetch(`${API_URL}?action=saved`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.json())
      .then(d => setSaved((d.slugs || []).includes(slug)));
  }, [accessToken, slug]);

  const toggleSave = async () => {
    if (!isAuthenticated) { alert("Войдите, чтобы сохранять статьи"); return; }
    setSavingState(true);
    const action = saved ? "unsave" : "save";
    await fetch(`${API_URL}?action=${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ slug }),
    });
    setSaved(!saved);
    setSavingState(false);
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 text-sm mb-4">Статья не найдена</p>
          <button onClick={() => navigate("/")} className="text-sm underline">На главную</button>
        </div>
      </div>
    );
  }

  const related = articles.filter((a) => a.category === article.category && a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <JournalHeader />
      <header className="bg-white border-b border-neutral-100 px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-xs text-neutral-500 hover:text-black transition-colors flex items-center gap-2"
          >
            ← Все статьи
          </button>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm font-medium ${categoryColors[article.category as Category]}`}>
              {article.category}
            </span>
            <button
              onClick={toggleSave}
              disabled={savingState}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-colors cursor-pointer ${saved ? "bg-black text-white border-black" : "border-neutral-300 text-neutral-600 hover:border-neutral-500"}`}
            >
              <Icon name={saved ? "BookmarkCheck" : "Bookmark"} size={13} />
              {saved ? "Сохранено" : "Сохранить"}
            </button>
          </div>
        </div>
      </header>

      <div>
        <div className="relative h-[55vh] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm font-medium ${categoryColors[article.category as Category]}`}>
                {article.category}
              </span>
              <span className="text-white/60 text-xs">{article.readTime} мин чтения</span>
              <span className="text-white/60 text-xs">{article.date}</span>
            </div>
            <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight">
              {article.title}
            </h1>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-12">
          <p className="text-xl text-neutral-600 leading-relaxed mb-10 font-light border-l-4 border-neutral-200 pl-6">
            {article.lead}
          </p>

          <div className="space-y-6">
            {article.content.map((section, i) => {
              if (section.type === "text") {
                return (
                  <p key={i} className="text-neutral-800 leading-[1.9] text-lg">
                    {section.value}
                  </p>
                );
              }
              if (section.type === "heading") {
                return (
                  <h2 key={i} className="text-2xl font-bold text-neutral-900 mt-10 mb-2">
                    {section.value}
                  </h2>
                );
              }
              if (section.type === "quote") {
                return (
                  <blockquote key={i} className="my-8 px-8 py-6 bg-neutral-50 border-l-4 border-neutral-900">
                    <p className="text-xl text-neutral-700 leading-relaxed italic">
                      «{section.value}»
                    </p>
                  </blockquote>
                );
              }
              if (section.type === "image") {
                return (
                  <figure key={i} className="my-10 -mx-6">
                    <img
                      src={section.value}
                      alt={section.caption}
                      className="w-full object-cover max-h-[500px]"
                    />
                    {section.caption && (
                      <figcaption className="text-neutral-400 text-xs mt-2 px-6">
                        {section.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              return null;
            })}
          </div>
        </div>

        {related.length > 0 && (
          <div className="border-t border-neutral-200 bg-neutral-50 py-12">
            <div className="max-w-6xl mx-auto px-6">
              <h3 className="text-sm uppercase tracking-widest text-neutral-500 mb-8">Читайте также</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map((a) => (
                  <div
                    key={a.id}
                    className="cursor-pointer group"
                    onClick={() => { navigate(`/article/${a.slug}`); window.scrollTo(0, 0); }}
                  >
                    <div className="overflow-hidden h-40 mb-3">
                      <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                    </div>
                    <p className="text-xs text-neutral-400 mb-1">{a.readTime} мин</p>
                    <h4 className="font-bold text-neutral-900 text-sm leading-snug group-hover:underline underline-offset-2">
                      {a.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}