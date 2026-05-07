import type { Study, Participant, StudyVariable, User } from '@/types';
import { generateId } from './utils';

// Default study variables for sports science
export const defaultVariables: StudyVariable[] = [
  {
    id: "var-speed",
    name: "speed",
    nameAr: "السرعة",
    unit: "ثانية",
    description: "اختبار السرعة 50 متر",
  },
  {
    id: "var-strength",
    name: "strength",
    nameAr: "القوة",
    unit: "عدد التكرارات",
    description: "اختبار قوة العضلات",
  },
  {
    id: "var-endurance",
    name: "endurance",
    nameAr: "التحمل",
    unit: "دقيقة",
    description: "اختبار التحمل القلبي التنفسي",
  },
  {
    id: "var-flexibility",
    name: "flexibility",
    nameAr: "المرونة",
    unit: "سم",
    description: "اختبار الجلوس ومد الذراعين",
  },
  {
    id: "var-balance",
    name: "balance",
    nameAr: "التوازن",
    unit: "ثانية",
    description: "اختبار التوازن",
  },
  {
    id: "var-bmi",
    name: "bmi",
    nameAr: "مؤشر كتلة الجسم",
    unit: "كغ/م²",
    description: "مؤشر كتلة الجسم",
  },
  {
    id: "var-arm-circumference",
    name: "armCircumference",
    nameAr: "محيط الذراع",
    unit: "سم",
    description: "قياس محيط الذراع قبل وبعد البرنامج",
  },
  {
    id: "var-thigh-circumference",
    name: "thighCircumference",
    nameAr: "محيط الفخذ",
    unit: "سم",
    description: "قياس محيط الفخذ قبل وبعد البرنامج",
  },
  {
    id: "var-waist-circumference",
    name: "waistCircumference",
    nameAr: "محيط الخصر",
    unit: "سم",
    description: "قياس محيط الخصر قبل وبعد البرنامج",
  },
  {
    id: "var-hip-circumference",
    name: "hipCircumference",
    nameAr: "محيط الورك",
    unit: "سم",
    description: "قياس محيط الورك قبل وبعد البرنامج",
  },
];

// Generate random participant data
function generateParticipant(variables: StudyVariable[], index: number): Participant {
  const gender = index % 3 === 0 ? 'female' : 'male';
  const baseAge = gender === 'female' ? 19 : 20;
  
  const preMeasurements: Record<string, number> = {};
  const postMeasurements: Record<string, number> = {};
  
  variables.forEach((variable) => {
    let baseValue: number;
    let variation: number;
    let improvement: number;
    
    switch (variable.name) {
      case 'speed':
        // Lower is better for speed (time in seconds)
        baseValue = 7.5 + Math.random() * 1.5;
        variation = (Math.random() - 0.5) * 0.3;
        improvement = -(0.1 + Math.random() * 0.4); // Negative = faster
        break;
      case 'strength':
        baseValue = 15 + Math.random() * 10;
        variation = (Math.random() - 0.5) * 3;
        improvement = 2 + Math.random() * 5;
        break;
      case 'endurance':
        baseValue = 8 + Math.random() * 6;
        variation = (Math.random() - 0.5) * 2;
        improvement = 1 + Math.random() * 4;
        break;
      case 'flexibility':
        baseValue = 15 + Math.random() * 10;
        variation = (Math.random() - 0.5) * 3;
        improvement = 2 + Math.random() * 5;
        break;
      case 'bmi':
        baseValue = 22 + Math.random() * 6;
        variation = (Math.random() - 0.5) * 1;
        improvement = (Math.random() - 0.5) * 1.5; // Can go either way
        break;
      case "balance":
  baseValue = 20 + Math.random() * 20;
  variation = (Math.random() - 0.5) * 4;
  improvement = 2 + Math.random() * 8;
  break;

case "armCircumference":
  baseValue = 25 + Math.random() * 8;
  variation = (Math.random() - 0.5) * 2;
  improvement = 0.5 + Math.random() * 2;
  break;

case "thighCircumference":
  baseValue = 45 + Math.random() * 10;
  variation = (Math.random() - 0.5) * 2;
  improvement = 0.5 + Math.random() * 2.5;
  break;

case "waistCircumference":
  baseValue = 70 + Math.random() * 15;
  variation = (Math.random() - 0.5) * 3;
  improvement = -(1 + Math.random() * 4);
  break;

case "hipCircumference":
  baseValue = 85 + Math.random() * 15;
  variation = (Math.random() - 0.5) * 3;
  improvement = -(0.5 + Math.random() * 3);
  break;  
      default:
        baseValue = 50;
        variation = 5;
        improvement = 2;
    }
    
    preMeasurements[variable.name] = Math.round((baseValue + variation) * 100) / 100;
    postMeasurements[variable.name] = Math.round((baseValue + variation + improvement) * 100) / 100;
  });
  
  return {
    id: generateId(),
    name: `مشارك ${index + 1}`,
    age: baseAge + Math.floor(Math.random() * 4),
    gender,
    preMeasurements,
    postMeasurements,
  };
}

