"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getUsers } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsersPage() {
  const users = getUsers();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">
            عرض جميع المستخدمين حسب الصلاحيات.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-right p-3">الاسم</th>
                    <th className="text-right p-3">البريد</th>
                    <th className="text-right p-3">الدور</th>
                    <th className="text-right p-3">تاريخ الإنشاء</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3 font-medium">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">
                        <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
                          {user.role === "admin"
                            ? "أدمن"
                            : user.role === "researcher"
                            ? "طالب / أستاذ / باحث"
                            : "مشارك"}
                        </span>
                      </td>
                      <td className="p-3">
                        {new Date(user.createdAt).toLocaleDateString("ar-DZ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}