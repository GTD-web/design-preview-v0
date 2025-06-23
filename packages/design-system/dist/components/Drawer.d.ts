import React from "react";
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
export declare function Drawer({ isOpen, onClose, title, width, position, children, closeOnOverlayClick, closeOnEscape, zIndex, animationDuration, animationTiming, enableAnimation, }: DrawerProps): React.JSX.Element;
export {};
