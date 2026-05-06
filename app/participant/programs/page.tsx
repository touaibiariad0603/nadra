"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ParticipantProgramsPage() {
  return (
    <ProtectedRoute allowedRoles={["participant"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">برنامجي التدريبي</h1>
        <p className="text-muted-foreground mb-8">
          هنا يرى المشارك البرنامج التدريبي والنصائح الموجهة له.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>برنامج تجريبي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <strong>المدة:</strong> 6 أسابيع
            </p>
            <p>
              <strong>عدد الحصص:</strong> 3 حصص في الأسبوع
            </p>
            <p className="text-muted-foreground">
              سيتم ربط هذه الصفحة لاحقًا بالبرامج التدريبية التي يضيفها الباحث.
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}