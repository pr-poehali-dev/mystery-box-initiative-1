import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const peoples = [
  {
    id: "buryats",
    name: "Буряты",
    area: "Сибирь · Байкал",
    tag: "Традиции",
    desc: "Буряты — потомки степных кочевников. Их шаманизм и буддизм переплетены так тесно, что разделить невозможно. Главный праздник — Сагаалган, Белый месяц — встреча Нового года по лунному календарю.",
    dish: "Позы (буузы) — паровые пельмени из баранины, которые едят только руками",
    tradition: "Сагаалган — праздник белого месяца и нового начала",
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/5e162ab2-3eab-48f3-aed5-2fb89d49d851.jpg",
  },
  {
    id: "caucasians",
    name: "Народы Кавказа",
    area: "Юг · Кавказ",
    tag: "Кухня",
    desc: "На Кавказе живут чеченцы, аварцы, лезгины, осетины и ещё десятки народов. Каждый — со своим языком, песнями и рецептами. Объединяет их культ гостеприимства: гость всегда дорог, как бы ни был беден хозяин.",
    dish: "Хинкал, чуду, шашлык из баранины и свежий сыр с зеленью",
    tradition: "Тамада на свадьбе — это не просто тост, это сакральная роль",
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/83f91b03-eb3f-4b17-9798-485488b5ba76.jpg",
  },
  {
    id: "altaians",
    name: "Алтайцы",
    area: "Алтай",
    tag: "Духовность",
    desc: "Алтайцы живут в горах уже тысячи лет. Их мировоззрение — это анимизм: каждая гора, река и дерево имеют дух. Камы (шаманы) до сих пор проводят обряды, а Эл Ойын — народные игры собирают тысячи людей.",
    dish: "Талкан — обжаренная ячменная мука, основа кочевой еды",
    tradition: "Эл Ойын — грандиозный праздник народных игр и песен",
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/c7fd8e26-9e2c-4b85-83ad-c538e4ffd2bf.jpg",
  },
  {
    id: "russians",
    name: "Русские",
    area: "Центральная Россия",
    tag: "Традиции",
    desc: "Русская деревня — это отдельная вселенная. Колядки, хороводы, посиделки с прялкой, баня по субботам. Многие традиции исчезали, но возрождаются сегодня — в фольклорных ансамблях, гончарных мастерских и домашних пекарнях.",
    dish: "Щи, каша, пироги с капустой — еда, за которой стоят века",
    tradition: "Масленица — проводы зимы с блинами, кострами и катанием",
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/31262af3-02c2-4fa3-9b8c-8f1b2e5e350d.jpg",
  },
  {
    id: "itelmens",
    name: "Ительмены",
    area: "Камчатка",
    tag: "Люди",
    desc: "Коренные жители Камчатки. Их меньше трёх тысяч человек, но они хранят язык, танцы и обряды, которым нет аналогов. Алхалалалай — праздник благодарности природе — это танец, молитва и пир одновременно.",
    dish: "Юкола — вяленый лосось, главная еда побережья",
    tradition: "Алхалалалай — осенний праздник благодарности природе",
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/fe7bf74f-3a0c-4f55-9317-cb6d34af950d.jpg",
  },
  {
    id: "karelians",
    name: "Карелы",
    area: "Карелия · Север",
    tag: "Эпос",
    desc: "Карелы — народ, подаривший миру «Калевалу», великий эпос о сотворении мира. Их руны пели старики у огня веками. Сегодня карельская культура — это деревянное зодчество, вышивка и бесконечные озёра.",
    dish: "Калитки — ржаные открытые пирожки с картофелем или кашей",
    tradition: "Калевала — живой эпос, который до сих пор поют на карельском",
    image: "https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/b9d02d1c-88b5-47d8-a96f-2887229877e3.jpg",
  },
];

export default function Regions() {
  const [active, setActive] = useState(peoples[0]);

  return (
    <section id="people" className="bg-neutral-950 min-h-screen flex flex-col">
      <div className="px-6 sm:px-10 pt-16 pb-8 border-b border-neutral-800">
        <p className="uppercase text-neutral-500 text-xs tracking-[0.4em] mb-3">Народы России</p>
        <h2 className="text-white text-4xl md:text-6xl font-bold leading-tight">
          190 народов.<br />Одна страна.
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="lg:w-[380px] shrink-0 flex flex-col">
          {peoples.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              className={`group text-left px-6 sm:px-10 py-5 border-b border-neutral-800 transition-all duration-200 cursor-pointer ${
                active.id === p.id ? "bg-white" : "hover:bg-neutral-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-[10px] uppercase tracking-widest mb-1 ${active.id === p.id ? "text-neutral-400" : "text-neutral-600"}`}>
                    {p.area}
                  </p>
                  <p className={`text-lg font-bold ${active.id === p.id ? "text-black" : "text-white"}`}>
                    {p.name}
                  </p>
                </div>
                <span className={`text-[10px] uppercase px-2 py-1 border tracking-wider ${
                  active.id === p.id
                    ? "border-neutral-300 text-neutral-500"
                    : "border-neutral-700 text-neutral-600"
                }`}>
                  {p.tag}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden min-h-[560px] lg:min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex flex-col lg:flex-row"
            >
              <div className="lg:w-1/2 h-64 lg:h-auto relative">
                <img
                  src={active.image}
                  alt={active.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-950/60 hidden lg:block" />
              </div>

              <div className="lg:w-1/2 bg-neutral-950 flex flex-col justify-center p-8 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <p className="text-neutral-500 text-[10px] uppercase tracking-[0.4em] mb-3">{active.area}</p>
                  <h3 className="text-white text-3xl lg:text-4xl font-bold mb-6">{active.name}</h3>
                  <p className="text-neutral-300 text-sm lg:text-base leading-relaxed mb-8">
                    {active.desc}
                  </p>

                  <div className="space-y-4 border-t border-neutral-800 pt-6">
                    <div className="flex gap-4">
                      <span className="text-neutral-600 text-xs uppercase tracking-widest w-20 shrink-0 pt-0.5">Блюдо</span>
                      <p className="text-neutral-300 text-sm">{active.dish}</p>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-neutral-600 text-xs uppercase tracking-widest w-20 shrink-0 pt-0.5">Традиция</span>
                      <p className="text-neutral-300 text-sm">{active.tradition}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
