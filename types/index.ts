export interface Participant {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  preMeasurements: Record<string, number>;
  postMeasurements: Record<string, number>;
}

export interface StudyVariable {
  id: string;
  name: string;
  nameAr: string;
  unit: string;
  description?: string;
}

export interface Study {
  id: string;
  title: string;
  titleAr: string;
  studentName: string;
  studentNameAr: string;
  supervisorName: string;
  supervisorNameAr: string;
  institute: string;
  instituteAr: string;
  department: string;
  departmentAr: string;
  sampleSize: number;
  studyType: 'experimental' | 'quasi-experimental' | 'descriptive' | 'correlational';
  studyTypeAr: string;
  programDuration: number; // weeks
  programDurationAr: string;
  notes: string;
  notesAr: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'planning' | 'pre-test' | 'intervention' | 'post-test' | 'analysis' | 'completed';
  variables: StudyVariable[];
  participants: Participant[];
}

export interface StatisticalResult {
  variable: StudyVariable;
  preMean: number;
  postMean: number;
  preStdDev: number;
  postStdDev: number;
  meanDifference: number;
  improvementPercentage: number;
  tStatistic: number;
  pValue: number;
  isSignificant: boolean;
  significanceLevel: number;
}

export interface AnalysisResult {
  studyId: string;
  results: StatisticalResult[];
  analyzedAt: Date;
  analyzedBy: string;
}

export interface User {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
}

export interface TeacherNote {
  id: string;
  studyId: string;
  teacherId: string;
  content: string;
  contentAr: string;
  createdAt: Date;
  updatedAt: Date;
}

export type StudyStatus = Study['status'];
export type StudyType = Study['studyType'];
export type UserRole = User['role'];