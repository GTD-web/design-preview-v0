"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
export function useTabBar({ initialTabs = [], maxTabs = 10, pageMapping = {}, homePath = "/design-example", pathNormalizer, defaultPageInfoResolver, enableLocalStorage = true, localStorageKey = "tabbar-tabs", } = {}) {
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
    const [tabs, setTabs] = useState(initialState.tabs);
    const [activeTabId, setActiveTabId] = useState(initialState.activeTabId);
    const [isRemovingTab, setIsRemovingTab] = useState(false);
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
    // 경로에서 탭 ID 생성
    const generateTabId = useCallback((path) => {
        const normalized = normalizePath(path);
        return `tab-${normalized.replace(/\//g, "-").replace(/^-/, "") || "home"}`;
    }, [normalizePath]);
    // 페이지 정보 가져오기
    const getPageInfo = useCallback((path) => {
        const normalizedPath = normalizePath(path);
        // 1. 매핑에서 찾기
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
    }, [pageMapping, homePath, normalizePath, defaultPageInfoResolver]);
    // 탭 추가
    const addTab = useCallback((pageInfo) => {
        const tabId = generateTabId(pageInfo.path);
        setTabs((prevTabs) => {
            // 이미 존재하는 탭인지 확인
            const existingTab = prevTabs.find((tab) => tab.id === tabId);
            if (existingTab) {
                return prevTabs;
            }
            // 최대 탭 개수 체크
            if (prevTabs.length >= maxTabs) {
                // 가장 오래된 탭을 제거 (첫 번째 탭 제외 - 보통 홈탭)
                const newTabs = prevTabs.slice(1, -1);
                const updatedTabs = [
                    prevTabs[0], // 홈 탭 유지
                    ...newTabs,
                    {
                        id: tabId,
                        title: pageInfo.title,
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
            // 새 탭 추가
            const updatedTabs = [
                ...prevTabs,
                {
                    id: tabId,
                    title: pageInfo.title,
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
    }, [generateTabId, maxTabs, enableLocalStorage, localStorageKey]);
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
                    // 네비게이션 완료 후 상태 리셋
                    setTimeout(() => setIsRemovingTab(false), 100);
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
                    // 네비게이션 완료 후 상태 리셋
                    setTimeout(() => setIsRemovingTab(false), 100);
                }, 0);
            }
            else {
                // 비활성 탭을 닫은 경우
                if (enableLocalStorage) {
                    saveTabsToStorage(localStorageKey, newTabs, activeTabId);
                }
                setIsRemovingTab(false);
            }
            return newTabs;
        });
    }, [activeTabId, router, homePath, enableLocalStorage, localStorageKey]);
    // 탭 활성화
    const activateTab = useCallback((tabId) => {
        const tab = tabs.find((t) => t.id === tabId);
        if (tab) {
            setActiveTabId(tabId);
            // 로컬 스토리지에 저장
            if (enableLocalStorage) {
                saveTabsToStorage(localStorageKey, tabs, tabId);
            }
            router.push(tab.path);
        }
    }, [tabs, router, enableLocalStorage, localStorageKey]);
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
    // 경로 변경 시 탭 상태 업데이트
    useEffect(() => {
        // 탭 제거 중이면 자동 탭 추가 방지
        if (isRemovingTab)
            return;
        const normalizedPathname = normalizePath(pathname);
        const tabId = generateTabId(normalizedPathname);
        const existingTab = tabs.find((tab) => tab.id === tabId);
        if (existingTab) {
            setActiveTabId(tabId);
        }
        else {
            // 새로운 페이지인 경우 자동으로 탭 추가
            const pageInfo = getPageInfo(normalizedPathname);
            addTab(pageInfo);
        }
    }, [
        pathname,
        tabs,
        generateTabId,
        getPageInfo,
        addTab,
        normalizePath,
        isRemovingTab,
    ]);
    return {
        tabs,
        activeTabId,
        addTab,
        removeTab,
        activateTab,
        createNewTab,
        closeAllTabs,
        closeOtherTabs,
        addCurrentPageAsTab,
    };
}
