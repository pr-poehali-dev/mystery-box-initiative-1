const features = [
  {
    icon: "🏔️",
    title: "Природа",
    desc: "От Байкала до Камчатки — дикая и величественная красота, которую нужно увидеть своими глазами.",
  },
  {
    icon: "🍵",
    title: "Вкусы",
    desc: "Сибирские пельмени, бурятский бухлёр, дагестанский хинкал — у каждого региона своя кухня.",
  },
  {
    icon: "🎭",
    title: "Традиции",
    desc: "Масленица, Ысыах, Навруз — Россия хранит живые традиции десятков народов и культур.",
  },
  {
    icon: "🏛️",
    title: "История",
    desc: "Древние города, монастыри, кремли и деревянное зодчество — тысяча лет в каждом камне.",
  },
];

export default function Featured() {
  return (
    <div id="traditions" className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-[60vh] px-6 py-12 lg:py-0">
        <div className="flex-1 h-[400px] lg:h-[700px] mb-8 lg:mb-0 lg:order-2">
          <img
            src="https://cdn.poehali.dev/projects/0fd730b6-ff99-47c2-a8cd-b94909d66811/files/ea7e915b-73d9-4a1d-ab23-8cda36f53729.jpg"
            alt="Традиции России"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-left lg:h-[700px] flex flex-col justify-center lg:mr-12 lg:order-1">
          <h3 className="uppercase mb-4 text-sm tracking-wide text-neutral-500">Познакомься с настоящей Россией</h3>
          <p className="text-2xl lg:text-4xl mb-8 text-neutral-900 leading-tight">
            Россия — это не одна страна, а целая вселенная народов, языков, пейзажей и вкусов.
            Мы помогаем открыть её с неожиданной стороны.
          </p>
          <button className="bg-black text-white border border-black px-6 py-3 text-sm transition-all duration-300 hover:bg-white hover:text-black cursor-pointer w-fit uppercase tracking-wide">
            Выбрать маршрут
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-neutral-200">
        {features.map((f) => (
          <div key={f.title} className="p-8 border-r border-neutral-200 last:border-r-0 hover:bg-neutral-50 transition-colors duration-300">
            <div className="text-4xl mb-4">{f.icon}</div>
            <h4 className="text-lg font-bold mb-3 uppercase tracking-wide">{f.title}</h4>
            <p className="text-neutral-600 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}