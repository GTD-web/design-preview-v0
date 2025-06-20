import React, { useEffect } from "react";
import { Button } from "./Button";
import { HStack, VStack } from "./Stack";

/**
 * Drawer 컴포넌트의 Props 인터페이스
 */
interface DrawerProps {
  /** 드로워 열림/닫힘 상태 */
  isOpen: boolean;
  /** 드로워 닫기 함수 */
  onClose: () => void;
  /** 드로워 제목 */
  title?: string;
  /** 드로워 너비 (기본값: max-w-md) */
  width?: string;
  /** 드로워 위치 (기본값: right) */
  position?: "left" | "right" | "top" | "bottom";
  /** 드로워 내용 */
  children: React.ReactNode;
  /** 배경 클릭 시 닫기 여부 (기본값: true) */
  closeOnOverlayClick?: boolean;
  /** ESC 키 클릭 시 닫기 여부 (기본값: true) */
  closeOnEscape?: boolean;
  /** z-index 값 (기본값: 9999) */
  zIndex?: number;
  /** 애니메이션 지속 시간 (기본값: 300ms) */
  animationDuration?: number;
  /** 애니메이션 타이밍 함수 (기본값: ease-in-out) */
  animationTiming?: string;
  /** 애니메이션 활성화 여부 (기본값: true) */
  enableAnimation?: boolean;
}

/**
 * 재사용 가능한 드로워 컴포넌트
 *
 * 기능:
 * - 좌측/우측에서 슬라이드되는 드로워
 * - 배경 오버레이 클릭 시 닫기
 * - ESC 키 클릭 시 닫기
 * - 애니메이션 효과
 * - 반응형 디자인
 *
 * 사용 예시:
 * ```tsx
 * <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="상품 상세">
 *   <div>드로워 내용</div>
 * </Drawer>
 * ```
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  width = "max-w-md",
  position = "right",
  children,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  zIndex = 9999,
  animationDuration = 300,
  animationTiming = "ease-in-out",
  enableAnimation = true,
}: DrawerProps) {
  // ESC 키 클릭 시 닫기
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEscape]);

  // 배경 클릭 시 닫기
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 transition-opacity ${
        position === "right"
          ? "flex justify-end"
          : position === "left"
          ? "flex justify-start"
          : position === "top"
          ? "flex items-start"
          : position === "bottom"
          ? "flex items-end"
          : "flex justify-end"
      }`}
      style={{
        zIndex,
        transitionDuration: enableAnimation ? `${animationDuration}ms` : "0ms",
        transitionTimingFunction: animationTiming,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-surface transition-transform overflow-hidden ${position === "top" || position === "bottom" ? "w-full" : `${width} h-full`} ${
          position === "right"
            ? "rounded-l-xl"
            : position === "left"
            ? "rounded-r-xl"
            : position === "top"
            ? "rounded-b-xl"
            : position === "bottom"
            ? "rounded-t-xl"
            : "rounded-l-xl"
        } flex flex-col`}
        style={{
          transitionDuration: enableAnimation ? `${animationDuration}ms` : "0ms",
          transitionTimingFunction: animationTiming,
          transform: isOpen
            ? "translate(0, 0)"
            : position === "right"
            ? "translateX(100%)"
            : position === "left"
            ? "translateX(-100%)"
            : position === "top"
            ? "translateY(-100%)"
            : position === "bottom"
            ? "translateY(100%)"
            : "translateX(100%)",
          maxHeight: position === "top" || position === "bottom" ? "80vh" : "100vh",
          borderRadius: position === "bottom" ? "16px 16px 0px 0px" : undefined,
        }}
      >
        {/* 드로워 헤더 */}
        {title && (
          <div className="flex-shrink-0 bg-surface border-b border-border/50 p-lg">
            <HStack justify="between" align="center">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                <div className="text-sm text-muted mt-xs">상품 상세 정보</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="w-8 h-8 p-0 rounded-full hover:bg-surface/80 flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </HStack>
          </div>
        )}

        {/* 드로워 내용 - 스크롤 가능한 영역 */}
        <div className="flex-1 overflow-y-auto p-lg">
          <VStack gap="lg">{children}</VStack>
        </div>
      </div>
    </div>
  );
}
