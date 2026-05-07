import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: " Nadra researchlab- منصة البحث الرياضي",
  description: "منصة أكاديمية شاملة لإدارة الدراسات والبحوث في معهد علوم الرياضة والنشاط البدني",
  keywords: ["بحث رياضي", "علوم الرياضة", "قياسات", "تحليل إحصائي"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}