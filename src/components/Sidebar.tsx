import { useNavigate } from "react-router-dom";

const sections = [
  { emoji: "🎭", label: "Традиции" },
  { emoji: "🍵", label: "Кухня" },
  { emoji: "👤", label: "Люди" },
  { emoji: "📍", label: "Места" },
  { emoji: "🌍", label: "Народы" },
  { emoji: "🎵", label: "Музыка" },
  { emoji: "🏺", label: "Ремёсла" },
  { emoji: "🌿", label: "Природа" },
  { emoji: "📖", label: "История" },
  { emoji: "🎨", label: "Искусство" },
];

export default function Sidebar({ activeCategory, onSelect }: { activeCategory: string; onSelect: (cat: string) => void }) {
  return (
    <aside className="w-52 shrink-0 hidden lg:block">
      <div className="sticky top-16 pt-6">
        <div className="flex flex-col">
          {sections.map((s) => (
            <button
              key={s.label}
              onClick={() => onSelect(s.label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer text-left ${
                activeCategory === s.label
                  ? "bg-neutral-100 font-semibold text-black"
                  : "text-neutral-700 hover:bg-neutral-50 font-normal"
              }`}
            >
              <span className="text-lg w-6 text-center">{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
