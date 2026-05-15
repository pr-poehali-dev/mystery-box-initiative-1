import { useEffect, useState, useCallback } from "react";
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

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % FEATURED.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + FEATURED.length) % FEATURED.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const article = FEATURED[current];

  return (
    <div
      className="relative h-screen overflow-hidden cursor-pointer"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={() => navigate(`/article/${article.slug}`)}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={article.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/80 z-[1]" />

      <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-12 pointer-events-none">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white text-[10px] uppercase tracking-[0.6em] opacity-50 mb-1">Выпуск № 1</p>
            <p className="text-white text-[10px] uppercase tracking-[0.6em] opacity-50">2026</p>
          </div>
          <div className="text-right">
            <p className="text-white text-[10px] uppercase tracking-[0.6em] opacity-50">Журнал</p>
            <p className="text-white text-[10px] uppercase tracking-[0.6em] opacity-50 mt-1">О традициях · Людях · Кухне</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={article.id + "-text"}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <span className="inline-block text-[10px] uppercase tracking-[0.4em] text-white/60 border border-white/25 px-3 py-1 rounded-full mb-4">
                {article.category}
              </span>
              <h2
                className="text-white font-bold leading-[1.05] tracking-tight mb-4"
                style={{ fontSize: "clamp(32px, 5.5vw, 72px)" }}
              >
                {article.title}
              </h2>
              <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-xl font-light line-clamp-2">
                {article.lead}
              </p>
              <div className="mt-5 flex items-center gap-3 text-white/50 text-xs">
                <Icon name="Clock" size={13} />
                <span>{article.readTime} мин чтения</span>
                <span className="opacity-40">·</span>
                <span>{article.date}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 pointer-events-auto">
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/15 transition-colors cursor-pointer"
              >
                <Icon name="ChevronLeft" size={16} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/15 transition-colors cursor-pointer"
              >
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {FEATURED.map((a, i) => (
                <button
                  key={a.id}
                  onClick={e => { e.stopPropagation(); setCurrent(i); }}
                  className="relative cursor-pointer"
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${
                      i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/35 hover:bg-white/60"
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

            <div className="pointer-events-auto">
              <button
                onClick={e => { e.stopPropagation(); navigate(`/article/${article.slug}`); }}
                className="flex items-center gap-2 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                Читать
                <Icon name="ArrowRight" size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
