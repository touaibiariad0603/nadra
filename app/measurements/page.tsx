'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Users,
  Download,
  Upload
} from 'lucide-react';
import { generateId } from '@/lib/utils';
import { getStudyStatusLabel } from '@/lib/mock-data';

export default function MeasurementsPage() {
  const { studies, addParticipant, updateParticipant, removeParticipant } = useApp();
  const [selectedStudy, setSelectedStudy] = useState<string>('');
  const [newParticipantName, setNewParticipantName] = useState('');
  const [newParticipantAge, setNewParticipantAge] = useState(20);
  const [newParticipantGender, setNewParticipantGender] = useState<'male' | 'female'>('male');

  const selectedStudyData = studies.find(s => s.id === selectedStudy);

  const handleAddParticipant = () => {
    if (!selectedStudyData || !newParticipantName) return;
    
    const preMeasurements: Record<string, number> = {};
    const postMeasurements: Record<string, number> = {};
    
    selectedStudyData.variables.forEach(v => {
      preMeasurements[v.name] = 0;
      postMeasurements[v.name] = 0;
    });

    addParticipant(selectedStudyData.id, {
      id: generateId(),
      name: newParticipantName,
      age: newParticipantAge,
      gender: newParticipantGender,
      preMeasurements,
      postMeasurements,
    });

    setNewParticipantName('');
  };

  const handleMeasurementChange = (
    participantId: string, 
    variableName: string, 
    measurementType: 'pre' | 'post',
    value: number
  ) => {
    if (!selectedStudyData) return;
    
    const participant = selectedStudyData.participants.find(p => p.id === participantId);
    if (!participant) return;

    const updatedParticipant = {
      ...participant,
      [measurementType === 'pre' ? 'preMeasurements' : 'postMeasurements']: {
        ...participant[measurementType === 'pre' ? 'preMeasurements' : 'postMeasurements'],
        [variableName]: value,
      },
    };

    updateParticipant(selectedStudyData.id, updatedParticipant);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          العودة للوحة التحكم
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">تسجيل القياسات</h1>
        <p className="text-muted-foreground">إدارة المشاركين وتسجيل القياسات القبلية والبعدية</p>
      </div>

      {/* Study Selection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>اختر الدراسة</CardTitle>
          <CardDescription>اختر الدراسة التي تريد تسجيل القياسات لها</CardDescription>
        </CardHeader>
        <CardContent>
          <select
            value={selectedStudy}
            onChange={(e) => setSelectedStudy(e.target.value)}
            className="w-full md:w-96 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- اختر دراسة --</option>
            {studies.map(study => (
              <option key={study.id} value={study.id}>
                {study.titleAr} - {study.studentNameAr} ({getStudyStatusLabel(study.status)})
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {selectedStudyData && (
        <>
          {/* Add Participant */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>إضافة مشارك جديد</CardTitle>
                  <CardDescription>أضف مشارك جديد للدراسة: {selectedStudyData.titleAr}</CardDescription>
                </div>
                <span className="text-sm text-muted-foreground">
                  عدد المشاركين: {selectedStudyData.participants.length} / {selectedStudyData.sampleSize}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium mb-2">اسم المشارك</label>
                  <input
                    type="text"
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="اسم المشارك"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium mb-2">العمر</label>
                  <input
                    type="number"
                    value={newParticipantAge}
                    onChange={(e) => setNewParticipantAge(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="10"
                    max="80"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium mb-2">الجنس</label>
                  <select
                    value={newParticipantGender}
                    onChange={(e) => setNewParticipantGender(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <Button onClick={handleAddParticipant} disabled={!newParticipantName.trim()}>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Participants Table */}
          <Card>
            <CardHeader>
              <CardTitle>جدول القياسات</CardTitle>
              <CardDescription>
                المتغيرات: {selectedStudyData.variables.map(v => v.nameAr).join('، ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedStudyData.participants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا يوجد مشاركون بعد</p>
                  <p className="text-sm mt-2">أضف مشاركين باستخدام النموذج أعلاه</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-right font-semibold">المشارك</th>
                        <th className="p-3 text-right font-semibold">العمر</th>
                        <th className="p-3 text-right font-semibold">الجنس</th>
                        {selectedStudyData.variables.map(variable => (
                          <th key={variable.id} colSpan={2} className="p-3 text-center font-semibold border-r">
                            {variable.nameAr} ({variable.unit})
                          </th>
                        ))}
                        <th className="p-3 text-center font-semibold">إجراءات</th>
                      </tr>
                      <tr className="border-b bg-muted/30">
                        <th className="p-2"></th>
                        <th className="p-2"></th>
                        <th className="p-2"></th>
                        {selectedStudyData.variables.map(variable => (
                          <th key={variable.id} className="p-2 text-center text-xs border-r">
                            <span className="text-blue-600">قبلي</span>
                          </th>
                        ))}
                        {selectedStudyData.variables.map(variable => (
                          <th key={variable.id} className="p-2 text-center text-xs border-r">
                            <span className="text-green-600">بعدي</span>
                          </th>
                        ))}
                        <th className="p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudyData.participants.map((participant) => (
                        <tr key={participant.id} className="border-b hover:bg-muted/30">
                          <td className="p-2">
                            <input
                              type="text"
                              value={participant.name}
                              onChange={(e) => {
                                const updated = { ...participant, name: e.target.value };
                                updateParticipant(selectedStudyData.id, updated);
                              }}
                              className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </td>
                          <td className="p-2 text-center">{participant.age}</td>
                          <td className="p-2 text-center">{participant.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                          {selectedStudyData.variables.map(variable => (
                            <td key={`${participant.id}-${variable.name}-pre`} className="p-2 border-r">
                              <input
                                type="number"
                                step="0.01"
                                value={participant.preMeasurements[variable.name] || ''}
                                onChange={(e) => handleMeasurementChange(
                                  participant.id,
                                  variable.name,
                                  'pre',
                                  parseFloat(e.target.value) || 0
                                )}
                                className="w-20 px-2 py-1 border rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0"
                              />
                            </td>
                          ))}
                          {selectedStudyData.variables.map(variable => (
                            <td key={`${participant.id}-${variable.name}-post`} className="p-2 border-r">
                              <input
                                type="number"
                                step="0.01"
                                value={participant.postMeasurements[variable.name] || ''}
                                onChange={(e) => handleMeasurementChange(
                                  participant.id,
                                  variable.name,
                                  'post',
                                  parseFloat(e.target.value) || 0
                                )}
                                className="w-20 px-2 py-1 border rounded text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                                placeholder="0"
                              />
                            </td>
                          ))}
                          <td className="p-2 text-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeParticipant(selectedStudyData.id, participant.id)}
                              className="text-danger hover:text-danger hover:bg-danger/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}