import type { TabItem } from "../components/TabBar";
/**
 * 페이지 정보 타입
 */
export interface PageInfo {
    path: string;
    title: string;
    icon?: React.ReactNode;
    closable?: boolean;
    /** 중복 탭 허용 여부 (기본값: false) */
    allowDuplicate?: boolean;
}
/**
 * useTabBar Hook Props
 */
export interface UseTabBarOptions {
    /** 초기 탭 목록 */
    initialTabs?: TabItem[];
    /** 최대 탭 개수 */
    maxTabs?: number;
    /** 페이지 정보 매핑 */
    pageMapping?: Record<string, PageInfo>;
    /** 홈 페이지 경로 */
    homePath?: string;
    /** 경로 정규화 함수 (선택적) */
    pathNormalizer?: (path: string) => string;
    /** 기본 페이지 정보 생성 함수 (선택적) */
    defaultPageInfoResolver?: (path: string, homePath: string) => PageInfo;
    /** 로컬 스토리지 사용 여부 */
    enableLocalStorage?: boolean;
    /** 로컬 스토리지 키 (기본값: 'tabbar-tabs') */
    localStorageKey?: string;
}
/**
 * useTabBar Hook 반환값
 */
export interface UseTabBarReturn {
    /** 현재 탭 목록 */
    tabs: TabItem[];
    /** 활성 탭 ID */
    activeTabId?: string;
    /** 탭 추가 */
    addTab: (pageInfo: PageInfo) => void;
    /** 탭 제거 */
    removeTab: (tabId: string) => void;
    /** 탭 활성화 */
    activateTab: (tabId: string) => void;
    /** 모든 탭 비활성화 */
    deactivateAllTabs: () => void;
    /** 기존 탭 활성화 또는 새 탭 추가 */
    activateOrAddTab: (pageInfo: PageInfo) => void;
    /** 탭 순서 변경 */
    reorderTabs: (activeId: string, overId: string) => void;
    /** 새 탭 생성 */
    createNewTab: () => void;
    /** 모든 탭 닫기 */
    closeAllTabs: () => void;
    /** 다른 탭 모두 닫기 */
    closeOtherTabs: (tabId: string) => void;
    /** 현재 페이지를 탭으로 추가 */
    addCurrentPageAsTab: () => void;
    /** 활성 탭의 경로 업데이트 */
    updateActiveTabPath: (newPath: string) => void;
}
/**
 * 탭 바 상태 관리를 위한 Hook
 */
export declare function useTabBar({ initialTabs, maxTabs, pageMapping, homePath, pathNormalizer, defaultPageInfoResolver, enableLocalStorage, localStorageKey, }?: UseTabBarOptions): UseTabBarReturn;
