"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNhomNghiepVu, updateNhomNghiepVu } from "../services/nhomnghiepvu.service";
import type { NhomNghiepVu, NhomNghiepVuInput } from "../services/nhomnghiepvu.types";

const emptyForm: NhomNghiepVuInput = {
  ma: "",
  ten: "",
  moTa: "",
  mauNen: "#3b82f6",
  mauChu: "#ffffff",
  icon: "BookOpen",
  thuTu: 0,
  kichHoat: true,
};

export function NhomNghiepVuForm({
  open,
  onOpenChange,
  item,
  items,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: NhomNghiepVu | null;
  items: NhomNghiepVu[];
  onSaved: (message: string) => void;
}) {
  const [form, setForm] = React.useState<NhomNghiepVuInput>(emptyForm);
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setForm(item ? {
        ma: item.ma,
        ten: item.ten,
        moTa: item.moTa,
        mauNen: item.mauNen,
        mauChu: item.mauChu,
        icon: item.icon,
        thuTu: item.thuTu,
        kichHoat: item.kichHoat,
      } : { ...emptyForm });
      setError("");
    }
  }, [item, open]);

  const setField = <K extends keyof NhomNghiepVuInput>(key: K, value: NhomNghiepVuInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const ma = form.ma.trim().toLowerCase();
    const ten = form.ten.trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(ma)) {
      setError("Mã nhóm chỉ gồm chữ thường, số và dấu gạch ngang; không bắt đầu hoặc kết thúc bằng dấu gạch ngang.");
      return;
    }
    if (!ten) {
      setError("Vui lòng nhập tên nhóm nghiệp vụ.");
      return;
    }
    if (items.some((existing) => existing.ma.toLowerCase() === ma && existing.id !== item?.id)) {
      setError("Mã nhóm này đã được sử dụng.");
      return;
    }

    setSaving(true);
    const input = { ...form, ma, ten, moTa: form.moTa.trim(), thuTu: Math.max(0, Math.floor(form.thuTu)) };
    const result = item ? await updateNhomNghiepVu(item.id, input) : await createNhomNghiepVu(input);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onOpenChange(false);
    onSaved(item ? "Đã cập nhật nhóm nghiệp vụ." : "Đã tạo nhóm nghiệp vụ.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{item ? "Chỉnh sửa nhóm nghiệp vụ" : "Thêm nhóm nghiệp vụ"}</DialogTitle>
          <DialogDescription>Nhập thông tin nhóm. Mã nhóm phải là duy nhất.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</p>}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nhom-ma">Mã nhóm</Label>
              <Input id="nhom-ma" value={form.ma} onChange={(event) => setField("ma", event.target.value.toLowerCase())} placeholder="cks" required maxLength={40} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nhom-ten">Tên nhóm</Label>
              <Input id="nhom-ten" value={form.ten} onChange={(event) => setField("ten", event.target.value)} placeholder="Chữ ký số" required maxLength={120} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nhom-mota">Mô tả</Label>
            <Textarea id="nhom-mota" value={form.moTa} onChange={(event) => setField("moTa", event.target.value)} rows={3} maxLength={500} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="nhom-nen">Màu nền</Label><Input id="nhom-nen" type="color" value={form.mauNen} onChange={(event) => setField("mauNen", event.target.value)} className="h-10 p-1" /></div>
            <div className="space-y-2"><Label htmlFor="nhom-chu">Màu chữ</Label><Input id="nhom-chu" type="color" value={form.mauChu} onChange={(event) => setField("mauChu", event.target.value)} className="h-10 p-1" /></div>
            <div className="space-y-2"><Label htmlFor="nhom-icon">Icon Lucide</Label><Input id="nhom-icon" value={form.icon} onChange={(event) => setField("icon", event.target.value)} placeholder="BookOpen" maxLength={40} /></div>
          </div>
          <div className="grid items-end gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="nhom-thutu">Thứ tự hiển thị</Label><Input id="nhom-thutu" type="number" min={0} step={1} value={form.thuTu} onChange={(event) => setField("thuTu", Number(event.target.value))} /></div>
            <label className="flex min-h-10 items-center gap-2 text-sm"><Checkbox checked={form.kichHoat} onCheckedChange={(checked) => setField("kichHoat", checked === true)} />Kích hoạt nhóm</label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Hủy</Button>
            <Button type="submit" disabled={saving}>{saving ? "Đang lưu..." : item ? "Lưu thay đổi" : "Tạo nhóm"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
