import React from "react";
/**
 * 레이아웃 타입 정의
 */
type LayoutType = "full" | "centered";
/**
 * LayoutContainer 컴포넌트 Props 인터페이스
 */
interface LayoutContainerProps {
    /** 레이아웃 타입 */
    type?: LayoutType;
    /** 최대 너비 (centered 타입에서 사용) */
    maxWidth?: string;
    /** 패딩 */
    padding?: string;
    /** 사이드바 존재 여부 */
    hasSidebar?: boolean;
    /** 사이드바 접힘 상태 */
    sidebarCollapsed?: boolean;
    /** 자식 요소 */
    children: React.ReactNode;
    /** 추가 클래스명 */
    className?: string;
}
/**
 * 페이지 레이아웃을 컨트롤하는 컴포넌트
 *
 * 레이아웃 타입:
 * - full: 화면 전체를 채움
 * - centered: 중앙 정렬 (기본값)
 */
export declare function LayoutContainer({ type, maxWidth, padding, hasSidebar, sidebarCollapsed, children, className, }: LayoutContainerProps): React.JSX.Element;
export {};
