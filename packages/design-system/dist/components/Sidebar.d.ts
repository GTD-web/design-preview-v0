import React from "react";
/**
 * 사이드바 메뉴 아이템 타입 정의
 */
export interface SidebarMenuItem {
    title: string;
    path: string;
    icon?: React.ReactNode;
    badge?: string;
}
/**
 * 사이드바 메뉴 그룹 타입 정의
 */
export interface SidebarMenuGroup {
    title: string;
    items: SidebarMenuItem[];
}
/**
 * 공통 사이드바 Props 인터페이스
 */
export interface SidebarBaseProps {
    /** 로고 이미지 URL */
    logoUrl?: string;
    /** 로고 텍스트 (전체) */
    logoText?: string;
    /** 로고 텍스트 (축약) */
    logoTextShort?: string;
    /** 현재 활성 메뉴 경로 */
    activePath?: string;
    /** 메뉴 그룹 목록 */
    menuGroups: SidebarMenuGroup[];
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
    /** 호버 모드 활성화 여부 */
    isHoverEnabled?: boolean;
}
/**
 * 접힌 사이드바 Props 인터페이스
 */
export interface SidebarCollapsedProps extends Omit<SidebarBaseProps, "logoText"> {
    /** 사이드바 펼치기 토글 함수 */
    onToggleExpand: () => void;
    /** 사이드바 펼치기 아이콘 */
    expandIcon?: React.ReactNode;
    /** 접힌 사이드바 너비 */
    width?: string;
    /** 호버 토글 함수 */
    onToggleHover?: () => void;
}
/**
 * 펼쳐진 사이드바 Props 인터페이스
 */
export interface SidebarExpandedProps extends SidebarBaseProps {
    /** 사이드바 접기 토글 함수 */
    onToggleCollapse: () => void;
    /** 사이드바 접기 아이콘 */
    collapseIcon?: React.ReactNode;
    /** 펼쳐진 사이드바 너비 */
    width?: string;
    /** 호버 토글 함수 */
    onToggleHover?: () => void;
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
    /** 사이드바 접기 아이콘 (펼쳐진 상태에서 표시) */
    collapseIcon?: React.ReactNode;
    /** 사이드바 펼치기 아이콘 (접힌 상태에서 표시) */
    expandIcon?: React.ReactNode;
    /** 호버 모드 활성화 여부 */
    isHoverEnabled?: boolean;
    /** 호버 모드 토글 함수 */
    onToggleHover?: () => void;
}
/**
 * 접힌 사이드바 컴포넌트
 */
export declare function SidebarCollapsed({ logoUrl, logoTextShort, activePath, menuGroups, width, className, user, onLogout, isAdminMode, onModeToggle, showModeToggle, showNotification, showSettings, onToggleExpand, expandIcon, isHoverEnabled, onToggleHover, }: SidebarCollapsedProps): React.JSX.Element;
/**
 * 펼쳐진 사이드바 컴포넌트
 */
export declare function SidebarExpanded({ logoUrl, logoText, logoTextShort, activePath, menuGroups, width, className, user, onLogout, isAdminMode, onModeToggle, showModeToggle, showNotification, showSettings, onToggleCollapse, collapseIcon, isHoverEnabled, onToggleHover, }: SidebarExpandedProps): React.JSX.Element;
/**
 * 사이드바 컴포넌트 (통합)
 *
 * 기능:
 * - 네비게이션 메뉴 제공
 * - 반응형 디자인 (모바일에서 자동 숨김)
 * - 현재 페이지 하이라이트
 * - 스크롤 가능한 메뉴 영역
 */
export declare function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse, activePath, menuGroups, width, collapsedWidth, className, user, onLogout, isAdminMode, onModeToggle, showModeToggle, showNotification, showSettings, logoUrl, logoText, logoTextShort, collapseIcon, expandIcon, isHoverEnabled, onToggleHover, }: SidebarProps): React.JSX.Element;
export {};
