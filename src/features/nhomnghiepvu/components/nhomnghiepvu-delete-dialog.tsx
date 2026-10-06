"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteNhomNghiepVu } from "../services/nhomnghiepvu.service";
import type { NhomNghiepVu } from "../services/nhomnghiepvu.types";

export function NhomNghiepVuDeleteDialog({
  item,
  open,
  onOpenChange,
  onDeleted,
}: {
  item: NhomNghiepVu | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: (message: string) => void;
}) {
  const [deleting, setDeleting] = React.useState(false);

  async function handleDelete() {
    if (!item) return;
    setDeleting(true);
    const result = await deleteNhomNghiepVu(item.id);
    setDeleting(false);
    if (result.ok) {
      onDeleted("Đã xóa nhóm nghiệp vụ.");
      onOpenChange(false);
    } else {
      alert(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa nhóm <strong>{item?.ten}</strong> (mã: <span className="font-mono">{item?.ma}</span>)?<br />
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={deleting}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="gap-1.5">
            <Trash2 className="size-4" />
            {deleting ? "Đang xóa..." : "Xóa nhóm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}