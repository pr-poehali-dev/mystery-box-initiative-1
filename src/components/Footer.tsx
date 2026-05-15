import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div
      className="relative h-auto sm:h-[600px] lg:h-[800px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      {/* Desktop sticky wrapper */}
      <div className="hidden sm:block relative h-[calc(100vh+600px)] lg:h-[calc(100vh+800px)] -top-[100vh]">
        <div className="h-[600px] lg:h-[800px] sticky top-[calc(100vh-600px)] lg:top-[calc(100vh-800px)]">
          <div className="bg-neutral-950 py-6 lg:py-8 px-10 h-full w-full flex flex-col justify-between">
            <div className="flex shrink-0 gap-16 lg:gap-24">
              <div className="flex flex-col gap-2">
                <h3 className="mb-3 uppercase text-neutral-500 text-xs tracking-widest">Рубрики</h3>
                <a href="#traditions" className="text-white hover:text-neutral-400 transition-colors duration-300 text-base">Традиции</a>
                <a href="#cuisine" className="text-white hover:text-neutral-400 transition-colors duration-300 text-base">Кухня</a>
                <a href="#people" className="text-white hover:text-neutral-400 transition-colors duration-300 text-base">Люди</a>
                <a href="#regions" className="text-white hover:text-neutral-400 transition-colors duration-300 text-base">Народы</a>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="mb-3 uppercase text-neutral-500 text-xs tracking-widest">Праздники</h3>
                <a href="#" className="text-white hover:text-neutral-400 transition-colors duration-300 text-base">Масленица</a>
                <a href="#" className="text-white hover:text-neutral-400 transition-colors duration-300 text-base">Ысыах</a>
                <a href="#" className="text-white hover:text-neutral-400 transition-colors duration-300 text-base">Навруз</a>
                <a href="#" className="text-white hover:text-neutral-400 transition-colors duration-300 text-base">Сабантуй</a>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="mb-3 uppercase text-neutral-500 text-xs tracking-widest">Документы</h3>
                <Link to="/privacy" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">Политика конфиденциальности</Link>
                <Link to="/terms" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">Пользовательское соглашение</Link>
                <Link to="/offer" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">Публичная оферта</Link>
                <Link to="/feedback" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">Обратная связь</Link>
              </div>
            </div>

            <div className="flex flex-row justify-between items-end">
              <div>
                <h1 className="text-[12vw] lg:text-[10vw] leading-[0.85] text-white font-bold tracking-tight">
                  МОЯ РОССИЯ
                </h1>
                <p className="text-neutral-600 text-xs uppercase tracking-widest mt-3">Журнал о традициях, людях и кухне</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <img
                  src="https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/bucket/a837aae1-da54-4a9f-8fb7-7dd56ee0fdbd.png"
                  alt="Организатор"
                  className="h-10 w-auto object-contain opacity-70"
                />
                <p className="text-neutral-600 text-xs">{new Date().getFullYear()} · Открой свою Россию</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout — простой, не sticky */}
      <div className="sm:hidden bg-neutral-950 px-6 pt-10 pb-8 flex flex-col gap-8">
        {/* Большой заголовок */}
        <div>
          <h1 className="text-[18vw] leading-[0.85] text-white font-bold tracking-tight">
            МОЯ
          </h1>
          <h1 className="text-[18vw] leading-[0.85] text-white font-bold tracking-tight">
            РОССИЯ
          </h1>
          <p className="text-neutral-500 text-xs uppercase tracking-widest mt-3">Журнал о традициях, людях и кухне</p>
        </div>

        {/* Две колонки: рубрики + праздники */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="mb-1 uppercase text-neutral-500 text-xs tracking-widest">Рубрики</h3>
            <a href="#traditions" className="text-white text-sm">Традиции</a>
            <a href="#cuisine" className="text-white text-sm">Кухня</a>
            <a href="#people" className="text-white text-sm">Люди</a>
            <a href="#regions" className="text-white text-sm">Народы</a>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="mb-1 uppercase text-neutral-500 text-xs tracking-widest">Праздники</h3>
            <a href="#" className="text-white text-sm">Масленица</a>
            <a href="#" className="text-white text-sm">Ысыах</a>
            <a href="#" className="text-white text-sm">Навруз</a>
            <a href="#" className="text-white text-sm">Сабантуй</a>
          </div>
        </div>

        {/* Документы — горизонтально с переносом */}
        <div className="flex flex-col gap-2">
          <h3 className="mb-1 uppercase text-neutral-500 text-xs tracking-widest">Документы</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link to="/privacy" className="text-neutral-400 text-xs">Конфиденциальность</Link>
            <Link to="/terms" className="text-neutral-400 text-xs">Соглашение</Link>
            <Link to="/offer" className="text-neutral-400 text-xs">Публичная оферта</Link>
            <Link to="/feedback" className="text-neutral-400 text-xs">Обратная связь</Link>
          </div>
        </div>

        {/* Лого и копирайт */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
          <p className="text-neutral-600 text-xs">{new Date().getFullYear()} · Открой свою Россию</p>
          <img
            src="https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/bucket/a837aae1-da54-4a9f-8fb7-7dd56ee0fdbd.png"
            alt="Организатор"
            className="h-7 w-auto object-contain opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
