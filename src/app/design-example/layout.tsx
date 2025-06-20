"use client";

import localFont from "next/font/local";
import React, { useState } from "react";
import "../globals.css";
import { useDesignSettings } from "@/packages/design-system/hooks/useDesignSettings";
import { DesignSettings } from "@/packages/design-system/components/DesignSettings";
import { LayoutContainer } from "@/packages/design-system/components/LayoutContainer";
import { Sidebar } from "@/packages/design-system/components/Sidebar";
import { Button } from "@/packages/design-system/components/Button";
import { usePathname } from "next/navigation";
import ClientOnly from "@/components/ClientOnly";
import Loading from "../loading";

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

  // 사이드바 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ClientOnly fallback={<Loading />}>
        {/* 사이드바 */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath={pathname} />

        {/* 메인 콘텐츠 */}
        <div className="lg:ml-60">
          {/* 모바일 헤더 */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-surface border-b border-border p-md">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                ☰
              </Button>
              <span className="font-semibold">디자인 예제</span>
              <div className="w-8" />
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="lg:pt-0 pt-16">
            <LayoutContainer type={layoutType} hasSidebar={true}>
              {children}
            </LayoutContainer>
          </div>
        </div>

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
      </ClientOnly>
    </div>
  );
}
