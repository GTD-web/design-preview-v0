/**
 * TabBar Hook & Utilities
 *
 * 리팩토링된 TabBar 관련 훅과 유틸리티들의 통합 export
 */
export { useTabBar } from "./useTabBar";
export type { PageInfo, TabItem, UseTabBarOptions, UseTabBarReturn, } from "./types";
export { loadTabsFromStorage, saveTabsToStorage } from "./tabStorageUtils";
export { createPathNormalizer, createTabIdGenerator, createPathComparer, extractTabNameFromQuery, } from "./tabPathUtils";
export { createTabFinder, findMatchingTab, countSamePathTabs, checkTabExists, } from "./tabComparisonUtils";
