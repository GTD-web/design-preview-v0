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
}
/**
 * TabBar 컴포넌트 - 브라우저 탭과 유사한 동작을 제공하는 탭 바
 */
export declare function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onPageSelect, availablePages, maxTabs, className, showNewTabButton, }: TabBarProps): React.JSX.Element;
/**
 * 기본 탭 스타일 적용을 위한 CSS 클래스
 */
export declare const TAB_BAR_STYLES: {
    scrollbar: string;
};
