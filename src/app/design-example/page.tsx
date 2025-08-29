"use client";

import TextHeading from "@/packages/design-system/components/TextHeading";
import TextValue from "@/packages/design-system/components/TextValue";
import { useEffect } from "react";
import { DesignTokensPreview } from "../components/DesignTokensPreview";

export default function DesignExamplePage() {
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
      <div className="container mx-auto p-8">
        <div className="space-y-8">
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
  );
}
