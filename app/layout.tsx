import type { Metadata } from "next";
import { Noto_Serif_KR, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import TopNav from "@/components/TopNav";

const notoSerif = Noto_Serif_KR({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Material Symbols is loaded via <link> in the head
export const metadata: Metadata = {
  title: "우리 가족 찾기 · 523 패밀리",
  description: "이름을 입력하면 어떤 관계인지 알려드려요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSerif.variable} ${plusJakarta.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className="min-h-screen pb-20 md:pb-0" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <TopNav />
        {children}
      </body>
    </html>
  );
}
