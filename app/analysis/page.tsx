'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Calculator, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { analyzeVariable, getSignificanceLabel, interpretPValue, formatNumber } from '@/lib/statistics';
import { getStudyStatusLabel } from '@/lib/mock-data';
import { useApp as useAppContext } from '@/context/AppContext';
import { StatisticalResult } from '@/types';

export default function AnalysisPage() {
  const { studies, setAnalysisResult, getAnalysisResult } = useAppContext();
  const [selectedStudy, setSelectedStudy] = useState<string>('');

  const selectedStudyData = studies.find(s => s.id === selectedStudy);
  const analysisResult = selectedStudy ? getAnalysisResult(selectedStudy) : null;
const statisticalResults = useMemo<StatisticalResult[]>(() => {
  if (!selectedStudyData || selectedStudyData.participants.length === 0) return [];

  return selectedStudyData.variables
    .map((variable): StatisticalResult | null => {
      const preValues = selectedStudyData.participants.map(
        p => p.preMeasurements[variable.name] || 0
      );

      const postValues = selectedStudyData.participants.map(
        p => p.postMeasurements[variable.name] || 0
      );

      const hasValidData =
        preValues.some(v => v !== 0) &&
        postValues.some(v => v !== 0);

      if (!hasValidData) return null;

      return analyzeVariable(variable, preValues, postValues);
    })
    .filter((item): item is StatisticalResult => item !== null);
}, [selectedStudyData]);

  const handleRunAnalysis = () => {
    if (!selectedStudyData || statisticalResults.length === 0) return;
    
    setAnalysisResult(selectedStudyData.id, {
      studyId: selectedStudyData.id,
      results: statisticalResults,
      analyzedAt: new Date(),
      analyzedBy: 'الباحث',
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          العودة للوحة التحكم
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">التحليل الإحصائي</h1>
        <p className="text-muted-foreground">حساب المتوسطات، الانحراف المعياري، واختبار T المقترن</p>
      </div>

      {/* Study Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>اختر الدراسة للتحليل</CardTitle>
          <CardDescription>
            اختر دراسة تحتوي على قياسات قبلية وبعدية مكتملة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
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
              onClick={handleRunAnalysis} 
              disabled={!selectedStudy || statisticalResults.length === 0}
              className="gap-2"
            >
              <Calculator className="w-4 h-4" />
              تشغيل التحليل
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedStudyData && (
        <>
          {/* Sample Info */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">حجم العينة</p>
                  <p className="text-xl font-bold">{selectedStudyData.participants.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المتغيرات</p>
                  <p className="text-xl font-bold">{selectedStudyData.variables.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">نتائج محللة</p>
                  <p className="text-xl font-bold">{analysisResult ? statisticalResults.length : 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          {statisticalResults.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">نتائج التحليل الإحصائي</h2>
              
              {statisticalResults.map((result, index) => (
                <Card key={index} className={result ? '' : 'opacity-50'}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {result?.variable.nameAr}
                          {result?.isSignificant ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                          )}
                        </CardTitle>
                        <CardDescription>
                          {result?.variable.description} - الوحدة: {result?.variable.unit}
                        </CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result?.isSignificant 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {result ? getSignificanceLabel(result.pValue) : 'لا توجد بيانات'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {result ? (
                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600 mb-1">المتوسط القبلي</p>
                            <p className="text-2xl font-bold text-blue-700">
                              {formatNumber(result.preMean)}
                            </p>
                            <p className="text-xs text-blue-500">±{formatNumber(result.preStdDev)}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-600 mb-1">المتوسط البعدي</p>
                            <p className="text-2xl font-bold text-green-700">
                              {formatNumber(result.postMean)}
                            </p>
                            <p className="text-xs text-green-500">±{formatNumber(result.postStdDev)}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs text-purple-600 mb-1">فرق المتوسطات (Δ)</p>
                            <p className="text-2xl font-bold text-purple-700">
                              {formatNumber(result.meanDifference)}
                            </p>
                            <p className="text-xs text-purple-500">
                              {result.improvementPercentage > 0 ? '+' : ''}{formatNumber(result.improvementPercentage)}%
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="p-3 bg-amber-50 rounded-lg">
                            <p className="text-xs text-amber-600 mb-1">قيمة t و p</p>
                            <p className="text-lg font-bold text-amber-700">
                              t = {formatNumber(result.tStatistic)}
                            </p>
                            <p className="text-lg font-bold text-amber-700">
                              p = {result.pValue < 0.001 ? '< 0.001' : formatNumber(result.pValue, 4)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>لا توجد بيانات كافية لهذا المتغير</p>
                      </div>
                    )}

                    {/* Interpretation */}
                    {result && (
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <p className="font-semibold mb-2">التفسير الإحصائي:</p>
                        <p className="text-foreground leading-relaxed">
                          {interpretPValue(result.pValue, result.variable.nameAr)}
                          {result.isSignificant 
                            ? `، مما يدل على وجود تأثير دال للبرنامج التدريبي على ${result.variable.nameAr}.`
                            : `، مما يشير to عدم وجود تأثير دال إحصائياً للبرنامج التدريبي على ${result.variable.nameAr}.`
                          }
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No data message */}
          {selectedStudyData.participants.length > 0 && statisticalResults.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  لا توجد قياسات مكتملة. يرجى تسجيل القياسات القبلية والبعدية للمشاركين أولاً.
                </p>
                <Link href="/measurements">
                  <Button variant="link" className="mt-2">الذهاب لصفحة القياسات</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}