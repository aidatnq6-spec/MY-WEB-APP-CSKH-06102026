"use client";

import { useAppData } from "@/lib/use-app-data";
import { categories } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FileText, AlertTriangle, Zap, Settings, PanelLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IssueFormDialog } from "@/components/issue-form-dialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth, isAllowedFirebaseUser } from "@/lib/firebase";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";

export default function CSKHDashboard() {
  const router = useRouter();
  const { state, getFilteredIssues, setState, isLoading } = useAppData();
  const [search, setSearch] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);

  useEffect(() => {
    const auth = firebaseAuth;
    if (!auth) {
      router.replace("/login");
      return;
    }

    return onAuthStateChanged(auth, async (user) => {
      if (!user || !isAllowedFirebaseUser(user.email)) {
        if (user) await signOut(auth);
        router.replace("/login");
      }
      setAuthLoading(false);
    });
  }, [router]);
  const activeCategory = categories.find((c) => c.id === state.activeCategoryId);
  const filteredIssues = getFilteredIssues.filter((issue) => {
    const q = search.trim().toLowerCase();
    return !q || `${issue.name} ${issue.summary} ${issue.script} ${issue.steps.join(" ")}`.toLowerCase().includes(q);
  });
  const totalUrgent = state.issues.filter((issue) => issue.priorityLabels?.includes("urgent")).length;
  const totalRemote = state.issues.filter((issue) => issue.priorityLabels?.includes("remote")).length;
  const totalSteps = state.issues.reduce((sum, issue) => sum + issue.steps.length, 0);
  const activeIssue = state.issues.find((issue) => issue.id === state.activeIssueId);

  const handleTabChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;
    const firstIssue = state.issues.find((issue) => issue.categoryId === category.id);
    setState({ ...state, activeCategoryId: category.id, activeIssueId: firstIssue?.id ?? "" });
  };
  const handleSelectIssue = (issueId: string) => {
    const selected = state.issues.find((item) => item.id === issueId);
    if (!selected) return;
    setState({ ...state, activeIssueId: issueId, activeCategoryId: selected.categoryId, viewCounts: { ...state.viewCounts, [issueId]: (state.viewCounts[issueId] || 0) + 1 } });
  };
  const handleCopy = async () => { if (activeIssue?.script) await navigator.clipboard.writeText(activeIssue.script); };
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state.issues, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "it-support-scripts.json"; link.click(); URL.revokeObjectURL(link.href);
  };
  if (authLoading || isLoading) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Đang tải dữ liệu...</div>;

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-slate-50/70 dark:bg-background">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
          <SidebarTrigger className="-ml-1"><PanelLeft className="size-4" /></SidebarTrigger>
          <Separator orientation="vertical" className="mx-1 h-4" />
          <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbPage>Trung tâm hỗ trợ</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportData} className="hidden sm:inline-flex">Xuất dữ liệu</Button>
            <Button size="sm" onClick={() => setIssueDialogOpen(true)} className="gap-1.5"><Plus className="size-4" /><span className="hidden sm:inline">Thêm kịch bản</span></Button>
          </div>
        </header>
        <div className="relative min-w-0 flex-1">
          <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 md:px-6 lg:py-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="space-y-1"><div className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><span className="size-1.5 rounded-full bg-emerald-500" /> WORKSPACE / HỖ TRỢ KỸ THUẬT</div><h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Tổng quan hỗ trợ</h1><p className="text-sm text-muted-foreground">Tra cứu quy trình xử lý và phản hồi khách hàng nhanh chóng.</p></div>
              <div className="relative hidden w-full max-w-sm md:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm lỗi, Token, hóa đơn, BHXH..." className="h-9 pl-9" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Tổng kịch bản" value={state.issues.length} note="Trong thư viện hỗ trợ" icon={<FileText className="size-4" />} tone="blue" />
              <MetricCard label="Nhóm nghiệp vụ" value={categories.length} note="Các lĩnh vực hỗ trợ" icon={<Settings className="size-4" />} tone="violet" />
              <MetricCard label="Ưu tiên khẩn cấp" value={totalUrgent} note="Cần xử lý sớm" icon={<AlertTriangle className="size-4" />} tone="rose" />
              <MetricCard label="Cần remote" value={totalRemote} note={`${totalSteps} bước trong quy trình`} icon={<Zap className="size-4" />} tone="amber" />
            </div>
            <Tabs value={state.activeCategoryId} onValueChange={handleTabChange}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-base font-semibold">Thư viện kịch bản</h2><p className="mt-0.5 text-sm text-muted-foreground">Chọn nhóm nghiệp vụ để xem các lỗi thường gặp.</p></div>
                <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl border bg-background p-1 lg:w-auto">{categories.map((category) => { const Icon = category.icon; const count = state.issues.filter((issue) => issue.categoryId === category.id).length; return <TabsTrigger key={category.id} value={category.id} className="shrink-0 gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm"><Icon className="size-4" /><span>{category.name}</span><span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{count}</span></TabsTrigger>; })}</TabsList>
              </div>
              {categories.map((category) => <TabsContent key={category.id} value={category.id} className="mt-4 focus-visible:outline-none"><div className="grid items-start gap-4 xl:grid-cols-[minmax(360px,0.92fr)_minmax(0,1.5fr)]">
                <Card className="overflow-hidden border-border/70 shadow-sm"><CardHeader className="border-b bg-card pb-4"><div className="flex items-start justify-between gap-3"><div className="space-y-1"><CardTitle className="text-base">{category.name}</CardTitle><CardDescription>{category.description}</CardDescription></div><Badge variant="secondary" className="shrink-0">{filteredIssues.length} kịch bản</Badge></div></CardHeader><CardContent className="p-2 sm:p-3"><div className="space-y-1">{filteredIssues.length ? filteredIssues.map((issue) => { const selected = issue.id === state.activeIssueId; return <button key={issue.id} type="button" onClick={() => handleSelectIssue(issue.id)} className={`group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${selected ? "border-primary/30 bg-primary/[0.045] shadow-sm" : "border-transparent hover:border-border hover:bg-muted/50"}`}><span className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg ${category.swatch}`}><category.icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><span className="line-clamp-1 text-sm font-medium">{issue.name}</span><span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{state.viewCounts[issue.id] || 0} lượt</span></span><span className="mt-1 block line-clamp-1 text-xs text-muted-foreground">{issue.summary || "Chưa có mô tả ngắn"}</span><span className="mt-2 flex flex-wrap gap-1">{(issue.priorityLabels || []).slice(0, 2).map((label) => <PriorityBadge key={label} priority={label} />)}</span></span></button>; }) : <div className="rounded-xl border border-dashed p-8 text-center"><p className="text-sm font-medium">Chưa có kịch bản</p><p className="mt-1 text-xs text-muted-foreground">Thêm kịch bản đầu tiên cho nhóm {category.name}.</p></div>}</div></CardContent></Card>
                <Card className="min-w-0 overflow-hidden border-border/70 shadow-sm">{activeIssue ? <><CardHeader className="border-b bg-card pb-4"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="min-w-0 space-y-2"><div className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><category.icon className="size-3.5" />{category.name}<span>/</span><span>Kịch bản xử lý</span></div><CardTitle className="text-xl leading-snug">{activeIssue.name}</CardTitle><CardDescription>{activeIssue.summary}</CardDescription><div className="flex flex-wrap gap-1.5">{(activeIssue.priorityLabels || []).map((label) => <PriorityBadge key={label} priority={label} />)}</div></div><Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0 gap-2"><FileText className="size-4" />Copy script</Button></div></CardHeader><CardContent className="space-y-6 p-4 sm:p-6"><section><div className="mb-3 flex items-center justify-between"><div><h3 className="text-sm font-semibold">Quy trình xử lý</h3><p className="mt-0.5 text-xs text-muted-foreground">Làm theo thứ tự và xác nhận với khách hàng.</p></div><Badge variant="outline" className="font-normal">{activeIssue.steps.length} bước</Badge></div>{activeIssue.steps.length ? <ol className="space-y-0">{activeIssue.steps.map((step, index) => <li key={`${activeIssue.id}-${index}`} className="relative flex gap-3 pb-4 last:pb-0"><span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border bg-background text-[11px] font-semibold text-muted-foreground">{index + 1}</span>{index < activeIssue.steps.length - 1 && <span className="absolute left-3 top-6 h-[calc(100%-12px)] w-px bg-border" />}<p className="pt-0.5 text-sm leading-relaxed">{step}</p></li>)}</ol> : <p className="text-sm text-muted-foreground">Chưa có bước xử lý.</p>}</section><section className="rounded-xl border bg-muted/30 p-4"><div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Script Zalo gửi khách</h3><p className="mt-0.5 text-xs text-muted-foreground">Nội dung phản hồi có thể sao chép nhanh.</p></div><Button variant="outline" size="sm" onClick={handleCopy} className="h-8 shrink-0 bg-background">Sao chép</Button></div><pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-foreground/85">{activeIssue.script || "Chưa có script phản hồi."}</pre></section>{activeIssue.escalation && <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20"><h3 className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200"><AlertTriangle className="size-4" />Khi nào cần leo thang?</h3><p className="mt-2 text-sm leading-relaxed text-amber-900/80 dark:text-amber-100/80">{activeIssue.escalation}</p></section>}</CardContent></> : <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center"><span className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted"><FileText className="size-5 text-muted-foreground" /></span><h3 className="text-sm font-semibold">Chọn một kịch bản</h3><p className="mt-1 max-w-xs text-sm text-muted-foreground">Chọn lỗi từ danh sách bên trái để xem checklist và mẫu phản hồi khách hàng.</p></CardContent>}</Card>
              </div></TabsContent>)}
            </Tabs>
            <IssueFormDialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen} state={state} setState={setState} />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function MetricCard({ label, value, note, icon, tone }: { label: string; value: number; note: string; icon: React.ReactNode; tone: "blue" | "violet" | "rose" | "amber" }) {
  const tones = { blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-200", violet: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-200", rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-200", amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-200" };
  return <Card className="border-border/70 shadow-sm"><CardContent className="flex items-start justify-between gap-3 p-4"><div><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div><span className={`flex size-9 items-center justify-center rounded-lg ${tones[tone]}`}>{icon}</span></CardContent></Card>;
}
function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { label: string; className: string }> = { common: { label: "Thường gặp", className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200" }, urgent: { label: "Khẩn cấp", className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" }, remote: { label: "Cần remote", className: "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200" }, escalate: { label: "Cần leo thang", className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200" } };
  const item = map[priority];
  return item ? <Badge variant="outline" className={`h-5 px-1.5 text-[10px] font-medium ${item.className}`}>{item.label}</Badge> : null;
}
