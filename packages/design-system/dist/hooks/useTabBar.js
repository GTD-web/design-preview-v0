"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { arrayMove } from "@dnd-kit/sortable";
/**
 * 로컬 스토리지에서 탭 데이터 로드
 */
const loadTabsFromStorage = (key) => {
    if (typeof window === "undefined")
        return null;
    try {
        const saved = localStorage.getItem(key);
        if (!saved)
            return null;
        const parsed = JSON.parse(saved);
        return {
            tabs: parsed.tabs || [],
            activeTabId: parsed.activeTabId,
        };
    }
    catch (error) {
        console.warn("Failed to load tabs from localStorage:", error);
        return null;
    }
};
/**
 * 로컬 스토리지에 탭 데이터 저장
 */
const saveTabsToStorage = (key, tabs, activeTabId) => {
    if (typeof window === "undefined")
        return;
    try {
        const data = {
            tabs: tabs.map((tab) => ({ ...tab, icon: undefined })), // icon은 serialize 불가능하므로 제외
            activeTabId,
            timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(data));
    }
    catch (error) {
        console.warn("Failed to save tabs to localStorage:", error);
    }
};
/**
 * 탭 바 상태 관리를 위한 Hook
 */
export function useTabBar({ initialTabs = [], maxTabs = 10, pageMapping = {}, homePath = "/design-example", pathNormalizer, defaultPageInfoResolver, enableLocalStorage = true, localStorageKey = "tabbar-tabs", ignoreQueryParamsForPaths = [], autoCreateTabOnNavigation = false, } = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
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
    const [tabs, setTabs] = useState(initialState.tabs);
    const [activeTabId, setActiveTabId] = useState(initialState.activeTabId);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isRemovingTab, setIsRemovingTab] = useState(false);
    const [isTabClickNavigation, setIsTabClickNavigation] = useState(false);
    // 경로 정규화 (외부에서 제공되면 사용, 아니면 기본 정규화)
    const normalizePath = useCallback((path) => {
        if (pathNormalizer) {
            return pathNormalizer(path);
        }
        // 기본 정규화: 마지막 슬래시 제거
        let normalized = path.replace(/\/$/, "");
        if (!normalized)
            normalized = "/";
        return normalized;
    }, [pathNormalizer]);
    // 경로에서 탭 ID 생성 (중복 허용 시 고유 ID 생성)
    const generateTabId = useCallback((path, allowDuplicate = false) => {
        const normalized = normalizePath(path);
        const baseId = `tab-${normalized.replace(/\//g, "-").replace(/^-/, "") || "home"}`;
        if (!allowDuplicate) {
            return baseId;
        }
        // 중복 허용 시 고유 ID 생성
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 5);
        return `${baseId}-${timestamp}-${random}`;
    }, [normalizePath]);
    // 페이지 정보 가져오기 - React 컴포넌트 때문에 pageMapping을 의존성에서 제외
    const getPageInfo = useCallback((path) => {
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
        const defaultPageInfo = {
            path: normalizedPath,
            title: normalizedPath.split("/").pop()?.replace(/[-_]/g, " ") || "Page",
            closable: normalizedPath !== homePath,
        };
        return defaultPageInfo;
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homePath, normalizePath, defaultPageInfoResolver]);
    // tab-name 쿼리 파라미터를 제외한 정규화된 경로 생성
    const getNormalizedPathWithoutTabName = useCallback((path) => {
        try {
            const url = new URL(path, "http://localhost");
            // tab-name 파라미터 제거
            url.searchParams.delete("tab-name");
            // pathname + 나머지 쿼리 파라미터 반환
            const normalizedPathname = normalizePath(url.pathname);
            const searchString = url.searchParams.toString();
            return normalizedPathname + (searchString ? `?${searchString}` : "");
        }
        catch {
            // URL 파싱 실패 시 기본 정규화만 적용
            const [pathPart] = path.split("?");
            return normalizePath(pathPart);
        }
    }, [normalizePath]);
    // 탭 구별을 위한 더 엄격한 경로 비교 함수
    const getPathForTabComparison = useCallback((path) => {
        try {
            const url = new URL(path, "http://localhost");
            const normalizedPathname = normalizePath(url.pathname);
            // 해당 pathname이 쿼리파라미터를 무시할 경로에 포함되어 있으면 쿼리 파라미터 제거
            const shouldIgnoreQueryParams = ignoreQueryParamsForPaths.some((ignorePath) => {
                return normalizedPathname === normalizePath(ignorePath);
            });
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
        }
        catch {
            // URL 파싱 실패 시 기본 정규화만 적용
            const [pathPart] = path.split("?");
            return normalizePath(pathPart);
        }
    }, [normalizePath, ignoreQueryParamsForPaths]);
    // 쿼리 파라미터에서 탭 이름 추출
    const extractTabNameFromQuery = useCallback((path) => {
        try {
            const url = new URL(path, "http://localhost");
            const tabName = url.searchParams.get("tab-name");
            // console.log("extractTabNameFromQuery - path:", path);
            // console.log("extractTabNameFromQuery - raw tabName:", tabName);
            if (!tabName)
                return null;
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
                    }
                    else {
                        break;
                    }
                }
                catch (decodeError) {
                    console.warn("extractTabNameFromQuery - decode error:", decodeError);
                    break;
                }
            }
            // console.log("extractTabNameFromQuery - final decoded:", decodedName);
            return decodedName;
        }
        catch (error) {
            console.error("extractTabNameFromQuery - error:", error);
            return null;
        }
    }, []);
    // 탭 추가
    const addTab = useCallback((pageInfo) => {
        // 경로 정규화 - pathname 부분만 정규화하고 쿼리 파라미터는 그대로 유지
        const [pathPart, queryPart] = pageInfo.path.split("?");
        const normalizedPath = normalizePath(pathPart) + (queryPart ? `?${queryPart}` : "");
        // 쿼리 파라미터에서 탭 이름 확인
        const customTabName = extractTabNameFromQuery(normalizedPath);
        // console.log("addTab - normalizedPath:", normalizedPath);
        // console.log("addTab - customTabName:", customTabName);
        // console.log("addTab - pageInfo.title:", pageInfo.title);
        const finalTitle = customTabName || pageInfo.title;
        // console.log("addTab - finalTitle:", finalTitle);
        // 정확한 쿼리 파라미터 비교를 위한 경로 생성 (탭의 고유성 판단)
        const pathForComparison = getPathForTabComparison(normalizedPath);
        // console.log("addTab - pathForComparison:", pathForComparison);
        const normalizedPageInfo = {
            ...pageInfo,
            path: normalizedPath,
            title: finalTitle,
        };
        // 탭 ID는 정확한 비교 경로로 생성
        const tabId = generateTabId(pathForComparison, normalizedPageInfo.allowDuplicate);
        setTabs((prevTabs) => {
            // 정확한 쿼리 파라미터 비교로 기존 탭 찾기
            const existingTab = prevTabs.find((tab) => {
                const tabPathForComparison = getPathForTabComparison(tab.path);
                return tabPathForComparison === pathForComparison;
            });
            if (existingTab) {
                // 기존 탭이 있으면 제목과 경로만 업데이트
                // console.log("addTab - Updating existing tab:", existingTab.id);
                const updatedTabs = prevTabs.map((tab) => {
                    if (tab.id === existingTab.id) {
                        return { ...tab, path: normalizedPath, title: finalTitle };
                    }
                    return tab;
                });
                // 기존 탭 활성화
                setActiveTabId(existingTab.id);
                router.push(normalizedPath);
                // 로컬 스토리지에 저장
                if (enableLocalStorage) {
                    saveTabsToStorage(localStorageKey, updatedTabs, existingTab.id);
                }
                return updatedTabs;
            }
            // 최대 탭 개수 체크
            if (prevTabs.length >= maxTabs) {
                // 가장 오래된 탭을 제거 (첫 번째 탭 제외 - 보통 홈탭)
                const newTabs = prevTabs.slice(1, -1);
                // 새 탭 제목 생성 (pathname 기준으로 중복 탭인 경우 번호 추가)
                let tabTitle = normalizedPageInfo.title;
                if (normalizedPageInfo.allowDuplicate) {
                    const basePath = normalizedPageInfo.path.split("?")[0];
                    const samePathTabs = prevTabs.filter((tab) => {
                        const tabBasePath = tab.path.split("?")[0];
                        return tabBasePath === basePath;
                    });
                    if (samePathTabs.length > 0) {
                        tabTitle = `${normalizedPageInfo.title} (${samePathTabs.length + 1})`;
                    }
                }
                const updatedTabs = [
                    prevTabs[0], // 홈 탭 유지
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
            // console.log(
            //   "addTab numbering - normalizedPageInfo.allowDuplicate:",
            //   normalizedPageInfo.allowDuplicate
            // );
            // console.log("addTab numbering - customTabName:", customTabName);
            // console.log("addTab numbering - finalTitle:", finalTitle);
            if (normalizedPageInfo.allowDuplicate && !customTabName) {
                // console.log("addTab numbering - Adding number to tab title");
                // 커스텀 탭 이름이 없을 때만 번호 추가
                // 정확한 비교로 같은 기본 경로를 가진 탭들 찾기
                const samePathTabs = prevTabs.filter((tab) => {
                    const tabPathForComparison = getPathForTabComparison(tab.path);
                    return tabPathForComparison === pathForComparison;
                });
                if (samePathTabs.length > 0) {
                    tabTitle = `${pageInfo.title} (${samePathTabs.length + 1})`;
                    // console.log("addTab numbering - tabTitle set to:", tabTitle);
                }
            }
            else {
                // console.log("addTab numbering - Using custom title:", tabTitle);
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
    ]);
    // 탭 제거
    const removeTab = useCallback((tabId) => {
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
                const nextActiveIndex = Math.max(0, Math.min(tabIndex - 1, newTabs.length - 1));
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
                    }, 200);
                }, 0);
            }
            else if (activeTabId === tabId && newTabs.length === 0) {
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
                    }, 200);
                }, 0);
            }
            else {
                // 비활성 탭을 닫은 경우
                if (enableLocalStorage) {
                    saveTabsToStorage(localStorageKey, newTabs, activeTabId);
                }
                setIsRemovingTab(false);
                // 비활성 탭 제거 시에도 일정 시간 재생성 방지
            }
            return newTabs;
        });
    }, [activeTabId, router, homePath, enableLocalStorage, localStorageKey]);
    // 탭 활성화
    const activateTab = useCallback((tabId) => {
        // console.log("activateTab: Starting activation for tabId:", tabId);
        // console.log(
        //   "activateTab: Available tabs:",
        //   tabs.map((t) => ({ id: t.id, title: t.title, path: t.path }))
        // );
        const tab = tabs.find((t) => t.id === tabId);
        if (!tab) {
            console.error("activateTab: Tab not found for id:", tabId);
            return;
        }
        // console.log("activateTab: Found tab:", {
        //   id: tab.id,
        //   title: tab.title,
        //   path: tab.path,
        // });
        // console.log("activateTab: Current pathname:", pathname);
        // console.log("activateTab: Router object:", !!router);
        // 먼저 탭을 활성화
        // console.log("activateTab: Setting activeTabId to:", tabId);
        setActiveTabId(tabId);
        // 로컬 스토리지에 저장
        if (enableLocalStorage) {
            // console.log("activateTab: Saving to localStorage");
            saveTabsToStorage(localStorageKey, tabs, tabId);
        }
        // 탭 클릭으로 인한 네비게이션임을 표시
        // console.log("activateTab: Setting isTabClickNavigation to true");
        setIsTabClickNavigation(true);
        // 항상 해당 경로로 이동 (현재 경로와 같더라도)
        // console.log("activateTab: Navigating to", tab.path);
        try {
            router.push(tab.path);
            // console.log("activateTab: Navigation initiated successfully");
        }
        catch {
            // console.error("activateTab: Navigation failed:", error);
        }
        // 네비게이션 완료 후 상태 리셋 - 더 빠르게
        setTimeout(() => {
            // console.log("activateTab: Resetting isTabClickNavigation to false");
            setIsTabClickNavigation(false);
        }, 50);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tabs, router, enableLocalStorage, localStorageKey, pathname]);
    // 모든 탭 비활성화
    const deactivateAllTabs = useCallback(() => {
        setActiveTabId(undefined);
        // 로컬 스토리지에 저장
        if (enableLocalStorage) {
            saveTabsToStorage(localStorageKey, tabs, undefined);
        }
    }, [tabs, enableLocalStorage, localStorageKey]);
    // 기존 탭 활성화 또는 새 탭 추가
    const activateOrAddTab = useCallback((pageInfo) => {
        // 경로 정규화
        const [pathPart, queryPart] = pageInfo.path.split("?");
        const normalizedPath = normalizePath(pathPart) + (queryPart ? `?${queryPart}` : "");
        const normalizedPageInfo = { ...pageInfo, path: normalizedPath };
        // 비교를 위한 경로 생성
        const pathForComparison = getPathForTabComparison(normalizedPath);
        // 동일한 비교 경로를 가진 탭 찾기 (쿼리파라미터 무시 설정 적용)
        const existingTab = tabs.find((tab) => {
            const tabPathForComparison = getPathForTabComparison(tab.path);
            return tabPathForComparison === pathForComparison;
        });
        if (existingTab) {
            // 일치하는 탭이 있으면 활성화하고 새로운 경로로 업데이트
            setActiveTabId(existingTab.id);
            // 기존 탭의 경로를 새로운 경로로 업데이트 (쿼리파라미터 변경 반영)
            setTabs((prevTabs) => {
                const updatedTabs = prevTabs.map((tab) => {
                    if (tab.id === existingTab.id) {
                        return { ...tab, path: normalizedPath };
                    }
                    return tab;
                });
                // 로컬 스토리지에 저장
                if (enableLocalStorage) {
                    saveTabsToStorage(localStorageKey, updatedTabs, existingTab.id);
                }
                return updatedTabs;
            });
            router.push(normalizedPageInfo.path);
            return;
        }
        // 일치하는 탭이 없으면 새 탭 추가
        addTab(normalizedPageInfo);
    }, [
        tabs,
        addTab,
        setActiveTabId,
        router,
        enableLocalStorage,
        localStorageKey,
        normalizePath,
        getPathForTabComparison,
    ]);
    // 활성 탭의 경로 업데이트
    const updateActiveTabPath = useCallback((newPath) => {
        if (!activeTabId)
            return;
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
    }, [activeTabId, enableLocalStorage, localStorageKey]);
    // 활성 탭의 제목과 경로 업데이트
    const updateActiveTabTitleAndPath = useCallback((newPath) => {
        if (!activeTabId)
            return;
        // 쿼리 파라미터에서 탭 이름 확인
        const customTabName = extractTabNameFromQuery(newPath);
        // console.log("updateActiveTabTitleAndPath - newPath:", newPath);
        // (
        //   "updateActiveTabTitleAndPath - customTabName:",
        //   customTabName
        // );
        setTabs((prevTabs) => {
            const updatedTabs = prevTabs.map((tab) => {
                if (tab.id === activeTabId) {
                    // 커스텀 탭 이름이 있으면 사용, 없으면 기존 제목 유지 (번호 제거)
                    let newTitle = tab.title;
                    if (customTabName) {
                        newTitle = customTabName;
                        // console.log(
                        //   "updateActiveTabTitleAndPath - Setting custom title:",
                        //   customTabName
                        // );
                    }
                    else {
                        // 커스텀 이름이 없으면 기존 제목에서 번호 제거
                        const basePath = newPath.split("?")[0];
                        const pageInfo = getPageInfo(basePath);
                        if (pageInfo) {
                            newTitle = pageInfo.title;
                            // console.log(
                            //   "updateActiveTabTitleAndPath - Resetting to base title:",
                            //   newTitle
                            // );
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
    }, [
        activeTabId,
        enableLocalStorage,
        localStorageKey,
        extractTabNameFromQuery,
        getPageInfo,
    ]);
    // 탭 순서 변경
    const reorderTabs = useCallback((activeId, overId) => {
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
    }, [enableLocalStorage, localStorageKey, activeTabId]);
    // 새 탭 생성
    const createNewTab = useCallback(() => {
        const newPageInfo = {
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
        }
        else {
            setActiveTabId(undefined);
            // 로컬 스토리지에 저장
            if (enableLocalStorage) {
                saveTabsToStorage(localStorageKey, homeTabs, undefined);
            }
            router.push(homePath);
        }
    }, [tabs, homePath, router, enableLocalStorage, localStorageKey]);
    // 다른 탭 모두 닫기
    const closeOtherTabs = useCallback((keepTabId) => {
        setTabs((prevTabs) => {
            const keepTab = prevTabs.find((tab) => tab.id === keepTabId);
            const homeTabs = prevTabs.filter((tab) => !tab.closable);
            let newTabs = [];
            if (keepTab) {
                newTabs = [...homeTabs];
                if (!newTabs.find((tab) => tab.id === keepTabId)) {
                    newTabs.push(keepTab);
                }
            }
            else {
                newTabs = homeTabs;
            }
            // 로컬 스토리지에 저장
            if (enableLocalStorage) {
                saveTabsToStorage(localStorageKey, newTabs, keepTabId);
            }
            return newTabs;
        });
        setActiveTabId(keepTabId);
    }, [enableLocalStorage, localStorageKey]);
    // 현재 페이지를 탭으로 추가
    const addCurrentPageAsTab = useCallback(() => {
        const normalizedPathname = normalizePath(pathname);
        const pageInfo = getPageInfo(normalizedPathname);
        addTab(pageInfo);
    }, [pathname, getPageInfo, addTab, normalizePath]);
    // TabBar 컴포넌트용 탭 클릭 핸들러
    const handleTabClick = useCallback((tab) => {
        // console.log(
        //   "useTabBar: handleTabClick called with tab:",
        //   tab.title,
        //   "id:",
        //   tab.id,
        //   "path:",
        //   tab.path
        // );
        // console.log("useTabBar: Current activeTabId:", activeTabId);
        // console.log("useTabBar: Calling activateTab...");
        activateTab(tab.id);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activateTab, activeTabId]);
    // 초기화 시 정확한 탭 활성화
    useEffect(() => {
        if (isInitialized || tabs.length === 0)
            return;
        // 현재 전체 경로 (쿼리 파라미터 포함) - pathname을 먼저 정규화
        const normalizedPathname = normalizePath(pathname);
        let currentFullPath = normalizedPathname;
        if (typeof window !== "undefined") {
            try {
                const queryString = searchParams ? searchParams.toString() : "";
                currentFullPath =
                    normalizedPathname + (queryString ? `?${queryString}` : "");
            }
            catch {
                currentFullPath = normalizedPathname + (window.location.search || "");
            }
        }
        // 전체 경로가 정확히 일치하는 탭 찾기
        const exactMatchTab = tabs.find((tab) => {
            return tab.path === currentFullPath;
        });
        if (exactMatchTab) {
            setActiveTabId(exactMatchTab.id);
        }
        else {
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
        setIsInitialized(true);
    }, [tabs, pathname, searchParams, isInitialized, normalizePath]);
    // 경로 변경 시 탭 상태 업데이트 - 기존 탭 활성화 및 활성 탭 경로 업데이트
    useEffect(() => {
        // 탭 제거 중이거나 초기화되지 않았으면 처리 방지
        if (isRemovingTab || !isInitialized)
            return;
        // 현재 전체 경로 (쿼리 파라미터 포함) - 클라이언트 사이드에서만 처리
        const normalizedPathname = normalizePath(pathname);
        let currentFullPath = normalizedPathname;
        if (typeof window !== "undefined") {
            try {
                const queryString = searchParams ? searchParams.toString() : "";
                currentFullPath =
                    normalizedPathname + (queryString ? `?${queryString}` : "");
            }
            catch {
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
                if (activeTabBasePath === normalizedPathname &&
                    activeTab.path !== currentFullPath) {
                    // 탭 클릭으로 인한 네비게이션이 아닐 때만 경로와 제목 업데이트
                    if (!isTabClickNavigation) {
                        updateActiveTabTitleAndPath(currentFullPath);
                    }
                    return;
                }
            }
        }
        // 정확한 쿼리 파라미터 비교를 위한 현재 경로 생성
        const currentPathForComparison = getPathForTabComparison(currentFullPath);
        // console.log(
        //   "Path change: currentPathForComparison:",
        //   currentPathForComparison
        // );
        // 정확한 쿼리 파라미터 비교로 일치하는 탭 찾기
        const matchingTab = tabs.find((tab) => {
            const tabPathForComparison = getPathForTabComparison(tab.path);
            return tabPathForComparison === currentPathForComparison;
        });
        if (matchingTab) {
            // console.log("Path change: Found matching tab:", matchingTab.id);
            // 탭 클릭으로 인한 네비게이션이 아니고 경로가 다르면 제목과 경로 업데이트
            if (matchingTab.path !== currentFullPath && !isTabClickNavigation) {
                // console.log("Path change: Updating tab title and path");
                updateActiveTabTitleAndPath(currentFullPath);
            }
            // 이미 올바른 탭이 활성화되어 있으면 변경하지 않음
            if (activeTabId !== matchingTab.id) {
                // console.log("Path change: Setting activeTabId to:", matchingTab.id);
                setActiveTabId(matchingTab.id);
            }
        }
        else {
            // 일치하는 탭이 없는 경우
            if (autoCreateTabOnNavigation && normalizedPathname !== homePath) {
                // 자동 탭 생성이 활성화되어 있고 홈 경로가 아닌 경우 새 탭 생성
                // console.log("Path change: Auto-creating new tab for:", currentFullPath);
                const pageInfo = getPageInfo(normalizedPathname);
                const pageInfoWithQuery = {
                    ...pageInfo,
                    path: currentFullPath,
                };
                addTab(pageInfoWithQuery);
            }
            else {
                // 자동 탭 생성이 비활성화되거나 홈 경로인 경우 활성 탭 ID를 undefined로 설정
                if (activeTabId !== undefined) {
                    // console.log("Path change: No matching tab found, deactivating");
                    setActiveTabId(undefined);
                }
            }
        }
        // 탭 클릭 네비게이션 상태 리셋
        if (isTabClickNavigation) {
            setIsTabClickNavigation(false);
        }
    }, [
        pathname,
        searchParams,
        isRemovingTab,
        isInitialized,
        homePath,
        normalizePath,
        tabs,
        activeTabId,
        updateActiveTabTitleAndPath,
        isTabClickNavigation,
        getPathForTabComparison,
        autoCreateTabOnNavigation,
        getPageInfo,
        addTab,
    ]);
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
        closeAllTabs,
        closeOtherTabs,
        addCurrentPageAsTab,
        updateActiveTabPath,
        handleTabClick,
    };
}
