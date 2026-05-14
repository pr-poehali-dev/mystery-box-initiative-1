import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const actions = [
  { emoji: "✍️", label: "Предложить тему", path: "/feedback?type=topic" },
  { emoji: "🙋", label: "Задать вопрос редакции", path: "/feedback?type=question" },
  { emoji: "💬", label: "Поделиться историей", path: "/profile?highlight=write" },
  { emoji: "❤️", label: "Поддержать журнал", path: "/support" },
];

export default function RightPanel() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  const handleAction = (path: string) => {
    if (path.startsWith("/profile") && !isAuthenticated) {
      login();
      return;
    }
    navigate(path);
  };

  return (
    <aside className="w-72 shrink-0 hidden xl:block">
      <div className="sticky top-16 pt-6 space-y-6">
        <div className="bg-neutral-50 rounded-2xl p-5">
          <h3 className="font-bold text-base mb-4">Участвовать</h3>
          <div className="space-y-3">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => handleAction(a.path)}
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
            <p className="text-sm text-neutral-400">Загружается...</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-neutral-500 hover:text-black transition-colors mt-4 cursor-pointer"
          >
            Все статьи →
          </button>
        </div>

        <div className="bg-black rounded-2xl p-5 text-white">
          <p className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Журнал</p>
          <h3 className="font-bold text-lg leading-tight mb-3">Открой свою Россию</h3>
          <p className="text-sm text-neutral-400 leading-relaxed mb-4">
            190 народов. Тысячи рецептов. Живые традиции — через людей, которые их хранят.
          </p>
          <button
            onClick={() => navigate("/support")}
            className="w-full bg-white text-black text-sm font-semibold py-2 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Поддержать
          </button>
        </div>
      </div>
    </aside>
  );
}
