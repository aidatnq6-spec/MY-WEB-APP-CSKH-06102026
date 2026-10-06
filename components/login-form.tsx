"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

import { cn } from "@/lib/utils";
import {
  allowedEmail,
  applyAuthPersistence,
  firebaseAuth,
  getFirebaseConfigError,
  getFirebaseLoginErrorMessage,
  googleProvider,
  isAllowedFirebaseUser,
  isFirebaseConfigured,
} from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState<"email" | "google" | null>(null);
  const [error, setError] = useState(() => getFirebaseConfigError());
  const [notice, setNotice] = useState("");

  function getErrorCode(err: unknown) {
    return typeof err === "object" && err && "code" in err ? String((err as { code: unknown }).code) : "auth/unknown";
  }

  function completeLogin(uid: string, email: string | null | undefined) {
    if (email) localStorage.setItem("cskh-session-email", email);
    sessionStorage.setItem("cskh-session-uid", uid);
    router.push("/dashboard");
  }

  async function handleGoogleLogin() {
    setError("");
    if (!isFirebaseConfigured || !firebaseAuth || !googleProvider) {
      setError(getFirebaseConfigError() || "Firebase chưa sẵn sàng. Hãy tải lại trang và thử lại.");
      return;
    }
    setLoading("google");
    try {
      await applyAuthPersistence(remember);
      const credentials = await signInWithPopup(firebaseAuth, googleProvider);
      if (!isAllowedFirebaseUser(credentials.user.email)) {
        await firebaseAuth.signOut();
        setError(`Tài khoản Google này chưa được cấp quyền${allowedEmail ? ` (${allowedEmail})` : ""}.`);
        return;
      }
      completeLogin(credentials.user.uid, credentials.user.email);
    } catch (err) {
      setError(getFirebaseLoginErrorMessage(getErrorCode(err)));
    } finally {
      setLoading(null);
    }
  }

  async function handlePasswordReset() {
    setError("");
    setNotice("");

    if (!firebaseAuth) {
      setError(getFirebaseConfigError() || "Firebase chưa sẵn sàng. Hãy tải lại trang và thử lại.");
      return;
    }

    const emailInput = document.getElementById("email");
    const email = emailInput instanceof HTMLInputElement ? emailInput.value.trim() : "";
    if (!email) {
      setError("Nhập email trước, sau đó chọn Quên mật khẩu?");
      document.getElementById("email")?.focus();
      return;
    }
    if (!isAllowedFirebaseUser(email)) {
      setError(`Email này chưa được cấp quyền truy cập${allowedEmail ? ` (${allowedEmail})` : ""}.`);
      return;
    }

    setLoading("email");
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      setNotice("Đã gửi email đặt lại mật khẩu. Kiểm tra hộp thư đến và thư rác.");
    } catch (err) {
      setError(getFirebaseLoginErrorMessage(getErrorCode(err)));
    } finally {
      setLoading(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!isFirebaseConfigured || !firebaseAuth) {
      setError(getFirebaseConfigError() || "Firebase chưa sẵn sàng. Hãy tải lại trang và thử lại.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }
    if (!isAllowedFirebaseUser(email)) {
      setError(`Email này chưa được cấp quyền truy cập${allowedEmail ? ` (${allowedEmail})` : ""}.`);
      return;
    }
    setLoading("email");
    try {
      await applyAuthPersistence(remember);
      const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
      completeLogin(credentials.user.uid, credentials.user.email || email);
    } catch (err) {
      setError(getFirebaseLoginErrorMessage(getErrorCode(err)));
    } finally {
      setLoading(null);
    }
  }

  const isLoading = loading !== null;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-border/70 shadow-xl shadow-slate-900/5">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-600/20"><KeyRound className="size-6" /></div>
          <div className="space-y-1"><CardTitle className="text-2xl tracking-tight">Đăng nhập hệ thống</CardTitle><CardDescription>Đăng nhập bằng tài khoản Firebase của bạn</CardDescription></div>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleSubmit}>
            <FieldGroup>
              {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">{error}</div>}
              {notice && <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">{notice}</div>}
              <Field><Button type="button" variant="outline" disabled={isLoading} onClick={handleGoogleLogin} className="h-10 gap-2"><GoogleIcon />{loading === "google" ? <Loader2 className="size-4 animate-spin" /> : "Tiếp tục với Google"}</Button></Field>
              <FieldSeparator>Hoặc đăng nhập bằng email</FieldSeparator>
              <Field><FieldLabel htmlFor="email">Email</FieldLabel><Input id="email" name="email" type="email" placeholder="ten@example.com" autoComplete="email" required /></Field>
              <Field><div className="flex items-center justify-between gap-2"><FieldLabel htmlFor="password">Mật khẩu</FieldLabel><button type="button" onClick={handlePasswordReset} disabled={isLoading} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50">Quên mật khẩu?</button></div><div className="relative"><Input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" className="pr-10" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} className="absolute right-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></Field>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-4 rounded border-input accent-primary" />Ghi nhớ đăng nhập trên thiết bị này</label>
              <Field><Button type="submit" disabled={isLoading} className="h-10 gap-2">{loading === "email" ? <Loader2 className="size-4 animate-spin" /> : null}{loading === "email" ? "Đang đăng nhập..." : "Đăng nhập"}{!isLoading && <ArrowRight className="size-4" />}</Button></Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <div className="flex items-start gap-2 px-4 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" /><span>{allowedEmail ? `Email được phép truy cập: ${allowedEmail}` : "Quyền truy cập được kiểm soát bởi Firebase Authentication."}</span></div>
    </div>
  );
}

function GoogleIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4"><path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.69 2.91-4.19 2.91-7.21Z" /><path fill="#34A853" d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.29v2.52A9.74 9.74 0 0 0 12 21.7Z" /><path fill="#FBBC05" d="M6.54 13.8a5.86 5.86 0 0 1 0-3.6V7.68H3.29a9.73 9.73 0 0 0 0 8.64l3.25-2.52Z" /><path fill="#EA4335" d="M12 6.17c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.26 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.71 5.38l3.25 2.52C7.31 7.89 9.46 6.17 12 6.17Z" /></svg>;
}
