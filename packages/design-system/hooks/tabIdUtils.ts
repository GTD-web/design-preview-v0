/**
 * Tab ID 관련 유틸리티 함수들
 */

/**
 * URL에서 tab-id 쿼리파라미터를 추출합니다
 */
export function extractTabIdFromPath(path: string): string | null {
  try {
    const url = new URL(path, "http://dummy.com");
    return url.searchParams.get("tab-id");
  } catch {
    // URL 파싱에 실패한 경우 직접 파싱
    const queryPart = path.split("?")[1];
    if (!queryPart) return null;

    const params = new URLSearchParams(queryPart);
    return params.get("tab-id");
  }
}

/**
 * tab-id를 기반으로 탭 인스턴스를 구분하는 고유 키를 생성합니다
 */
export function generateTabInstanceKey(
  basePath: string,
  tabId: string | null
): string {
  const cleanBasePath = basePath.split("?")[0];
  return tabId ? `${cleanBasePath}_${tabId}` : cleanBasePath;
}

/**
 * 경로에서 tab-id를 제거한 클린한 경로를 반환합니다
 */
export function getCleanPath(path: string): string {
  try {
    const url = new URL(path, "http://dummy.com");
    url.searchParams.delete("tab-id");
    const cleanPath = url.pathname + (url.search || "");
    return cleanPath.endsWith("?") ? cleanPath.slice(0, -1) : cleanPath;
  } catch {
    // URL 파싱에 실패한 경우 직접 처리
    const [pathPart, queryPart] = path.split("?");
    if (!queryPart) return pathPart;

    const params = new URLSearchParams(queryPart);
    params.delete("tab-id");
    const cleanQuery = params.toString();

    return cleanQuery ? `${pathPart}?${cleanQuery}` : pathPart;
  }
}

/**
 * tab-id가 있는 경로인지 확인합니다
 */
export function hasTabId(path: string): boolean {
  return extractTabIdFromPath(path) !== null;
}

/**
 * 두 경로가 같은 기본 경로이지만 다른 tab-id를 가지는지 확인합니다
 */
export function isSamePageDifferentInstance(
  path1: string,
  path2: string
): boolean {
  const cleanPath1 = getCleanPath(path1);
  const cleanPath2 = getCleanPath(path2);
  const tabId1 = extractTabIdFromPath(path1);
  const tabId2 = extractTabIdFromPath(path2);

  return cleanPath1 === cleanPath2 && tabId1 !== tabId2 && !!(tabId1 || tabId2);
}

/**
 * React 컴포넌트에서 사용할 수 있는 tab-id 기반 Hook을 위한 키 생성
 */
export function useTabInstanceKey(
  pathname: string,
  searchParams?: URLSearchParams
): string {
  const path = searchParams
    ? `${pathname}?${searchParams.toString()}`
    : pathname;
  const tabId = extractTabIdFromPath(path);
  return generateTabInstanceKey(pathname, tabId);
}
