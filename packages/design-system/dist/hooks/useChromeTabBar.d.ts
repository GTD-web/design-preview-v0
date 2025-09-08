import type { ChromeTabItem } from "../components/ChromeTabBar";
import type { PageInfo, UseTabBarOptions } from "./types";
/**
 * 크롬 탭바 전용 옵션
 */
export interface UseChromeTabBarOptions extends UseTabBarOptions {
    /** 중복 탭 허용 - 쿼리파라미터가 다르면 다른 탭으로 취급 */
    allowDuplicatesByQuery?: boolean;
    /** 다크 모드 여부 */
    darkMode?: boolean;
    /** 파비콘 리졸버 함수 */
    faviconResolver?: (path: string) => string | undefined;
}
/**
 * 크롬 탭바 상태 관리를 위한 Hook 반환 타입
 */
export interface UseChromeTabBarReturn {
    tabs: ChromeTabItem[];
    activeTabId: string | undefined;
    addTab: (pageInfo: PageInfo) => void;
    removeTab: (tabId: string) => void;
    activateTab: (tabId: string) => void;
    reorderTabs: (fromIndex: number, toIndex: number) => void;
    createNewTab: () => void;
    closeAllTabs: () => void;
    closeOtherTabs: (keepTabId: string) => void;
    handleTabClick: (tab: ChromeTabItem) => void;
    updateActiveTabPath: (newPath: string) => void;
}
/**
 * 크롬 스타일 탭 바 상태 관리를 위한 Hook
 */
export declare function useChromeTabBar({ initialTabs, maxTabs, pageMapping, homePath, pathNormalizer, defaultPageInfoResolver, enableLocalStorage, localStorageKey, allowDuplicatesByQuery, faviconResolver, }?: UseChromeTabBarOptions): UseChromeTabBarReturn;
