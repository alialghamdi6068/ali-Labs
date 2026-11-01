import { Check, Clock3, FileWarning, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { SiteChrome, Tag } from "@/components/SiteChrome";

export default function Admin() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const queue = trpc.projects.reviewQueue.useQuery(undefined, { enabled: isAdmin });
  const decide = trpc.projects.decide.useMutation({ onSuccess: () => void queue.refetch() });
  const [note, setNote] = useState("");
  if (loading) return <SiteChrome><div className="shell py-20 text-slate-500">جاري التحقق من الصلاحيات...</div></SiteChrome>;
  if (!user) return <Gate title="لوحة المشرف" text="تحتاج إلى تسجيل الدخول للوصول إلى لوحة المراجعة." action="دخول" onClick={startLogin}/>;
  if (!isAdmin) return <Gate title="هذه المساحة للمشرفين" text="حسابك مسجل كمطور. يمكنك إدارة مشاريعك من لوحة المطور." action="لوحة المطور" onClick={() => { window.location.href = "/dashboard"; }}/>;
  return <SiteChrome><main className="shell py-10 md:py-14"><div className="eyebrow"><ShieldCheck size={14}/> مركز المراجعة</div><div className="flex flex-col md:flex-row md:items-end justify-between gap-4"><div><h1 className="page-title">نظرة على ما ينتظر الاعتماد.</h1><p className="mt-3 text-slate-500">راجع بيانات المشروع والملف قبل ظهوره في الدليل العام.</p></div><div className="flex items-center gap-2 text-xs text-slate-500"><Clock3 size={14}/> {queue.data?.length || 0} عناصر تنتظر المراجعة</div></div><div className="mt-10 space-y-4">{queue.data?.length ? queue.data.map(item => <div key={item.version.id} className="review-row"><div className="flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-white">{item.project.name}</h2><Tag tone="amber">قيد المراجعة</Tag></div><p className="mt-2 text-sm text-slate-400">الإصدار <span className="font-mono text-white">{item.version.versionNumber}</span> · {item.version.fileName || "ملف لم يُرفق بعد"}</p><p className="mt-2 text-xs leading-6 text-slate-500">{item.version.changelog || "لا يوجد سجل تغييرات."}</p></div><div className="flex flex-col gap-2 md:w-52"><input value={note} onChange={e => setNote(e.target.value)} className="form-input text-xs" placeholder="ملاحظة اختيارية"/><div className="flex gap-2"><button onClick={() => decide.mutate({ versionId: item.version.id, decision: "approved", note })} className="flex-1 rounded-lg bg-emerald-400/15 py-2 text-xs text-emerald-200 hover:bg-emerald-400/25"><Check size={14} className="inline ml-1"/> قبول</button><button onClick={() => decide.mutate({ versionId: item.version.id, decision: "rejected", note })} className="flex-1 rounded-lg bg-rose-400/15 py-2 text-xs text-rose-200 hover:bg-rose-400/25"><X size={14} className="inline ml-1"/> رفض</button></div></div></div>) : <div className="empty-state"><FileWarning size={25}/><p>لا توجد عناصر بانتظار المراجعة.</p><span className="text-xs text-slate-600">ستظهر هنا المشاريع والإصدارات الجديدة.</span></div>}</div></main></SiteChrome>;
}
function Gate({ title, text, action, onClick }: { title: string; text: string; action: string; onClick: () => void }) { return <SiteChrome><main className="shell py-24 max-w-xl text-center"><div className="icon-box mx-auto"><ShieldCheck/></div><h1 className="mt-6 text-3xl font-black text-white">{title}</h1><p className="mt-3 leading-8 text-slate-400">{text}</p><button onClick={onClick} className="cta-primary mt-8 mx-auto">{action}</button></main></SiteChrome>; }
