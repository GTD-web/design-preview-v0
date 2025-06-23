import React from "react";
/**
 * 사이드바 메뉴 아이템 타입 정의
 */
interface SidebarMenuItem {
    title: string;
    path: string;
    icon?: React.ReactNode;
}
/**
 * 사이드바 메뉴 그룹 타입 정의
 */
interface SidebarMenuGroup {
    title: string;
    items: SidebarMenuItem[];
}
/**
 * Sidebar 컴포넌트 Props 인터페이스
 */
interface SidebarProps {
    /** 로고 이미지 URL */
    logoUrl?: string;
    /** 로고 텍스트 (전체) */
    logoText?: string;
    /** 로고 텍스트 (축약) */
    logoTextShort?: string;
    /** 사이드바 열림/닫힘 상태 */
    isOpen?: boolean;
    /** 사이드바 닫기 함수 */
    onClose?: () => void;
    /** 사이드바 접힘 상태 */
    isCollapsed?: boolean;
    /** 사이드바 접기/펼치기 토글 함수 */
    onToggleCollapse?: () => void;
    /** 현재 활성 메뉴 경로 */
    activePath?: string;
    /** 메뉴 그룹 목록 (2차원 배열 구조) */
    menuGroups: SidebarMenuGroup[];
    /** 사이드바 너비 */
    width?: string;
    /** 접힌 사이드바 너비 */
    collapsedWidth?: string;
    /** 추가 클래스명 */
    className?: string;
    /** 사용자 정보 */
    user?: {
        name: string;
        email: string;
        avatar?: string;
        initials?: string;
    };
    /** 로그아웃 함수 */
    onLogout?: () => void;
    /** 관리자 모드 여부 */
    isAdminMode?: boolean;
    /** 관리자/사용자 모드 전환 함수 */
    onModeToggle?: () => void;
    /** 화면 이동 버튼 표시 여부 */
    showModeToggle?: boolean;
    /** 알림 아이콘 표시 여부 */
    showNotification?: boolean;
    /** 설정 아이콘 표시 여부 */
    showSettings?: boolean;
}
/**
 * 사이드바 컴포넌트
 *
 * 기능:
 * - 네비게이션 메뉴 제공
 * - 반응형 디자인 (모바일에서 자동 숨김)
 * - 현재 페이지 하이라이트
 * - 스크롤 가능한 메뉴 영역
 */
export declare function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse, activePath, menuGroups, width, collapsedWidth, className, user, onLogout, isAdminMode, onModeToggle, showModeToggle, showNotification, showSettings, logoUrl, logoText, logoTextShort, }: SidebarProps): React.JSX.Element;
export {};
