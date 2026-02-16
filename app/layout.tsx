import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Analyzer - 한국 vs 호주 취업 분석",
  description: "AI가 분석하는 한국과 호주 취업 시장 적합도 분석 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
