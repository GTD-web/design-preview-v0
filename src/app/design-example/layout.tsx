"use client";

import localFont from "next/font/local";
import React from "react";
import "../globals.css";
import { useDesignSettings } from "@/packages/design-system/hooks/useDesignSettings";
import { DesignSettings } from "@/packages/design-system/components/DesignSettings";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function DesignExampleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 디자인 설정 상태 관리를 커스텀 훅으로 처리
  const { font, theme, radius, fontSize, spacing, gap, setFont, setTheme, setRadius, setFontSize, setSpacing, setGap } = useDesignSettings();

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <div className="flex flex-row min-h-screen">
        <main className="flex-1 min-h-screen bg-background">{children}</main>
      </div>

      <DesignSettings
        onFontChange={setFont}
        onThemeChange={setTheme}
        onRadiusChange={setRadius}
        onFontSizeChange={setFontSize}
        onSpacingChange={setSpacing}
        onGapChange={setGap}
        currentFont={font}
        currentTheme={theme}
        currentRadius={radius}
        currentFontSize={fontSize}
        currentSpacing={spacing}
        currentGap={gap}
      />
    </div>
  );
}
