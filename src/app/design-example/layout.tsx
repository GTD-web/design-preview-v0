"use client";

import localFont from "next/font/local";
import React from "react";
import "../globals.css";
import { useDesignSettings } from "@/packages/design-system/hooks/useDesignSettings";
import { DesignSettings } from "@/packages/design-system/components/DesignSettings";
import { LayoutContainer } from "@/packages/design-system/components/LayoutContainer";

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
  const { font, theme, radius, fontSize, spacing, gap, layoutType, setFont, setTheme, setRadius, setFontSize, setSpacing, setGap, setLayoutType } =
    useDesignSettings();

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <LayoutContainer type={layoutType}>{children}</LayoutContainer>

      <DesignSettings
        onFontChange={setFont}
        onThemeChange={setTheme}
        onRadiusChange={setRadius}
        onFontSizeChange={setFontSize}
        onSpacingChange={setSpacing}
        onGapChange={setGap}
        onLayoutTypeChange={setLayoutType}
        currentFont={font}
        currentTheme={theme}
        currentRadius={radius}
        currentFontSize={fontSize}
        currentSpacing={spacing}
        currentGap={gap}
        currentLayoutType={layoutType}
      />
    </div>
  );
}
