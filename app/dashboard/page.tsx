"use client";

import { getCurrentUser, getDashboardPath } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.push("/login");
      return;
    }

    router.push(getDashboardPath(user.role));
  }, [router]);

  return (
    <main dir="rtl" className="min-h-screen flex items-center justify-center">
      جاري تحويلك إلى لوحة التحكم...
    </main>
  );
}