import type { PageInfo, UseTabBarOptions, UseTabBarReturn } from "./types";
export type { PageInfo, UseTabBarOptions, UseTabBarReturn };
/**
 * 탭 바 상태 관리를 위한 Hook
 */
export declare function useTabBar({ initialTabs, maxTabs, pageMapping, homePath, pathNormalizer, defaultPageInfoResolver, enableLocalStorage, localStorageKey, ignoreQueryParamsForPaths, autoCreateTabOnNavigation, }?: UseTabBarOptions): UseTabBarReturn;
