/**
 * TabBar Hook & Utilities
 *
 * 리팩토링된 TabBar 관련 훅과 유틸리티들의 통합 export
 */

// 메인 훅
export { useTabBar } from "./useTabBar";
export { useChromeTabBar } from "./useChromeTabBar";

// 타입 정의
export type {
  PageInfo,
  TabItem,
  UseTabBarOptions,
  UseTabBarReturn,
  ChromeTabItem,
  UseChromeTabBarOptions,
  UseChromeTabBarReturn,
} from "./types";

// 유틸리티 함수들 (필요시 외부에서 사용 가능)
export { loadTabsFromStorage, saveTabsToStorage } from "./tabStorageUtils";

export {
  createPathNormalizer,
  createTabIdGenerator,
  createPathComparer,
  extractTabNameFromQuery,
} from "./tabPathUtils";

export {
  createTabFinder,
  findMatchingTab,
  countSamePathTabs,
  checkTabExists,
} from "./tabComparisonUtils";

// Tab Instance 관련 유틸리티
export {
  extractTabIdFromPath,
  generateTabInstanceKey,
  getCleanPath,
  hasTabId,
  isSamePageDifferentInstance,
  useTabInstanceKey,
} from "./tabIdUtils";

export {
  useTabInstance,
  useTabInstanceLocalStorage,
  useCurrentTabInfo,
} from "./useTabInstance";
