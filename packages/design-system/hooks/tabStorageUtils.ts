import type { TabItem } from "./types";

/**
 * 탭바 로컬 스토리지 관리 유틸리티
 */

/**
 * 로컬 스토리지에서 탭 데이터 로드
 */
export const loadTabsFromStorage = (
  key: string
): { tabs: TabItem[]; activeTabId?: string } | null => {
  if (typeof window === "undefined") return null;

  try {
    const saved = localStorage.getItem(key);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return {
      tabs: parsed.tabs || [],
      activeTabId: parsed.activeTabId,
    };
  } catch (error) {
    console.warn("Failed to load tabs from localStorage:", error);
    return null;
  }
};

/**
 * 로컬 스토리지에 탭 데이터 저장
 */
export const saveTabsToStorage = (
  key: string,
  tabs: TabItem[],
  activeTabId?: string
) => {
  if (typeof window === "undefined") return;

  try {
    const data = {
      tabs: tabs.map((tab) => ({ ...tab, icon: undefined })), // icon은 serialize 불가능하므로 제외
      activeTabId,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn("Failed to save tabs to localStorage:", error);
  }
};
