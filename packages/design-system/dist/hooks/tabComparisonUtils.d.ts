import type { TabItem, PageInfo } from "./types";
/**
 * 탭 비교 및 매칭 유틸리티 함수들
 */
/**
 * 기존 탭을 찾는 함수 생성 (중복 허용 여부에 따라 다른 로직 적용)
 */
export declare const createTabFinder: (getPathForTabComparison: (path: string) => string) => (tabs: TabItem[], pageInfo: PageInfo, normalizedPath: string) => TabItem | undefined;
/**
 * 현재 경로와 일치하는 탭을 찾는 함수
 */
export declare const findMatchingTab: (tabs: TabItem[], currentFullPath: string, getPathForTabComparison: (path: string) => string) => TabItem | null;
/**
 * 같은 경로를 가진 탭들의 개수를 세는 함수 (탭 번호 매기기용)
 */
export declare const countSamePathTabs: (tabs: TabItem[], pathForComparison: string, getPathForTabComparison: (path: string) => string) => number;
/**
 * 탭이 존재하는지 확인하는 함수 (자동 탭 생성 시 사용)
 */
export declare const checkTabExists: (tabs: TabItem[], normalizedPathname: string, getPathForTabComparison: (path: string) => string) => TabItem | null;
