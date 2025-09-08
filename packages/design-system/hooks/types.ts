/**
 * TabBar Hook 관련 타입 정의
 */

/**
 * 페이지 정보 타입
 */
export interface PageInfo {
  path: string;
  title: string;
  icon?: React.ReactNode;
  closable?: boolean;
  /** 중복 탭 허용 여부 (기본값: false) */
  allowDuplicate?: boolean;
}

/**
 * 탭 아이템 타입 (TabBar 컴포넌트와 호환)
 */
export interface TabItem {
  id: string;
  title: string;
  path: string;
  icon?: React.ReactNode;
  closable?: boolean;
}

/**
 * useTabBar Hook Options
 */
export interface UseTabBarOptions {
  /** 초기 탭 목록 */
  initialTabs?: TabItem[];
  /** 최대 탭 개수 */
  maxTabs?: number;
  /** 페이지 정보 매핑 */
  pageMapping?: Record<string, PageInfo>;
  /** 홈 페이지 경로 */
  homePath?: string;
  /** 경로 정규화 함수 (선택적) */
  pathNormalizer?: (path: string) => string;
  /** 기본 페이지 정보 생성 함수 (선택적) */
  defaultPageInfoResolver?: (path: string, homePath: string) => PageInfo;
  /** 로컬 스토리지 사용 여부 */
  enableLocalStorage?: boolean;
  /** 로컬 스토리지 키 (기본값: 'tabbar-tabs') */
  localStorageKey?: string;
  /** 쿼리파라미터를 무시할 pathname 목록 (해당 경로들은 쿼리파라미터가 달라도 같은 탭으로 인식) */
  ignoreQueryParamsForPaths?: string[];
  /** URL 직접 입력 등 네비게이션 시 자동으로 탭을 생성할지 여부 (기본값: false) */
  autoCreateTabOnNavigation?: boolean;
}

/**
 * useTabBar Hook 반환값
 */
export interface UseTabBarReturn {
  /** 현재 탭 목록 */
  tabs: TabItem[];
  /** 활성 탭 ID */
  activeTabId?: string;
  /** 탭 추가 */
  addTab: (pageInfo: PageInfo) => void;
  /** 탭 제거 */
  removeTab: (tabId: string) => void;
  /** 탭 활성화 */
  activateTab: (tabId: string) => void;
  /** 모든 탭 비활성화 */
  deactivateAllTabs: () => void;
  /** 기존 탭 활성화 또는 새 탭 추가 */
  activateOrAddTab: (pageInfo: PageInfo) => void;
  /** 탭 순서 변경 */
  reorderTabs: (activeId: string, overId: string) => void;
  /** 새 탭 생성 */
  createNewTab: () => void;
  /** 중복 탭 강제 생성 (중복 허용 페이지용) */
  forceAddNewTab: (pageInfo: PageInfo) => void;
  /** 모든 탭 닫기 */
  closeAllTabs: () => void;
  /** 다른 탭 모두 닫기 */
  closeOtherTabs: (tabId: string) => void;
  /** 현재 페이지를 탭으로 추가 */
  addCurrentPageAsTab: () => void;
  /** 활성 탭의 경로 업데이트 */
  updateActiveTabPath: (newPath: string) => void;
  /** TabBar 컴포넌트용 탭 클릭 핸들러 */
  handleTabClick: (tab: TabItem) => void;
}
