import React from "react";
import type { PageInfo } from "../hooks/useTabBar";
/**
 * 탭 아이템 타입 정의
 */
export interface TabItem {
    id: string;
    title: string;
    path: string;
    icon?: React.ReactNode;
    closable?: boolean;
}
/**
 * TabBar 컴포넌트 Props 인터페이스
 */
export interface TabBarProps {
    /** 탭 목록 */
    tabs: TabItem[];
    /** 활성 탭 ID */
    activeTabId?: string;
    /** 탭 클릭 시 호출되는 콜백 */
    onTabClick?: (tab: TabItem) => void;
    /** 탭 닫기 시 호출되는 콜백 */
    onTabClose?: (tabId: string) => void;
    /** 새 탭 추가 시 호출되는 콜백 (기본 홈페이지로) */
    onNewTab?: () => void;
    /** 페이지 선택해서 탭 추가 시 호출되는 콜백 */
    onPageSelect?: (pageInfo: PageInfo) => void;
    /** 사용 가능한 모든 페이지 목록 */
    availablePages?: PageInfo[];
    /** 최대 탭 개수 */
    maxTabs?: number;
    /** 추가 클래스명 */
    className?: string;
    /** 새 탭 버튼 표시 여부 */
    showNewTabButton?: boolean;
    /** 홈 버튼 표시 여부 */
    showHomeButton?: boolean;
    /** 홈 버튼 클릭 시 호출되는 콜백 */
    onHomeClick?: () => void;
    /** 홈 버튼 활성 상태 (현재 홈페이지인지 여부) */
    homeButtonActive?: boolean;
    /** 홈 경로 (툴팁용) */
    homePath?: string;
}
/**
 * TabBar 컴포넌트 - 브라우저 탭과 유사한 동작을 제공하는 탭 바
 */
export declare function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onPageSelect, availablePages, maxTabs, className, showNewTabButton, showHomeButton, onHomeClick, homeButtonActive, homePath, }: TabBarProps): React.JSX.Element;
/**
 * TabBar 스타일 상수 - 필요시 외부에서 참조 가능
 */
export declare const TAB_BAR_STYLES: {
    readonly colors: {
        readonly primary: "#3b82f6";
        readonly background: "#f3f4f6";
        readonly foreground: "#1f2937";
        readonly muted: "#6b7280";
        readonly border: "#d1d5db";
        readonly surface: "#ffffff";
        readonly hover: "#e5e7eb";
    };
    readonly spacing: {
        readonly tabPadding: "6px 12px";
        readonly containerPadding: "4px 0";
        readonly iconSize: "14px";
        readonly closeButtonSize: "16px";
    };
    readonly animation: {
        readonly duration: "0.15s";
        readonly easing: "ease-in-out";
    };
};
