import { useNavigate } from "react-router-dom";

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  const navigate = useNavigate();

  const scrollToArticles = () => {
    navigate("/");
    setTimeout(() => {
      document.getElementById("articles-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <header className={`absolute top-0 left-0 right-0 z-10 p-6 ${className ?? ""}`}>
      <div className="flex justify-between items-center">
        <span className="text-white text-xs uppercase tracking-[0.3em] font-light opacity-60">Журнал</span>
        <button
          onClick={() => navigate("/")}
          className="text-white text-sm uppercase tracking-[0.4em] font-bold cursor-pointer hover:opacity-80 transition-opacity"
        >
          Открой свою Россию
        </button>
        <nav className="flex gap-6">
          {["Традиции", "Кухня", "Люди", "Места"].map((cat) => (
            <button
              key={cat}
              onClick={scrollToArticles}
              className="text-white hover:text-neutral-300 transition-colors duration-300 uppercase text-xs tracking-widest cursor-pointer"
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}