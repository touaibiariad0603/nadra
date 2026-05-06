'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Eye,
  MessageSquare
} from 'lucide-react';
import { getStudyStatusLabel, getStudyTypeLabel } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function TeacherDashboardPage() {
  const { studies } = useApp();
  const [selectedStudy, setSelectedStudy] = useState<string>('');

  const selectedStudyData = studies.find(s => s.id === selectedStudy);

  // Group studies by student
  const studiesByStudent = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    studies.forEach(study => {
      const key = study.studentNameAr;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(study);
    });
    return grouped;
  }, [studies]);

  // Calculate completion stats
  const completionStats = useMemo(() => {
    const total = studies.length;
    const completed = studies.filter(s => s.status === 'completed').length;
    const inProgress = studies.filter(s => ['pre-test', 'intervention', 'post-test', 'analysis'].includes(s.status)).length;
    const planning = studies.filter(s => s.status === 'planning').length;
    
    return { total, completed, inProgress, planning };
  }, [studies]);

  // Studies needing attention
  const needsAttention = useMemo(() => {
    return studies.filter(s => 
      s.status === 'post-test' && s.participants.length > 0 &&
      s.participants.some(p => 
        Object.values(p.postMeasurements).some(v => v === 0)
      )
    );
  }, [studies]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          العودة للوحة التحكم
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">لوحة المعلم</h1>
        <p className="text-muted-foreground">متابعة تقدم الطلاب وتقييم الدراسات</p>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الدراسات</p>
              <p className="text-2xl font-bold">{completionStats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">مكتملة</p>
              <p className="text-2xl font-bold text-green-600">{completionStats.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-amber-600">{completionStats.inProgress}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الطلاب</p>
              <p className="text-2xl font-bold">{Object.keys(studiesByStudent).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {needsAttention.length > 0 && (
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <CardTitle className="text-amber-900">دراسات تحتاج متابعة</CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              هذه الدراسات لديها قياسات غير مكتملة وتحتاج إلى تدخل
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {needsAttention.map(study => (
                <div key={study.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-semibold">{study.titleAr}</p>
                    <p className="text-sm text-muted-foreground">{study.studentNameAr}</p>
                  </div>
                  <Link href={`/studies/${study.id}`}>
                    <Button variant="outline" size="sm">متابعة</Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Students List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>قائمة الطلاب</CardTitle>
              <CardDescription>الطلاب والمشرف عليهم</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(studiesByStudent).map(([studentName, studentStudies]) => (
                  <div key={studentName} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{studentName}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {studentStudies.length} دراسة
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {studentStudies.map(study => (
                        <span 
                          key={study.id}
                          className={`text-xs px-2 py-0.5 rounded ${
                            study.status === 'completed' 
                              ? 'bg-green-100 text-green-700'
                              : study.status === 'planning'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {getStudyStatusLabel(study.status)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>تفاصيل الدراسات</CardTitle>
                  <CardDescription>
                    {selectedStudyData 
                      ? `عرض تفاصيل دراسة: ${selectedStudyData.titleAr}`
                      : 'اختر دراسة لعرض التفاصيل'
                    }
                  </CardDescription>
                </div>
                {selectedStudyData && (
                  <Link href={`/studies/${selectedStudyData.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 ml-2" />
                      عرض كامل
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <select
                value={selectedStudy}
                onChange={(e) => setSelectedStudy(e.target.value)}
                className="w-full mb-6 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- اختر دراسة --</option>
                {studies.map(study => (
                  <option key={study.id} value={study.id}>
                    {study.titleAr} - {study.studentNameAr}
                  </option>
                ))}
              </select>

              {selectedStudyData ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">عنوان الدراسة</p>
                      <p className="font-semibold">{selectedStudyData.titleAr}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">الباحث</p>
                      <p className="font-semibold">{selectedStudyData.studentNameAr}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">المشرف</p>
                      <p className="font-semibold">{selectedStudyData.supervisorNameAr}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">نوع الدراسة</p>
                      <p className="font-semibold">{getStudyTypeLabel(selectedStudyData.studyType)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">حجم العينة</p>
                      <p className="font-semibold">{selectedStudyData.sampleSize}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">مدة البرنامج</p>
                      <p className="font-semibold">{selectedStudyData.programDurationAr}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">مرحلة الدراسة الحالية</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedStudyData.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : selectedStudyData.status === 'analysis'
                        ? 'bg-purple-100 text-purple-700'
                        : selectedStudyData.status === 'post-test'
                        ? 'bg-blue-100 text-blue-700'
                        : selectedStudyData.status === 'intervention'
                        ? 'bg-amber-100 text-amber-700'
                        : selectedStudyData.status === 'pre-test'
                        ? 'bg-cyan-100 text-cyan-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {getStudyStatusLabel(selectedStudyData.status)}
                    </span>
                  </div>

                  {/* Participants Progress */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">تقدم المشاركين</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ 
                            width: `${selectedStudyData.participants.length > 0 
                              ? (selectedStudyData.participants.filter(p => 
                                  Object.values(p.preMeasurements).every(v => v > 0) &&
                                  Object.values(p.postMeasurements).every(v => v > 0)
                                ).length / selectedStudyData.participants.length) * 100 
                              : 0}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {selectedStudyData.participants.filter(p => 
                          Object.values(p.preMeasurements).every(v => v > 0) &&
                          Object.values(p.postMeasurements).every(v => v > 0)
                        ).length} / {selectedStudyData.participants.length}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      مشاركون أكملوا القياسات القبلية والبعدية
                    </p>
                  </div>

                  {/* Notes */}
                  {selectedStudyData.notesAr && (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">ملاحظات</p>
                      <p className="text-foreground">{selectedStudyData.notesAr}</p>
                    </div>
                  )}

                  {/* Teacher Actions */}
                  <div className="flex gap-4 pt-4 border-t">
                    <Button variant="outline" className="gap-2">
                      <MessageSquare className="w-4 h-4" />
                      إضافة ملاحظة
                    </Button>
                    <Link href={`/export/${selectedStudyData.id}`}>
                      <Button className="gap-2">
                        تصدير التقرير
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>اختر دراسة من القائمة أعلاه لعرض التفاصيل</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}