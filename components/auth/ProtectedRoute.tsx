"use client";

import { getCurrentUser, getDashboardPath } from "@/lib/auth";
import { UserRole } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.push(getDashboardPath(user.role));
      return;
    }

    setReady(true);
  }, [allowedRoles, router]);

  if (!ready) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center">
        جاري التحقق من الصلاحيات...
      </div>
    );
  }

  return <>{children}</>;
}