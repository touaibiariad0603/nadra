"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getUsers } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderPlus, BarChart3, Shield } from "lucide-react";

export default function AdminDashboardPage() {
  const users = getUsers();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">لوحة تحكم الأدمن</h1>
          <p className="text-muted-foreground">
            إدارة كاملة للمستخدمين، الدراسات، المشاركين، القياسات والتقارير.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                الصلاحية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Admin</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                المستخدمون
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{users.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-primary" />
                الدراسات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">1</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                التقارير
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}