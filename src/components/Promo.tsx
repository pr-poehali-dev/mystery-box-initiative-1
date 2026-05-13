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
      ref={container}
      className="relative flex items-center justify-center h-screen overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
        <motion.div style={{ y }} className="relative w-full h-full">
          <img
            src="https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/7eefe37f-35e3-4021-af18-1d90200b1ebb.jpg"
            alt="Города России"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-black/30 z-[1]" />
      <h3 className="absolute top-12 left-6 text-white uppercase z-10 text-sm md:text-base lg:text-lg tracking-widest">
        От Калининграда до Владивостока
      </h3>

      <p className="absolute bottom-12 left-6 text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-3xl z-10 leading-tight">
        11 часовых поясов, 190 народов, бесконечное разнообразие — всё это твоя Россия. Пора её открыть.
      </p>

      <button className="absolute bottom-12 right-6 z-10 border border-white text-white px-6 py-3 uppercase tracking-wide text-sm hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
        Смотреть маршруты
      </button>
    </div>
  );
}