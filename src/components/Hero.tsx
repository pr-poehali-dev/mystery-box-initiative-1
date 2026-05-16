import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { articles } from "@/data/articles";
import Icon from "@/components/ui/icon";

const FEATURED = articles.slice(0, 5);
const INTERVAL = 5000;

export default function Hero() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const touchStart = useRef<number | null>(null);

  const go = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % FEATURED.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(prev => (prev - 1 + FEATURED.length) % FEATURED.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const article = FEATURED[current];

  // Swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { if (diff > 0) { next(); } else { prev(); } }
    touchStart.current = null;
  };

  // Карточки-превью: предыдущая, текущая, следующие
  const getCard = (offset: number) => {
    const idx = (current + offset + FEATURED.length) % FEATURED.length;
    return FEATURED[idx];
  };

  return (
    <div
      className="relative w-full bg-neutral-950 overflow-hidden"
      style={{ minHeight: "100svh" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Размытый фон — цвет от текущей картинки */}
      <AnimatePresence mode="sync">
        <motion.div
          key={article.id + "-bg"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={article.image}
            alt=""
            className="w-full h-full object-cover object-center scale-110"
            style={{ filter: "blur(40px) brightness(0.25)" }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-full min-h-[100svh]">
        {/* Шапка */}
        <div className="flex justify-between items-start px-6 md:px-12 pt-8 shrink-0">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.6em]">Выпуск № 1</p>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.6em] mt-1">2026</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.6em]">Журнал</p>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.6em] mt-1">О традициях · Людях · Кухне</p>
          </div>
        </div>

        {/* Галерея карточек */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-10 py-8">
          <div className="relative w-full max-w-6xl flex items-center justify-center gap-3 md:gap-4">

            {/* Кнопка влево */}
            <button
              onClick={prev}
              className="absolute left-0 z-20 w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/15 transition-all cursor-pointer shrink-0"
            >
              <Icon name="ChevronLeft" size={18} />
            </button>

            {/* Карточка —2 (маленькая, дальняя слева) */}
            <div
              className="hidden lg:block shrink-0 w-[14%] cursor-pointer opacity-20 hover:opacity-35 transition-opacity"
              onClick={() => go((current - 2 + FEATURED.length) % FEATURED.length)}
            >
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={getCard(-2).image} alt="" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Карточка —1 (левая) */}
            <div
              className="hidden md:block shrink-0 w-[22%] cursor-pointer opacity-50 hover:opacity-70 transition-opacity"
              onClick={prev}
            >
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={getCard(-1).image} alt="" className="w-full h-full object-cover" />
              </div>
              <p className="text-white/40 text-xs mt-2 line-clamp-2 text-center px-1">{getCard(-1).title}</p>
            </div>

            {/* Главная карточка */}
            <div
              className="shrink-0 w-full md:w-[44%] lg:w-[36%] cursor-pointer"
              onClick={() => navigate(`/article/${article.slug}`)}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={article.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  {/* Обложка */}
                  <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-2xl shadow-black/60 relative">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-white/60 border border-white/25 px-2.5 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      <h2 className="text-white font-bold text-xl leading-tight mt-3 line-clamp-3">
                        {article.title}
                      </h2>
                      <div className="flex items-center gap-2 text-white/50 text-xs mt-3">
                        <Icon name="Clock" size={11} />
                        <span>{article.readTime} мин</span>
                        <span className="opacity-40">·</span>
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Кнопка читать */}
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/article/${article.slug}`); }}
                      className="flex items-center gap-2 bg-white text-black text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      Читать материал
                      <Icon name="ArrowRight" size={13} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Карточка +1 (правая) */}
            <div
              className="hidden md:block shrink-0 w-[22%] cursor-pointer opacity-50 hover:opacity-70 transition-opacity"
              onClick={next}
            >
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={getCard(1).image} alt="" className="w-full h-full object-cover" />
              </div>
              <p className="text-white/40 text-xs mt-2 line-clamp-2 text-center px-1">{getCard(1).title}</p>
            </div>

            {/* Карточка +2 (маленькая, дальняя справа) */}
            <div
              className="hidden lg:block shrink-0 w-[14%] cursor-pointer opacity-20 hover:opacity-35 transition-opacity"
              onClick={() => go((current + 2) % FEATURED.length)}
            >
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={getCard(2).image} alt="" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Кнопка вправо */}
            <button
              onClick={next}
              className="absolute right-0 z-20 w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/15 transition-all cursor-pointer shrink-0"
            >
              <Icon name="ChevronRight" size={18} />
            </button>
          </div>
        </div>

        {/* Точки навигации + прогресс */}
        <div className="flex justify-center gap-2 pb-8 shrink-0">
          {FEATURED.map((a, i) => (
            <button
              key={a.id}
              onClick={() => go(i)}
              className="relative cursor-pointer"
            >
              <div
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/55"
                }`}
              />
              {i === current && !paused && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/30 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                  key={current + "-progress"}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}