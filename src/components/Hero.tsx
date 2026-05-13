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
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src="https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/33c9d23e-f51b-4eff-bb46-cbef2aa5e853.jpg"
          alt="Пейзажи России"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-black/40 z-[1]" />
      <div className="relative z-10 text-center text-white px-6">
        <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 opacity-80">Туристический проект</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
          ОТКРОЙ<br />СВОЮ РОССИЮ
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 leading-relaxed">
          Традиции, вкусы и красота необъятной страны — для тех, кто хочет познать Россию по-настоящему
        </p>
        <button className="mt-8 border border-white text-white px-8 py-3 uppercase tracking-wide text-sm hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
          Начать путешествие
        </button>
      </div>
    </div>
  );
}