import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

export const firebaseApp = isFirebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firestoreDb = firebaseApp ? getFirestore(firebaseApp) : null;
export const googleProvider = firebaseApp ? new GoogleAuthProvider() : null;
export const allowedEmail = process.env.NEXT_PUBLIC_ALLOWED_EMAIL?.trim().toLowerCase() || null;

export async function applyAuthPersistence(remember: boolean) {
  if (!firebaseAuth) return;
  await setPersistence(firebaseAuth, remember ? browserLocalPersistence : browserSessionPersistence);
}

export function getFirebaseConfigError() {
  if (!isFirebaseConfigured) return "Thiếu cấu hình Firebase. Kiểm tra các biến NEXT_PUBLIC_FIREBASE_* trong .env.local.";
  return "";
}

export function getFirebaseLoginErrorMessage(code: string) {
  const messages: Record<string, string> = {
    "auth/invalid-email": "Địa chỉ email không hợp lệ.",
    "auth/user-disabled": "Tài khoản này đã bị vô hiệu hóa trong Firebase Authentication.",
    "auth/user-not-found": "Không tìm thấy tài khoản này trong Firebase project đang cấu hình.",
    "auth/wrong-password": "Mật khẩu chưa chính xác. Hãy kiểm tra lại hoặc dùng chức năng quên mật khẩu.",
    "auth/invalid-credential": "Email hoặc mật khẩu chưa chính xác, hoặc tài khoản không thuộc Firebase project đang cấu hình.",
    "auth/too-many-requests": "Bạn đã thử đăng nhập quá nhiều lần. Vui lòng chờ rồi thử lại.",
    "auth/network-request-failed": "Không thể kết nối Firebase. Kiểm tra mạng, VPN hoặc tiện ích chặn kết nối.",
    "auth/operation-not-allowed": "Provider đăng nhập chưa được bật. Trong Firebase Console, bật Email/Password và/hoặc Google tại Authentication → Sign-in method.",
    "auth/invalid-api-key": "Firebase API key không hợp lệ. Đối chiếu NEXT_PUBLIC_FIREBASE_API_KEY với đúng Firebase project.",
    "auth/api-key-not-valid": "Firebase API key không hợp lệ hoặc bị giới hạn. Kiểm tra API key trong Google Cloud Console.",
    "auth/unauthorized-domain": "Domain hiện tại chưa được phép. Thêm localhost vào Firebase Authentication → Settings → Authorized domains.",
    "auth/admin-restricted-operation": "Thao tác đăng nhập này chưa được cho phép trong Firebase Authentication.",
    "auth/popup-blocked": "Trình duyệt đã chặn cửa sổ đăng nhập Google. Cho phép popup rồi thử lại.",
    "auth/popup-closed-by-user": "Cửa sổ đăng nhập đã đóng trước khi hoàn tất.",
    "auth/cancelled-popup-request": "Một yêu cầu đăng nhập Google khác đang mở. Đóng popup cũ rồi thử lại.",
    "auth/web-storage-unsupported": "Trình duyệt đang chặn cookie hoặc bộ nhớ cần thiết cho Firebase Auth.",
    "auth/quota-exceeded": "Firebase Authentication đã vượt hạn mức tạm thời. Vui lòng thử lại sau.",
    "auth/account-exists-with-different-credential": "Email này đã được đăng ký bằng phương thức đăng nhập khác.",
    "auth/credential-already-in-use": "Thông tin đăng nhập này đã được liên kết với tài khoản khác.",
    "auth/internal-error": "Firebase Auth gặp lỗi nội bộ. Tải lại trang và thử lại; nếu còn lỗi, kiểm tra cấu hình project.",
  };
  return messages[code] || `Đăng nhập Firebase thất bại (${code}). Kiểm tra provider, tài khoản trong đúng project và Authorized domains.`;
}

export function isAllowedFirebaseUser(email: string | null | undefined) {
  return Boolean(email && (!allowedEmail || email.trim().toLowerCase() === allowedEmail));
}
