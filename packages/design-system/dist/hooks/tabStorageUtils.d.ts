import type { TabItem } from "./types";
/**
 * 탭바 로컬 스토리지 관리 유틸리티
 */
/**
 * 로컬 스토리지에서 탭 데이터 로드
 */
export declare const loadTabsFromStorage: (key: string) => {
    tabs: TabItem[];
    activeTabId?: string;
} | null;
/**
 * 로컬 스토리지에 탭 데이터 저장
 */
export declare const saveTabsToStorage: (key: string, tabs: TabItem[], activeTabId?: string) => void;
