"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudyStatusLabel, getStudyTypeLabel } from "@/lib/mock-data";

export default function AdminStudiesPage() {
  const { studies } = useApp();

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إدارة الدراسات</h1>
          <p className="text-muted-foreground">
            يستطيع الأدمن رؤية جميع الدراسات داخل المنصة.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>كل الدراسات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studies.map((study) => (
                <div
                  key={study.id}
                  className="rounded-xl border bg-card p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold">{study.titleAr}</h3>
                    <p className="text-sm text-muted-foreground">
                      {study.studentNameAr} • {getStudyTypeLabel(study.studyType)}
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
                    {getStudyStatusLabel(study.status)}
                  </span>
                </div>
              ))}

              {studies.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  لا توجد دراسات بعد.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}