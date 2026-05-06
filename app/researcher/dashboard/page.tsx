"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useApp } from "@/context/AppContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderPlus,
  Users,
  BarChart3,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Eye,
  Plus,
} from "lucide-react";
import { getStudyStatusLabel, getStudyTypeLabel } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const statCards = [
  {
    title: "إجمالي الدراسات",
    value: (studies: any[]) => studies.length,
    icon: FolderPlus,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "المشاركين",
    value: (studies: any[]) =>
      studies.reduce((sum, s) => sum + s.participants.length, 0),
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "الدراسات المكتملة",
    value: (studies: any[]) =>
      studies.filter((s) => s.status === "completed").length,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    title: "قيد التحليل",
    value: (studies: any[]) =>
      studies.filter((s) => s.status === "analysis" || s.status === "post-test")
        .length,
    icon: BarChart3,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
];

export default function ResearcherDashboardPage() {
  const { studies, isLoading } = useApp();

  return (
    <ProtectedRoute allowedRoles={["researcher"]}>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </div>
      ) : (
        <DashboardContent studies={studies} />
      )}
    </ProtectedRoute>
  );
}

function DashboardContent({ studies }: { studies: any[] }) {
  const recentStudies = [...studies]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          لوحة الباحث
        </h1>
        <p className="text-muted-foreground">
          نظرة عامة على دراساتك وإحصائيات البحث
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <Link href="/studies/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            إنشاء دراسة جديدة
          </Button>
        </Link>

        <Link href="/measurements">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            تسجيل القياسات
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value(studies)}
                  </p>
                </div>

                <div
                  className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>أحدث الدراسات</CardTitle>
                  <CardDescription>
                    آخر الدراسات التي تم تحديثها
                  </CardDescription>
                </div>

                <Link href="/studies">
                  <Button variant="ghost" size="sm">
                    عرض الكل
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent>
              {recentStudies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
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
                  {recentStudies.map((study) => (
                    <div
                      key={study.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1 line-clamp-1">
                          {study.titleAr}
                        </h4>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{study.studentNameAr}</span>
                          <span>•</span>
                          <span>{getStudyTypeLabel(study.studyType)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(study.updatedAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            study.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : study.status === "analysis"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {getStudyStatusLabel(study.status)}
                        </span>

                        <Link href={`/studies/${study.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
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

        <div>
          <Card>
            <CardHeader>
              <CardTitle>تقدم الدراسات</CardTitle>
              <CardDescription>
                توزيع الدراسات حسب المرحلة
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    status: "planning",
                    label: "التخطيط",
                    count: studies.filter((s) => s.status === "planning")
                      .length,
                  },
                  {
                    status: "pre-test",
                    label: "القياس القبلي",
                    count: studies.filter((s) => s.status === "pre-test")
                      .length,
                  },
                  {
                    status: "intervention",
                    label: "البرنامج التدريبي",
                    count: studies.filter((s) => s.status === "intervention")
                      .length,
                  },
                  {
                    status: "post-test",
                    label: "القياس البعدي",
                    count: studies.filter((s) => s.status === "post-test")
                      .length,
                  },
                  {
                    status: "analysis",
                    label: "التحليل الإحصائي",
                    count: studies.filter((s) => s.status === "analysis")
                      .length,
                  },
                  {
                    status: "completed",
                    label: "مكتمل",
                    count: studies.filter((s) => s.status === "completed")
                      .length,
                  },
                ].map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${
                              studies.length > 0
                                ? (item.count / studies.length) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>

                      <span className="text-sm font-medium w-6 text-left">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>إحصائيات سريعة</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm">متوسط التحسن</span>
                  </div>

                  <span className="font-bold text-green-600">+15.2%</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">متوسط العينات</span>
                  </div>

                  <span className="font-bold text-blue-600">
                    {studies.length > 0
                      ? Math.round(
                          studies.reduce((sum, s) => sum + s.sampleSize, 0) /
                            studies.length
                        )
                      : 0}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">دراسات ذات دلالة</span>
                  </div>

                  <span className="font-bold text-purple-600">
                    {studies.filter((s) => s.status === "completed").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}