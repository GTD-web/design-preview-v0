/**
 * 탭바 경로 관련 유틸리티 함수들
 */

/**
 * 경로 정규화 함수 생성
 */
export const createPathNormalizer = (
  customNormalizer?: (path: string) => string
) => {
  return (path: string): string => {
    if (customNormalizer) {
      return customNormalizer(path);
    }

    // 기본 정규화: 마지막 슬래시 제거
    let normalized = path.replace(/\/$/, "");
    if (!normalized) normalized = "/";

    return normalized;
  };
};

/**
 * 탭 ID 생성 함수
 */
export const createTabIdGenerator = (
  normalizePath: (path: string) => string
) => {
  return (path: string, allowDuplicate: boolean = false): string => {
    const normalized = normalizePath(path);
    const baseId = `tab-${
      normalized.replace(/\//g, "-").replace(/^-/, "") || "home"
    }`;

    if (!allowDuplicate) {
      return baseId;
    }

    // 중복 허용 시 고유 ID 생성
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 5);
    return `${baseId}-${timestamp}-${random}`;
  };
};

/**
 * 탭 구별을 위한 경로 비교 함수 생성
 */
export const createPathComparer = (
  normalizePath: (path: string) => string,
  ignoreQueryParamsForPaths: string[] = []
) => {
  return (path: string): string => {
    try {
      const url = new URL(path, "http://localhost");
      const normalizedPathname = normalizePath(url.pathname);

      // 해당 pathname이 쿼리파라미터를 무시할 경로에 포함되어 있으면 쿼리 파라미터 제거
      const shouldIgnoreQueryParams = ignoreQueryParamsForPaths.some(
        (ignorePath) => {
          return normalizedPathname === normalizePath(ignorePath);
        }
      );

      if (shouldIgnoreQueryParams) {
        return normalizedPathname;
      }

      // tab-name만 제거하고 나머지 모든 쿼리 파라미터는 유지
      url.searchParams.delete("tab-name");
      const searchString = url.searchParams.toString();

      // 쿼리 파라미터를 정렬하여 일관성 있는 비교 가능
      if (searchString) {
        const params = new URLSearchParams(searchString);
        const sortedParams = new URLSearchParams();
        Array.from(params.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .forEach(([key, value]) => sortedParams.set(key, value));
        return normalizedPathname + `?${sortedParams.toString()}`;
      }

      return normalizedPathname;
    } catch {
      // URL 파싱 실패 시 기본 정규화만 적용
      const [pathPart] = path.split("?");
      return normalizePath(pathPart);
    }
  };
};

/**
 * 쿼리 파라미터에서 탭 이름 추출
 */
export const extractTabNameFromQuery = (path: string): string | null => {
  try {
    const url = new URL(path, "http://localhost");
    const tabName = url.searchParams.get("tab-name");

    if (!tabName) return null;

    // 이중 인코딩된 경우를 처리하기 위해 반복적으로 디코딩
    let decodedName = tabName;
    let previousName = "";

    // 최대 3번까지 디코딩 시도 (무한 루프 방지)
    for (let i = 0; i < 3 && decodedName !== previousName; i++) {
      previousName = decodedName;
      try {
        // %로 시작하는 인코딩된 문자가 있는지 확인
        if (decodedName.includes("%")) {
          const decoded = decodeURIComponent(decodedName);
          decodedName = decoded;
        } else {
          break;
        }
      } catch (decodeError) {
        console.warn("extractTabNameFromQuery - decode error:", decodeError);
        break;
      }
    }

    return decodedName;
  } catch (error) {
    console.error("extractTabNameFromQuery - error:", error);
    return null;
  }
};
