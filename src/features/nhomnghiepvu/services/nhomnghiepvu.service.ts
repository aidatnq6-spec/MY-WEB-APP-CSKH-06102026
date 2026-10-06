import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { firestoreDb } from "@/lib/firebase";
import { NHOM_NGHIEP_VU_COLLECTION, mapNhomNghiepVuDocument } from "./nhomnghiepvu.firestore";
import type { NhomNghiepVu, NhomNghiepVuInput, ServiceResult } from "./nhomnghiepvu.types";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định.";
}

export async function listNhomNghiepVu(): Promise<ServiceResult<NhomNghiepVu[]>> {
  if (!firestoreDb) return { ok: false, error: "Firebase Firestore chưa được cấu hình." };
  try {
    const snapshot = await getDocs(query(collection(firestoreDb, NHOM_NGHIEP_VU_COLLECTION), orderBy("thuTu")));
    return { ok: true, data: snapshot.docs.map(mapNhomNghiepVuDocument) };
  } catch (error) {
    return { ok: false, error: `Không thể tải danh sách nhóm nghiệp vụ: ${getErrorMessage(error)}` };
  }
}

export async function getNhomNghiepVu(id: string): Promise<ServiceResult<NhomNghiepVu | null>> {
  if (!firestoreDb) return { ok: false, error: "Firebase Firestore chưa được cấu hình." };
  try {
    const snapshot = await getDoc(doc(firestoreDb, NHOM_NGHIEP_VU_COLLECTION, id));
    return { ok: true, data: snapshot.exists() ? mapNhomNghiepVuDocument(snapshot) : null };
  } catch (error) {
    return { ok: false, error: `Không thể tải chi tiết nhóm nghiệp vụ: ${getErrorMessage(error)}` };
  }
}

export async function createNhomNghiepVu(input: NhomNghiepVuInput): Promise<ServiceResult<string>> {
  if (!firestoreDb) return { ok: false, error: "Firebase Firestore chưa được cấu hình." };
  try {
    const now = new Date().toISOString();
    const reference = await addDoc(collection(firestoreDb, NHOM_NGHIEP_VU_COLLECTION), {
      ...input,
      ma: input.ma.trim().toLowerCase(),
      ten: input.ten.trim(),
      moTa: input.moTa.trim(),
      ngayTao: now,
      ngayCapNhat: now,
    });
    await updateDoc(reference, { id: reference.id });
    return { ok: true, data: reference.id };
  } catch (error) {
    return { ok: false, error: `Không thể tạo nhóm nghiệp vụ: ${getErrorMessage(error)}` };
  }
}

export async function updateNhomNghiepVu(id: string, input: NhomNghiepVuInput): Promise<ServiceResult<void>> {
  if (!firestoreDb) return { ok: false, error: "Firebase Firestore chưa được cấu hình." };
  try {
    await updateDoc(doc(firestoreDb, NHOM_NGHIEP_VU_COLLECTION, id), {
      ...input,
      ma: input.ma.trim().toLowerCase(),
      ten: input.ten.trim(),
      moTa: input.moTa.trim(),
      ngayCapNhat: new Date().toISOString(),
    });
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: `Không thể cập nhật nhóm nghiệp vụ: ${getErrorMessage(error)}` };
  }
}

export async function deleteNhomNghiepVu(id: string): Promise<ServiceResult<void>> {
  if (!firestoreDb) return { ok: false, error: "Firebase Firestore chưa được cấu hình." };
  try {
    await deleteDoc(doc(firestoreDb, NHOM_NGHIEP_VU_COLLECTION, id));
    return { ok: true, data: undefined };
  } catch (error) {
    return { ok: false, error: `Không thể xóa nhóm nghiệp vụ: ${getErrorMessage(error)}` };
  }
}