/**
 * Tab ID 관련 유틸리티 함수들
 */
/**
 * URL에서 tab-id 쿼리파라미터를 추출합니다
 */
export declare function extractTabIdFromPath(path: string): string | null;
/**
 * tab-id를 기반으로 탭 인스턴스를 구분하는 고유 키를 생성합니다
 */
export declare function generateTabInstanceKey(basePath: string, tabId: string | null): string;
/**
 * 경로에서 tab-id를 제거한 클린한 경로를 반환합니다
 */
export declare function getCleanPath(path: string): string;
/**
 * tab-id가 있는 경로인지 확인합니다
 */
export declare function hasTabId(path: string): boolean;
/**
 * 두 경로가 같은 기본 경로이지만 다른 tab-id를 가지는지 확인합니다
 */
export declare function isSamePageDifferentInstance(path1: string, path2: string): boolean;
/**
 * React 컴포넌트에서 사용할 수 있는 tab-id 기반 Hook을 위한 키 생성
 */
export declare function useTabInstanceKey(pathname: string, searchParams?: URLSearchParams): string;
