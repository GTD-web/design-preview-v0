"use client";

import TextHeading from "@/packages/design-system/components/TextHeading";
import TextValue from "@/packages/design-system/components/TextValue";
import { Button } from "@/packages/design-system/components/Button";
import { useEffect } from "react";
import { DesignTokensPreview } from "../components/DesignTokensPreview";
import { useSidebarContext } from "./layout";

export default function DesignExamplePage() {
  const { sidebarHidden, toggleSidebarHidden } = useSidebarContext();

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
    <div className="min-h-screen">
      <div className="p-8">
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1" />
              <div className="flex-1 text-center">
                <TextHeading size="3xl" weight="bold" className="mb-4">
                  디자인 토큰 미리보기
                </TextHeading>
                <TextValue className="text-lg">
                  디자인 시스템의 토큰들을 확인하고 테스트할 수 있습니다.
                </TextValue>
              </div>
              <div className="flex-1 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSidebarHidden}
                  className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {sidebarHidden ? (
                      // 사이드바 보이기 아이콘
                      <path d="M3 12h18M12 3l9 9-9 9" />
                    ) : (
                      // 사이드바 숨기기 아이콘
                      <path d="M21 12H3m9-9l-9 9 9 9" />
                    )}
                  </svg>
                  {sidebarHidden ? "사이드바 보이기" : "사이드바 숨기기"}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <DesignTokensPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
