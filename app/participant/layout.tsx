import { Sidebar } from "@/components/layout/Sidebar";

export default function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <main className="flex-1 bg-muted/20">{children}</main>
    </div>
  );
}