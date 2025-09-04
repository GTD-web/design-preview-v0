"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { arrayMove } from "@dnd-kit/sortable";
import type { TabItem } from "../components/TabBar";

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
 * useTabBar Hook Props
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
  /** 탭 순서 변경 */
  reorderTabs: (activeId: string, overId: string) => void;
  /** 새 탭 생성 */
  createNewTab: () => void;
  /** 모든 탭 닫기 */
  closeAllTabs: () => void;
  /** 다른 탭 모두 닫기 */
  closeOtherTabs: (tabId: string) => void;
  /** 현재 페이지를 탭으로 추가 */
  addCurrentPageAsTab: () => void;
}

/**
 * 로컬 스토리지에서 탭 데이터 로드
 */
const loadTabsFromStorage = (
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
const saveTabsToStorage = (
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

/**
 * 탭 바 상태 관리를 위한 Hook
 */
export function useTabBar({
  initialTabs = [],
  maxTabs = 10,
  pageMapping = {},
  homePath = "/design-example",
  pathNormalizer,
  defaultPageInfoResolver,
  enableLocalStorage = true,
  localStorageKey = "tabbar-tabs",
}: UseTabBarOptions = {}): UseTabBarReturn {
  const router = useRouter();
  const pathname = usePathname();

  // 로컬 스토리지에서 초기 데이터 로드
  const getInitialState = useCallback(() => {
    if (enableLocalStorage) {
      const saved = loadTabsFromStorage(localStorageKey);
      if (saved && saved.tabs.length > 0) {
        // 저장된 탭들을 복원하면서 아이콘을 pageMapping에서 찾아서 추가
        const restoredTabs = saved.tabs.map((tab) => {
          const pageInfo = pageMapping[tab.path];
          return {
            ...tab,
            icon: pageInfo?.icon || tab.icon,
          };
        });

        return {
          tabs: restoredTabs,
          activeTabId: saved.activeTabId,
        };
      }
    }
    return {
      tabs: initialTabs,
      activeTabId: initialTabs.find((tab) => tab.path === pathname)?.id,
    };
  }, [enableLocalStorage, localStorageKey, initialTabs, pathname, pageMapping]);

  const [initialState] = useState(getInitialState);

  // 탭 상태
  const [tabs, setTabs] = useState<TabItem[]>(initialState.tabs);
  const [activeTabId, setActiveTabId] = useState<string | undefined>(
    initialState.activeTabId
  );
  const [isRemovingTab, setIsRemovingTab] = useState(false);
  const [recentlyRemovedTabId, setRecentlyRemovedTabId] = useState<
    string | null
  >(null);

  // 경로 정규화 (외부에서 제공되면 사용, 아니면 기본 정규화)
  const normalizePath = useCallback(
    (path: string): string => {
      if (pathNormalizer) {
        return pathNormalizer(path);
      }

      // 기본 정규화: 마지막 슬래시 제거
      let normalized = path.replace(/\/$/, "");
      if (!normalized) normalized = "/";

      return normalized;
    },
    [pathNormalizer]
  );

  // 경로에서 탭 ID 생성 (중복 허용 시 고유 ID 생성)
  const generateTabId = useCallback(
    (path: string, allowDuplicate: boolean = false): string => {
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
    },
    [normalizePath]
  );

  // 페이지 정보 가져오기 - React 컴포넌트 때문에 pageMapping을 의존성에서 제외
  const getPageInfo = useCallback(
    (path: string): PageInfo => {
      const normalizedPath = normalizePath(path);

      // 1. 매핑에서 찾기 (매번 최신 pageMapping 참조)
      if (pageMapping[normalizedPath]) {
        return { ...pageMapping[normalizedPath], path: normalizedPath };
      }

      // 2. 외부에서 제공된 기본값 리졸버 사용
      if (defaultPageInfoResolver) {
        return defaultPageInfoResolver(normalizedPath, homePath);
      }

      // 3. 라이브러리 기본값 (매우 간단)
      const defaultPageInfo: PageInfo = {
        path: normalizedPath,
        title: normalizedPath.split("/").pop()?.replace(/[-_]/g, " ") || "Page",
        closable: normalizedPath !== homePath,
      };

      return defaultPageInfo;
    },
    [homePath, normalizePath, defaultPageInfoResolver]
  );

  // 탭 추가
  const addTab = useCallback(
    (pageInfo: PageInfo) => {
      const tabId = generateTabId(pageInfo.path, pageInfo.allowDuplicate);

      setTabs((prevTabs) => {
        // 중복 허용이 아닌 경우에만 기존 탭 확인
        if (!pageInfo.allowDuplicate) {
          const existingTab = prevTabs.find(
            (tab) => tab.path === pageInfo.path
          );
          if (existingTab) {
            return prevTabs;
          }
        }

        // 최대 탭 개수 체크
        if (prevTabs.length >= maxTabs) {
          // 가장 오래된 탭을 제거 (첫 번째 탭 제외 - 보통 홈탭)
          const newTabs = prevTabs.slice(1, -1);
          // 새 탭 제목 생성 (중복 탭인 경우 번호 추가)
          let tabTitle = pageInfo.title;
          if (pageInfo.allowDuplicate) {
            const samePathTabs = prevTabs.filter(
              (tab) => tab.path === pageInfo.path
            );
            if (samePathTabs.length > 0) {
              tabTitle = `${pageInfo.title} (${samePathTabs.length + 1})`;
            }
          }

          const updatedTabs = [
            prevTabs[0], // 홈 탭 유지
            ...newTabs,
            {
              id: tabId,
              title: tabTitle,
              path: pageInfo.path,
              icon: pageInfo.icon,
              closable: pageInfo.closable,
            },
          ];

          // 로컬 스토리지에 저장
          if (enableLocalStorage) {
            saveTabsToStorage(localStorageKey, updatedTabs, tabId);
          }

          return updatedTabs;
        }

        // 새 탭 추가 (중복 탭인 경우 제목에 번호 추가)
        let tabTitle = pageInfo.title;
        if (pageInfo.allowDuplicate) {
          const samePathTabs = prevTabs.filter(
            (tab) => tab.path === pageInfo.path
          );
          if (samePathTabs.length > 0) {
            tabTitle = `${pageInfo.title} (${samePathTabs.length + 1})`;
          }
        }

        const updatedTabs = [
          ...prevTabs,
          {
            id: tabId,
            title: tabTitle,
            path: pageInfo.path,
            icon: pageInfo.icon,
            closable: pageInfo.closable,
          },
        ];

        // 로컬 스토리지에 저장
        if (enableLocalStorage) {
          saveTabsToStorage(localStorageKey, updatedTabs, tabId);
        }

        return updatedTabs;
      });

      setActiveTabId(tabId);
    },
    [generateTabId, maxTabs, enableLocalStorage, localStorageKey]
  );

  // 탭 제거
  const removeTab = useCallback(
    (tabId: string) => {
      // 탭 제거 중 상태 설정
      setIsRemovingTab(true);
      setRecentlyRemovedTabId(tabId);

      setTabs((prevTabs) => {
        const tabIndex = prevTabs.findIndex((tab) => tab.id === tabId);
        if (tabIndex === -1) {
          setIsRemovingTab(false);
          setRecentlyRemovedTabId(null);
          return prevTabs;
        }

        const newTabs = prevTabs.filter((tab) => tab.id !== tabId);

        // 활성 탭이 제거된 경우 다른 탭으로 전환
        if (activeTabId === tabId && newTabs.length > 0) {
          // 닫힌 탭의 위치에 따라 다음 활성 탭 결정
          const nextActiveIndex = Math.max(
            0,
            Math.min(tabIndex - 1, newTabs.length - 1)
          );
          const newActiveTab = newTabs[nextActiveIndex];

          // 로컬 스토리지에 저장
          if (enableLocalStorage) {
            saveTabsToStorage(localStorageKey, newTabs, newActiveTab.id);
          }

          // 비동기로 상태 업데이트하여 렌더링 후 실행
          setTimeout(() => {
            setActiveTabId(newActiveTab.id);
            router.push(newActiveTab.path);
            // 네비게이션 완료 후 상태 리셋 (더 긴 딜레이로 확실하게 방지)
            setTimeout(() => {
              setIsRemovingTab(false);
              // 최근 제거된 탭 ID는 더 오래 유지하여 재생성 방지
              setTimeout(() => setRecentlyRemovedTabId(null), 500);
            }, 200);
          }, 0);
        } else if (activeTabId === tabId && newTabs.length === 0) {
          // 모든 탭이 닫힌 경우
          if (enableLocalStorage) {
            saveTabsToStorage(localStorageKey, newTabs, undefined);
          }

          setTimeout(() => {
            setActiveTabId(undefined);
            router.push(homePath);
            // 네비게이션 완료 후 상태 리셋 (더 긴 딜레이로 확실하게 방지)
            setTimeout(() => {
              setIsRemovingTab(false);
              // 최근 제거된 탭 ID는 더 오래 유지하여 재생성 방지
              setTimeout(() => setRecentlyRemovedTabId(null), 500);
            }, 200);
          }, 0);
        } else {
          // 비활성 탭을 닫은 경우
          if (enableLocalStorage) {
            saveTabsToStorage(localStorageKey, newTabs, activeTabId);
          }
          setIsRemovingTab(false);
          // 비활성 탭 제거 시에도 일정 시간 재생성 방지
          setTimeout(() => setRecentlyRemovedTabId(null), 500);
        }

        return newTabs;
      });
    },
    [activeTabId, router, homePath, enableLocalStorage, localStorageKey]
  );

  // 탭 활성화
  const activateTab = useCallback(
    (tabId: string) => {
      console.log("activateTab called with tabId:", tabId);
      const tab = tabs.find((t) => t.id === tabId);
      console.log("Found tab:", tab);
      if (tab) {
        console.log("Activating tab and navigating to:", tab.path);
        setActiveTabId(tabId);

        // 로컬 스토리지에 저장
        if (enableLocalStorage) {
          saveTabsToStorage(localStorageKey, tabs, tabId);
        }

        router.push(tab.path);
      } else {
        console.log("Tab not found for tabId:", tabId);
      }
    },
    [tabs, router, enableLocalStorage, localStorageKey]
  );

  // 탭 순서 변경
  const reorderTabs = useCallback(
    (activeId: string, overId: string) => {
      console.log("reorderTabs called with:", { activeId, overId });

      if (activeId === overId) {
        console.log("Same id, returning early");
        return;
      }

      setTabs((prevTabs) => {
        console.log(
          "Current tabs:",
          prevTabs.map((t) => ({ id: t.id, title: t.title }))
        );

        const activeIndex = prevTabs.findIndex((tab) => tab.id === activeId);
        const overIndex = prevTabs.findIndex((tab) => tab.id === overId);

        console.log("Indices:", { activeIndex, overIndex });

        if (activeIndex === -1 || overIndex === -1) {
          console.warn("Invalid indices, returning previous tabs");
          return prevTabs;
        }

        const newTabs = arrayMove(prevTabs, activeIndex, overIndex);
        console.log(
          "New tabs after reorder:",
          newTabs.map((t) => ({ id: t.id, title: t.title }))
        );

        // 로컬 스토리지에 저장
        if (enableLocalStorage) {
          saveTabsToStorage(localStorageKey, newTabs, activeTabId);
        }

        return newTabs;
      });
    },
    [enableLocalStorage, localStorageKey, activeTabId]
  );

  // 새 탭 생성
  const createNewTab = useCallback(() => {
    const newPageInfo: PageInfo = {
      path: homePath,
      title: "새 탭",
      closable: true,
    };
    addTab(newPageInfo);
    router.push(homePath);
  }, [addTab, homePath, router]);

  // 모든 탭 닫기
  const closeAllTabs = useCallback(() => {
    const homeTabs = tabs.filter((tab) => !tab.closable);
    setTabs(homeTabs);

    if (homeTabs.length > 0) {
      const homeTab = homeTabs[0];
      setActiveTabId(homeTab.id);

      // 로컬 스토리지에 저장
      if (enableLocalStorage) {
        saveTabsToStorage(localStorageKey, homeTabs, homeTab.id);
      }

      router.push(homeTab.path);
    } else {
      setActiveTabId(undefined);

      // 로컬 스토리지에 저장
      if (enableLocalStorage) {
        saveTabsToStorage(localStorageKey, homeTabs, undefined);
      }

      router.push(homePath);
    }
  }, [tabs, homePath, router, enableLocalStorage, localStorageKey]);

  // 다른 탭 모두 닫기
  const closeOtherTabs = useCallback(
    (keepTabId: string) => {
      setTabs((prevTabs) => {
        const keepTab = prevTabs.find((tab) => tab.id === keepTabId);
        const homeTabs = prevTabs.filter((tab) => !tab.closable);

        let newTabs: TabItem[] = [];
        if (keepTab) {
          newTabs = [...homeTabs];
          if (!newTabs.find((tab) => tab.id === keepTabId)) {
            newTabs.push(keepTab);
          }
        } else {
          newTabs = homeTabs;
        }

        // 로컬 스토리지에 저장
        if (enableLocalStorage) {
          saveTabsToStorage(localStorageKey, newTabs, keepTabId);
        }

        return newTabs;
      });

      setActiveTabId(keepTabId);
    },
    [enableLocalStorage, localStorageKey]
  );

  // 현재 페이지를 탭으로 추가
  const addCurrentPageAsTab = useCallback(() => {
    const normalizedPathname = normalizePath(pathname);
    const pageInfo = getPageInfo(normalizedPathname);
    addTab(pageInfo);
  }, [pathname, getPageInfo, addTab, normalizePath]);

  // 경로 변경 시 탭 상태 업데이트 - 기존 탭 활성화만 처리, 자동 생성 없음
  useEffect(() => {
    // 탭 제거 중이면 처리 방지
    if (isRemovingTab) return;

    const normalizedPathname = normalizePath(pathname);

    // 홈 경로인 경우 모든 탭 비활성화
    if (normalizedPathname === homePath) {
      setActiveTabId(undefined);
      return;
    }

    // 현재 경로와 일치하는 기존 탭이 있는지 확인하고 활성화만 처리
    setTabs((currentTabs) => {
      // 경로가 일치하는 기존 탭 찾기 (중복 허용 페이지의 경우 첫 번째 탭)
      const existingTab = currentTabs.find(
        (tab) => tab.path === normalizedPathname
      );

      if (existingTab) {
        setActiveTabId(existingTab.id);
      } else {
        // 기존 탭이 없으면 활성 탭 ID를 undefined로 설정 (탭바에서 아무것도 활성화되지 않음)
        setActiveTabId(undefined);
      }

      return currentTabs; // 탭 목록은 변경하지 않음
    });
  }, [pathname, isRemovingTab, homePath, normalizePath]);

  return {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    activateTab,
    reorderTabs,
    createNewTab,
    closeAllTabs,
    closeOtherTabs,
    addCurrentPageAsTab,
  };
}
