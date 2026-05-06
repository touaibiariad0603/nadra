"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

export default function ParticipantProgressPage() {
  return (
    <ProtectedRoute allowedRoles={["participant"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">تطور الأداء</h1>
        <p className="text-muted-foreground mb-8">
          هذه الصفحة ستعرض لاحقًا مخطط الأداء الخاص بالمشارك فقط.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                نسبة التحسن
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">+15.2%</p>
              <p className="text-muted-foreground mt-2">
                قيمة تجريبية إلى حين ربط القياسات الفعلية.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                مخطط الأداء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                سيتم إضافة الرسم البياني في Module 3
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}