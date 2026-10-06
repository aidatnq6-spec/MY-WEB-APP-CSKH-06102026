import type { LucideIcon } from "lucide-react";
import { KeyRound, FileSpreadsheet, ShieldCheck, Building2, TrendingUp } from "lucide-react";

export type CategoryId = "cks" | "hddt" | "bhxh" | "canho" | "dautu";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  icon: LucideIcon;
  accent: string; // tailwind classes for active tab
  color: string; // hex for chips
  swatch: string; // tailwind text/bg class
};

export const categories: Category[] = [
  {
    id: "cks",
    name: "Chữ ký số",
    description: "USB Token, plugin, chứng thư số, PIN, ký trên HTKK/MISA",
    icon: KeyRound,
    accent: "data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700 dark:data-[active=true]:bg-blue-950/60 dark:data-[active=true]:text-blue-200",
    color: "#1c3f9f",
    swatch: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-200",
  },
  {
    id: "hddt",
    name: "Hóa đơn điện tử",
    description: "Phần mềm HĐĐT, gửi email, điều chỉnh/hủy, ký số hóa đơn",
    icon: FileSpreadsheet,
    accent: "data-[active=true]:bg-teal-50 data-[active=true]:text-teal-700 dark:data-[active=true]:bg-teal-950/60 dark:data-[active=true]:text-teal-200",
    color: "#0f9d91",
    swatch: "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-200",
  },
  {
    id: "bhxh",
    name: "Bảo hiểm xã hội",
    description: "Cổng BHXH, ký số hồ sơ, nộp hồ sơ, tài khoản/mật khẩu",
    icon: ShieldCheck,
    accent: "data-[active=true]:bg-violet-50 data-[active=true]:text-violet-700 dark:data-[active=true]:bg-violet-950/60 dark:data-[active=true]:text-violet-200",
    color: "#7533e6",
    swatch: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-200",
  },
  {
    id: "canho",
    name: "Căn hộ cho thuê",
    description: "Hợp đồng, đặt cọc, bàn giao, hỗ trợ khách thuê",
    icon: Building2,
    accent: "data-[active=true]:bg-sky-50 data-[active=true]:text-sky-700 dark:data-[active=true]:bg-sky-950/60 dark:data-[active=true]:text-sky-200",
    color: "#0ea5e9",
    swatch: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-200",
  },
  {
    id: "dautu",
    name: "Môi giới Đầu tư",
    description: "Tư vấn, báo giá, chốt deal, chăm sóc sau đầu tư",
    icon: TrendingUp,
    accent: "data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 dark:data-[active=true]:bg-emerald-950/60 dark:data-[active=true]:text-emerald-200",
    color: "#16a34a",
    swatch: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200",
  },
];

export const findCategory = (id: string) => categories.find((c) => c.id === id);
