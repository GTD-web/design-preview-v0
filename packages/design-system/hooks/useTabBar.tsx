"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { arrayMove } from "@dnd-kit/sortable";
import type { TabItem } from "../components/TabBar";
import type { PageInfo, UseTabBarOptions, UseTabBarReturn } from "./types";
import { loadTabsFromStorage, saveTabsToStorage } from "./tabStorageUtils";
import {
  createPathNormalizer,
  createTabIdGenerator,
  createPathComparer,
  extractTabNameFromQuery,
} from "./tabPathUtils";
import {
  createTabFinder,
  findMatchingTab,
  countSamePathTabs,
} from "./tabComparisonUtils";

// 타입 재export (하위 호환성)
export type { PageInfo, UseTabBarOptions, UseTabBarReturn };

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
  ignoreQueryParamsForPaths = [],
  autoCreateTabOnNavigation = false,
}: UseTabBarOptions = {}): UseTabBarReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 유틸리티 함수들 생성
  const normalizePath = useMemo(
    () => createPathNormalizer(pathNormalizer),
    [pathNormalizer]
  );
  const generateTabId = useMemo(
    () => createTabIdGenerator(normalizePath),
    [normalizePath]
  );
  const getPathForTabComparison = useMemo(
    () => createPathComparer(normalizePath, ignoreQueryParamsForPaths),
    [normalizePath, ignoreQueryParamsForPaths]
  );
  const findTab = useMemo(
    () => createTabFinder(getPathForTabComparison),
    [getPathForTabComparison]
  );

  // 로컬 스토리지에서 초기 데이터 로드
  const getInitialState = useCallback(() => {
    if (enableLocalStorage) {
      const saved = loadTabsFromStorage(localStorageKey);
      if (saved && saved.tabs.length > 0) {
        // 저장된 탭들을 복원하면서 아이콘을 pageMapping에서 찾아서 추가
        const restoredTabs = saved.tabs.map((tab) => {
          const tabBasePath = tab.path.split("?")[0];
          const pageInfo = pageMapping[tabBasePath];
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
      activeTabId: initialTabs.find((tab) => {
        const tabBasePath = tab.path.split("?")[0];
        return tabBasePath === pathname;
      })?.id,
    };
  }, [enableLocalStorage, localStorageKey, initialTabs, pathname, pageMapping]);

  const [initialState] = useState(getInitialState);

  // 탭 상태
  const [tabs, setTabs] = useState<TabItem[]>(initialState.tabs);
  const [activeTabId, setActiveTabId] = useState<string | undefined>(
    initialState.activeTabId
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRemovingTab, setIsRemovingTab] = useState(false);
  const [isTabClickNavigation, setIsTabClickNavigation] = useState(false);
  const [isTabCloseNavigation, setIsTabCloseNavigation] = useState(false);
  const [isCreatingNewTab, setIsCreatingNewTab] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homePath, normalizePath, defaultPageInfoResolver]
  );

  // 탭 추가
  const addTab = useCallback(
    (pageInfo: PageInfo) => {
      // 경로 정규화 - pathname 부분만 정규화하고 쿼리 파라미터는 그대로 유지
      const [pathPart, queryPart] = pageInfo.path.split("?");
      let normalizedPath = normalizePath(pathPart);

      // 중복 허용 페이지이면서 tab-id가 없는 경우 자동으로 tab-id 생성
      if (pageInfo.allowDuplicate && !queryPart?.includes("tab-id=")) {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 5);
        const tabIdParam = `tab-id=${timestamp}-${randomId}`;

        if (queryPart) {
          normalizedPath += `?${queryPart}&${tabIdParam}`;
        } else {
          normalizedPath += `?${tabIdParam}`;
        }
      } else {
        normalizedPath += queryPart ? `?${queryPart}` : "";
      }

      // 쿼리 파라미터에서 탭 이름 확인
      const customTabName = extractTabNameFromQuery(normalizedPath);
      const finalTitle = customTabName || pageInfo.title;

      const normalizedPageInfo = {
        ...pageInfo,
        path: normalizedPath,
        title: finalTitle,
      };

      // pathForComparison은 항상 정의 (나중에 탭 번호 매기기에서 사용)
      const pathForComparison = getPathForTabComparison(normalizedPath);

      // 탭 ID는 중복 허용 여부에 따라 다른 방식으로 생성
      // 중복 허용 시에는 원본 pathPart를 사용해서 ID 생성 (이미 tab-id가 추가되기 전 상태)
      const tabId = normalizedPageInfo.allowDuplicate
        ? generateTabId(normalizePath(pathPart), true) // 원본 pathPart로 고유 ID 생성
        : generateTabId(pathForComparison, false); // 일반 탭은 기존 방식

      // 탭 클릭으로 인한 네비게이션임을 표시 (다른 useEffect가 덮어쓰지 못하게)
      setIsTabClickNavigation(true);

      setTabs((prevTabs) => {
        // 중복 허용 탭이 아닌 경우에만 기존 탭 찾기
        if (!normalizedPageInfo.allowDuplicate) {
          const foundExistingTab = findTab(
            prevTabs,
            normalizedPageInfo,
            normalizedPath
          );

          if (foundExistingTab) {
            // 기존 탭 업데이트
            const updatedTabs = prevTabs.map((tab) => {
              if (tab.id === foundExistingTab.id) {
                return { ...tab, path: normalizedPath, title: finalTitle };
              }
              return tab;
            });

            // 기존 탭 활성화
            setActiveTabId(foundExistingTab.id);

            // 로컬 스토리지에 저장
            if (enableLocalStorage) {
              saveTabsToStorage(
                localStorageKey,
                updatedTabs,
                foundExistingTab.id
              );
            }

            // 네비게이션 후 상태 리셋
            setTimeout(() => {
              setIsTabClickNavigation(false);
            }, 300);

            router.push(normalizedPath);

            return updatedTabs;
          }
        }

        // 최대 탭 개수 체크
        if (prevTabs.length >= maxTabs) {
          // 닫을 수 있는 가장 오래된 탭을 찾기 (홈 탭이 아닌 것 중에서)
          let oldestClosableIndex = -1;
          for (let i = 1; i < prevTabs.length; i++) {
            // 첫 번째 탭(홈탭) 제외
            if (prevTabs[i].closable !== false) {
              oldestClosableIndex = i;
              break;
            }
          }

          if (oldestClosableIndex === -1) {
            // 상태 리셋
            setTimeout(() => {
              setIsTabClickNavigation(false);
            }, 300);
            return prevTabs; // 닫을 수 있는 탭이 없으면 추가하지 않음
          }

          // 선택된 탭을 제거
          const newTabs = prevTabs.filter(
            (_, index) => index !== oldestClosableIndex
          );

          // 새 탭 제목 생성 (pathname 기준으로 중복 탭인 경우 번호 추가)
          let tabTitle = normalizedPageInfo.title;
          if (normalizedPageInfo.allowDuplicate) {
            const basePath = normalizedPageInfo.path.split("?")[0];
            const samePathTabs = newTabs.filter((tab) => {
              const tabBasePath = tab.path.split("?")[0];
              return tabBasePath === basePath;
            });
            if (samePathTabs.length > 0) {
              tabTitle = `${normalizedPageInfo.title} (${
                samePathTabs.length + 1
              })`;
            }
          }

          // 새 탭을 맨 끝에 추가 (순서 정렬 없이)
          const updatedTabs = [
            ...newTabs,
            {
              id: tabId,
              title: tabTitle,
              path: normalizedPageInfo.path,
              icon: normalizedPageInfo.icon,
              closable: normalizedPageInfo.closable,
            },
          ];

          // 로컬 스토리지에 저장
          if (enableLocalStorage) {
            saveTabsToStorage(localStorageKey, updatedTabs, tabId);
          }

          return updatedTabs;
        }

        // 새 탭 추가 (pathname 기준으로 중복 탭인 경우 제목에 번호 추가)
        let tabTitle = finalTitle;
        if (normalizedPageInfo.allowDuplicate && !customTabName) {
          // 커스텀 탭 이름이 없을 때만 번호 추가
          const samePathTabsCount = countSamePathTabs(
            prevTabs,
            pathForComparison,
            getPathForTabComparison
          );
          if (samePathTabsCount > 0) {
            tabTitle = `${pageInfo.title} (${samePathTabsCount + 1})`;
          }
        }

        const updatedTabs = [
          ...prevTabs,
          {
            id: tabId,
            title: tabTitle,
            path: normalizedPageInfo.path,
            icon: normalizedPageInfo.icon,
            closable: normalizedPageInfo.closable,
          },
        ];

        // 로컬 스토리지에 저장
        if (enableLocalStorage) {
          saveTabsToStorage(localStorageKey, updatedTabs, tabId);
        }

        return updatedTabs;
      });

      // 새 탭을 활성화하고 해당 페이지로 이동
      setActiveTabId(tabId);

      // 네비게이션 후 상태 리셋
      setTimeout(() => {
        setIsTabClickNavigation(false);
      }, 300);

      router.push(normalizedPageInfo.path);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      generateTabId,
      maxTabs,
      enableLocalStorage,
      localStorageKey,
      router,
      normalizePath,
      getPathForTabComparison,
      extractTabNameFromQuery,
      findTab,
      countSamePathTabs,
    ]
  );

  // 탭 제거
  const removeTab = useCallback(
    (tabId: string) => {
      // 탭 제거 중 상태 설정
      setIsRemovingTab(true);

      setTabs((prevTabs) => {
        const tabIndex = prevTabs.findIndex((tab) => tab.id === tabId);
        if (tabIndex === -1) {
          setIsRemovingTab(false);
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

          // 즉시 상태 업데이트 - 더 빠른 반응을 위해
          setActiveTabId(newActiveTab.id);

          // 탭 닫기로 인한 네비게이션임을 표시
          setIsTabCloseNavigation(true);

          // 로컬 스토리지에 저장
          if (enableLocalStorage) {
            saveTabsToStorage(localStorageKey, newTabs, newActiveTab.id);
          }

          // 네비게이션은 즉시 실행
          router.push(newActiveTab.path);

          // 상태 리셋은 더 짧은 딜레이로
          setTimeout(() => {
            setIsRemovingTab(false);
            setIsTabCloseNavigation(false);
          }, 150);
        } else if (activeTabId === tabId && newTabs.length === 0) {
          // 모든 탭이 닫힌 경우
          // 즉시 상태 업데이트
          setActiveTabId(undefined);

          // 탭 닫기로 인한 네비게이션임을 표시
          setIsTabCloseNavigation(true);

          if (enableLocalStorage) {
            saveTabsToStorage(localStorageKey, newTabs, undefined);
          }

          // 네비게이션은 즉시 실행
          router.push(homePath);

          // 상태 리셋은 더 짧은 딜레이로
          setTimeout(() => {
            setIsRemovingTab(false);
            setIsTabCloseNavigation(false);
          }, 150);
        } else {
          // 비활성 탭을 닫은 경우
          if (enableLocalStorage) {
            saveTabsToStorage(localStorageKey, newTabs, activeTabId);
          }
          // 즉시 상태 리셋 - 비활성 탭은 네비게이션이 필요하지 않으므로
          setIsRemovingTab(false);
        }

        return newTabs;
      });
    },
    [activeTabId, router, homePath, enableLocalStorage, localStorageKey]
  );

  // 탭 활성화
  const activateTab = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (!tab) {
        return;
      }

      // 중복 허용 페이지이면서 tab-id가 없는 탭의 경우 tab-id 추가
      const [pathPart] = tab.path.split("?");
      const pageInfo = getPageInfo(normalizePath(pathPart));
      let finalPath = tab.path;

      if (pageInfo.allowDuplicate && !tab.path.includes("tab-id=")) {
        // 탭 ID에서 timestamp와 randomId 추출
        const tabIdParts = tab.id.split("-");
        if (tabIdParts.length >= 2) {
          const timestamp = tabIdParts[tabIdParts.length - 2];
          const randomId = tabIdParts[tabIdParts.length - 1];
          const tabIdParam = `tab-id=${timestamp}-${randomId}`;

          if (tab.path.includes("?")) {
            finalPath = `${tab.path}&${tabIdParam}`;
          } else {
            finalPath = `${tab.path}?${tabIdParam}`;
          }

          // 탭의 path를 업데이트
          setTabs((prevTabs) => {
            const updatedTabs = prevTabs.map((t) => {
              if (t.id === tabId) {
                return { ...t, path: finalPath };
              }
              return t;
            });

            // 로컬 스토리지에 저장
            if (enableLocalStorage) {
              saveTabsToStorage(localStorageKey, updatedTabs, tabId);
            }

            return updatedTabs;
          });
        }
      }

      // 탭 클릭으로 인한 네비게이션임을 먼저 표시 (더 오래 유지)
      setIsTabClickNavigation(true);

      // 먼저 탭을 활성화
      setActiveTabId(tabId);

      // 로컬 스토리지에 저장
      if (enableLocalStorage) {
        saveTabsToStorage(localStorageKey, tabs, tabId);
      }

      // 항상 해당 경로로 이동 (현재 경로와 같더라도)
      router.push(finalPath);

      // 네비게이션 완료 후 상태 리셋 - 더 길게 유지하여 useEffect 실행 방지
      setTimeout(() => {
        setIsTabClickNavigation(false);
      }, 300); // 50ms에서 300ms로 증가
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      tabs,
      router,
      enableLocalStorage,
      localStorageKey,
      pathname,
      getPageInfo,
      normalizePath,
    ]
  );

  // 모든 탭 비활성화
  const deactivateAllTabs = useCallback(() => {
    setActiveTabId(undefined);

    // 로컬 스토리지에 저장
    if (enableLocalStorage) {
      saveTabsToStorage(localStorageKey, tabs, undefined);
    }
  }, [tabs, enableLocalStorage, localStorageKey]);

  // 기존 탭 활성화 또는 새 탭 추가
  const activateOrAddTab = useCallback(
    (pageInfo: PageInfo) => {
      // 경로 정규화
      const [pathPart, queryPart] = pageInfo.path.split("?");
      let normalizedPath = normalizePath(pathPart);

      // 중복 허용 페이지이면서 tab-id가 없는 경우 자동으로 tab-id 생성
      if (pageInfo.allowDuplicate && !queryPart?.includes("tab-id=")) {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 5);
        const tabIdParam = `tab-id=${timestamp}-${randomId}`;

        if (queryPart) {
          normalizedPath += `?${queryPart}&${tabIdParam}`;
        } else {
          normalizedPath += `?${tabIdParam}`;
        }
      } else {
        normalizedPath += queryPart ? `?${queryPart}` : "";
      }

      const normalizedPageInfo = { ...pageInfo, path: normalizedPath };

      // 기존 탭 찾기 로직 개선 - 더 정확한 매칭
      let existingTab;
      if (normalizedPageInfo.allowDuplicate) {
        // 중복 허용 페이지는 완전히 동일한 경로(tab-id 포함)만 매칭
        // 기본 경로로는 매칭하지 않음 (각 탭이 고유한 tab-id를 유지해야 함)
        existingTab = tabs.find((tab) => tab.path === normalizedPath);
      } else {
        // 일반 페이지는 기존 로직 사용
        existingTab = findTab(tabs, normalizedPageInfo, normalizedPath);
      }

      if (existingTab) {
        // 기존 탭이 있으면 활성화 (순서 변경 없이)
        setActiveTabId(existingTab.id);

        // 일반 페이지만 기존 탭의 경로를 새로운 경로로 업데이트 (쿼리파라미터 변경 반영)
        // 중복 허용 페이지는 각 탭이 고유한 tab-id를 유지해야 하므로 path 업데이트 금지
        if (!normalizedPageInfo.allowDuplicate) {
          setTabs((prevTabs) => {
            const updatedTabs = prevTabs.map((tab) => {
              if (tab.id === existingTab.id) {
                // 쿼리 파라미터에서 탭 이름 확인
                const customTabName = extractTabNameFromQuery(normalizedPath);
                const newTitle =
                  customTabName || tab.title.replace(/ \(\d+\)$/, ""); // 기존 번호 제거

                return {
                  ...tab,
                  path: normalizedPath,
                  title: newTitle,
                };
              }
              return tab;
            });

            // 로컬 스토리지에 저장
            if (enableLocalStorage) {
              saveTabsToStorage(localStorageKey, updatedTabs, existingTab.id);
            }

            return updatedTabs;
          });
        }

        router.push(normalizedPageInfo.path);
        return;
      }

      // 기존 탭이 없는 경우에만 새 탭 추가
      addTab(normalizedPageInfo);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      tabs,
      addTab,
      setActiveTabId,
      router,
      enableLocalStorage,
      localStorageKey,
      normalizePath,
      findTab,
      extractTabNameFromQuery,
    ]
  );

  // 활성 탭의 경로 업데이트
  const updateActiveTabPath = useCallback(
    (newPath: string) => {
      if (!activeTabId) return;

      setTabs((prevTabs) => {
        const updatedTabs = prevTabs.map((tab) => {
          if (tab.id === activeTabId) {
            return { ...tab, path: newPath };
          }
          return tab;
        });

        // 로컬 스토리지에 저장
        if (enableLocalStorage) {
          saveTabsToStorage(localStorageKey, updatedTabs, activeTabId);
        }

        return updatedTabs;
      });
    },
    [activeTabId, enableLocalStorage, localStorageKey]
  );

  // 활성 탭의 제목과 경로 업데이트 - 의존성 최적화
  const updateActiveTabTitleAndPath = useCallback(
    (newPath: string) => {
      if (!activeTabId) return;

      setTabs((prevTabs) => {
        const updatedTabs = prevTabs.map((tab) => {
          if (tab.id === activeTabId) {
            // 쿼리 파라미터에서 탭 이름 확인 (함수 내에서 직접 호출)
            const customTabName = extractTabNameFromQuery(newPath);

            // 커스텀 탭 이름이 있으면 사용, 없으면 기존 제목 유지 (번호 제거)
            let newTitle = tab.title;
            if (customTabName) {
              newTitle = customTabName;
            } else {
              // 커스텀 이름이 없으면 기존 제목에서 번호 제거
              const basePath = newPath.split("?")[0];
              const pageInfo = getPageInfo(basePath);
              if (pageInfo) {
                newTitle = pageInfo.title;
              }
            }
            return { ...tab, path: newPath, title: newTitle };
          }
          return tab;
        });

        // 로컬 스토리지에 저장
        if (enableLocalStorage) {
          saveTabsToStorage(localStorageKey, updatedTabs, activeTabId);
        }

        return updatedTabs;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTabId, enableLocalStorage, localStorageKey] // 의존성 최소화
  );

  // 탭 순서 변경
  const reorderTabs = useCallback(
    (activeId: string, overId: string) => {
      if (activeId === overId) {
        return;
      }

      setTabs((prevTabs) => {
        const activeIndex = prevTabs.findIndex((tab) => tab.id === activeId);
        const overIndex = prevTabs.findIndex((tab) => tab.id === overId);

        if (activeIndex === -1 || overIndex === -1) {
          return prevTabs;
        }

        const newTabs = arrayMove(prevTabs, activeIndex, overIndex);

        // 로컬 스토리지에 저장
        if (enableLocalStorage) {
          saveTabsToStorage(localStorageKey, newTabs, activeTabId);
        }

        return newTabs;
      });
    },
    [enableLocalStorage, localStorageKey, activeTabId]
  );

  // 새 탭 생성 (홈 페이지)
  const createNewTab = useCallback(() => {
    const newPageInfo: PageInfo = {
      path: homePath,
      title: "새 탭",
      closable: true,
    };
    addTab(newPageInfo);
    router.push(homePath);
  }, [addTab, homePath, router]);

  // 중복 탭 강제 생성 (중복 허용 페이지용)
  const forceAddNewTab = useCallback(
    (pageInfo: PageInfo) => {
      // 경로 정규화
      const [pathPart, queryPart] = pageInfo.path.split("?");
      let normalizedPath = normalizePath(pathPart);

      // 고유한 tab-id 생성
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 5);
      const tabIdParam = `tab-id=${timestamp}-${randomId}`;

      if (queryPart) {
        // 기존 쿼리 파라미터가 있으면서 tab-id가 없으면 추가
        if (!queryPart.includes("tab-id=")) {
          normalizedPath += `?${queryPart}&${tabIdParam}`;
        } else {
          // 기존 tab-id를 새로운 것으로 교체
          const newQueryPart = queryPart.replace(/tab-id=[^&]*/, tabIdParam);
          normalizedPath += `?${newQueryPart}`;
        }
      } else {
        normalizedPath += `?${tabIdParam}`;
      }

      const normalizedPageInfo = {
        ...pageInfo,
        path: normalizedPath,
        allowDuplicate: true,
      };

      // addTab 함수가 이미 탭 네비게이션 상태를 설정하므로 그대로 사용
      addTab(normalizedPageInfo);
    },
    [addTab, normalizePath]
  );

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

  // TabBar 컴포넌트용 탭 클릭 핸들러
  const handleTabClick = useCallback(
    (tab: TabItem) => {
      activateTab(tab.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activateTab, activeTabId]
  );

  // 초기화 시 정확한 탭 활성화
  useEffect(() => {
    if (isInitialized) {
      return;
    }

    // 현재 전체 경로 (쿼리 파라미터 포함) - pathname을 먼저 정규화
    const normalizedPathname = normalizePath(pathname);
    let currentFullPath = normalizedPathname;
    if (typeof window !== "undefined") {
      try {
        const queryString = searchParams ? searchParams.toString() : "";
        currentFullPath =
          normalizedPathname + (queryString ? `?${queryString}` : "");
      } catch {
        currentFullPath = normalizedPathname + (window.location.search || "");
      }
    }

    if (tabs.length > 0) {
      // 탭이 있는 경우에만 기존 탭 활성화 로직 수행
      // 전체 경로가 정확히 일치하는 탭 찾기
      const exactMatchTab = tabs.find((tab) => {
        return tab.path === currentFullPath;
      });

      if (exactMatchTab) {
        setActiveTabId(exactMatchTab.id);
      } else {
        // 정확히 일치하는 탭이 없으면 pathname만으로 일치하는 탭 찾기
        const normalizedPathname = normalizePath(pathname);

        const pathMatchTab = tabs.find((tab) => {
          const tabBasePath = tab.path.split("?")[0];
          return tabBasePath === normalizedPathname;
        });

        if (pathMatchTab) {
          setActiveTabId(pathMatchTab.id);
        }
      }
    }

    setIsInitialized(true);
  }, [tabs, pathname, searchParams, isInitialized, normalizePath]);

  // 경로 변경 시 탭 상태 업데이트 - 기존 탭 활성화 및 활성 탭 경로 업데이트
  useEffect(() => {
    // 탭 제거 중이거나 초기화되지 않았거나 탭 닫기로 인한 네비게이션이거나 탭 클릭 네비게이션이거나 탭 생성 중이면 처리 방지
    if (
      isRemovingTab ||
      !isInitialized ||
      isTabCloseNavigation ||
      isTabClickNavigation ||
      isCreatingNewTab
    ) {
      return;
    }

    // 현재 전체 경로 (쿼리 파라미터 포함) - 클라이언트 사이드에서만 처리
    const normalizedPathname = normalizePath(pathname);
    let currentFullPath = normalizedPathname;
    if (typeof window !== "undefined") {
      try {
        const queryString = searchParams ? searchParams.toString() : "";
        currentFullPath =
          normalizedPathname + (queryString ? `?${queryString}` : "");
      } catch {
        // searchParams 에러 시 window.location.search 사용
        currentFullPath = normalizedPathname + (window.location.search || "");
      }
    }

    // 홈 경로인 경우 모든 탭 비활성화
    if (normalizedPathname === homePath) {
      setActiveTabId(undefined);
      return;
    }

    // 현재 활성화된 탭이 있고, 그 탭의 base path가 현재 pathname과 일치하는 경우
    // 쿼리 파라미터만 변경된 것으로 간주하고 탭의 경로를 업데이트
    if (activeTabId) {
      const activeTab = tabs.find((tab) => tab.id === activeTabId);
      if (activeTab) {
        const activeTabBasePath = activeTab.path.split("?")[0];

        if (
          activeTabBasePath === normalizedPathname &&
          activeTab.path !== currentFullPath
        ) {
          // 탭 클릭으로 인한 네비게이션이 아닐 때만 경로와 제목 업데이트
          if (!isTabClickNavigation) {
            updateActiveTabTitleAndPath(currentFullPath);
          }
          return;
        }
      }
    }

    // 페이지 정보를 먼저 가져와서 중복 허용 여부 확인
    const pageInfo = getPageInfo(normalizedPathname);

    // 중복 허용 페이지 처리 - 직접 탭 생성 (무한 루프 방지)
    if (pageInfo.allowDuplicate && !currentFullPath.includes("tab-id=")) {
      if (autoCreateTabOnNavigation && normalizedPathname !== homePath) {
        // tab-id 자동 생성
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 5);
        const tabIdParam = `tab-id=${timestamp}-${randomId}`;

        let finalPath;
        if (currentFullPath.includes("?")) {
          finalPath = `${currentFullPath}&${tabIdParam}`;
        } else {
          finalPath = `${currentFullPath}?${tabIdParam}`;
        }

        // 탭 생성 중 플래그 설정 (무한 루프 방지)
        setIsCreatingNewTab(true);
        setIsTabClickNavigation(true);

        // 탭 ID 생성
        const [pathPart] = normalizedPathname.split("?");
        const tabId = `tab-${
          normalizePath(pathPart).replace(/\//g, "-").replace(/^-/, "") ||
          "home"
        }-${timestamp}-${randomId}`;

        // 직접 탭 추가 (addTab 함수 사용하지 않음 - 무한 루프 방지)
        setTabs((prevTabs) => {
          // 이미 같은 경로의 탭이 있는지 확인
          const existingTab = prevTabs.find((tab) => tab.path === finalPath);
          if (existingTab) {
            return prevTabs;
          }

          // 새 탭 추가
          const newTab = {
            id: tabId,
            title: pageInfo.title,
            path: finalPath,
            icon: pageInfo.icon,
            closable: pageInfo.closable,
          };

          const updatedTabs = [...prevTabs, newTab];

          // 로컬 스토리지에 저장
          if (enableLocalStorage) {
            saveTabsToStorage(localStorageKey, updatedTabs, tabId);
          }

          return updatedTabs;
        });

        setActiveTabId(tabId);

        // 상태 리셋
        setTimeout(() => {
          setIsTabClickNavigation(false);
          setIsCreatingNewTab(false);
        }, 500);

        // URL 업데이트 (router.push 대신 replaceState 사용해서 useEffect 재실행 방지)
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", finalPath);
        }

        return; // 여기서 return해서 아래 로직 실행 방지
      }
    }

    // 일반적인 탭 매칭 로직 (중복 허용 페이지는 위에서 이미 처리됨)
    let matchingTab = null;
    if (!pageInfo.allowDuplicate) {
      // 일반 페이지만 처리 (중복 허용 페이지는 위에서 이미 처리됨)
      matchingTab = findMatchingTab(
        tabs,
        currentFullPath,
        getPathForTabComparison
      );

      if (matchingTab) {
        // 일반 페이지만 탭 클릭으로 인한 네비게이션이 아니고 경로가 다르면 제목과 경로 업데이트
        if (matchingTab.path !== currentFullPath && !isTabClickNavigation) {
          updateActiveTabTitleAndPath(currentFullPath);
        }
        // 이미 올바른 탭이 활성화되어 있으면 변경하지 않음
        if (activeTabId !== matchingTab.id) {
          setActiveTabId(matchingTab.id);
        }
      } else {
        // 일치하는 탭이 없는 일반 페이지의 경우
        if (autoCreateTabOnNavigation && normalizedPathname !== homePath) {
          // 일반 페이지 새 탭 생성 - addTab 함수 사용
          addTab(pageInfo);
        } else {
          // 자동 탭 생성이 비활성화되거나 홈 경로인 경우 활성 탭 ID를 undefined로 설정
          if (activeTabId !== undefined) {
            setActiveTabId(undefined);
          }
        }
      }
    }

    // 탭 클릭 네비게이션 상태 리셋 - 더 이상 여기서 리셋하지 않음 (초기 방지 조건으로 이동)
    // if (isTabClickNavigation) {
    //   setIsTabClickNavigation(false);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pathname,
    searchParams,
    isRemovingTab,
    isInitialized,
    isTabCloseNavigation,
    isTabClickNavigation,
    isCreatingNewTab,
    homePath,
    normalizePath,
    tabs,
    activeTabId,
    updateActiveTabTitleAndPath,
    getPathForTabComparison,
    autoCreateTabOnNavigation,
    findMatchingTab,
    generateTabId,
    findTab,
    router,
    enableLocalStorage,
    localStorageKey,
    getPageInfo,
    // 직접 호출하는 함수들 의존성 추가
  ]);

  // 두 번째 useEffect 제거 - 중복 탭 생성 방지

  return {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    activateTab,
    deactivateAllTabs,
    activateOrAddTab,
    reorderTabs,
    createNewTab,
    forceAddNewTab,
    closeAllTabs,
    closeOtherTabs,
    addCurrentPageAsTab,
    updateActiveTabPath,
    handleTabClick,
  };
}