// Generate mock studies
export function generateMockStudies(): Study[] {
  const studies: Study[] = [
    {
      id: 'study-1',
      title: 'Effect of Plyometric Training on Speed and Power',
      titleAr: 'تأثير التدريب البليومتري على السرعة والقوة',
      studentName: 'Ahmed Mohammed',
      studentNameAr: 'أحمد محمد',
      supervisorName: 'Dr. Fatima Al-Zahra',
      supervisorNameAr: 'د. فاطمة الزهراء',
      institute: 'Institute of Sports Science',
      instituteAr: 'معهد علوم الرياضة',
      department: 'Athletic Training',
      departmentAr: 'التدريب الرياضي',
      sampleSize: 20,
      studyType: 'experimental',
      studyTypeAr: 'تجريبي',
      programDuration: 8,
      programDurationAr: '8 أسابيع',
      notes: 'Study on university athletes',
      notesAr: 'دراسة على لاعبين جامعيين',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-15'),
      status: 'completed',
      variables: defaultVariables,
      participants: Array.from({ length: 20 }, (_, i) => generateParticipant(defaultVariables, i)),
    },
    {
      id: 'study-2',
      title: 'Impact of Endurance Training on Cardiovascular Fitness',
      titleAr: 'تأثير تدريب التحمل على اللياقة القلبية التنفسية',
      studentName: 'Sara Ibrahim',
      studentNameAr: 'سارة إبراهيم',
      supervisorName: 'Dr. Hassan Al-Masri',
      supervisorNameAr: 'د. حسن المصري',
      institute: 'Institute of Sports Science',
      instituteAr: 'معهد علوم الرياضة',
      department: 'Exercise Physiology',
      departmentAr: 'فسيولوجيا الرياضة',
      sampleSize: 15,
      studyType: 'quasi-experimental',
      studyTypeAr: 'شبه تجريبي',
      programDuration: 12,
      programDurationAr: '12 أسبوعاً',
      notes: 'Study on sedentary adults',
      notesAr: 'دراسة على بالغين خاملين',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-04-20'),
      status: 'post-test',
      variables: defaultVariables.filter(v => ['endurance', 'bmi', 'flexibility'].includes(v.name)),
      participants: Array.from({ length: 15 }, (_, i) => generateParticipant(defaultVariables.filter(v => ['endurance', 'bmi', 'flexibility'].includes(v.name)), i)),
    },
    {
      id: 'study-3',
      title: 'Flexibility Program for Adolescent Athletes',
      titleAr: 'برنامج المرونة للاعبين المراهقين',
      studentName: 'Omar Khalil',
      studentNameAr: 'عمر خليل',
      supervisorName: 'Dr. Aisha Al-Rashid',
      supervisorNameAr: 'د. عائشة الراشد',
      institute: 'Institute of Sports Science',
      instituteAr: 'معهد علوم الرياضة',
      department: 'Sports Rehabilitation',
      departmentAr: 'إعادة التأهيل الرياضي',
      sampleSize: 25,
      studyType: 'experimental',
      studyTypeAr: 'تجريبي',
      programDuration: 6,
      programDurationAr: '6 أسابيع',
      notes: 'Focus on hamstring and hip flexibility',
      notesAr: 'التركيز على مرونة أوتار الركبة والورك',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-04-01'),
      status: 'pre-test',
      variables: defaultVariables.filter(v => ['flexibility', 'strength'].includes(v.name)),
      participants: Array.from({ length: 25 }, (_, i) => generateParticipant(defaultVariables.filter(v => ['flexibility', 'strength'].includes(v.name)), i)),
    },
    {
      id: 'study-4',
      title: 'Strength Training Effects on Body Composition',
      titleAr: 'تأثيرات تدريب القوة على تكوين الجسم',
      studentName: 'Mariam Abdullah',
      studentNameAr: 'مريم عبدالله',
      supervisorName: 'Dr. Khaled Al-Nasser',
      supervisorNameAr: 'د. خالد الناصر',
      institute: 'Institute of Sports Science',
      instituteAr: 'معهد علوم الرياضة',
      department: 'Sports Nutrition',
      departmentAr: 'التغذية الرياضية',
      sampleSize: 18,
      studyType: 'experimental',
      studyTypeAr: 'تجريبي',
      programDuration: 10,
      programDurationAr: '10 أسابيع',
      notes: 'Combined with nutritional intervention',
      notesAr: 'بالإضافة إلى التدخل الغذائي',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-03-25'),
      status: 'intervention',
      variables: defaultVariables.filter(v => ['strength', 'bmi'].includes(v.name)),
      participants: Array.from({ length: 18 }, (_, i) => generateParticipant(defaultVariables.filter(v => ['strength', 'bmi'].includes(v.name)), i)),
    },
    {
      id: 'study-5',
      title: 'Speed and Agility Development in Young Athletes',
      titleAr: 'تطوير السرعة والخفة لدى اللاعبين الصغار',
      studentName: 'Youssef Hassan',
      studentNameAr: 'يوسف حسن',
      supervisorName: 'Dr. Nadia Al-Sayed',
      supervisorNameAr: 'د. نادية السيد',
      institute: 'Institute of Sports Science',
      instituteAr: 'معهد علوم الرياضة',
      department: 'Athletic Training',
      departmentAr: 'التدريب الرياضي',
      sampleSize: 22,
      studyType: 'experimental',
      studyTypeAr: 'تجريبي',
      programDuration: 8,
      programDurationAr: '8 أسابيع',
      notes: 'Focus on football players aged 14-16',
      notesAr: 'التركيز على لاعبي كرة القدم aged 14-16',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-20'),
      status: 'planning',
      variables: defaultVariables.filter(v => ['speed', 'strength'].includes(v.name)),
      participants: [],
    },
  ];
  
  return studies;
}

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    nameAr: 'المستخدم الإداري',
    email: 'admin@researchfit.edu',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-2',
    name: 'Dr. Fatima Al-Zahra',
    nameAr: 'د. فاطمة الزهراء',
    email: 'fatima@researchfit.edu',
    role: 'teacher',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'user-3',
    name: 'Dr. Hassan Al-Masri',
    nameAr: 'د. حسن المصري',
    email: 'hassan@researchfit.edu',
    role: 'teacher',
    createdAt: new Date('2024-01-01'),
  },
];

// Get study status label in Arabic
export function getStudyStatusLabel(status: Study['status']): string {
  const labels: Record<Study['status'], string> = {
    'planning': 'التخطيط',
    'pre-test': 'القياس القبلي',
    'intervention': 'البرنامج التدريبي',
    'post-test': 'القياس البعدي',
    'analysis': 'التحليل الإحصائي',
    'completed': 'مكتمل',
  };
  return labels[status];
}

// Get study type label in Arabic
export function getStudyTypeLabel(type: Study['studyType']): string {
  const labels: Record<Study['studyType'], string> = {
    'experimental': 'تجريبي',
    'quasi-experimental': 'شبه تجريبي',
    'descriptive': 'وصفي',
    'correlational': 'ارتباطي',
  };
  return labels[type];
}