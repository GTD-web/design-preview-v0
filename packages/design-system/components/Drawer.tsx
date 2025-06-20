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
  position?: "left" | "right";
  /** 드로워 내용 */
  children: React.ReactNode;
  /** 배경 클릭 시 닫기 여부 (기본값: true) */
  closeOnOverlayClick?: boolean;
  /** ESC 키 클릭 시 닫기 여부 (기본값: true) */
  closeOnEscape?: boolean;
  /** z-index 값 (기본값: 9999) */
  zIndex?: number;
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex transition-opacity duration-300" style={{ zIndex }} onClick={handleOverlayClick}>
      <div
        className={`w-full ${width} bg-surface h-full overflow-y-auto transform transition-transform duration-300 ${
          position === "right" ? "translate-x-0" : "-translate-x-0"
        }`}
        style={{
          transform: position === "right" ? "translateX(0)" : "translateX(0)",
        }}
      >
        <div className="p-lg">
          {/* 드로워 헤더 */}
          {title && (
            <HStack justify="between" align="center" className="mb-lg">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-lg">
                ×
              </Button>
            </HStack>
          )}

          {/* 드로워 내용 */}
          <VStack gap="lg">{children}</VStack>
        </div>
      </div>
    </div>
  );
}
