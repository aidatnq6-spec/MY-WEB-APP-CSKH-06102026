"use client";

import Link from "next/link";
import { ArrowLeft, Headset, LifeBuoy, ShieldCheck, Sparkles } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.82fr)]">
      <section className="relative hidden overflow-hidden bg-slate-950 px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(37,99,235,0.36),transparent_42%),radial-gradient(ellipse_at_90%_90%,rgba(20,184,166,0.22),transparent_40%)]" />
        <div className="absolute -right-32 top-1/3 size-[500px] rounded-full border border-white/5" />
        <div className="absolute -right-16 top-[38%] size-[370px] rounded-full border border-white/5" />
        <div className="relative z-10 flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 shadow-lg shadow-blue-950/30"><Headset className="size-5" /></span>
          <div><p className="text-sm font-semibold tracking-wide">CSKH Script</p><p className="text-xs text-slate-400">TRUNG TÂM HỖ TRỢ</p></div>
        </div>
        <div className="relative z-10 max-w-xl space-y-8 py-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-medium text-blue-100"><Sparkles className="size-3.5" /> Nền tảng hỗ trợ kỹ thuật nội bộ</div>
          <div className="space-y-4"><h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Hỗ trợ khách hàng<br /><span className="bg-gradient-to-r from-blue-300 to-teal-200 bg-clip-text text-transparent">nhanh hơn, rõ ràng hơn.</span></h1><p className="max-w-md text-base leading-7 text-slate-300">Tra cứu quy trình xử lý, checklist kỹ thuật và mẫu tin nhắn chăm sóc khách hàng trong cùng một không gian làm việc.</p></div>
          <div className="grid max-w-lg grid-cols-3 gap-3">
            {[{ icon: ShieldCheck, title: "Quy trình", caption: "Từng bước rõ ràng" }, { icon: LifeBuoy, title: "5 lĩnh vực", caption: "Nghiệp vụ tập trung" }, { icon: Sparkles, title: "Kịch bản", caption: "Phản hồi nhanh" }].map((item) => <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm"><item.icon className="mb-3 size-4 text-teal-300" /><p className="text-xs font-medium">{item.title}</p><p className="mt-1 text-[10px] text-slate-400">{item.caption}</p></div>)}
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500"><span>© 2026 CSKH Script</span><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-400" /> Hệ thống hỗ trợ nội bộ</span></div>
      </section>

      <section className="flex min-h-svh flex-col justify-between px-5 py-6 sm:px-10 lg:px-12 xl:px-20">
        <div className="flex items-center justify-between lg:justify-end">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"><span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 text-white"><Headset className="size-4" /></span>CSKH Script</Link>
          <Link href="/" className="hidden items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"><ArrowLeft className="size-3.5" /> Trang chủ</Link>
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <div className="mb-7 space-y-2"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Chào mừng trở lại</p><h2 className="text-3xl font-semibold tracking-tight">Đăng nhập</h2><p className="text-sm leading-6 text-muted-foreground">Nhập thông tin tài khoản để tiếp tục vào không gian hỗ trợ.</p></div>
          <LoginForm />
        </div>
        <p className="text-center text-xs text-muted-foreground">Cần hỗ trợ truy cập? Liên hệ quản trị viên hệ thống.</p>
      </section>
    </main>
  );
}
