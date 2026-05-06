"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDashboardPath, registerUser } from "@/lib/auth";
import { UserRole } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("researcher");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const user = registerUser({ name, email, password, role });
      router.push(getDashboardPath(user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Microscope className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl">إنشاء حساب</CardTitle>
          <CardDescription>اختر نوع الحساب المناسب داخل المنصة</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-100 text-red-700 p-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium">الاسم الكامل</label>
              <input
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">البريد الإلكتروني</label>
              <input
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">كلمة المرور</label>
              <input
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">نوع الحساب</label>
              <select
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="researcher">طالب / أستاذ / باحث</option>
                <option value="participant">مشارك</option>
                <option value="admin">أدمن</option>
              </select>
            </div>

            <Button className="w-full py-6 text-base" type="submit">
              إنشاء الحساب
            </Button>

            <div className="text-center text-sm">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}