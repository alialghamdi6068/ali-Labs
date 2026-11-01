import { Link, useLocation } from "wouter";
import { ArrowLeft, Github, LogIn, Menu, Plus, Search, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

export function Logo() {
  return <Link href="/" className="flex items-center gap-3 group"><span className="logo-mark"><span>A</span></span><span className="font-black tracking-tight text-lg text-white">Ali <span className="text-cyan-300">Labs</span></span></Link>;
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const nav = [{ href: "/discover", label: "استكشف" }, { href: "/dashboard", label: "لوحة المطور" }];
  return <div className="min-h-screen bg-[#0b0913] text-slate-100 selection:bg-violet-400/30">
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0b0913]/85 backdrop-blur-xl">
      <div className="shell h-18 flex items-center justify-between gap-5">
        <div className="flex items-center gap-8"><Logo /><nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">{nav.map(item => <Link key={item.href} href={item.href} className={`hover:text-white transition-colors ${location.startsWith(item.href) ? "text-white" : ""}`}>{item.label}</Link>)}</nav></div>
        <div className="hidden sm:flex items-center gap-3"><Link href="/discover" className="h-10 w-10 grid place-items-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5"><Search size={18}/></Link><Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/30 hover:bg-violet-400 transition-colors"><Plus size={16}/> ابدأ مشروعًا</Link>{user ? <button onClick={() => void logout()} className="text-xs text-slate-500 hover:text-white">خروج</button> : <button onClick={startLogin} className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><LogIn size={16}/> دخول</button>}</div>
        <button className="md:hidden p-2 text-slate-300" onClick={() => setMenuOpen(value => !value)} aria-label="القائمة">{menuOpen ? <X/> : <Menu/>}</button>
      </div>
      {menuOpen && <div className="md:hidden border-t border-white/[0.08] p-4 space-y-2 bg-[#0b0913]"><Link href="/discover" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 hover:bg-white/5">استكشف المشاريع</Link><Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 hover:bg-white/5">لوحة المطور</Link><button onClick={user ? () => void logout() : startLogin} className="w-full text-right rounded-xl px-4 py-3 hover:bg-white/5">{user ? "تسجيل الخروج" : "تسجيل الدخول"}</button></div>}
    </header>
    {children}
    <footer className="border-t border-white/[0.08] mt-24"><div className="shell py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"><div><Logo/><p className="mt-3 text-sm text-slate-500 max-w-sm">مساحة مستقلة يشارك فيها المطورون الأدوات والإضافات التي يبنونها لمجتمع Minecraft.</p></div><div className="flex items-center gap-5 text-sm text-slate-500"><Link href="/discover" className="hover:text-white">دليل المشاريع</Link><Link href="/dashboard" className="hover:text-white">للمطورين</Link><a href="https://github.com/alialghamdi6068/ali-Labs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Github size={15}/> GitHub</a></div></div></footer>
  </div>;
}

export function ProjectIcon({ letter, accent, size = "md" }: { letter: string; accent: string; size?: "sm" | "md" | "lg" }) {
  const classes = size === "lg" ? "h-20 w-20 text-3xl rounded-3xl" : size === "sm" ? "h-10 w-10 text-sm rounded-xl" : "h-14 w-14 text-xl rounded-2xl";
  return <span className={`${classes} inline-grid place-items-center font-black text-white shadow-lg`} style={{ background: `linear-gradient(135deg, ${accent}, #171326)` }}>{letter}</span>;
}

export function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "violet" | "cyan" | "amber" | "green" }) {
  const tones = { neutral: "border-white/10 bg-white/[0.04] text-slate-400", violet: "border-violet-400/20 bg-violet-400/10 text-violet-200", cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200", amber: "border-amber-400/20 bg-amber-400/10 text-amber-200", green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200" };
  return <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-medium ${tones[tone]}`}>{children}</span>;
}

export function Stat({ value, label }: { value: string; label: string }) { return <div><div className="text-xl font-bold text-white">{value}</div><div className="text-xs text-slate-500 mt-1">{label}</div></div>; }
