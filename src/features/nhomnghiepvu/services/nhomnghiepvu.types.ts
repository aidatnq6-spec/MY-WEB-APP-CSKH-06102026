export interface NhomNghiepVu {
  id: string;
  ma: string;
  ten: string;
  moTa: string;
  mauNen: string;
  mauChu: string;
  icon: string;
  thuTu: number;
  kichHoat: boolean;
  ngayTao: string;
  ngayCapNhat: string;
}

export type NhomNghiepVuInput = Omit<NhomNghiepVu, "id" | "ngayTao" | "ngayCapNhat">;

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
