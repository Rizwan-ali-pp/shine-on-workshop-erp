"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LockKeyhole } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(pin);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid PIN. Please try again.");
      setPin("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 pb-6 flex flex-col items-center justify-center bg-slate-900 border-b border-slate-800">
          <Logo className="scale-[0.85] md:scale-100" />
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Admin PIN
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center tracking-[1em] font-mono text-2xl h-14 rounded-lg border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all"
                placeholder="••••"
                maxLength={8}
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || pin.length < 4}
              className="w-full h-12 text-lg font-semibold"
            >
              {isLoading ? "Unlocking..." : "Unlock Access"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
