"use client";

import TextHeading from "@/packages/design-system/components/TextHeading";
import TextValue from "@/packages/design-system/components/TextValue";
import { Button } from "@/packages/design-system/components/Button";
import { Sidebar } from "@/packages/design-system/components/Sidebar";
import { useEffect, useState } from "react";
import { DesignTokensPreview } from "../components/DesignTokensPreview";

interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  isFullyHidden: boolean;
  isHoverEnabled: boolean;
}

export default function DesignExamplePage() {
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    isOpen: true,
    isCollapsed: false,
    isFullyHidden: false,
    isHoverEnabled: false,
  });

  // 사이드바 메뉴 데이터
  const menuGroups = [
    {
      title: "메인 메뉴",
      items: [
        {
          title: "대시보드",
          path: "/design-example/dashboard",
          icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M3 13l4 4L22 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
        {
          title: "분석",
          path: "/design-example/analytics",
          icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 20V10M12 20V4m-6 16v-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          badge: "새로움",
        },
        {
          title: "사용자 관리",
          path: "/design-example/user-profile",
          icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      ],
    },
    {
      title: "도구",
      items: [
        {
          title: "설정",
          path: "/design-example/settings",
          icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      ],
    },
  ];

  // 사용자 정보
  const user = {
    name: "홍길동",
    email: "hong@example.com",
    initials: "홍",
  };

  // 사이드바 토글 함수들
  const handleToggleCollapse = () => {
    setSidebarState((prev) => ({
      ...prev,
      isCollapsed: !prev.isCollapsed,
    }));
  };

  const handleToggleFullyHidden = () => {
    setSidebarState((prev) => ({
      ...prev,
      isFullyHidden: !prev.isFullyHidden,
    }));
  };

  const handleToggleHover = () => {
    setSidebarState((prev) => ({
      ...prev,
      isHoverEnabled: !prev.isHoverEnabled,
    }));
  };

  const handleClose = () => {
    setSidebarState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleOpen = () => {
    setSidebarState((prev) => ({ ...prev, isOpen: true }));
  };

  // 사이드바 상태에 따른 메인 컨텐츠 스타일 계산
  const getMainContentStyle = () => {
    if (sidebarState.isFullyHidden) {
      return "ml-0";
    }
    if (sidebarState.isCollapsed) {
      return "ml-20"; // w-20 = 80px = 5rem = ml-20
    }
    return "ml-64"; // w-64 = 256px = 16rem = ml-64
  };

  // body 클래스와 CSS 변수 모니터링
  useEffect(() => {
    const updateDebugInfo = () => {
      // CSS 변수 값 확인
      const computedStyle = getComputedStyle(document.body);
      const variables: Record<string, string> = {};

      // shadcn 관련 주요 변수들 확인
      const varsToCheck = [
        "--background",
        "--foreground",
        "--primary",
        "--secondary",
        "--card",
        "--border",
        "--muted",
        "--accent",
      ];

      varsToCheck.forEach((varName) => {
        variables[varName] = computedStyle.getPropertyValue(varName).trim();
      });
    };

    // 초기 실행
    updateDebugInfo();

    // MutationObserver로 body 클래스 변경 감지
    const observer = new MutationObserver(updateDebugInfo);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* 사이드바 */}
      <Sidebar
        isOpen={sidebarState.isOpen}
        onClose={handleClose}
        isCollapsed={sidebarState.isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isFullyHidden={sidebarState.isFullyHidden}
        onToggleFullyHidden={handleToggleFullyHidden}
        activePath="/design-example"
        menuGroups={menuGroups}
        user={user}
        onLogout={() => console.log("로그아웃")}
        isAdminMode={false}
        onModeToggle={() => console.log("모드 전환")}
        showModeToggle={true}
        showNotification={true}
        showSettings={true}
        logoText="디자인시스템"
        logoTextShort="DS"
        isHoverEnabled={sidebarState.isHoverEnabled}
        onToggleHover={handleToggleHover}
      />

      {/* 메인 컨텐츠 - 사이드바 상태에 따라 동적으로 여백 조정 */}
      <div
        className={`min-h-screen transition-all duration-500 ease-in-out ${getMainContentStyle()}`}
      >
        <div className="p-8">
          <div className="space-y-8">
            {/* 사이드바 제어 패널 */}
            <div className="bg-card border rounded-lg p-6">
              <TextHeading size="xl" weight="semibold" className="mb-4">
                사이드바 제어 패널
              </TextHeading>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <TextValue size="sm" weight="medium">
                    현재 상태
                  </TextValue>
                  <div className="space-y-1">
                    <div className="text-xs">
                      열림: {sidebarState.isOpen ? "✅" : "❌"}
                    </div>
                    <div className="text-xs">
                      접힘: {sidebarState.isCollapsed ? "✅" : "❌"}
                    </div>
                    <div className="text-xs">
                      완전 숨김: {sidebarState.isFullyHidden ? "✅" : "❌"}
                    </div>
                    <div className="text-xs">
                      호버 모드: {sidebarState.isHoverEnabled ? "✅" : "❌"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <TextValue size="sm" weight="medium">
                    기본 제어
                  </TextValue>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={sidebarState.isOpen ? handleClose : handleOpen}
                      className="w-full"
                    >
                      {sidebarState.isOpen ? "사이드바 닫기" : "사이드바 열기"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleToggleCollapse}
                      className="w-full"
                      disabled={sidebarState.isFullyHidden}
                    >
                      {sidebarState.isCollapsed ? "펼치기" : "접기"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <TextValue size="sm" weight="medium">
                    고급 제어
                  </TextValue>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleToggleFullyHidden}
                      className="w-full"
                    >
                      {sidebarState.isFullyHidden
                        ? "사이드바 보이기"
                        : "완전 접기"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleToggleHover}
                      className="w-full"
                      disabled={sidebarState.isFullyHidden}
                    >
                      {sidebarState.isHoverEnabled
                        ? "호버 모드 끄기"
                        : "호버 모드 켜기"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <TextValue size="sm" weight="medium">
                    메인 컨텐츠 여백
                  </TextValue>
                  <div className="text-xs text-muted-foreground">
                    현재 적용된 클래스:
                    <br />
                    <code className="bg-muted px-2 py-1 rounded text-xs">
                      {getMainContentStyle()}
                    </code>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  💡 <strong>사용법:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>기본 제어로 사이드바를 열고 닫거나 접을 수 있습니다.</li>
                  <li>
                    &quot;완전 접기&quot;를 사용하면 사이드바가 완전히
                    사라집니다.
                  </li>
                  <li>
                    &quot;호버 모드&quot;를 켜면 접힌 사이드바에 마우스를 올릴
                    때 자동으로 펼쳐집니다.
                  </li>
                  <li>
                    메인 컨텐츠의 여백이 사이드바 상태에 따라 자동으로
                    조정됩니다.
                  </li>
                </ul>
              </div>
            </div>

            {/* 기존 컨텐츠 */}
            <div className="text-center">
              <TextHeading size="3xl" weight="bold" className="mb-4">
                디자인 토큰 미리보기
              </TextHeading>
              <TextValue className="text-lg">
                디자인 시스템의 토큰들을 확인하고 테스트할 수 있습니다.
              </TextValue>
            </div>

            <div className="space-y-8">
              <DesignTokensPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
