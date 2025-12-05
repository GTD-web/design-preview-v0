import React from "react";
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
 * useTabManager hook 옵션
 */
export interface UseTabManagerOptions {
    /** 초기 탭 목록 */
    initialTabs?: TabItem[];
    /** 최대 탭 개수 */
    maxTabs?: number;
    /** 경로에서 탭 정보를 생성하는 함수 (fullPath는 쿼리 파라미터 포함) */
    getTabFromPath?: (pathname: string, fullPath: string) => Omit<TabItem, "id"> | null;
    /** 홈 경로 (이 경로일 때는 탭을 추가하지 않음) */
    homePath?: string;
    /**
     * 특정 경로가 여러 탭을 허용할지 결정하는 함수
     * true를 반환하면 같은 경로에 여러 탭이 열릴 수 있음 (쿼리 파라미터가 달라도 새 탭 생성)
     * false를 반환하면 같은 경로는 하나의 탭만 유지하고 쿼리 파라미터만 업데이트
     * @default () => false
     */
    shouldAllowMultipleTabs?: (pathname: string, fullPath: string) => boolean;
}
/**
 * useTabManager - 탭 상태 관리 및 자동 탭 추가/활성화 hook
 *
 * 링크로 접속했을 때 자동으로 탭을 추가하거나 활성화합니다.
 * 쿼리 파라미터가 포함된 URL도 지원하며, 같은 경로의 탭은 쿼리 파라미터만 업데이트합니다.
 *
 * @example
 * ```tsx
 * const { tabs, activeTabId, handleTabClick, handleTabClose, handleTabReorder } = useTabManager({
 *   initialTabs: [{ id: "home", title: "홈", path: "/" }],
 *   maxTabs: 10,
 *   getTabFromPath: (pathname, fullPath) => ({
 *     title: pathname === "/" ? "홈" : pathname.split("/").pop() || "페이지",
 *     path: fullPath, // 쿼리 파라미터 포함
 *     closable: pathname !== "/",
 *   }),
 *   homePath: "/",
 *   shouldAllowMultipleTabs: (pathname) => {
 *     // 특정 페이지는 여러 탭 허용
 *     return pathname.startsWith("/detail/");
 *   },
 * });
 *
 * return <TabBar
 *   tabs={tabs}
 *   activeTabId={activeTabId}
 *   onTabClick={handleTabClick}
 *   onTabClose={handleTabClose}
 *   onTabReorder={handleTabReorder}
 * />;
 * ```
 */
export declare function useTabManager({ initialTabs, maxTabs, getTabFromPath, homePath, shouldAllowMultipleTabs, }?: UseTabManagerOptions): {
    tabs: TabItem[];
    activeTabId: string;
    setTabs: React.Dispatch<React.SetStateAction<TabItem[]>>;
    setActiveTabId: React.Dispatch<React.SetStateAction<string>>;
    handleTabClick: (tab: TabItem) => void;
    handleTabClose: (tabId: string) => void;
    handleTabReorder: (activeId: string, overId: string) => void;
    handleNewTab: () => void;
};
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
    /** 탭 순서 변경 시 호출되는 콜백 */
    onTabReorder?: (activeId: string, overId: string) => void;
    /** 새 탭 추가 시 호출되는 콜백 (기본 홈페이지로) */
    onNewTab?: () => void;
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
    /** 홈 버튼 커스텀 아이콘 */
    homeButtonIcon?: React.ReactNode;
    /** 홈 버튼 텍스트/라벨 */
    homeButtonLabel?: string;
    /**
     * 새 탭 버튼 커스텀 렌더링 함수
     * 사용하는 쪽에서 PageSelector 등의 컴포넌트를 직접 구성하여 전달 가능
     * @param isDisabled - 최대 탭 개수 도달 여부
     * @param tabCount - 현재 탭 개수
     * @param maxTabs - 최대 탭 개수
     */
    renderNewTabButton?: (props: {
        isDisabled: boolean;
        tabCount: number;
        maxTabs: number;
    }) => React.ReactNode;
}
/**
 * TabBar 컴포넌트 - 브라우저 탭과 유사한 동작을 제공하는 탭 바
 */
export declare function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onTabReorder, maxTabs, className, showNewTabButton, showHomeButton, onHomeClick, homeButtonActive, homeButtonIcon, homeButtonLabel, renderNewTabButton, }: TabBarProps): React.JSX.Element;
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
