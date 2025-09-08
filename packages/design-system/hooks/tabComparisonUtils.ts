import type { TabItem, PageInfo } from "./types";

/**
 * 탭 비교 및 매칭 유틸리티 함수들
 */

/**
 * 기존 탭을 찾는 함수 생성 (중복 허용 여부에 따라 다른 로직 적용)
 */
export const createTabFinder = (
  getPathForTabComparison: (path: string) => string
) => {
  return (
    tabs: TabItem[],
    pageInfo: PageInfo,
    normalizedPath: string
  ): TabItem | undefined => {
    if (pageInfo.allowDuplicate) {
      // 중복 허용 탭의 경우: 완전히 동일한 경로(쿼리 파라미터 포함)일 때만 기존 탭으로 간주
      return tabs.find((tab) => tab.path === normalizedPath);
    } else {
      // 일반 탭의 경우: 기존 로직 사용
      const pathForComparison = getPathForTabComparison(normalizedPath);
      return tabs.find((tab) => {
        const tabPathForComparison = getPathForTabComparison(tab.path);
        return tabPathForComparison === pathForComparison;
      });
    }
  };
};

/**
 * 현재 경로와 일치하는 탭을 찾는 함수
 */
export const findMatchingTab = (
  tabs: TabItem[],
  currentFullPath: string,
  getPathForTabComparison: (path: string) => string
): TabItem | null => {
  // 먼저 완전히 동일한 경로(쿼리 파라미터 포함)로 일치하는 탭 찾기
  let matchingTab = tabs.find((tab) => tab.path === currentFullPath);

  // 완전 일치하는 탭이 없으면 기존 로직으로 탭 찾기 (일반 탭용)
  if (!matchingTab) {
    const currentPathForComparison = getPathForTabComparison(currentFullPath);
    matchingTab = tabs.find((tab) => {
      const tabPathForComparison = getPathForTabComparison(tab.path);
      return tabPathForComparison === currentPathForComparison;
    });
  }

  return matchingTab || null;
};

/**
 * 같은 경로를 가진 탭들의 개수를 세는 함수 (탭 번호 매기기용)
 */
export const countSamePathTabs = (
  tabs: TabItem[],
  pathForComparison: string,
  getPathForTabComparison: (path: string) => string
): number => {
  return tabs.filter((tab) => {
    const tabPathForComparison = getPathForTabComparison(tab.path);
    return tabPathForComparison === pathForComparison;
  }).length;
};

/**
 * 탭이 존재하는지 확인하는 함수 (자동 탭 생성 시 사용)
 */
export const checkTabExists = (
  tabs: TabItem[],
  normalizedPathname: string,
  getPathForTabComparison: (path: string) => string
): TabItem | null => {
  // 먼저 완전히 동일한 경로로 탭 찾기
  const currentFullPath =
    typeof window !== "undefined"
      ? normalizedPathname + (window.location.search || "")
      : normalizedPathname;

  let existingTab = tabs.find((tab) => tab.path === currentFullPath);

  // 완전 일치하는 탭이 없으면 기존 로직으로 탭 찾기
  if (!existingTab) {
    const currentPathForComparison =
      getPathForTabComparison(normalizedPathname);
    existingTab = tabs.find((tab) => {
      const tabPathForComparison = getPathForTabComparison(tab.path);
      return tabPathForComparison === currentPathForComparison;
    });
  }

  return existingTab || null;
};
