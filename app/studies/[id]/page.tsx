"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BarChart3, Users, Calendar, FileText } from "lucide-react";
import { getStudyStatusLabel, getStudyTypeLabel } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function StudyDetailsPage() {
  const params = useParams();
  const { studies } = useApp();

  const studyId = params.id as string;
  const study = studies.find((item) => item.id === studyId);

  return (
    <ProtectedRoute allowedRoles={["researcher", "admin"]}>
      <div className="p-8" dir="rtl">
        <Link href="/studies">
          <Button variant="outline" className="gap-2 mb-6">
            <ArrowRight className="w-4 h-4" />
            العودة إلى الدراسات
          </Button>
        </Link>

        {!study ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              لم يتم العثور على هذه الدراسة.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{study.titleAr}</h1>
              <p className="text-muted-foreground">
                {study.studentNameAr} • {getStudyTypeLabel(study.studyType)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="w-5 h-5 text-primary" />
                    المشاركون
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">
                    {study.participants?.length ?? 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    حجم العينة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{study.sampleSize}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="w-5 h-5 text-primary" />
                    الحالة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm">
                    {getStudyStatusLabel(study.status)}
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="w-5 h-5 text-primary" />
                    آخر تحديث
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">{formatDate(study.updatedAt)}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الدراسة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  <strong>عنوان الدراسة:</strong> {study.titleAr}
                </p>
                <p>
                  <strong>الباحث:</strong> {study.studentNameAr}
                </p>
                <p>
                  <strong>نوع الدراسة:</strong>{" "}
                  {getStudyTypeLabel(study.studyType)}
                </p>
                <p>
                  <strong>حجم العينة:</strong> {study.sampleSize}
                </p>
                <p>
                  <strong>الحالة:</strong> {getStudyStatusLabel(study.status)}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}