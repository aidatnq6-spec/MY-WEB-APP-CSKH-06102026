"use client";

import * as React from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listNhomNghiepVu } from "../services/nhomnghiepvu.service";
import type { NhomNghiepVu } from "../services/nhomnghiepvu.types";
import { NhomNghiepVuForm } from "./nhomnghiepvu-form";
import { NhomNghiepVuDetail } from "./nhomnghiepvu-detail";
import { NhomNghiepVuDeleteDialog } from "./nhomnghiepvu-delete-dialog";

export function NhomNghiepVuList({ onAction }: { onAction?: (message: string) => void }) {
  const [items, setItems] = React.useState<NhomNghiepVu[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [editing, setEditing] = React.useState<NhomNghiepVu | null>(null);
  const [viewing, setViewing] = React.useState<NhomNghiepVu | null>(null);
  const [deleting, setDeleting] = React.useState<NhomNghiepVu | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError("");
    const result = await listNhomNghiepVu();
    if (result.ok) setItems(result.data);
    else setError(result.error);
    setLoading(false);
  }, []);

  React.useEffect(() => { void load(); }, [load]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.ten.toLowerCase().includes(q) || item.ma.toLowerCase().includes(q) || item.moTa.toLowerCase().includes(q));
  }, [items, search]);

  function openCreate() { setEditing(null); setFormOpen(true); }
  function openEdit(item: NhomNghiepVu) { setEditing(item); setFormOpen(true); }
  function notify(message: string) { onAction?.(message); void load(); }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Danh sách nhóm nghiệp vụ</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Quản lý các nhóm hiển thị trên dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm theo mã, tên, mô tả..." className="h-9 pl-9" />
          </div>
          <Button onClick={openCreate} className="h-9 gap-1.5"><Plus className="size-4" />Thêm nhóm</Button>
        </div>
      </div>

      {error && <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32">Mã</TableHead>
              <TableHead>Tên nhóm</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="w-28 text-center">Thứ tự</TableHead>
              <TableHead className="w-32">Trạng thái</TableHead>
              <TableHead className="w-44 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">Đang tải danh sách...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">Chưa có nhóm nào. Nhấn “Thêm nhóm” để bắt đầu.</TableCell></TableRow>
            ) : filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell><code className="rounded bg-muted px-2 py-0.5 text-xs">{item.ma}</code></TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-md text-xs font-medium" style={{ backgroundColor: item.mauNen, color: item.mauChu }}>{item.ten.slice(0, 1)}</span>
                    <span className="font-medium">{item.ten}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-sm text-sm text-muted-foreground">{item.moTa || "—"}</TableCell>
                <TableCell className="text-center tabular-nums">{item.thuTu}</TableCell>
                <TableCell>{item.kichHoat ? <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">Đang hoạt động</span> : <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">Tạm dừng</span>}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setViewing(item)} aria-label="Xem chi tiết"><Eye className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label="Chỉnh sửa"><Pencil className="size-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleting(item)} aria-label="Xóa" className="text-destructive hover:text-destructive"><Trash2 className="size-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <NhomNghiepVuForm open={formOpen} onOpenChange={setFormOpen} item={editing} items={items} onSaved={notify} />
      <NhomNghiepVuDetail item={viewing} open={viewing !== null} onOpenChange={(open) => { if (!open) setViewing(null); }} />
      <NhomNghiepVuDeleteDialog item={deleting} open={deleting !== null} onOpenChange={(open) => { if (!open) setDeleting(null); }} onDeleted={notify} />
    </div>
  );
}
