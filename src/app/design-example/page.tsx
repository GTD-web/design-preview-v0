"use client";

import TextHeading from "@/packages/design-system/components/TextHeading";
import TextValue from "@/packages/design-system/components/TextValue";
import { Button } from "@/packages/design-system/components/Button";
import { Sidebar } from "@/packages/design-system/components/Sidebar";
import { VStack } from "@/packages/design-system/components/Stack";
import { useEffect, useState } from "react";
import { DesignTokensPreview } from "../components/DesignTokensPreview";

export default function DesignExamplePage() {
  // 사이드바 상태 관리
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);

  // 사이드바 토글 함수들
  const handleToggleCollapse = () => {
    if (isHidden) {
      setIsHidden(false);
      setIsCollapsed(true);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleToggleHidden = () => {
    setIsHidden(!isHidden);
    if (!isHidden) {
      setIsCollapsed(false);
    }
  };

  const handleToggleHover = () => {
    setIsHoverEnabled(!isHoverEnabled);
  };

  // 사이드바 완전 리셋 (펼쳐진 상태로)
  const handleReset = () => {
    setIsHidden(false);
    setIsCollapsed(false);
    setIsHoverEnabled(false);
  };

  // 더미 메뉴 데이터
  const menuGroups = [
    {
      title: "메인",
      items: [
        {
          title: "대시보드",
          path: "/design-example/dashboard",
          icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 8v4l2 2"
                stroke="currentColor"
                strokeWidth="1.5"
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
                d="M3 3v18h18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.7 8 16 10.7l-2-2L7 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          badge: "새로움",
        },
      ],
    },
    {
      title: "관리",
      items: [
        {
          title: "사용자",
          path: "/design-example/users",
          icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
        {
          title: "설정",
          path: "/design-example/settings",
          icon: (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      ],
    },
  ];

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
    <div className="min-h-screen flex">
      {/* 사이드바 */}
      <Sidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isHidden={isHidden}
        onToggleHidden={handleToggleHidden}
        activePath="/design-example"
        menuGroups={menuGroups}
        isHoverEnabled={isHoverEnabled}
        onToggleHover={handleToggleHover}
        user={{
          name: "테스트 사용자",
          email: "test@example.com",
          initials: "TU",
        }}
        onLogout={() => console.log("로그아웃")}
      />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 transition-all duration-300 ease-in-out">
        <div className="container mx-auto p-8">
          <div className="space-y-8">
            <div className="text-center">
              <TextHeading size="3xl" weight="bold" className="mb-4">
                사이드바 테스트 & 디자인 토큰 미리보기
              </TextHeading>
              <TextValue className="text-lg">
                사이드바의 다양한 상태를 테스트하고 디자인 시스템의 토큰들을
                확인할 수 있습니다.
              </TextValue>
            </div>

            {/* 사이드바 제어 패널 */}
            <div className="bg-surface border rounded-lg p-6">
              <TextHeading size="lg" weight="semibold" className="mb-4">
                사이드바 제어 패널
              </TextHeading>

              <div className="space-y-4">
                {/* 현재 상태 표시 */}
                <div className="p-4 bg-neutral-50 /*dark:bg-neutral-900*/ rounded-lg">
                  <TextHeading size="sm" weight="medium" className="mb-2">
                    현재 상태
                  </TextHeading>
                  <div className="flex gap-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded ${
                        isHidden
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {isHidden ? "완전 숨김" : "표시됨"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        isCollapsed
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isCollapsed ? "접힘" : "펼쳐짐"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        isHoverEnabled
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      호버 모드: {isHoverEnabled ? "ON" : "OFF"}
                    </span>
                  </div>
                </div>

                {/* 제어 버튼들 */}
                <VStack gap="sm" align="start">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleCollapse}
                      disabled={isHidden}
                    >
                      사이드바 {isCollapsed ? "펼치기" : "접기"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleHidden}
                      className="text-danger border-danger hover:bg-danger/10"
                    >
                      {isHidden ? "사이드바 표시" : "사이드바 완전 숨기기"}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleHover}
                      disabled={isHidden}
                    >
                      호버 모드 {isHoverEnabled ? "OFF" : "ON"}
                    </Button>

                    <Button variant="secondary" size="sm" onClick={handleReset}>
                      초기화 (모두 펼치기)
                    </Button>
                  </div>

                  <TextValue size="sm" className="text-muted">
                    💡 펼쳐진 사이드바와 접힌 사이드바 모두에서 완전 숨기기가
                    가능합니다. 숨겨진 상태에서는 화면 왼쪽 상단의 버튼으로 다시
                    표시할 수 있습니다.
                  </TextValue>
                </VStack>
              </div>
            </div>

            {/* 디자인 토큰 미리보기 */}
            <div className="space-y-8">
              <DesignTokensPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
