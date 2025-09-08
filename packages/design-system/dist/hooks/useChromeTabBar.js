"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { loadTabsFromStorage, saveTabsToStorage } from "./tabStorageUtils";
import { createPathNormalizer, createTabIdGenerator, extractTabNameFromQuery, } from "./tabPathUtils";
/**
 * 크롬 스타일 탭 바 상태 관리를 위한 Hook
 */
export function useChromeTabBar({ initialTabs = [], maxTabs = 10, pageMapping = {}, homePath = "/design-example", pathNormalizer, defaultPageInfoResolver, enableLocalStorage = true, localStorageKey = "chrome-tabbar-tabs", 
// ignoreQueryParamsForPaths = [], // 현재 사용하지 않음
// autoCreateTabOnNavigation = false, // 현재 사용하지 않음
allowDuplicatesByQuery = true, 
// darkMode = false, // 현재 사용하지 않음
faviconResolver, } = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    // 유틸리티 함수들 생성
    const normalizePath = useMemo(() => createPathNormalizer(pathNormalizer), [pathNormalizer]);
    const generateTabId = useMemo(() => createTabIdGenerator(normalizePath), [normalizePath]);
    // const getPathForTabComparison = useMemo(
    //   () => createPathComparer(normalizePath, ignoreQueryParamsForPaths),
    //   [normalizePath, ignoreQueryParamsForPaths]
    // ); // 현재 사용하지 않음
    // 로컬 스토리지에서 초기 데이터 로드
    const getInitialState = useCallback(() => {
        if (enableLocalStorage) {
            const saved = loadTabsFromStorage(localStorageKey);
            if (saved && saved.tabs.length > 0) {
                // 저장된 탭들을 ChromeTabItem 형식으로 복원
                const restoredTabs = saved.tabs.map((tab) => {
                    return {
                        id: tab.id,
                        title: tab.title,
                        path: tab.path,
                        favicon: faviconResolver?.(tab.path) || undefined,
                        active: tab.id === saved.activeTabId,
                    };
                });
                return {
                    tabs: restoredTabs,
                    activeTabId: saved.activeTabId,
                };
            }
        }
        // 초기 탭들을 ChromeTabItem 형식으로 변환
        const chromeTabItems = initialTabs.map((tab) => ({
            id: tab.id,
            title: tab.title,
            path: tab.path,
            favicon: faviconResolver?.(tab.path) || undefined,
            active: false,
        }));
        const activeTab = chromeTabItems.find((tab) => {
            const tabBasePath = tab.path.split("?")[0];
            return tabBasePath === pathname;
        });
        if (activeTab) {
            activeTab.active = true;
        }
        return {
            tabs: chromeTabItems,
            activeTabId: activeTab?.id,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        enableLocalStorage,
        localStorageKey,
        initialTabs,
        pathname,
        pageMapping,
        faviconResolver,
    ]);
    const [initialState] = useState(getInitialState);
    // 탭 상태
    const [tabs, setTabs] = useState(initialState.tabs);
    const [activeTabId, setActiveTabId] = useState(initialState.activeTabId);
    const [isInitialized, setIsInitialized] = useState(false);
    // 페이지 정보 가져오기
    const getPageInfo = useCallback((path) => {
        const normalizedPath = normalizePath(path);
        if (pageMapping[normalizedPath]) {
            return { ...pageMapping[normalizedPath], path: normalizedPath };
        }
        if (defaultPageInfoResolver) {
            return defaultPageInfoResolver(normalizedPath, homePath);
        }
        const defaultPageInfo = {
            path: normalizedPath,
            title: normalizedPath.split("/").pop()?.replace(/[-_]/g, " ") || "Page",
            closable: normalizedPath !== homePath,
        };
        return defaultPageInfo;
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [homePath, normalizePath, defaultPageInfoResolver]
    // pageMapping은 매번 최신값을 참조하므로 의존성에서 제외
    );
    // 고유한 탭 ID 생성 (중복 탭 허용을 위해 쿼리파라미터 포함)
    const generateUniqueTabId = useCallback((path, allowDuplicate = false) => {
        if (allowDuplicatesByQuery || allowDuplicate) {
            // 중복 허용 시 전체 경로(쿼리파라미터 포함)로 고유 ID 생성
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substr(2, 8);
            return `${path.replace(/[^a-zA-Z0-9]/g, "_")}_${timestamp}_${randomSuffix}`;
        }
        else {
            // 중복 허용 안 할 시 기존 방식
            return generateTabId(path, false);
        }
    }, [allowDuplicatesByQuery, generateTabId]);
    // 고유한 탭 ID를 포함한 경로 생성
    const generatePathWithTabId = useCallback((basePath, allowDuplicate = false) => {
        if (!allowDuplicate && !allowDuplicatesByQuery) {
            return basePath;
        }
        // 고유한 탭 ID 생성
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substr(2, 6);
        const tabId = `tab_${timestamp}_${randomSuffix}`;
        // 기존 쿼리파라미터가 있는지 확인
        const [pathPart, existingQuery] = basePath.split("?");
        const searchParams = new URLSearchParams(existingQuery || "");
        // tab-id 추가
        searchParams.set("tab-id", tabId);
        return `${pathPart}?${searchParams.toString()}`;
    }, [allowDuplicatesByQuery]);
    // 중복 탭 찾기 (쿼리파라미터 고려)
    const findExistingTab = useCallback((path, allowDuplicate = false) => {
        if (allowDuplicatesByQuery || allowDuplicate) {
            // 중복 허용 시: 정확히 동일한 경로(쿼리파라미터 포함)를 가진 탭만 찾기
            return tabs.find((tab) => tab.path === path);
        }
        else {
            // 중복 허용 안 할 시: 기본 경로가 같은 탭 찾기
            const basePath = path.split("?")[0];
            return tabs.find((tab) => {
                const tabBasePath = tab.path.split("?")[0];
                return tabBasePath === basePath;
            });
        }
    }, [tabs, allowDuplicatesByQuery]);
    // 탭 추가
    const addTab = useCallback((pageInfo) => {
        // 경로 정규화
        const [pathPart, queryPart] = pageInfo.path.split("?");
        const normalizedBasePath = normalizePath(pathPart);
        // 중복 탭 허용 여부 확인
        const allowDuplicate = pageInfo.allowDuplicate || allowDuplicatesByQuery;
        // 중복 탭인 경우 고유한 tab-id를 포함한 경로 생성
        let finalPath;
        if (allowDuplicate) {
            // 고유한 tab-id를 포함한 경로 생성
            const pathWithTabId = generatePathWithTabId(normalizedBasePath, allowDuplicate);
            finalPath = pathWithTabId;
        }
        else {
            // 일반 탭인 경우 기존 방식
            finalPath = normalizedBasePath + (queryPart ? `?${queryPart}` : "");
        }
        // 쿼리 파라미터에서 탭 이름 확인
        const customTabName = extractTabNameFromQuery(finalPath);
        let finalTitle = customTabName || pageInfo.title;
        // 기존 탭 찾기 (중복 허용이 아닌 경우에만)
        if (!allowDuplicate) {
            const existingTab = findExistingTab(finalPath, false);
            if (existingTab) {
                // 기존 탭이 있으면 기존 탭 활성화
                setTabs((prevTabs) => prevTabs.map((tab) => ({
                    ...tab,
                    active: tab.id === existingTab.id,
                    path: tab.id === existingTab.id ? finalPath : tab.path,
                    title: tab.id === existingTab.id ? finalTitle : tab.title,
                })));
                setActiveTabId(existingTab.id);
                router.push(finalPath);
                return;
            }
        }
        // 새 탭 생성
        const tabId = generateUniqueTabId(finalPath, allowDuplicate);
        // 같은 기본 경로의 탭 개수 세기 (중복 탭 번호 매기기용)
        if (allowDuplicate && !customTabName) {
            const samePathTabs = tabs.filter((tab) => {
                const tabBasePath = tab.path.split("?")[0];
                return tabBasePath === normalizedBasePath;
            });
            if (samePathTabs.length > 0) {
                finalTitle = `${pageInfo.title} (${samePathTabs.length + 1})`;
            }
        }
        setTabs((prevTabs) => {
            // 최대 탭 개수 확인
            if (prevTabs.length >= maxTabs) {
                // 첫 번째 탭 제외하고 가장 오래된 탭 제거
                const newTabs = prevTabs.slice(1);
                const updatedTabs = [
                    prevTabs[0],
                    ...newTabs.slice(0, -1).map((tab) => ({ ...tab, active: false })),
                    {
                        id: tabId,
                        title: finalTitle,
                        path: finalPath,
                        favicon: faviconResolver?.(finalPath) || undefined,
                        active: true,
                    },
                ];
                // 로컬 스토리지 저장
                if (enableLocalStorage) {
                    const tabsForStorage = updatedTabs.map(
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    ({ active: _, ...tab }) => tab);
                    saveTabsToStorage(localStorageKey, tabsForStorage, tabId);
                }
                return updatedTabs;
            }
            // 새 탭 추가
            const updatedTabs = [
                ...prevTabs.map((tab) => ({ ...tab, active: false })),
                {
                    id: tabId,
                    title: finalTitle,
                    path: finalPath,
                    favicon: faviconResolver?.(finalPath) || undefined,
                    active: true,
                },
            ];
            // 로컬 스토리지 저장
            if (enableLocalStorage) {
                const tabsForStorage = updatedTabs.map(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ({ active: _, ...tab }) => tab);
                saveTabsToStorage(localStorageKey, tabsForStorage, tabId);
            }
            return updatedTabs;
        });
        setActiveTabId(tabId);
        router.push(finalPath);
    }, [
        normalizePath,
        allowDuplicatesByQuery,
        generatePathWithTabId,
        findExistingTab,
        generateUniqueTabId,
        tabs,
        maxTabs,
        faviconResolver,
        enableLocalStorage,
        localStorageKey,
        router,
    ]);
    // 탭 제거
    const removeTab = useCallback((tabId) => {
        setTabs((prevTabs) => {
            const tabIndex = prevTabs.findIndex((tab) => tab.id === tabId);
            if (tabIndex === -1)
                return prevTabs;
            const newTabs = prevTabs.filter((tab) => tab.id !== tabId);
            // 활성 탭이 제거된 경우 다른 탭으로 전환
            let newActiveTabId = activeTabId;
            if (activeTabId === tabId && newTabs.length > 0) {
                const nextActiveIndex = Math.max(0, Math.min(tabIndex - 1, newTabs.length - 1));
                const newActiveTab = newTabs[nextActiveIndex];
                newActiveTabId = newActiveTab.id;
                // 활성 상태 업데이트
                newTabs.forEach((tab, index) => {
                    tab.active = index === nextActiveIndex;
                });
                setActiveTabId(newActiveTabId);
                router.push(newActiveTab.path);
            }
            else if (activeTabId === tabId && newTabs.length === 0) {
                // 모든 탭이 닫힌 경우
                newActiveTabId = undefined;
                setActiveTabId(undefined);
                router.push(homePath);
            }
            else {
                // 비활성 탭을 닫은 경우 - 기존 활성 상태 유지
                newTabs.forEach((tab) => {
                    tab.active = tab.id === activeTabId;
                });
            }
            // 로컬 스토리지 저장
            if (enableLocalStorage) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const tabsForStorage = newTabs.map(({ active: _, ...tab }) => tab);
                saveTabsToStorage(localStorageKey, tabsForStorage, newActiveTabId);
            }
            return newTabs;
        });
    }, [activeTabId, router, homePath, enableLocalStorage, localStorageKey]);
    // 탭 활성화
    const activateTab = useCallback((tabId) => {
        const tab = tabs.find((t) => t.id === tabId);
        if (!tab)
            return;
        setTabs((prevTabs) => prevTabs.map((t) => ({ ...t, active: t.id === tabId })));
        setActiveTabId(tabId);
        // 로컬 스토리지 저장
        if (enableLocalStorage) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const tabsForStorage = tabs.map(({ active: _, ...tab }) => tab);
            saveTabsToStorage(localStorageKey, tabsForStorage, tabId);
        }
        router.push(tab.path);
    }, [tabs, router, enableLocalStorage, localStorageKey]);
    // 탭 순서 변경
    const reorderTabs = useCallback((fromIndex, toIndex) => {
        if (fromIndex === toIndex)
            return;
        setTabs((prevTabs) => {
            const newTabs = [...prevTabs];
            const [movedTab] = newTabs.splice(fromIndex, 1);
            newTabs.splice(toIndex, 0, movedTab);
            // 로컬 스토리지 저장
            if (enableLocalStorage) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const tabsForStorage = newTabs.map(({ active: _, ...tab }) => tab);
                saveTabsToStorage(localStorageKey, tabsForStorage, activeTabId);
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
    }, [addTab, homePath]);
    // 모든 탭 닫기
    const closeAllTabs = useCallback(() => {
        const homeTabs = tabs.filter((tab) => !tab.path.includes("closable=true"));
        setTabs(homeTabs);
        if (homeTabs.length > 0) {
            const homeTab = homeTabs[0];
            homeTab.active = true;
            setActiveTabId(homeTab.id);
            router.push(homeTab.path);
        }
        else {
            setActiveTabId(undefined);
            router.push(homePath);
        }
    }, [tabs, homePath, router]);
    // 다른 탭 모두 닫기
    const closeOtherTabs = useCallback((keepTabId) => {
        setTabs((prevTabs) => {
            const keepTab = prevTabs.find((tab) => tab.id === keepTabId);
            const homeTabs = prevTabs.filter((tab) => !tab.path.includes("closable=true"));
            const newTabs = [...homeTabs];
            if (keepTab && !newTabs.find((tab) => tab.id === keepTabId)) {
                newTabs.push(keepTab);
            }
            // 활성 상태 업데이트
            newTabs.forEach((tab) => {
                tab.active = tab.id === keepTabId;
            });
            // 로컬 스토리지 저장
            if (enableLocalStorage) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const tabsForStorage = newTabs.map(({ active: _, ...tab }) => tab);
                saveTabsToStorage(localStorageKey, tabsForStorage, keepTabId);
            }
            return newTabs;
        });
        setActiveTabId(keepTabId);
    }, [enableLocalStorage, localStorageKey]);
    // 활성 탭 경로 업데이트
    const updateActiveTabPath = useCallback((newPath) => {
        if (!activeTabId)
            return;
        setTabs((prevTabs) => prevTabs.map((tab) => {
            if (tab.id === activeTabId) {
                const customTabName = extractTabNameFromQuery(newPath);
                let newTitle = tab.title;
                if (customTabName) {
                    newTitle = customTabName;
                }
                else {
                    const basePath = newPath.split("?")[0];
                    const pageInfo = getPageInfo(basePath);
                    newTitle = pageInfo.title;
                }
                return {
                    ...tab,
                    path: newPath,
                    title: newTitle,
                    favicon: faviconResolver?.(newPath) || tab.favicon,
                };
            }
            return tab;
        }));
        // 로컬 스토리지 저장
        if (enableLocalStorage) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const updatedTabs = tabs.map(({ active: _, ...tab }) => tab.id === activeTabId ? { ...tab, path: newPath } : tab);
            saveTabsToStorage(localStorageKey, updatedTabs, activeTabId);
        }
    }, [
        activeTabId,
        tabs,
        getPageInfo,
        faviconResolver,
        enableLocalStorage,
        localStorageKey,
    ]);
    // TabBar 컴포넌트용 탭 클릭 핸들러
    const handleTabClick = useCallback((tab) => {
        console.log("useChromeTabBar: Tab clicked:", tab.title, tab.id);
        activateTab(tab.id);
    }, [activateTab]);
    // 초기화
    useEffect(() => {
        if (isInitialized)
            return;
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
        if (tabs.length > 0) {
            // 정확히 일치하는 탭 찾기
            const exactMatchTab = tabs.find((tab) => tab.path === currentFullPath);
            if (exactMatchTab) {
                setTabs((prevTabs) => prevTabs.map((tab) => ({
                    ...tab,
                    active: tab.id === exactMatchTab.id,
                })));
                setActiveTabId(exactMatchTab.id);
            }
            else {
                // 기본 경로만 일치하는 탭 찾기
                const pathMatchTab = tabs.find((tab) => {
                    const tabBasePath = tab.path.split("?")[0];
                    return tabBasePath === normalizedPathname;
                });
                if (pathMatchTab) {
                    setTabs((prevTabs) => prevTabs.map((tab) => ({
                        ...tab,
                        active: tab.id === pathMatchTab.id,
                    })));
                    setActiveTabId(pathMatchTab.id);
                }
            }
        }
        setIsInitialized(true);
    }, [tabs, pathname, searchParams, isInitialized, normalizePath]);
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
        handleTabClick,
        updateActiveTabPath,
    };
}
