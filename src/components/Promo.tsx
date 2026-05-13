import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Promo() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

  return (
    <div
      id="cuisine"
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <img
            src="https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/df1eb61f-5f60-4734-9ae9-06b62fd732b5.jpg"
            alt="Русская кухня"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-black/50 z-[1]" />

      <div className="absolute top-10 left-8 z-10">
        <span className="text-white text-xs uppercase tracking-[0.4em] opacity-60">Кухня</span>
      </div>

      <div className="relative z-10 text-white text-center px-6 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.5em] mb-6 opacity-50">Рубрика номера</p>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
          Рецепт — это<br />не инструкция.<br />Это история.
        </h2>
        <div className="w-12 h-px bg-white/40 mx-auto my-8" />
        <p className="text-base md:text-lg opacity-70 max-w-xl mx-auto leading-relaxed font-light">
          В каждой семье — свой борщ. В каждой деревне — свой квас. Мы собираем рецепты, за которыми стоят живые люди.
        </p>
      </div>
    </div>
  );
}
