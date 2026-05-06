"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ParticipantProfilePage() {
  const user = getCurrentUser();

  return (
    <ProtectedRoute allowedRoles={["participant"]}>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">معلومات المشارك</h1>

        <Card>
          <CardHeader>
            <CardTitle>بياناتي الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <strong>الاسم:</strong> {user?.name}
            </p>
            <p>
              <strong>البريد الإلكتروني:</strong> {user?.email}
            </p>
            <p>
              <strong>الدور:</strong> مشارك
            </p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}