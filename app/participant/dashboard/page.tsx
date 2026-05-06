"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileText, UserCircle } from "lucide-react";

export default function ParticipantDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["participant"]}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">لوحة المشارك</h1>
          <p className="text-muted-foreground">
            هنا يمكن للمشارك رؤية معلوماته، تطوره، وبرنامجه التدريبي فقط.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-primary" />
                معلوماتي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                عرض البيانات الشخصية الخاصة بالمشارك.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                تطور الأداء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                متابعة تطور القياسات القبلية والبعدية.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                برنامجي التدريبي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                عرض البرنامج التدريبي والنصائح الخاصة بك.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}