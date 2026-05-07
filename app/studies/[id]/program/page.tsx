"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus, Upload, Dumbbell, FileText } from "lucide-react";

interface TrainingUnit {
  id: string;
  title: string;
  description: string;
  duration: string;
  intensity: string;
  exercises: string;
  fileName?: string;
}

export default function StudyProgramPage() {
  const params = useParams();

  const [programTitle, setProgramTitle] = useState("");
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [objective, setObjective] = useState("");

  const [units, setUnits] = useState<TrainingUnit[]>([]);

  function addUnit() {
    const newUnit: TrainingUnit = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      duration: "",
      intensity: "",
      exercises: "",
    };

    setUnits((prev) => [...prev, newUnit]);
  }

  function updateUnit(
    id: string,
    field: keyof TrainingUnit,
    value: string
  ) {
    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === id ? { ...unit, [field]: value } : unit
      )
    );
  }

  function handleFileUpload(
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUnits((prev) =>
      prev.map((unit) =>
        unit.id === id
          ? {
              ...unit,
              fileName: file.name,
            }
          : unit
      )
    );
  }

  function saveProgram() {
    const programData = {
      studyId: params.id,
      title: programTitle,
      durationWeeks,
      sessionsPerWeek,
      objective,
      units,
    };

    localStorage.setItem(
      `study-program-${params.id}`,
      JSON.stringify(programData)
    );

    alert("تم حفظ البرنامج التدريبي بنجاح");
  }

  return (
    <ProtectedRoute allowedRoles={["researcher", "admin"]}>
      <div className="p-8" dir="rtl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            البرنامج التدريبي
          </h1>

          <p className="text-muted-foreground">
            إنشاء وإدارة البرنامج التدريبي الخاص بالدراسة.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>معلومات البرنامج</CardTitle>

            <CardDescription>
              البيانات العامة الخاصة بالبرنامج التدريبي.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">
                اسم البرنامج
              </label>

              <input
                className="w-full border rounded-lg p-3"
                value={programTitle}
                onChange={(e) => setProgramTitle(e.target.value)}
                placeholder="مثال: برنامج تطوير القوة العضلية"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  مدة البرنامج (أسابيع)
                </label>

                <input
                  type="number"
                  className="w-full border rounded-lg p-3"
                  value={durationWeeks}
                  onChange={(e) =>
                    setDurationWeeks(Number(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  عدد الحصص أسبوعيًا
                </label>

                <input
                  type="number"
                  className="w-full border rounded-lg p-3"
                  value={sessionsPerWeek}
                  onChange={(e) =>
                    setSessionsPerWeek(Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium">
                هدف البرنامج
              </label>

              <textarea
                className="w-full border rounded-lg p-3 min-h-[120px]"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="اشرح هدف البرنامج التدريبي..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              الوحدات التدريبية
            </h2>

            <p className="text-muted-foreground">
              إضافة الوحدات والحصص التدريبية الخاصة بالدراسة.
            </p>
          </div>

          <Button onClick={addUnit} className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة وحدة تدريبية
          </Button>
        </div>

        <div className="space-y-6">
          {units.map((unit, index) => (
            <Card key={unit.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  الوحدة التدريبية {index + 1}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div>
                  <label className="block mb-2 font-medium">
                    عنوان الوحدة
                  </label>

                  <input
                    className="w-full border rounded-lg p-3"
                    value={unit.title}
                    onChange={(e) =>
                      updateUnit(unit.id, "title", e.target.value)
                    }
                    placeholder="مثال: تطوير القوة الانفجارية"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    وصف الوحدة
                  </label>

                  <textarea
                    className="w-full border rounded-lg p-3 min-h-[120px]"
                    value={unit.description}
                    onChange={(e) =>
                      updateUnit(
                        unit.id,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium">
                      مدة الحصة
                    </label>

                    <input
                      className="w-full border rounded-lg p-3"
                      value={unit.duration}
                      onChange={(e) =>
                        updateUnit(
                          unit.id,
                          "duration",
                          e.target.value
                        )
                      }
                      placeholder="90 دقيقة"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 font-medium">
                      شدة التدريب
                    </label>

                    <input
                      className="w-full border rounded-lg p-3"
                      value={unit.intensity}
                      onChange={(e) =>
                        updateUnit(
                          unit.id,
                          "intensity",
                          e.target.value
                        )
                      }
                      placeholder="متوسطة / عالية"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    التمارين
                  </label>

                  <textarea
                    className="w-full border rounded-lg p-3 min-h-[100px]"
                    value={unit.exercises}
                    onChange={(e) =>
                      updateUnit(
                        unit.id,
                        "exercises",
                        e.target.value
                      )
                    }
                    placeholder="اذكر التمارين المستخدمة..."
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    رفع ملف
                  </label>

                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(unit.id, e)
                        }
                      />

                      <div className="border rounded-lg px-4 py-3 flex items-center gap-2 hover:bg-muted transition">
                        <Upload className="w-4 h-4" />
                        تحميل ملف
                      </div>
                    </label>

                    {unit.fileName && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <FileText className="w-4 h-4" />
                        {unit.fileName}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Button onClick={saveProgram} size="lg">
            حفظ البرنامج التدريبي
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}