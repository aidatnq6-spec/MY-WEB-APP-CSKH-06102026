"use client";

import * as React from "react";
import { CalendarIcon, ShieldCheckIcon, TagIcon, ZapIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { NhomNghiepVu } from "../services/nhomnghiepvu.types";

function formatDate(value: string) {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Chưa cập nhật" : date.toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" });
}

export function NhomNghiepVuDetail({ item, open, onOpenChange }: { item: NhomNghiepVu | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        {item && <>
          <SheetHeader className="border-b px-6 py-5 pr-14">
            <SheetTitle className="flex items-center gap-3 text-lg">
              <span className="flex size-10 items-center justify-center rounded-xl text-lg font-semibold" style={{ backgroundColor: item.mauNen, color: item.mauChu }}>{item.ten.slice(0, 1)}</span>
              <span>{item.ten}</span>
            </SheetTitle>
            <SheetDescription>Mã nhóm: <code className="font-mono">{item.ma}</code></SheetDescription>
          </SheetHeader>
          <div className="space-y-6 p-6">
            <section><h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mô tả</h3><p className="mt-2 text-sm leading-6">{item.moTa || "Chưa có mô tả."}</p></section>
            <section className="grid grid-cols-2 gap-3"><div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Màu nền</p><div className="mt-2 flex items-center gap-2"><span className="size-6 rounded" style={{ backgroundColor: item.mauNen }} /><code className="text-xs">{item.mauNen}</code></div></div><div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Màu chữ</p><div className="mt-2 flex items-center gap-2"><span className="size-6 rounded border" style={{ backgroundColor: item.mauChu }} /><code className="text-xs">{item.mauChu}</code></div></div></section>
            <section className="space-y-3 rounded-xl border bg-muted/30 p-4"><div className="flex items-center gap-2 text-sm"><CalendarIcon className="size-4 text-muted-foreground" /><span className="text-muted-foreground">Ngày tạo</span><span className="ml-auto font-mono text-xs">{formatDate(item.ngayTao)}</span></div><div className="flex items-center gap-2 text-sm"><CalendarIcon className="size-4 text-muted-foreground" /><span className="text-muted-foreground">Cập nhật</span><span className="ml-auto font-mono text-xs">{formatDate(item.ngayCapNhat)}</span></div><div className="flex items-center gap-2 text-sm"><ZapIcon className="size-4 text-muted-foreground" /><span className="text-muted-foreground">Thứ tự</span><span className="ml-auto font-mono text-xs">{item.thuTu}</span></div></section>
            <section className="flex items-center justify-between rounded-xl border p-4"><div className="flex items-center gap-2 text-sm">{item.kichHoat ? <ShieldCheckIcon className="size-4 text-emerald-500" /> : <ZapIcon className="size-4 text-amber-500" />}<span>{item.kichHoat ? "Đang hoạt động" : "Tạm dừng"}</span></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><TagIcon className="size-4" /><code>{item.icon}</code></div></section>
          </div>
        </>}
      </SheetContent>
    </Sheet>
  );
}
