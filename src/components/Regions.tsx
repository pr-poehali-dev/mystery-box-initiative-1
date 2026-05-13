import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const regions = [
  {
    id: "baikal",
    name: "Байкал",
    area: "Сибирь",
    tag: "Природа",
    color: "bg-blue-900",
    accent: "#1e3a5f",
    desc: "Глубочайшее озеро планеты. Чистейшая вода, нерпы, омуль и бесконечный горизонт — место, которое меняет взгляд на мир.",
    facts: ["Глубина 1642 м", "20% мировых запасов пресной воды", "Более 1700 видов животных"],
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/5e162ab2-3eab-48f3-aed5-2fb89d49d851.jpg",
  },
  {
    id: "caucasus",
    name: "Кавказ",
    area: "Юг России",
    tag: "Горы и вкусы",
    color: "bg-amber-900",
    accent: "#78350f",
    desc: "Гостеприимство, которого нет нигде. Хинкал, шашлык, свежий сулугуни и горячий чай с видом на Эльбрус.",
    facts: ["Эльбрус — 5642 м", "Более 50 народностей", "Старейшие виноградники России"],
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/83f91b03-eb3f-4b17-9798-485488b5ba76.jpg",
  },
  {
    id: "altai",
    name: "Алтай",
    area: "Западная Сибирь",
    tag: "Дикая природа",
    color: "bg-green-900",
    accent: "#14532d",
    desc: "Горы, степи, ледники и бирюзовые реки. Алтай — место силы, где шаманские традиции живут рядом с современностью.",
    facts: ["ЮНЕСКО: объект Всемирного наследия", "Телецкое озеро — Сибирский Байкал", "Родина скифского золота"],
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/c7fd8e26-9e2c-4b85-83ad-c538e4ffd2bf.jpg",
  },
  {
    id: "golden-ring",
    name: "Золотое кольцо",
    area: "Центральная Россия",
    tag: "История",
    color: "bg-yellow-900",
    accent: "#713f12",
    desc: "Суздаль, Владимир, Ростов Великий — белокаменные соборы XII века, купеческие особняки и запах свежего хлеба из русской печи.",
    facts: ["8 древних городов", "Самый старый — Ростов Великий (862 год)", "Центр православного паломничества"],
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/31262af3-02c2-4fa3-9b8c-8f1b2e5e350d.jpg",
  },
  {
    id: "kamchatka",
    name: "Камчатка",
    area: "Дальний Восток",
    tag: "Вулканы",
    color: "bg-red-900",
    accent: "#7f1d1d",
    desc: "Огнедышащие вулканы, гейзеры и медведи у рек. Край света, где природа живёт по своим правилам.",
    facts: ["29 действующих вулканов", "Долина гейзеров — 2-й по размеру гейзерный район мира", "Нерестовые реки с тысячами лососей"],
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/fe7bf74f-3a0c-4f55-9317-cb6d34af950d.jpg",
  },
  {
    id: "karelia",
    name: "Карелия",
    area: "Северо-Запад",
    tag: "Леса и озёра",
    color: "bg-slate-800",
    accent: "#1e293b",
    desc: "Тысячи озёр, древние карельские деревни, северное сияние и деревянный остров Кижи — архитектурное чудо без единого гвоздя.",
    facts: ["Более 60 000 озёр", "Кижи — под защитой ЮНЕСКО", "Белые ночи с июня по июль"],
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/b9d02d1c-88b5-47d8-a96f-2887229877e3.jpg",
  },
];

export default function Regions() {
  const [active, setActive] = useState(regions[0]);

  return (
    <section id="regions" className="bg-neutral-950 min-h-screen flex flex-col">
      <div className="px-6 pt-16 pb-8">
        <p className="uppercase text-neutral-500 text-sm tracking-widest mb-3">Куда отправиться</p>
        <h2 className="text-white text-4xl md:text-6xl font-bold leading-tight">
          Регионы России
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="lg:w-1/3 flex flex-col border-t border-neutral-800">
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => setActive(r)}
              className={`group text-left px-6 py-5 border-b border-neutral-800 transition-all duration-300 flex items-center justify-between cursor-pointer ${
                active.id === r.id ? "bg-white" : "hover:bg-neutral-900"
              }`}
            >
              <div>
                <p className={`text-xs uppercase tracking-widest mb-1 ${active.id === r.id ? "text-neutral-500" : "text-neutral-600"}`}>
                  {r.area}
                </p>
                <p className={`text-xl font-bold ${active.id === r.id ? "text-black" : "text-white"}`}>
                  {r.name}
                </p>
              </div>
              <span className={`text-xs uppercase px-2 py-1 rounded-full border ${
                active.id === r.id
                  ? "border-neutral-300 text-neutral-600"
                  : "border-neutral-700 text-neutral-500 group-hover:border-neutral-500"
              }`}>
                {r.tag}
              </span>
            </button>
          ))}
        </div>

        <div className="lg:w-2/3 relative overflow-hidden min-h-[500px] lg:min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <img
                src={active.image}
                alt={active.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-neutral-300 text-base md:text-lg mb-6 max-w-xl leading-relaxed"
                >
                  {active.desc}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="flex flex-wrap gap-3"
                >
                  {active.facts.map((f) => (
                    <span key={f} className="text-xs text-white border border-white/30 px-3 py-1.5 bg-white/10 backdrop-blur-sm">
                      {f}
                    </span>
                  ))}
                </motion.div>
              </div>

              <div className="absolute top-6 right-6">
                <motion.h3
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-white text-5xl md:text-7xl font-bold opacity-20 select-none"
                >
                  {active.name}
                </motion.h3>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}