"use client";

import * as React from "react";
import { BookOpen, Bot, BriefcaseBusiness, FileText, KeyRound, LifeBuoy, Settings2, ShieldCheck, Sparkles, Wrench } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";

const data = {
  user: { name: "Kỹ thuật viên", email: "phongdepdanang@gmail.com", avatar: "/app-icon.svg" },
  teams: [
    { name: "CSKH Script", logo: <Wrench />, plan: "Hỗ trợ kỹ thuật" },
    { name: "Trung tâm hỗ trợ", logo: <LifeBuoy />, plan: "Nội bộ" },
  ],
  navMain: [
    {
      title: "Tổng quan",
      url: "/dashboard",
      icon: <BriefcaseBusiness />,
      isActive: true,
      items: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Thống kê sử dụng", url: "/dashboard#stats" },
      ],
    },
    {
      title: "Nhóm nghiệp vụ",
      url: "/nhomnghiepvu",
      icon: <BookOpen />,
      items: [
        { title: "Quản lý nhóm nghiệp vụ", url: "/nhomnghiepvu" },
        { title: "Chữ ký số (CKS)", url: "/dashboard#cks" },
        { title: "Hóa đơn điện tử", url: "/dashboard#hddt" },
        { title: "Bảo hiểm xã hội", url: "/dashboard#bhxh" },
        { title: "Căn hộ cho thuê", url: "/dashboard#canho" },
        { title: "Môi giới Đầu tư", url: "/dashboard#dautu" },
      ],
    },
    {
      title: "Công cụ hỗ trợ",
      url: "/dashboard#tools",
      icon: <Bot />,
      items: [
        { title: "AI chẩn đoán lỗi", url: "/dashboard#ai" },
        { title: "Tạo tin nhắn Zalo", url: "/dashboard#zalo" },
        { title: "Sao lưu dữ liệu", url: "/dashboard#backup" },
      ],
    },
    {
      title: "Cài đặt",
      url: "/dashboard#settings",
      icon: <Settings2 />,
      items: [
        { title: "Firebase & đồng bộ", url: "/dashboard#firebase" },
        { title: "Cấu hình AI", url: "/dashboard#ai-config" },
      ],
    },
  ],
  projects: [
    { name: "Kịch bản thường gặp", url: "/dashboard#common", icon: <FileText /> },
    { name: "Ca cần leo thang", url: "/dashboard#escalate", icon: <ShieldCheck /> },
    { name: "Gợi ý từ AI", url: "/dashboard#ai", icon: <Sparkles /> },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
