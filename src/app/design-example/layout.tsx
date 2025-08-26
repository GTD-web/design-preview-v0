"use client";

import localFont from "next/font/local";
import React, { useState } from "react";
import "../globals.css";
import { usePathname } from "next/navigation";
import ClientOnly from "@/components/ClientOnly";
import Loading from "../loading";
import {
  Button,
  DesignSettingsProvider,
  useDesignSettings,
} from "@lumir-company/design-system-v0";
import { LayoutContainer } from "@/packages/design-system/components/LayoutContainer";
import { DesignSettings } from "@/packages/design-system/components/DesignSettings";
import { Sidebar } from "@/packages/design-system/components/Sidebar";

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
    title: "디자인시스템",
    items: [
      {
        title: "디자인토큰",
        path: "/design-example",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4.5 12a7.5 7.5 0 0015 0 7.5 7.5 0 00-15 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: "예시페이지",
    items: [
      {
        title: "대시보드",
        path: "/design-example/dashboard",
        badge: "NEW",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
            />
          </svg>
        ),
      },
      {
        title: "이커머스",
        path: "/design-example/ecommerce",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        ),
      },
      {
        title: "분석",
        path: "/design-example/analytics",
        badge: "긴급",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
        ),
      },
      {
        title: "업무관리",
        path: "/design-example/task-management",
        badge: "D-30",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        title: "사용자 프로필",
        path: "/design-example/user-profile",
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
    ],
  },
];

// 내부 컴포넌트 - 디자인 설정 컨텍스트 사용
function DesignExampleContent({ children }: { children: React.ReactNode }) {
  // 디자인 설정 상태 관리를 커스텀 훅으로 처리
  const {
    font,
    theme,
    radius,
    fontSize,
    spacing,
    gap,
    layoutType,
    maxWidth,
    setFont,
    setTheme,
    setRadius,
    setFontSize,
    setSpacing,
    setGap,
    setLayoutType,
    setMaxWidth,
  } = useDesignSettings();

  // 사이드바 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // 초기 상태: 펼쳐진 사이드바
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);
  const pathname = usePathname();

  // 관리자/사용자 화면 상태 관리
  const [isAdminMode, setIsAdminMode] = useState(false);

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

  // 관리자/사용자 화면 전환 함수
  const handleModeToggle = () => {
    setIsAdminMode(!isAdminMode);
    console.log(`${!isAdminMode ? "관리자" : "사용자"} 모드로 전환`);

    // 페이지 이동 로직 (예시)
    if (!isAdminMode) {
      // 관리자 모드로 전환 시 관리자 페이지로 이동
      window.location.href = "/design-example/admin";
    } else {
      // 사용자 모드로 전환 시 사용자 페이지로 이동
      window.location.href = "/design-example/dashboard";
    }
  };

  // 호버 모드 토글 함수
  const handleHoverToggle = () => {
    if (isHoverEnabled) {
      // 호버 모드 비활성화 → 펼친 사이드바로 변경
      setIsHoverEnabled(false);
      setSidebarCollapsed(false);
    } else {
      // 호버 모드 활성화 → 접힌 사이드바로 변경
      setIsHoverEnabled(true);
      setSidebarCollapsed(true);
    }
  };

  return (
    <ClientOnly fallback={<Loading />}>
      <div className="lg:flex h-screen">
        {/* 사이드바 */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => {
            if (isHoverEnabled) {
              // 호버 모드에서는 단순히 접기/펼치기만 수행 (호버 이벤트용)
              setSidebarCollapsed(!sidebarCollapsed);
            } else if (!sidebarCollapsed) {
              // 펼쳐진 상태에서 접기 버튼 클릭 → 호버 모드 활성화 + 접기
              setIsHoverEnabled(true);
              setSidebarCollapsed(true);
            } else {
              // 일반 접힌 상태에서 펼치기
              setSidebarCollapsed(false);
            }
          }}
          activePath={pathname}
          menuGroups={sidebarMenuGroups}
          user={user}
          onLogout={handleLogout}
          isAdminMode={isAdminMode}
          onModeToggle={handleModeToggle}
          showModeToggle={true}
          showNotification={true}
          showSettings={true}
          isHoverEnabled={isHoverEnabled}
          onToggleHover={handleHoverToggle}
          // 로고를 사용하려면 아래 주석을 해제하고 로고 URL을 입력하세요.
          // logoUrl="https://via.placeholder.com/150/DDDDDD/808080?Text=LOGO"
          // 텍스트 로고를 변경하려면 아래 주석을 해제하고 원하는 텍스트를 입력하세요.
          logoText="커스텀 시스템"
          logoTextShort="CS"
          hoverActiveIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          }
          hoverInActiveIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m13.5 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          }

          // 사이드바 아이콘은 이제 설정에서 사용자가 직접 선택할 수 있습니다
          // collapseIcon과 expandIcon props는 필요시에만 사용하세요
        />

        {/* 메인 콘텐츠 */}
        <main className="flex-1">
          {/* 모바일 헤더 */}
          <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-surface border-b border-border p-md">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </Button>
              <span className="font-semibold">디자인 예제</span>
              <div className="w-8" />
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="lg:pt-0 pt-16">
            <LayoutContainer
              type={layoutType}
              maxWidth={maxWidth}
              hasSidebar={true}
              sidebarCollapsed={sidebarCollapsed}
            >
              {children}
            </LayoutContainer>
          </div>
        </main>
      </div>

      <DesignSettings
        onFontChange={setFont}
        onThemeChange={setTheme}
        onRadiusChange={setRadius}
        onFontSizeChange={setFontSize}
        onSpacingChange={setSpacing}
        onGapChange={setGap}
        onLayoutTypeChange={setLayoutType}
        onMaxWidthChange={setMaxWidth}
        currentFont={font}
        currentTheme={theme}
        currentRadius={radius}
        currentFontSize={fontSize}
        currentSpacing={spacing}
        currentGap={gap}
        currentLayoutType={layoutType}
        currentMaxWidth={maxWidth}
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
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--color-background)]`}
    >
      <DesignSettingsProvider>
        <DesignExampleContent>{children}</DesignExampleContent>
      </DesignSettingsProvider>
    </div>
  );
}
