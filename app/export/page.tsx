"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, FileSpreadsheet } from "lucide-react";
function downloadCSV(filename: string, rows: string[][]) {
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(";")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export default function ExportPage() {
  const { studies } = useApp();
function exportParticipantsMeasurements() {
  const rows: string[][] = [
    [
      "Study",
      "Participant",
      "Variable",
      "Unit",
      "Pre Value",
      "Post Value",
      "Delta",
      "Improvement %",
    ],
  ];

  studies.forEach((study: any) => {
    study.participants?.forEach((participant: any) => {
      study.variables?.forEach((variable: any) => {
        const pre =
          participant.preMeasurements?.[variable.name] ?? "";

        const post =
          participant.postMeasurements?.[variable.name] ?? "";

        const delta =
          typeof pre === "number" && typeof post === "number"
            ? (post - pre).toFixed(2)
            : "";

        const improvement =
          typeof pre === "number" &&
          typeof post === "number" &&
          pre !== 0
            ? (((post - pre) / pre) * 100).toFixed(2)
            : "";

        rows.push([
          study.titleAr,
          participant.name,
          variable.nameAr,
          variable.unit,
          String(pre),
          String(post),
          String(delta),
          improvement ? `${improvement}%` : "",
        ]);
      });
    });
  });

  downloadCSV("participants-measurements-report.csv", rows);
}
 function exportStatisticalAnalysis() {
  const rows: string[][] = [
    [
      "Study",
      "Variable",
      "Mean Pre",
      "Mean Post",
      "Delta Mean",
      "Improvement %",
      "Interpretation",
    ],
  ];

  studies.forEach((study: any) => {
    study.variables?.forEach((variable: any) => {
      const preValues = study.participants
        ?.map(
          (p: any) =>
            p.preMeasurements?.[variable.name]
        )
        .filter((v: any) => typeof v === "number");

      const postValues = study.participants
        ?.map(
          (p: any) =>
            p.postMeasurements?.[variable.name]
        )
        .filter((v: any) => typeof v === "number");

      const mean = (values: number[]) =>
        values.length
          ? values.reduce((a, b) => a + b, 0) /
            values.length
          : 0;

      const meanPre = mean(preValues);
      const meanPost = mean(postValues);

      const deltaMean = meanPost - meanPre;

      const improvement =
        meanPre !== 0
          ? ((deltaMean / meanPre) * 100).toFixed(2)
          : "0";

      const interpretation =
        deltaMean > 0
          ? "يوجد تحسن في القياس البعدي مقارنة بالقياس القبلي."
          : deltaMean < 0
          ? "يوجد انخفاض في القياس البعدي مقارنة بالقياس القبلي."
          : "لا يوجد تغير واضح.";

      rows.push([
        study.titleAr,
        variable.nameAr,
        meanPre.toFixed(2),
        meanPost.toFixed(2),
        deltaMean.toFixed(2),
        `${improvement}%`,
        interpretation,
      ]);
    });
  });

  downloadCSV("statistical-analysis-report.csv", rows);
}

  return (
    <ProtectedRoute allowedRoles={["researcher", "admin"]}>
      <div className="p-8" dir="rtl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">التصدير</h1>
          <p className="text-muted-foreground">
            تحميل تقارير Excel/CSV خاصة بالمشاركين، القياسات، والتحليل الإحصائي.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                تقرير المشاركين والقياسات
              </CardTitle>
              <CardDescription>
                يجمع كل المشاركين حسب المتغيرات، القياس القبلي، القياس البعدي،
                الفرق Δ ونسبة التحسن.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={exportParticipantsMeasurements} className="gap-2">
                <Download className="w-4 h-4" />
                تحميل التقرير CSV
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                تقرير التحليل الإحصائي
              </CardTitle>
              <CardDescription>
                يخرج متوسط القياس القبلي، متوسط القياس البعدي، الفرق المتوسط،
                ونسبة التحسن مع تفسير علمي مختصر.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={exportStatisticalAnalysis} className="gap-2">
                <Download className="w-4 h-4" />
                تحميل التحليل CSV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}