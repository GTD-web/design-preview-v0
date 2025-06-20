"use client";

import localFont from "next/font/local";
import React, { useState } from "react";
import "../globals.css";
import { useDesignSettings, DesignSettingsProvider } from "@/packages/design-system/hooks/useDesignSettings";
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

// 사이드바 메뉴 데이터 정의
const sidebarMenuGroups = [
  {
    title: "대시보드",
    items: [
      {
        title: "대시보드",
        path: "/design-example/dashboard",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "E-commerce",
    items: [
      {
        title: "E-commerce",
        path: "/design-example/ecommerce",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Analytics",
        path: "/design-example/analytics",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: "Task Management",
    items: [
      {
        title: "Task Management",
        path: "/design-example/task-management",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: "User Profile",
    items: [
      {
        title: "User Profile",
        path: "/design-example/user-profile",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
    ],
  },
];

// 내부 컴포넌트 - 디자인 설정 컨텍스트 사용
function DesignExampleContent({ children }: { children: React.ReactNode }) {
  // 디자인 설정 상태 관리를 커스텀 훅으로 처리
  const { font, theme, radius, fontSize, spacing, gap, layoutType, setFont, setTheme, setRadius, setFontSize, setSpacing, setGap, setLayoutType } =
    useDesignSettings();

  // 사이드바 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // 사용자 정보 (실제로는 인증 상태에서 가져와야 함)
  const user = {
    name: "김디자이너",
    email: "designer@example.com",
    initials: "김",
  };

  // 로그아웃 함수
  const handleLogout = () => {
    // 실제 로그아웃 로직 구현
    console.log("로그아웃 처리 중...");
    // 예: 인증 토큰 삭제, 로그인 페이지로 리다이렉트 등
    alert("로그아웃되었습니다.");
  };

  return (
    <ClientOnly fallback={<Loading />}>
      {/* 사이드바 */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePath={pathname}
        menuGroups={sidebarMenuGroups}
        user={user}
        onLogout={handleLogout}
      />

      {/* 메인 콘텐츠 */}
      <div className="lg:ml-64">
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
  );
}

export default function DesignExampleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--color-background)]`}>
      <DesignSettingsProvider>
        <DesignExampleContent>{children}</DesignExampleContent>
      </DesignSettingsProvider>
    </div>
  );
}
