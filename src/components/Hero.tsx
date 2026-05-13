import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "50vh"]);

  return (
    <div
      ref={container}
      className="relative h-screen overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
        <img
          src="https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/190e04de-95b7-429e-bcb7-2af5ed7752f3.jpg"
          alt="Люди России"
          className="w-full h-full object-cover object-top"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70 z-[1]" />

      <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-12">
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

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-white font-bold leading-[0.85] tracking-tight"
              style={{ fontSize: "clamp(56px, 10vw, 130px)" }}>
              ОТКРОЙ<br />СВОЮ<br />РОССИЮ
            </h1>
          </div>

          <div className="md:max-w-xs md:text-right shrink-0">
            <div className="w-8 h-px bg-white/40 mb-4 md:ml-auto" />
            <p className="text-white/70 text-sm leading-relaxed font-light">
              190 народов. Тысячи рецептов.<br />
              Живые традиции — через людей,<br />
              которые их хранят.
            </p>
            <div className="mt-6 flex gap-4 md:justify-end">
              <span className="text-white/40 text-[10px] uppercase tracking-widest border-l border-white/20 pl-3">Традиции</span>
              <span className="text-white/40 text-[10px] uppercase tracking-widest border-l border-white/20 pl-3">Кухня</span>
              <span className="text-white/40 text-[10px] uppercase tracking-widest border-l border-white/20 pl-3">Люди</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="flex flex-col items-center gap-2 opacity-40"
          >
            <div className="w-px h-10 bg-white" />
          </motion.div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest">Листать вниз</p>
        </div>
      </div>
    </div>
  );
}
