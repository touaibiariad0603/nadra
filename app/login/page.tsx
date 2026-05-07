"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDashboardPath, initAuth, loginUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    initAuth();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const user = loginUser({ email, password });
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
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>الدخول إلى منصة Nadra ResearchFit</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-100 text-red-700 p-3 text-sm">
                {error}
              </div>
            )}

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
              />
            </div>

            <Button className="w-full py-6 text-base" type="submit">
              دخول
            </Button>

            <div className="text-center text-sm">
              ليس لديك حساب؟{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                إنشاء حساب
              </Link>
            </div>

          </form>
        </CardContent>
      </Card>
    </main>
  );
}