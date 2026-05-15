import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-neutral-950 text-white rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl">
        <p className="text-sm text-neutral-300 leading-relaxed flex-1">
          Мы используем файлы cookie для работы сайта и авторизации. Продолжая пользоваться сайтом, вы соглашаетесь на обработку персональных данных в соответствии с{" "}
          <Link to="/privacy" className="text-white underline underline-offset-2 hover:text-neutral-300 transition-colors">
            Политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="shrink-0 bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer whitespace-nowrap"
        >
          Принять и закрыть
        </button>
      </div>
    </div>
  );
}
