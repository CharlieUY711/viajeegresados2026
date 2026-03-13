"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/lib/i18n";
import { LangSwitcher } from "@/components/ui/LangSwitcher";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { t } = useLang();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch {
      setError(t.auth.errors.invalid);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sidebar-gradient flex">
      {/* Panel izquierdo */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 border-r border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-glow">
            <GraduationCap size={20} className="text-navy-950" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-lg leading-none">{t.app.name}</p>
            <p className="text-white/40 text-xs mt-0.5">{t.app.tagline}</p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            {t.auth.hero.line1}<br />
            <span className="text-amber-400">{t.auth.hero.line2}</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-xs">{t.auth.hero.desc}</p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { label: t.auth.stats.families,  value: "48"     },
              { label: t.auth.stats.events,    value: "12"     },
              { label: t.auth.stats.raised,    value: "$8.240" },
              { label: t.auth.stats.days,      value: "42"     },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4">
                <p className="text-2xl font-bold text-amber-400">{value}</p>
                <p className="text-white/40 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs">{t.app.copyright}</p>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center">
                <GraduationCap size={18} className="text-navy-950" />
              </div>
              <p className="font-display font-bold text-white text-lg">{t.app.name}</p>
            </div>
            <LangSwitcher />
          </div>

          <div className="hidden lg:flex justify-end mb-6">
            <LangSwitcher />
          </div>

          <h1 className="font-display text-3xl font-bold text-white mb-1">{t.auth.welcome}</h1>
          <p className="text-white/40 text-sm mb-8">{t.auth.signInPrompt}</p>

          {error && (
            <div className="bg-red-500/15 border border-red-500/25 rounded-xl p-3 mb-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">{t.auth.email}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t.auth.emailPlaceholder}
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-amber-400/60 focus:bg-white/[0.08] transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">{t.auth.password}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t.auth.passwordPlaceholder}
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-white/25 focus:border-amber-400/60 focus:bg-white/[0.08] transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
              {t.auth.signIn}
            </Button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">
            {t.auth.noAccount}{" "}
            <span className="text-amber-400 hover:text-amber-300 cursor-pointer transition-colors">
              {t.auth.contactOrganizer}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
