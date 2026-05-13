import { useNavigate } from "react-router-dom";
import { articles, categoryColors, type Category } from "@/data/articles";

const actions = [
  { emoji: "✍️", label: "Предложить тему" },
  { emoji: "🙋", label: "Задать вопрос редакции" },
  { emoji: "💬", label: "Поделиться историей" },
  { emoji: "❤️", label: "Поддержать журнал" },
];

export default function RightPanel() {
  const navigate = useNavigate();
  const popular = articles.slice(0, 4);

  return (
    <aside className="w-72 shrink-0 hidden xl:block">
      <div className="sticky top-16 pt-6 space-y-6">
        <div className="bg-neutral-50 rounded-2xl p-5">
          <h3 className="font-bold text-base mb-4">Участвовать</h3>
          <div className="space-y-3">
            {actions.map((a) => (
              <button
                key={a.label}
                className="flex items-center gap-3 w-full text-left cursor-pointer group"
              >
                <span className="w-9 h-9 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-base shrink-0 group-hover:border-neutral-400 transition-colors">
                  {a.emoji}
                </span>
                <span className="text-sm font-medium text-neutral-800 group-hover:text-black transition-colors leading-tight">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-neutral-50 rounded-2xl p-5">
          <h3 className="font-bold text-base mb-4">Популярное</h3>
          <div className="space-y-4">
            {popular.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => navigate(`/article/${a.slug}`)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 mb-0.5">{a.category}</p>
                  <p className="text-sm font-semibold text-neutral-900 leading-snug group-hover:underline underline-offset-2 line-clamp-2">
                    {a.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="text-sm text-neutral-500 hover:text-black transition-colors mt-4 cursor-pointer">
            Все статьи →
          </button>
        </div>

        <div className="bg-black rounded-2xl p-5 text-white">
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Журнал</p>
          <h3 className="font-bold text-lg leading-tight mb-3">Открой свою Россию</h3>
          <p className="text-sm text-neutral-400 leading-relaxed mb-4">
            190 народов. Тысячи рецептов. Живые традиции — через людей, которые их хранят.
          </p>
          <button className="w-full bg-white text-black text-sm font-semibold py-2 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer">
            Подписаться
          </button>
        </div>
      </div>
    </aside>
  );
}
