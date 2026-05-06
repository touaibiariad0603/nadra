'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Table2, 
  BarChart3,
  FileText,
  Check
} from 'lucide-react';
import { analyzeVariable, formatNumber } from '@/lib/statistics';
import { getStudyStatusLabel } from '@/lib/mock-data';
import { downloadCSV, printPage } from '@/lib/utils';

// Simple bar chart component using HTML/CSS
function SimpleBarChart({ data, title }: { data: { label: string; pre: number; post: number }[]; title: string }) {
  const maxValue = Math.max(...data.flatMap(d => [d.pre, d.post]));
  
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-center">{title}</h4>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-600 w-12 text-left">قبلي</span>
              <div className="flex-1 h-6 bg-muted rounded-r-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-r-full transition-all"
                  style={{ width: `${(item.pre / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium w-16 text-left">{formatNumber(item.pre)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-600 w-12 text-left">بعدي</span>
              <div className="flex-1 h-6 bg-muted rounded-r-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-r-full transition-all"
                  style={{ width: `${(item.post / maxValue) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium w-16 text-left">{formatNumber(item.post)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6 text-xs text-muted-foreground mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>القياس القبلي</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>القياس البعدي</span>
        </div>
      </div>
    </div>
  );
}

export default function ExportPage() {
  const { studies, getAnalysisResult } = useApp();
  const [selectedStudy, setSelectedStudy] = useState<string>('');
  const [exported, setExported] = useState(false);

  const selectedStudyData = studies.find(s => s.id === selectedStudy);
  const analysisResult = selectedStudy ? getAnalysisResult(selectedStudy) : null;

  const statisticalResults = useMemo(() => {
    if (!selectedStudyData || selectedStudyData.participants.length === 0) return [];
    
    return selectedStudyData.variables.map(variable => {
      const preValues = selectedStudyData.participants.map(p => p.preMeasurements[variable.name] || 0);
      const postValues = selectedStudyData.participants.map(p => p.postMeasurements[variable.name] || 0);
      const hasValidData = preValues.some(v => v !== 0) && postValues.some(v => v !== 0);
      if (!hasValidData) return null;
      return analyzeVariable(variable, preValues, postValues);
    }).filter(Boolean);
  }, [selectedStudyData]);

  const chartData = useMemo(() => {
    return statisticalResults.map(result => ({
      label: result?.variable.nameAr || '',
      pre: result?.preMean || 0,
      post: result?.postMean || 0,
    }));
  }, [statisticalResults]);

  const exportTableCSV = () => {
    if (statisticalResults.length === 0) return;
    
      
    const headers = ['المتغير', 'المتوسط القبلي', 'الانحراف القبلي', 'المتوسط البعدي', 'الانحراف البعدي', 'فرق المتوسطات', 'نسبة التحسن %', 'قيمة t', 'قيمة p', 'الدلالة الإحصائية'];
    const data = statisticalResults.map(r => [
      r?.variable.nameAr || '',
      formatNumber(r?.preMean || 0),
      formatNumber(r?.preStdDev || 0),
      formatNumber(r?.postMean || 0),
      formatNumber(r?.postStdDev || 0),
      formatNumber(r?.meanDifference || 0),
      formatNumber(r?.improvementPercentage || 0),
      formatNumber(r?.tStatistic || 0),
      
      r?.pValue != null
  ? (r.pValue < 0.001 ? '< 0.001' : formatNumber(r.pValue, 4))
     : 'N/A',
      r?.isSignificant ? 'دال إحصائياً' : 'غير دال إحصائياً'
    ]);
    
    downloadCSV([headers, ...data], `chapter4_table_${selectedStudy}`);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  const exportParticipantsCSV = () => {
    if (!selectedStudyData || selectedStudyData.participants.length === 0) return;
    
    const headers = ['اسم المشارك', 'العمر', 'الجنس', ...selectedStudyData.variables.flatMap(v => [`${v.nameAr} (قبلي)`, `${v.nameAr} (بعدي)`])];
    const data = selectedStudyData.participants.map(p => [
      p.name,
      String(p.age),
      p.gender === 'male' ? 'ذكر' : 'أنثى',
      ...selectedStudyData.variables.flatMap(v => [
        String(p.preMeasurements[v.name] || 0),
        String(p.postMeasurements[v.name] || 0)
      ])
    ]);
    
    downloadCSV([headers, ...data], `participants_${selectedStudy}`);
  };

  const handlePrint = () => {
    printPage();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          العودة للوحة التحكم
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">تصدير الفصل الرابع</h1>
        <p className="text-muted-foreground">جداول وأشكال أكاديمية جاهزة للطباعة والتصدير</p>
      </div>

      {/* Study Selection */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>اختر الدراسة</CardTitle>
              <CardDescription>اختر دراسة لتصدير جداول وأشكال الفصل الرابع</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePrint}
                disabled={!selectedStudy || statisticalResults.length === 0}
                className="gap-2"
              >
                <Printer className="w-4 h-4" />
                طباعة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <select
              value={selectedStudy}
              onChange={(e) => setSelectedStudy(e.target.value)}
              className="flex-1 md:flex-none md:w-96 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- اختر دراسة --</option>
              {studies.filter(s => s.participants.length > 0).map(study => (
                <option key={study.id} value={study.id}>
                  {study.titleAr} - {study.studentNameAr} ({getStudyStatusLabel(study.status)})
                </option>
              ))}
            </select>
            <Button 
              onClick={exportTableCSV}
              disabled={!selectedStudy || statisticalResults.length === 0}
              className="gap-2"
            >
              {exported ? (
                <><Check className="w-4 h-4" /> تم التصدير</>
              ) : (
                <><Download className="w-4 h-4" /> تصدير الجدول</>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={exportParticipantsCSV}
              disabled={!selectedStudy || selectedStudyData?.participants.length === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              تصدير المشاركين
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedStudyData && statisticalResults.length > 0 && (
        <div className="space-y-8">
          {/* Academic Table */}
          <Card className="print-break-before">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Table2 className="w-5 h-5 text-primary" />
                <CardTitle>جدول (1)</CardTitle>
              </div>
              <CardDescription>
                المتوسطات الحسابية والانحرافات المعيارية وقيم (t) و(p) للفروق بين القياسين القبلي والبعدي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b-2 border-foreground">
                      <th rowSpan={2} className="p-3 border text-center font-bold">المتغير</th>
                      <th colSpan={2} className="p-3 border text-center font-bold">القياس القبلي</th>
                      <th colSpan={2} className="p-3 border text-center font-bold">القياس البعدي</th>
                      <th rowSpan={2} className="p-3 border text-center font-bold">فرق<br/>المتوسطات</th>
                      <th rowSpan={2} className="p-3 border text-center font-bold">نسبة<br/>التحسن %</th>
                      <th rowSpan={2} className="p-3 border text-center font-bold">قيمة t</th>
                      <th rowSpan={2} className="p-3 border text-center font-bold">قيمة p</th>
                      <th rowSpan={2} className="p-3 border text-center font-bold">الدلالة</th>
                    </tr>
                    <tr className="bg-muted/30 border-b border-foreground">
                      <th className="p-2 border text-center font-semibold">المتوسط</th>
                      <th className="p-2 border text-center font-semibold">الانحراف</th>
                      <th className="p-2 border text-center font-semibold">المتوسط</th>
                      <th className="p-2 border text-center font-semibold">الانحراف</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statisticalResults.map((result, index) => (
                      <tr key={index} className="border-b hover:bg-muted/30">
                        <td className="p-3 border text-center font-semibold">{result?.variable.nameAr}</td>
                        <td className="p-3 border text-center">{formatNumber(result?.preMean || 0)}</td>
                        <td className="p-3 border text-center">{formatNumber(result?.preStdDev || 0)}</td>
                        <td className="p-3 border text-center">{formatNumber(result?.postMean || 0)}</td>
                        <td className="p-3 border text-center">{formatNumber(result?.postStdDev || 0)}</td>
                        <td className="p-3 border text-center">
                          <span className={result?.meanDifference && result.meanDifference < 0 ? 'text-green-600' : 'text-foreground'}>
                            {formatNumber(result?.meanDifference || 0)}
                          </span>
                        </td>
                        <td className="p-3 border text-center">
                          <span className={result?.improvementPercentage && result.improvementPercentage > 0 ? 'text-green-600 font-semibold' : 'text-foreground'}>
                            {result?.improvementPercentage && result.improvementPercentage > 0 ? '+' : ''}{formatNumber(result?.improvementPercentage || 0)}
                          </span>
                        </td>
                        <td className="p-3 border text-center">{formatNumber(result?.tStatistic || 0)}</td>
                        <td className="p-3 border text-center font-semibold">
                          {result?.pValue && result.pValue < 0.001 ? '< 0.001' : formatNumber(result?.pValue || 0, 4)}
                        </td>
                        <td className="p-3 border text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            result?.isSignificant 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {result?.isSignificant ? 'دال' : 'غير دال'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                ملاحظة: * دال إحصائياً عند مستوى 0.05، ** دال عند مستوى 0.01، *** دال عند مستوى 0.001
              </p>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle>شكل (1)</CardTitle>
              </div>
              <CardDescription>
                متوسطات القياسات القبلية والبعدية للمتغيرات المقيسة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart data={chartData} title="" />
            </CardContent>
          </Card>

          {/* Study Info for Report */}
          <Card className="bg-muted/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle>معلومات الدراسة</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">عنوان الدراسة: </span>
                  <span className="font-semibold">{selectedStudyData.titleAr}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">الباحث: </span>
                  <span className="font-semibold">{selectedStudyData.studentNameAr}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">المشرف: </span>
                  <span className="font-semibold">{selectedStudyData.supervisorNameAr}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">القسم: </span>
                  <span className="font-semibold">{selectedStudyData.departmentAr}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">حجم العينة: </span>
                  <span className="font-semibold">{selectedStudyData.participants.length} مشارك</span>
                </div>
                <div>
                  <span className="text-muted-foreground">نوع الدراسة: </span>
                  <span className="font-semibold">{selectedStudyData.studyTypeAr}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedStudyData && statisticalResults.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Table2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              لا توجد بيانات تحليل كافية. يرجى إتمام القياسات والتحليل الإحصائي أولاً.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Link href="/measurements">
                <Button variant="outline">القياسات</Button>
              </Link>
              <Link href="/analysis">
                <Button variant="outline">التحليل الإحصائي</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}