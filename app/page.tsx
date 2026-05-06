'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  Calculator, 
  Download,
  BookOpen,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Microscope,
  Database
} from 'lucide-react';

const problems = [
  {
    icon: AlertCircle,
    title: 'صعوبة تنظيم بيانات القياسات',
    description: 'تشتت البيانات بين الملفات الورقية والإلكترونية يصعب عملية التنظيم',
  },
  {
    icon: Clock,
    title: 'ضياع نتائج القياس القبلي/البعدي',
    description: 'فقدان البيانات أثناء فترة البرنامج التدريبي يؤدي إلى إهدار الجهد',
  },
  {
    icon: Calculator,
    title: 'أخطاء في الحسابات الإحصائية',
    description: 'الحسابات اليدوية المعقدة تزيد من احتمالية الخطأ البشري',
  },
  {
    icon: FileText,
    title: 'صعوبة تفسير النتائج',
    description: 'تحويل الأرقام إلى نصوص أكاديمية علمية يتطلب وقتاً وجهداً كبيراً',
  },
  {
    icon: Clock,
    title: 'إهدار الوقت في إعداد جداول الفصل الرابع',
    description: 'تنسيق الجداول والأشكال وفق المعايير الأكاديمية يستغرق ساعات',
  },
];

const features = [
  {
    icon: Database,
    title: 'إدارة شاملة للدراسات',
    description: 'إنشاء ومتابعة الدراسات من التخطيط حتى التحليل النهائي',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Target,
    title: 'قياسات دقيقة ومنظمة',
    description: 'تسجيل القياسات القبلية والبعدية في جداول ديناميكية',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Calculator,
    title: 'تحليل إحصائي تلقائي',
    description: 'حساب المتوسطات، الانحراف المعياري، واختبار T المقترن',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: BookOpen,
    title: 'تفسير علمي بالعربية',
    description: 'توليد نصوص أكاديمية جاهزة للمناقشة والفصل الرابع',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    icon: Download,
    title: 'تصدير احترافي',
    description: 'جداول وأشكال جاهزة للطباعة وفق المعايير الأكاديمية',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    icon: Users,
    title: 'لوحة معلم ومتابعة',
    description: 'متابعة تقدم الطلاب وتقييم الدراسات',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
];

const stats = [
  { label: 'دراسة مكتملة', value: '5+', icon: CheckCircle2 },
  { label: 'مشارك في الدراسات', value: '100+', icon: Users },
  { label: 'متغير مقاس', value: '25+', icon: BarChart3 },
  { label: 'ساعة موفرة', value: '50+', icon: Clock },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Nadra ResearchFit</h1>
              <p className="text-xs text-muted-foreground">منصة البحث الرياضي</p>
            </div>
          </div>
          <nav className="flex items-center gap-4">
        <Link href="/login">
            <Button variant="ghost">تسجيل الدخول</Button>
            </Link>
            <Link href="/register">
           <Button>إنشاء حساب</Button>
        </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <GraduationCap className="w-4 h-4" />
            <span className="text-sm font-medium">هدية لمعهد علوم الرياضة والنشاط البدني</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            من القياس إلى المناقشة...
            <br />
            <span className="text-primary">بحثك الرياضي منظّم علمياً</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            منصة أكاديمية شاملة تساعد الطلاب والباحثين على إدارة الدراسات الميدانية 
            baseada على قياسات قبلية وبعدية، مع تحليل إحصائي تلقائي وتفسير علمي جاهز.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                ابدأ البحث الآن
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                اكتشف الميزات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-none shadow-md">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Problems Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-4">المشاكل التي نحلها</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نعلم جيداً التحديات التي تواجهها في البحوث الميدانية، ولذلك صممنا هذه المنصة خصيصاً لك
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <Card key={index} className="border-r-4 border-r-danger/50">
              <CardHeader>
                <problem.icon className="w-8 h-8 text-danger mb-2" />
                <CardTitle className="text-lg">{problem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{problem.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-4">ميزات المنصة</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            كل ما تحتاجه لإتمام بحثك الرياضي بشكل احترافي ومنظم
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-4">كيف تعمل المنصة؟</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            رحلة بحثك من البداية حتى النهاية في خطوات بسيطة
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block"></div>
            
            <div className="space-y-8">
              {[
                { step: '01', title: 'إنشاء دراسة جديدة', description: 'أدخل بيانات الدراسة الأساسية وحدد المتغيرات التي تريد قياسها' },
                { step: '02', title: 'تسجيل القياسات القبلية', description: 'أدخل نتائج الاختبارات القبلية لجميع المشاركين في الدراسة' },
                { step: '03', title: 'تنفيذ البرنامج التدريبي', description: 'نفذ البرنامج التدريبي أو التدخل البحثي حسب خطة الدراسة' },
                { step: '04', title: 'تسجيل القياسات البعدية', description: 'سجل نتائج الاختبارات البعدية بعد انتهاء فترة البرنامج' },
                { step: '05', title: 'التحليل الإحصائي', description: 'احصل على تحليل إحصائي تلقائي شامل مع قيم p و t' },
                { step: '06', title: 'التفسير والتصدير', description: 'احصل على نصوص تفسيرية جاهزة وصدّر الجداول للفصل الرابع' },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shrink-0 z-10">
                    {item.step}
                  </div>
                  <div className="flex-1 pt-2">
                    <h4 className="text-xl font-bold text-foreground mb-2">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="gradient-primary text-white max-w-4xl mx-auto text-center">
          <CardContent className="p-12">
            <h3 className="text-3xl font-bold mb-4">جاهز لبدء بحثك الرياضي؟</h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              انضم إلى الباحثين الذين يستخدمون منصة Nadra ResearchFit 
              لتنظيم وتحليل دراساتهم الميدانية بشكل احترافي
            </p>
           <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                ابدأ الآن مجاناً
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Microscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">Nadra ResearchFit</h4>
                <p className="text-xs text-muted-foreground">منصة البحث الرياضي الأكاديمي</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              هدية لمعهد علوم الرياضة والنشاط البدني - صُممت بحب ❤️
            </p>
            <p className="text-sm text-muted-foreground">
              © 2026 جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}