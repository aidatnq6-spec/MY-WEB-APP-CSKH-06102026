import type { CategoryId } from "./categories";

export type Priority = "common" | "urgent" | "remote" | "escalate";

export type Issue = {
  id: string;
  categoryId: CategoryId;
  name: string;
  summary: string;
  steps: string[];
  script: string;
  escalation: string;
  internalNotes?: string;
  priorityLabels?: Priority[];
  image?: string;
  images?: string[];
};

export type Backup = {
  id: string;
  createdAt: string;
  reason: string;
  issues: Issue[];
};

export const priorityLabels: Array<{ id: Priority; name: string; className: string }> = [
  { id: "common", name: "Thường gặp", className: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200" },
  { id: "urgent", name: "Khẩn cấp", className: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" },
  { id: "remote", name: "Cần remote", className: "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-200" },
  { id: "escalate", name: "Cần leo thang", className: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200" },
];

export type AppState = {
  issues: Issue[];
  activeCategoryId: CategoryId;
  activeIssueId: string;
  checklistState: Record<string, Record<number, boolean>>;
  viewCounts: Record<string, number>;
};
