import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function YandexCallback() {
  const { handleCallback } = useAuth();
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    const params = new URLSearchParams(window.location.search);
    handleCallback(params).then((ok) => {
      navigate(ok ? "/profile" : "/", { replace: true });
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-500 text-sm">Входим через Яндекс...</p>
      </div>
    </div>
  );
}
