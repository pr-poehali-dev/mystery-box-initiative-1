const topics = [
  {
    tag: "Традиции",
    title: "Масленица",
    desc: "Древний праздник проводов зимы — блины, хороводы и сжигание чучела. Его отмечают по всей стране, но везде по-своему.",
  },
  {
    tag: "Кухня",
    title: "Щи да каша",
    desc: "Русская кухня — это не просто еда. Это архив памяти: каждый рецепт хранит историю семьи, деревни, целого народа.",
  },
  {
    tag: "Люди",
    title: "Хранители",
    desc: "Мастера, знахарки, сказители — люди, которые передают живое знание из рук в руки, из уст в уста.",
  },
];

export default function Featured() {
  return (
    <div id="traditions" className="bg-[#f5f0e8]">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="lg:w-1/2 h-[50vh] lg:h-auto relative overflow-hidden">
          <img
            src="https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/3ea499f3-d1c3-4aa9-a7e5-87e5ab922c58.jpg"
            alt="Традиции России"
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-8 left-8">
            <span className="text-white text-xs uppercase tracking-widest bg-black/60 px-3 py-1 backdrop-blur-sm">
              Фото редакции
            </span>
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col justify-between p-10 lg:p-16">
          <div>
            <p className="uppercase text-xs tracking-[0.4em] text-neutral-400 mb-6">О журнале</p>
            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900 leading-tight mb-6">
              Россия — это сотни живых культур внутри одной страны
            </h2>
            <p className="text-neutral-600 leading-relaxed text-base lg:text-lg">
              Мы не пишем о достопримечательностях. Мы пишем о людях, которые пекут хлеб по рецептам прабабушек, водят хороводы в чистый понедельник и знают, как правильно солить грибы.
            </p>
          </div>

          <div className="mt-10 space-y-0 border-t border-neutral-300">
            {topics.map((t) => (
              <div key={t.title} className="flex gap-6 py-6 border-b border-neutral-200 group cursor-pointer hover:bg-neutral-100 -mx-4 px-4 transition-colors duration-200">
                <span className="text-xs uppercase tracking-widest text-neutral-400 w-20 shrink-0 pt-1">{t.tag}</span>
                <div>
                  <h4 className="font-bold text-neutral-900 mb-1 group-hover:underline underline-offset-2">{t.title}</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
