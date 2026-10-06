"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { categories } from "@/lib/categories";
import type { Issue, AppState, Priority } from "@/lib/types";

export function IssueFormDialog({ open, onOpenChange, state, setState }: { open: boolean; onOpenChange: (open: boolean) => void; state: AppState; setState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const [categoryId, setCategoryId] = React.useState(state.activeCategoryId);
  const [name, setName] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [steps, setSteps] = React.useState("");
  const [script, setScript] = React.useState("");
  const [escalation, setEscalation] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>("common");

  React.useEffect(() => { if (open) { setCategoryId(state.activeCategoryId); setName(""); setSummary(""); setSteps(""); setScript(""); setEscalation(""); setPriority("common"); } }, [open, state.activeCategoryId]);
  function save(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    const issue: Issue = { id: crypto.randomUUID(), categoryId, name: name.trim(), summary: summary.trim(), steps: steps.split("\n").map((s) => s.trim()).filter(Boolean), script: script.trim(), escalation: escalation.trim(), priorityLabels: [priority], image: "" };
    const next = { ...state, issues: [...state.issues, issue], activeCategoryId: categoryId, activeIssueId: issue.id };
    setState(next);
    localStorage.setItem("cskh-script-data-v1", JSON.stringify(next));
    toast.success("Đã thêm kịch bản mới");
    onOpenChange(false);
  }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>Thêm kịch bản</DialogTitle><DialogDescription>Tạo kịch bản xử lý mới trong thư viện hỗ trợ.</DialogDescription></DialogHeader><form onSubmit={save} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="issue-category">Nhóm nghiệp vụ</Label><select id="issue-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value as Issue["categoryId"])} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm">{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div><div className="space-y-2"><Label htmlFor="issue-name">Tên kịch bản</Label><Input id="issue-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Không nhận Token" required /></div></div><div className="space-y-2"><Label htmlFor="issue-summary">Mô tả ngắn</Label><Input id="issue-summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Nguyên nhân hoặc biểu hiện lỗi" /></div><div className="space-y-2"><Label htmlFor="issue-steps">Các bước xử lý</Label><Textarea id="issue-steps" value={steps} onChange={(e) => setSteps(e.target.value)} placeholder="Mỗi bước một dòng" rows={5} /></div><div className="space-y-2"><Label htmlFor="issue-script">Script gửi khách</Label><Textarea id="issue-script" value={script} onChange={(e) => setScript(e.target.value)} rows={5} /></div><div className="space-y-2"><Label htmlFor="issue-escalation">Khi nào cần leo thang?</Label><Textarea id="issue-escalation" value={escalation} onChange={(e) => setEscalation(e.target.value)} rows={3} /></div><div className="flex items-center gap-3"><Label htmlFor="issue-priority">Mức ưu tiên</Label><select id="issue-priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="common">Thường gặp</option><option value="urgent">Khẩn cấp</option><option value="remote">Cần remote</option><option value="escalate">Cần leo thang</option></select></div><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button><Button type="submit">Tạo kịch bản</Button></DialogFooter></form></DialogContent></Dialog>;
}
