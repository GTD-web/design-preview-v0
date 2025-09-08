/**
 * 탭바 경로 관련 유틸리티 함수들
 */
/**
 * 경로 정규화 함수 생성
 */
export declare const createPathNormalizer: (customNormalizer?: (path: string) => string) => (path: string) => string;
/**
 * 탭 ID 생성 함수
 */
export declare const createTabIdGenerator: (normalizePath: (path: string) => string) => (path: string, allowDuplicate?: boolean) => string;
/**
 * 탭 구별을 위한 경로 비교 함수 생성
 */
export declare const createPathComparer: (normalizePath: (path: string) => string, ignoreQueryParamsForPaths?: string[]) => (path: string) => string;
/**
 * 쿼리 파라미터에서 탭 이름 추출
 */
export declare const extractTabNameFromQuery: (path: string) => string | null;
