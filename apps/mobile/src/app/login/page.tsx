"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LockKeyhole, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) return;
    
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#060B14] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-amber-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[20%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="w-full max-w-sm relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Glassmorphic Card */}
        <div className="relative rounded-[32px] overflow-hidden bg-white/[0.03] border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-xl">
          
          <div className="px-8 pt-10 pb-6 flex flex-col items-center justify-center">
            <div className="relative z-10 scale-90 mb-4 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <Logo />
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 mt-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-slate-300 tracking-wider uppercase">Secure Portal</span>
            </div>
          </div>

          <div className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Admin PIN
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <LockKeyhole className="h-5 w-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={pin}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setPin(val);
                      if (error) setError("");
                    }}
                    className="w-full pl-12 pr-4 h-14 bg-black/40 border border-white/10 rounded-2xl text-2xl tracking-[0.5em] text-white placeholder:text-slate-700 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 focus:bg-black/60 outline-none transition-all duration-300 shadow-inner"
                    placeholder="••••"
                    maxLength={8}
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3 text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 p-4 rounded-2xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || pin.length < 4}
                className="relative w-full h-14 rounded-2xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {/* Button Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 transition-transform duration-500 group-hover:scale-105" />
                
                {/* Button Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-[200%] transition-all duration-1000 ease-in-out" />
                
                {/* Button Content */}
                <div className="relative h-full flex items-center justify-center gap-2 text-white font-semibold text-lg tracking-wide">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Unlock Access</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-xs mt-8 font-medium">
          Authorized Personnel Only &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
