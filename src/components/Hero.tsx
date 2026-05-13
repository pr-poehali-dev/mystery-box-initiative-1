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
      className="relative flex items-center justify-center h-screen overflow-hidden"
    >
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
        <img
          src="https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/190e04de-95b7-429e-bcb7-2af5ed7752f3.jpg"
          alt="Люди России"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-black/55 z-[1]" />

      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-[0.5em] mb-6 opacity-60">Журнал о людях, традициях и кухне</p>
        <h1 className="text-6xl md:text-8xl lg:text-[110px] font-bold tracking-tight leading-[0.9] mb-8">
          ОТКРОЙ<br />СВОЮ<br />РОССИЮ
        </h1>
        <div className="w-16 h-px bg-white/50 mx-auto mb-8" />
        <p className="text-base md:text-lg max-w-xl mx-auto opacity-75 leading-relaxed font-light">
          190 народов. Тысячи рецептов. Живые традиции, которым сотни лет.
          Мы рассказываем о настоящей России — через её людей.
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
        <span className="text-white text-xs uppercase tracking-widest">Листать</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-white"
        />
      </div>
    </div>
  );
}
