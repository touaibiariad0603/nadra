"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderPlus, Eye, Plus } from "lucide-react";
import { getStudyStatusLabel, getStudyTypeLabel } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function StudiesPage() {
  const { studies } = useApp();

  return (
    <ProtectedRoute allowedRoles={["researcher", "admin"]}>
      <div className="p-8" dir="rtl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">كل الدراسات</h1>
            <p className="text-muted-foreground">
              عرض وإدارة جميع الدراسات البحثية داخل المنصة.
            </p>
          </div>

          <Link href="/studies/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إنشاء دراسة جديدة
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>قائمة الدراسات</CardTitle>
            <CardDescription>
              يمكنك فتح أي دراسة لمتابعة تفاصيلها وقياساتها.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {studies.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FolderPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد دراسات بعد</p>
                <Link href="/studies/create">
                  <Button variant="link" className="mt-2">
                    أنشئ أول دراسة
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {studies.map((study) => (
                  <div
                    key={study.id}
                    className="flex items-center justify-between rounded-xl border bg-card p-4 hover:shadow-sm transition"
                  >
                    <div>
                      <h3 className="font-bold text-lg">{study.titleAr}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {study.studentNameAr} •{" "}
                        {getStudyTypeLabel(study.studyType)} •{" "}
                        {formatDate(study.updatedAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs">
                        {getStudyStatusLabel(study.status)}
                      </span>

                      <Link href={`/studies/${study.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          عرض
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}