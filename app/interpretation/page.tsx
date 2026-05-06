'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  BookOpen, 
  Copy, 
  Check,
  FileText,
  Download
} from 'lucide-react';
import { analyzeVariable, interpretPValue, formatNumber } from '@/lib/statistics';
import { getStudyStatusLabel } from '@/lib/mock-data';
import { downloadCSV } from '@/lib/utils';

export default function InterpretationPage() {
  const { studies, getAnalysisResult } = useApp();
  const [selectedStudy, setSelectedStudy] = useState<string>('');
  const [copiedSection, setCopiedSection] = useState<string>('');

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

  // Generate scientific interpretation text
  const generateMethodologySection = () => {
    if (!selectedStudyData) return '';
    
    return `
منهجية الدراسة:

عنوان الدراسة: ${selectedStudyData.titleAr}
الباحث: ${selectedStudyData.studentNameAr}
المشرف: ${selectedStudyData.supervisorNameAr}
القسم: ${selectedStudyData.departmentAr}
المعهد: ${selectedStudyData.instituteAr}

نوع الدراسة: ${selectedStudyData.studyTypeAr}
حجم العينة: ${selectedStudyData.sampleSize} مشارك/مشاركة
مدة البرنامج التدريبي: ${selectedStudyData.programDurationAr}

المتغيرات المقيسة:
${selectedStudyData.variables.map(v => `- ${v.nameAr} (${v.unit}): ${v.description}`).join('\n')}

ملاحظة: ${selectedStudyData.notesAr || 'لا توجد ملاحظات إضافية'}
`.trim();
  };

  const generateResultsSection = () => {
    if (statisticalResults.length === 0) return 'لا توجد نتائج للتحليل';
    
    let text = `
نتائج الدراسة:

تم تحليل بيانات ${selectedStudyData?.participants.length} مشاركاً باستخدام الاختبار التائي للعينات المرتبطة (Paired T-Test) لمقارنة الفروق بين القياسات القبلية والبعدية.

`;

    statisticalResults.forEach(result => {
      if (result) {
        text += `
1. متغير ${result.variable.nameAr}:
   - المتوسط القبلي: ${formatNumber(result.preMean)} ± ${formatNumber(result.preStdDev)}
   - المتوسط البعدي: ${formatNumber(result.postMean)} ± ${formatNumber(result.postStdDev)}
   - فرق المتوسطات: ${formatNumber(result.meanDifference)} (${result.improvementPercentage > 0 ? '+' : ''}${formatNumber(result.improvementPercentage)}%)
   - قيمة t: ${formatNumber(result.tStatistic)}
   - قيمة p: ${result.pValue < 0.001 ? '< 0.001' : formatNumber(result.pValue, 4)}
   - الدلالة الإحصائية: ${result.isSignificant ? 'دال إحصائياً' : 'غير دال إحصائياً'}

   ${interpretPValue(result.pValue, result.variable.nameAr)}
`;
      }
    });

    return text;
  };

  const generateDiscussionSection = () => {
    if (statisticalResults.length === 0) return '';
    
    const significantVars = statisticalResults.filter(r => r?.isSignificant);
    const nonSignificantVars = statisticalResults.filter(r => !r?.isSignificant);
    
    let text = `
مناقشة النتائج:

`;

    if (significantVars.length > 0) {
      text += `أظهرت النتائج وجود فروق دالة إحصائياً بين القياس القبلي والبعدي في المتغيرات التالية:
${significantVars.map(r => `- ${r?.variable.nameAr}`).join('\n')}

وهذه النتيجة تدعم فرضية الدراسة التي توقعت وجود تأثير دال للبرنامج التدريبي على هذه المتغيرات. يمكن تفسير هذه التحسينات من خلال التكيفات الفسيولوجية والعصبية التي تحدث استجابة للبرنامج التدريبي المنظم.

`;
    }

    if (nonSignificantVars.length > 0) {
      text += `أما المتغيرات التي لم تظهر فروقاً دالة إحصائياً فهي:
${nonSignificantVars.map(r => `- ${r?.variable.nameAr}`).join('\n')}

وقد يعزى ذلك إلى قصر مدة البرنامج التدريبي أو عدم كفاية شدة التدريب لإحداث تغييرات دالة in these variables.

`;
    }

    text += `
التوصيات:
1. التوصية بتطبيق البرنامج التدريبي المشابه على فئات مماثلة من السكان
2. إجراء دراسات مستقبلية بفترات تدريبية أطول
3. دراسة تأثير متغيرات تدريبية أخرى على نفس المتغيرات
4. تطبيق البرنامج على عينات أكبر لزيادة قوة الدراسة الإحصائية

الخلاصة:
${significantVars.length > 0 
  ? 'أثبت البرنامج التدريبي فعاليته في تحسين المتغيرات المقيسة، مما يدعم استخدامه كوسيلة فعالة لتطوير الأداء.'
  : 'لم يظهر البرنامج التدريبي تأثيراً دالاً على معظم المتغيرات، مما يستدعي مراجعة شدة ومدة البرنامج.'
}
`;

    return text;
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(''), 2000);
  };

  const exportToCSV = () => {
    if (statisticalResults.length === 0) return;
    
    const headers = ['المتغير', 'المتوسط القبلي', 'الانحراف القبلي', 'المتوسط البعدي', 'الانحراف البعدي', 'فرق المتوسطات', 'نسبة التحسن', 'قيمة t', 'قيمة p', 'الدلالة'];
    const data = statisticalResults.map(r => [
      r?.variable.nameAr || '',
      formatNumber(r?.preMean || 0),
      formatNumber(r?.preStdDev || 0),
      formatNumber(r?.postMean || 0),
      formatNumber(r?.postStdDev || 0),
      formatNumber(r?.meanDifference || 0),
      formatNumber(r?.improvementPercentage || 0) + '%',
      formatNumber(r?.tStatistic || 0),
      r?.pValue != null
  ? (r.pValue < 0.001 ? '< 0.001' : formatNumber(r.pValue, 4))
  : 'N/A',
      r?.isSignificant ? 'دال' : 'غير دال'
    ]);
    
    downloadCSV([headers, ...data], `analysis_${selectedStudy}`);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          العودة للوحة التحكم
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">التفسير العلمي</h1>
        <p className="text-muted-foreground">نصوص أكاديمية جاهزة للفصل الرابع والمناقشة</p>
      </div>

      {/* Study Selection */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>اختر الدراسة</CardTitle>
              <CardDescription>اختر دراسة لعرض التفسير العلمي لنتائجها</CardDescription>
            </div>
            {statisticalResults.length > 0 && (
              <Button variant="outline" onClick={exportToCSV} className="gap-2">
                <Download className="w-4 h-4" />
                تصدير CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <select
            value={selectedStudy}
            onChange={(e) => setSelectedStudy(e.target.value)}
            className="w-full md:w-96 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- اختر دراسة --</option>
            {studies.filter(s => s.participants.length > 0).map(study => (
              <option key={study.id} value={study.id}>
                {study.titleAr} - {study.studentNameAr} ({getStudyStatusLabel(study.status)})
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {selectedStudyData && statisticalResults.length > 0 && (
        <div className="space-y-8">
          {/* Methodology Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle>منهجية الدراسة</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generateMethodologySection(), 'methodology')}
                  className="gap-2"
                >
                  {copiedSection === 'methodology' ? (
                    <><Check className="w-4 h-4" /> تم النسخ</>
                  ) : (
                    <><Copy className="w-4 h-4" /> نسخ</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed p-4 bg-muted/30 rounded-lg">
                {generateMethodologySection()}
              </pre>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <CardTitle>نتائج الدراسة</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generateResultsSection(), 'results')}
                  className="gap-2"
                >
                  {copiedSection === 'results' ? (
                    <><Check className="w-4 h-4" /> تم النسخ</>
                  ) : (
                    <><Copy className="w-4 h-4" /> نسخ</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed p-4 bg-muted/30 rounded-lg">
                {generateResultsSection()}
              </pre>
            </CardContent>
          </Card>

          {/* Discussion Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <CardTitle>مناقشة النتائج والتوصيات</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generateDiscussionSection(), 'discussion')}
                  className="gap-2"
                >
                  {copiedSection === 'discussion' ? (
                    <><Check className="w-4 h-4" /> تم النسخ</>
                  ) : (
                    <><Copy className="w-4 h-4" /> نسخ</>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed p-4 bg-muted/30 rounded-lg">
                {generateDiscussionSection()}
              </pre>
            </CardContent>
          </Card>

          {/* Export Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">نصائح للاستخدام</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• يمكنك نسخ أي قسم ولصقه مباشرة في رسالة البحث</li>
                    <li>• قم بمراجعة النصوص وتعديلها حسب احتياجاتك الأكاديمية</li>
                    <li>• استخدم قسم تصدير CSV للحصول على الجداول في formato جدول</li>
                    <li>• راجع مع مشرفك التعديلات المطلوبة قبل الاعتماد النهائي</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedStudyData && statisticalResults.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              لا توجد نتائج تحليل لهذه الدراسة. يرجى إجراء التحليل الإحصائي أولاً.
            </p>
            <Link href="/analysis">
              <Button variant="link" className="mt-2">الذهاب للتحليل الإحصائي</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}