"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NhomNghiepVuList } from "@/src/features/nhomnghiepvu/components/nhomnghiepvu-list";

export default function NhomNghiepVuPage() {
  const router = useRouter();

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-slate-50/70 dark:bg-background">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
          <SidebarTrigger className="-ml-1"><Plus className="size-4" /></SidebarTrigger>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Quản lý nhóm nghiệp vụ</h1>
                <p className="text-sm text-muted-foreground">Tạo, sửa, xóa và xem danh sách các nhóm nghiệp vụ.</p>
              </div>
              <Button onClick={() => router.push("/dashboard")} variant="outline" size="sm">Quay về Dashboard</Button>
            </div>
          </div>
        </header>
        <div className="p-6">
          <NhomNghiepVuList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}