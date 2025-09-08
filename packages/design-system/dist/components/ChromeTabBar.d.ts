import React from "react";
import "@sinm/react-chrome-tabs/css/chrome-tabs.css";
/**
 * 크롬 탭 아이템 타입 정의
 */
export interface ChromeTabItem {
    id: string;
    title: string;
    path: string;
    favicon?: string;
    active: boolean;
}
/**
 * ChromeTabBar 컴포넌트 Props 인터페이스
 */
export interface ChromeTabBarProps {
    /** 탭 목록 */
    tabs: ChromeTabItem[];
    /** 탭 클릭 시 호출되는 콜백 */
    onTabClick?: (tab: ChromeTabItem) => void;
    /** 탭 닫기 시 호출되는 콜백 */
    onTabClose?: (tabId: string) => void;
    /** 탭 순서 변경 시 호출되는 콜백 */
    onTabReorder?: (fromIndex: number, toIndex: number) => void;
    /** 새 탭 추가 시 호출되는 콜백 */
    onNewTab?: () => void;
    /** 최대 탭 개수 */
    maxTabs?: number;
    /** 추가 클래스명 */
    className?: string;
    /** 새 탭 버튼 표시 여부 */
    showNewTabButton?: boolean;
    /** 다크 모드 여부 */
    darkMode?: boolean;
}
/**
 * ChromeTabBar 컴포넌트 - 크롬 브라우저와 유사한 탭 바
 */
export declare function ChromeTabBar({ tabs, onTabClick, onTabClose, onTabReorder, onNewTab, maxTabs, className, showNewTabButton, darkMode, }: ChromeTabBarProps): React.JSX.Element;
/**
 * ChromeTabBar 스타일 상수
 */
export declare const CHROME_TAB_BAR_STYLES: {
    readonly colors: {
        readonly light: {
            readonly background: "#f1f3f4";
            readonly border: "#dadce0";
            readonly text: "#202124";
            readonly hover: "#e8eaed";
        };
        readonly dark: {
            readonly background: "#2d2d30";
            readonly border: "#3c3c3c";
            readonly text: "#ffffff";
            readonly hover: "#404040";
        };
    };
    readonly dimensions: {
        readonly height: "46px";
        readonly newTabButtonSize: "28px";
    };
};
