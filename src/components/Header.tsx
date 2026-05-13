interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={`absolute top-0 left-0 right-0 z-10 p-6 ${className ?? ""}`}>
      <div className="flex justify-between items-center">
        <div className="text-white text-xs uppercase tracking-[0.3em] font-light">Журнал</div>
        <div className="text-white text-sm uppercase tracking-[0.4em] font-bold">Открой свою Россию</div>
        <nav className="flex gap-8">
          <a href="#traditions" className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-xs tracking-widest">
            Традиции
          </a>
          <a href="#cuisine" className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-xs tracking-widest">
            Кухня
          </a>
          <a href="#people" className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-xs tracking-widest">
            Люди
          </a>
        </nav>
      </div>
    </header>
  );
}
