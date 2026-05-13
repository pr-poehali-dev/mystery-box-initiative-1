import { createContext, useContext, ReactNode } from "react";
import { useYandexAuth, User } from "@/components/extensions/yandex-auth/useYandexAuth";
import { AUTH_URLS } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  handleCallback: (params?: URLSearchParams) => Promise<boolean>;
  getAuthHeader: () => { Authorization: string } | Record<string, never>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useYandexAuth({ apiUrls: AUTH_URLS });

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
