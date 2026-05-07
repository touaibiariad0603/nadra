"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FolderPlus,
  BarChart3,
  FileText,
  Users,
  Download,
  Microscope,
  LayoutDashboard,
  ChevronLeft,
  LogOut,
  Shield,
  UserCircle,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { User } from "@/types/auth";

const adminNavigation = [
  { name: "لوحة الأدمن", href: "/admin/dashboard", icon: Shield },
  { name: "إدارة المستخدمين", href: "/admin/users", icon: Users },
  { name: "إدارة الدراسات", href: "/admin/studies", icon: FolderPlus },
];

const researcherNavigation = [
  { name: "لوحة التحكم", href: "/researcher/dashboard", icon: LayoutDashboard },
  { name: "إنشاء دراسة", href: "/studies/create", icon: FolderPlus },
  { name: "القياسات", href: "/measurements", icon: BarChart3 },
  { name: "التحليل الإحصائي", href: "/analysis", icon: FileText },
  { name: "التفسير العلمي", href: "/interpretation", icon: Microscope },
  { name: "لوحة المعلم", href: "/teacher", icon: Users },
  { name: "التصدير", href: "/export", icon: Download },
];

const participantNavigation = [
  { name: "لوحة المشارك", href: "/participant/dashboard", icon: LayoutDashboard },
  { name: "معلوماتي", href: "/participant/profile", icon: UserCircle },
  { name: "تطور الأداء", href: "/participant/progress", icon: Activity },
  { name: "برنامجي التدريبي", href: "/participant/programs", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [pathname]);

  const navigation =
    user?.role === "admin"
      ? adminNavigation
      : user?.role === "participant"
      ? participantNavigation
      : user?.role === "researcher"
      ? researcherNavigation
      : [];

  function handleLogout() {
    logoutUser();
    setUser(null);
    router.push("/login");
  }

  return (
    <aside className="w-64 bg-white border-l h-screen sticky top-0 overflow-y-auto flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Microscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-foreground">Nadra researchlab</h1>
            <p className="text-xs text-muted-foreground">منصة البحث الرياضي</p>
          </div>
        </Link>
      </div>

      {user && (
        <div className="mx-4 mb-4 rounded-xl bg-muted p-3">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            {user.role === "admin"
              ? "أدمن"
              : user.role === "researcher"
              ? "طالب / أستاذ / باحث"
              : "مشارك"}
          </p>
        </div>
      )}

      <nav className="px-3 py-4 flex-1">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 space-y-2">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full justify-start gap-2"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </Button>

        <Link href="/">
          <Button variant="outline" className="w-full justify-start gap-2">
            <ChevronLeft className="w-4 h-4" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </aside>
  );
}