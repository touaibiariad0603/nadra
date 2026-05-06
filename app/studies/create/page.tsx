'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { defaultVariables } from '@/lib/mock-data';
import { generateId } from '@/lib/utils';
import { 
  ArrowLeft, 
  Save, 
  Check,
  FlaskConical,
  User,
  Building2,
  Users,
  Calendar,
  FileText
} from 'lucide-react';
import Link from 'next/link';

const studyTypes = [
  { value: 'experimental', label: 'تجريبي', labelAr: 'تجريبي' },
  { value: 'quasi-experimental', label: 'شبه تجريبي', labelAr: 'شبه تجريبي' },
  { value: 'descriptive', label: 'وصفي', labelAr: 'وصفي' },
  { value: 'correlational', label: 'ارتباطي', labelAr: 'ارتباطي' },
];

export default function CreateStudyPage() {
  const router = useRouter();
  const { createStudy } = useApp();
  
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    studentName: '',
    studentNameAr: '',
    supervisorName: '',
    supervisorNameAr: '',
    institute: 'Institute of Sports Science',
    instituteAr: 'معهد علوم الرياضة',
    department: '',
    departmentAr: '',
    sampleSize: 20,
    studyType: 'experimental' as StudyType,
    studyTypeAr: 'تجريبي',
    programDuration: 8,
    programDurationAr: '8 أسابيع',
    notes: '',
    notesAr: '',
  });

  const [selectedVariables, setSelectedVariables] = useState<string[]>(
    defaultVariables.map(v => v.name)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-update Arabic study type
    if (name === 'studyType') {
      const studyType = studyTypes.find(t => t.value === value);
      if (studyType) {
        setFormData(prev => ({ ...prev, studyTypeAr: studyType.labelAr }));
      }
    }
  };

  const toggleVariable = (varName: string) => {
    setSelectedVariables(prev => 
      prev.includes(varName) 
        ? prev.filter(v => v !== varName)
        : [...prev, varName]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const variables = defaultVariables.filter(v => selectedVariables.includes(v.name));
    
    const newStudy = createStudy({
      ...formData,
      variables,
      status: 'planning' as const,
    });
    
    router.push(`/studies/${newStudy.id}`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          العودة للوحة التحكم
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">إنشاء دراسة جديدة</h1>
        <p className="text-muted-foreground">أدخل بيانات الدراسة الأساسية والمتغيرات المراد قياسها</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <CardTitle>البيانات الأساسية</CardTitle>
              </div>
              <CardDescription>معلومات الدراسة والعينة البحثية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان الدراسة (EN)</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Effect of Training on Performance"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">عنوان الدراسة (AR)</label>
                  <input
                    type="text"
                    name="titleAr"
                    value={formData.titleAr}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="تأثير التدريب على الأداء"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <User className="w-4 h-4 inline ml-1" />
                    اسم الطالب (EN)
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Student Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الطالب (AR)</label>
                  <input
                    type="text"
                    name="studentNameAr"
                    value={formData.studentNameAr}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="اسم الطالب"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم المشرف (EN)</label>
                  <input
                    type="text"
                    name="supervisorName"
                    value={formData.supervisorName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Dr. Supervisor Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">اسم المشرف (AR)</label>
                  <input
                    type="text"
                    name="supervisorNameAr"
                    value={formData.supervisorNameAr}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="د. اسم المشرف"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Building2 className="w-4 h-4 inline ml-1" />
                    القسم (EN)
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Department"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">القسم (AR)</label>
                  <input
                    type="text"
                    name="departmentAr"
                    value={formData.departmentAr}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="القسم"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Users className="w-4 h-4 inline ml-1" />
                    حجم العينة
                  </label>
                  <input
                    type="number"
                    name="sampleSize"
                    value={formData.sampleSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, sampleSize: parseInt(e.target.value) || 0 }))}
                    min="5"
                    max="200"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نوع الدراسة</label>
                  <select
                    name="studyType"
                    value={formData.studyType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {studyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4 inline ml-1" />
                    مدة البرنامج (أسابيع)
                  </label>
                  <input
                    type="number"
                    name="programDuration"
                    value={formData.programDuration}
                    onChange={(e) => {
                      const weeks = parseInt(e.target.value) || 0;
                      setFormData(prev => ({ 
                        ...prev, 
                        programDuration: weeks,
                        programDurationAr: `${weeks} أسابيع`
                      }));
                    }}
                    min="1"
                    max="52"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ملاحظات إضافية</label>
                <textarea
                  name="notesAr"
                  value={formData.notesAr}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="أي ملاحظات إضافية حول الدراسة..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Variables Selection */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                <CardTitle>المتغيرات المراد قياسها</CardTitle>
              </div>
              <CardDescription>اختر المتغيرات التي تريد تضمينها in your study</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {defaultVariables.map((variable) => (
                  <div
                    key={variable.id}
                    onClick={() => toggleVariable(variable.name)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedVariables.includes(variable.name)
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{variable.nameAr}</span>
                      {selectedVariables.includes(variable.name) && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{variable.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">الوحدة: {variable.unit}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard">
              <Button variant="outline" type="button">إلغاء</Button>
            </Link>
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              حفظ وإنشاء الدراسة
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

type StudyType = 'experimental' | 'quasi-experimental' | 'descriptive' | 'correlational';