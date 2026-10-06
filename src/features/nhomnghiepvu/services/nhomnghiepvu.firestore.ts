import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import type { NhomNghiepVu } from "./nhomnghiepvu.types";

export const NHOM_NGHIEP_VU_COLLECTION = "nhomnghiepvu";

function toIsoString(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof value === "string") return value;
  return "";
}

export function mapNhomNghiepVuDocument(
  snapshot: DocumentSnapshot<DocumentData>,
): NhomNghiepVu {
  const data = snapshot.data() ?? {};
  return {
    id: snapshot.id,
    ma: typeof data.ma === "string" ? data.ma : "",
    ten: typeof data.ten === "string" ? data.ten : "",
    moTa: typeof data.moTa === "string" ? data.moTa : "",
    mauNen: typeof data.mauNen === "string" ? data.mauNen : "#3b82f6",
    mauChu: typeof data.mauChu === "string" ? data.mauChu : "#ffffff",
    icon: typeof data.icon === "string" ? data.icon : "BookOpen",
    thuTu: typeof data.thuTu === "number" ? data.thuTu : 0,
    kichHoat: typeof data.kichHoat === "boolean" ? data.kichHoat : true,
    ngayTao: toIsoString(data.ngayTao),
    ngayCapNhat: toIsoString(data.ngayCapNhat),
  };
}