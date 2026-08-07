"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (pin: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      await api.get("/auth/me");
      setIsAuthenticated(true);
      if (pathname === "/login") {
        router.push("/");
      }
    } catch (error) {
      setIsAuthenticated(false);
      if (pathname !== "/login") {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (pin: string) => {
    await api.post("/auth/login", { pin });
    setIsAuthenticated(true);
    router.push("/");
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setIsAuthenticated(false);
    router.push("/login");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading...</div>;
  }

  // Prevent flashing protected content while redirecting to login
  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
