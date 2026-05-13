export default function Footer() {
  return (
    <div
      className="relative h-[400px] sm:h-[600px] lg:h-[800px] max-h-[800px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+400px)] sm:h-[calc(100vh+600px)] lg:h-[calc(100vh+800px)] -top-[100vh]">
        <div className="h-[400px] sm:h-[600px] lg:h-[800px] sticky top-[calc(100vh-400px)] sm:top-[calc(100vh-600px)] lg:top-[calc(100vh-800px)]">
          <div className="bg-neutral-950 py-4 sm:py-6 lg:py-8 px-6 sm:px-10 h-full w-full flex flex-col justify-between">
            <div className="flex shrink-0 gap-10 sm:gap-16 lg:gap-24">
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-2 sm:mb-3 uppercase text-neutral-500 text-xs tracking-widest">Рубрики</h3>
                <a href="#traditions" className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">Традиции</a>
                <a href="#cuisine" className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">Кухня</a>
                <a href="#people" className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">Люди</a>
                <a href="#regions" className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">Народы</a>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="mb-2 sm:mb-3 uppercase text-neutral-500 text-xs tracking-widest">Праздники</h3>
                <a href="#" className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">Масленица</a>
                <a href="#" className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">Ысыах</a>
                <a href="#" className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">Навруз</a>
                <a href="#" className="text-white hover:text-neutral-400 transition-colors duration-300 text-sm sm:text-base">Сабантуй</a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
              <div>
                <h1 className="text-[13vw] sm:text-[12vw] lg:text-[10vw] leading-[0.85] text-white font-bold tracking-tight">
                  МОЯ РОССИЯ
                </h1>
                <p className="text-neutral-600 text-xs uppercase tracking-widest mt-3">Журнал о традициях, людях и кухне</p>
              </div>
              <p className="text-neutral-600 text-xs">{new Date().getFullYear()} · Открой свою Россию</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
