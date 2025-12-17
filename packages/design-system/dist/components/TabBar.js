"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable, } from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import styles from "./TabBar.module.css";
// Y축 움직임을 완전히 차단하는 강력한 modifier
const restrictToHorizontalAxisStrict = ({ transform }) => {
    // Y축 이동을 완전히 차단하고, X축만 허용
    return {
        x: transform.x || 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
    };
};
/**
 * useTabManager - 탭 상태 관리 및 자동 탭 추가/활성화 hook
 *
 * 링크로 접속했을 때 자동으로 탭을 추가하거나 활성화합니다.
 * 쿼리 파라미터가 포함된 URL도 지원하며, 같은 경로의 탭은 쿼리 파라미터만 업데이트합니다.
 *
 * @example
 * ```tsx
 * const { tabs, activeTabId, handleTabClick, handleTabClose, handleTabReorder } = useTabManager({
 *   initialTabs: [{ id: "home", title: "홈", path: "/" }],
 *   maxTabs: 10,
 *   getTabFromPath: (pathname, fullPath) => ({
 *     title: pathname === "/" ? "홈" : pathname.split("/").pop() || "페이지",
 *     path: fullPath, // 쿼리 파라미터 포함
 *     closable: pathname !== "/",
 *   }),
 *   homePath: "/",
 *   shouldAllowMultipleTabs: (pathname) => {
 *     // 특정 페이지는 여러 탭 허용
 *     return pathname.startsWith("/detail/");
 *   },
 * });
 *
 * return <TabBar
 *   tabs={tabs}
 *   activeTabId={activeTabId}
 *   onTabClick={handleTabClick}
 *   onTabClose={handleTabClose}
 *   onTabReorder={handleTabReorder}
 * />;
 * ```
 */
export function useTabManager({ initialTabs = [], maxTabs = 10, getTabFromPath, homePath = "/", shouldAllowMultipleTabs = () => false, } = {}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [tabs, setTabs] = useState(initialTabs);
    const [activeTabId, setActiveTabId] = useState(initialTabs.find((tab) => {
        const tabPathname = tab.path.split("?")[0];
        return tabPathname === pathname;
    })?.id);
    // 경로 변경 시 자동으로 탭 추가/활성화/업데이트
    useEffect(() => {
        if (!pathname)
            return;
        // 전체 경로 생성 (쿼리 파라미터 포함)
        const search = searchParams?.toString();
        const fullPath = search ? `${pathname}?${search}` : pathname;
        // 홈 경로는 탭으로 관리하지 않음 (선택사항)
        if (pathname === homePath && homePath !== undefined) {
            setActiveTabId(undefined);
            return;
        }
        // pathname이 같은 탭 찾기 (쿼리 파라미터는 무시)
        const existingTabWithSamePathname = tabs.find((tab) => {
            const tabPathname = tab.path.split("?")[0];
            return tabPathname === pathname;
        });
        // 여러 탭을 허용하는 페이지인지 확인
        const allowMultipleTabs = shouldAllowMultipleTabs(pathname, fullPath);
        if (existingTabWithSamePathname && !allowMultipleTabs) {
            // 같은 pathname의 탭이 있고, 여러 탭을 허용하지 않는 경우
            // 기존 탭의 쿼리 파라미터를 업데이트하고 활성화
            setTabs((prevTabs) => prevTabs.map((tab) => {
                const tabPathname = tab.path.split("?")[0];
                if (tabPathname === pathname) {
                    return { ...tab, path: fullPath };
                }
                return tab;
            }));
            setActiveTabId(existingTabWithSamePathname.id);
        }
        else if (allowMultipleTabs) {
            // 여러 탭을 허용하는 페이지인 경우, 전체 경로(쿼리 파라미터 포함)로 비교
            const existingTabWithExactPath = tabs.find((tab) => tab.path === fullPath);
            if (existingTabWithExactPath) {
                // 완전히 같은 경로의 탭이 있으면 활성화
                setActiveTabId(existingTabWithExactPath.id);
            }
            else {
                // 없으면 새 탭 추가
                if (tabs.length >= maxTabs) {
                    return;
                }
                const newTabData = getTabFromPath
                    ? getTabFromPath(pathname, fullPath)
                    : {
                        title: pathname.split("/").filter(Boolean).pop() || "새 페이지",
                        path: fullPath,
                        closable: true,
                    };
                if (!newTabData)
                    return;
                const newTab = {
                    id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    ...newTabData,
                };
                setTabs((prevTabs) => [...prevTabs, newTab]);
                setActiveTabId(newTab.id);
            }
        }
        else {
            // 같은 pathname의 탭이 없고, 여러 탭을 허용하지 않는 경우
            // 새 탭 추가
            if (tabs.length >= maxTabs) {
                return;
            }
            const newTabData = getTabFromPath
                ? getTabFromPath(pathname, fullPath)
                : {
                    title: pathname.split("/").filter(Boolean).pop() || "새 페이지",
                    path: fullPath,
                    closable: true,
                };
            if (!newTabData)
                return;
            const newTab = {
                id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                ...newTabData,
            };
            setTabs((prevTabs) => [...prevTabs, newTab]);
            setActiveTabId(newTab.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, searchParams, maxTabs, getTabFromPath, homePath]);
    // 탭 클릭 핸들러
    const handleTabClick = useCallback((tab) => {
        setActiveTabId(tab.id);
        // 라우터를 사용하는 경우 부모 컴포넌트에서 처리
        // router.push(tab.path);
    }, []);
    // 탭 닫기 핸들러
    const handleTabClose = useCallback((tabId) => {
        setTabs((prevTabs) => {
            const newTabs = prevTabs.filter((tab) => tab.id !== tabId);
            // 닫힌 탭이 활성 탭이었다면 다른 탭을 활성화
            if (activeTabId === tabId && newTabs.length > 0) {
                const closedTabIndex = prevTabs.findIndex((tab) => tab.id === tabId);
                const newActiveTab = newTabs[Math.max(0, closedTabIndex - 1)] || newTabs[0];
                setActiveTabId(newActiveTab.id);
                // router.push(newActiveTab.path); // 부모에서 처리
            }
            else if (newTabs.length === 0) {
                setActiveTabId(undefined);
            }
            return newTabs;
        });
    }, [activeTabId]);
    // 탭 순서 변경 핸들러
    const handleTabReorder = useCallback((activeId, overId) => {
        setTabs((prevTabs) => {
            const activeIndex = prevTabs.findIndex((tab) => tab.id === activeId);
            const overIndex = prevTabs.findIndex((tab) => tab.id === overId);
            if (activeIndex === -1 || overIndex === -1)
                return prevTabs;
            const newTabs = [...prevTabs];
            const [movedTab] = newTabs.splice(activeIndex, 1);
            newTabs.splice(overIndex, 0, movedTab);
            return newTabs;
        });
    }, []);
    // 새 탭 추가 (홈으로)
    const handleNewTab = useCallback(() => {
        // 부모 컴포넌트에서 홈으로 이동하도록 처리
        // router.push(homePath);
    }, []);
    return {
        tabs,
        activeTabId,
        setTabs,
        setActiveTabId,
        handleTabClick,
        handleTabClose,
        handleTabReorder,
        handleNewTab,
    };
}
function SortableTab({ tab, isActive, onTabClick, onTabClose }) {
    const [isHovering, setIsHovering] = useState(false);
    const [isDragInProgress, setIsDragInProgress] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: tab.id });
    const handleCloseClick = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();
        // 드래그 중이면 닫기 동작 무시
        if (isDragging || isDragInProgress) {
            return;
        }
        // 즉시 닫기 실행
        onTabClose(tab.id);
    }, [tab.id, onTabClose, isDragging, isDragInProgress]);
    // 간단한 클릭 핸들러 - 드래그 센서가 500ms delay로 충분히 구분됨
    const handleClick = useCallback((e) => {
        // 기본 동작 방지
        e.preventDefault();
        e.stopPropagation();
        // console.log("SortableTab: Click on tab:", tab.title, tab.id);
        // console.log(
        //   "SortableTab: isDragging:",
        //   isDragging,
        //   "isDragInProgress:",
        //   isDragInProgress
        // );
        // 드래그 중이 아닐 때만 처리 (더 엄격하게 체크)
        if (!isDragging && !isDragInProgress) {
            // console.log("SortableTab: Processing click");
            // 짧은 딜레이를 추가하여 드래그 이벤트와 충돌 방지
            setTimeout(() => {
                onTabClick(tab);
            }, 10);
        }
        else {
            // console.log("SortableTab: Click ignored due to drag");
        }
    }, [tab, onTabClick, isDragging, isDragInProgress]);
    // 드래그 이벤트 구독 - 클릭 우선을 위해 더 빠른 상태 리셋
    React.useEffect(() => {
        const handleDragStart = (event) => {
            if (event.detail?.activeId === tab.id) {
                setIsDragInProgress(true);
            }
        };
        const handleDragEnd = () => {
            // 드래그 종료 시 즉시 상태 리셋 - 클릭 반응성 향상
            // 모든 탭의 드래그 상태를 리셋하도록 변경
            setIsDragInProgress(false);
        };
        const handleDragCancel = () => {
            // 드래그 취소 시도 상태 리셋
            setIsDragInProgress(false);
        };
        window.addEventListener("tab-drag-start", handleDragStart);
        window.addEventListener("tab-drag-end", handleDragEnd);
        window.addEventListener("tab-drag-cancel", handleDragCancel);
        return () => {
            window.removeEventListener("tab-drag-start", handleDragStart);
            window.removeEventListener("tab-drag-end", handleDragEnd);
            window.removeEventListener("tab-drag-cancel", handleDragCancel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab.id]);
    // CSS 모듈 클래스 조합
    const tabButtonClass = [
        styles.tabButton,
        styles.tabButtonHover,
        isActive ? styles.tabButtonActive : styles.tabButtonInactive,
        isDragging ? styles.tabButtonDragging : "",
    ]
        .filter(Boolean)
        .join(" ");
    const closeButtonClass = [
        styles.closeButton,
        isActive ? styles.closeButtonActive : styles.closeButtonInactive,
    ].join(" ");
    const style = {
        transform: transform
            ? `translate3d(${transform.x || 0}px, 0px, 0px) scale(${isDragging ? 1.05 : 1}) rotate(${isDragging ? "1deg" : "0deg"})`
            : undefined,
        transition: isDragging ? "none" : transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1000 : "auto",
        touchAction: "pan-x",
        userSelect: "none",
        willChange: isDragging ? "transform" : "auto",
    };
    return (React.createElement("div", { ref: setNodeRef, style: style, ...attributes },
        React.createElement("button", { className: tabButtonClass, onClick: handleClick, onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), title: tab.title, style: {
                pointerEvents: "auto",
                cursor: "pointer",
                // 클릭 반응성을 위한 추가 스타일
                touchAction: "manipulation",
                userSelect: "none",
            }, ...listeners },
            tab.icon && React.createElement("div", { className: styles.tabIcon }, tab.icon),
            React.createElement("span", { className: styles.tabTitle }, tab.title),
            tab.closable !== false && (React.createElement("div", { className: closeButtonClass, onClick: handleCloseClick, onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), title: "\uD0ED \uB2EB\uAE30", role: "button", tabIndex: 0, onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCloseClick(e);
                    }
                }, style: {
                    opacity: isHovering || isActive ? 1 : 0.7,
                    transform: `scale(${isHovering ? 1.1 : 1})`,
                    transition: "opacity 0.15s, transform 0.15s",
                    // 클릭 영역 확대를 위한 패딩 추가
                    padding: "2px",
                    // 다른 요소와의 상호작용 방지
                    zIndex: 10,
                    position: "relative",
                    cursor: "pointer",
                } },
                React.createElement("svg", { className: styles.closeButtonIcon, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })))))));
}
// 이전 Tab 컴포넌트를 SortableTab으로 대체
const Tab = SortableTab;
function HomeButton({ isActive = false, onClick, icon, label = "홈", }) {
    // CSS 모듈 클래스 조합
    const homeButtonClass = [
        styles.homeButton,
        isActive ? styles.homeButtonActive : "",
    ]
        .filter(Boolean)
        .join(" ");
    return (React.createElement(motion.button, { className: homeButtonClass, onClick: onClick, title: `${label}으로 이동`, style: {
            position: "relative",
            zIndex: 2,
            userSelect: "none",
            touchAction: "manipulation",
            pointerEvents: "auto",
        }, draggable: false },
        icon ? (React.createElement("div", { className: styles.homeButtonIcon }, icon)) : (React.createElement("svg", { className: styles.homeButtonIcon, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }))),
        React.createElement("span", { className: styles.homeButtonLabel }, label)));
}
/**
 * TabBar 컴포넌트 - 브라우저 탭과 유사한 동작을 제공하는 탭 바
 */
export function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onTabReorder, maxTabs = 10, className = "", showNewTabButton = true, showHomeButton = false, onHomeClick, homeButtonActive = false, homeButtonIcon, homeButtonLabel = "홈", renderNewTabButton, }) {
    // 드래그 앤 드롭 센서 설정 - 클릭 우선, 드래그는 의도적으로 길게 눌렀을 때만
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 15,
            tolerance: 3,
            delay: 500, // 500ms로 늘려서 클릭과 확실히 구분
        },
    }), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    // 드래그 시작 핸들러 - 탭 영역에서만 Y축 이동 차단
    const handleDragStart = useCallback((event) => {
        // 현재 스크롤 위치 저장
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        // 드래그 상태 표시
        document.body.setAttribute("data-dragging", "true");
        // 최소한의 스크롤 차단 - 너무 강력하지 않게
        document.body.style.userSelect = "none";
        // 저장된 스크롤 위치
        window.__savedScrollTop = scrollTop;
        // 모든 탭에게 드래그 시작 알림 (브로드캐스트)
        window.dispatchEvent(new CustomEvent("tab-drag-start", {
            detail: { activeId: event.active.id },
        }));
    }, []);
    // 드래그 종료 핸들러
    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        // 드래그 상태 제거
        document.body.removeAttribute("data-dragging");
        // body 스타일 복원
        document.body.style.userSelect = "";
        // 모든 탭에게 드래그 종료 알림 (브로드캐스트)
        window.dispatchEvent(new CustomEvent("tab-drag-end", { detail: { activeId: active.id } }));
        // 드래그가 실제로 발생했고, 다른 위치로 이동한 경우만 reorder 실행
        if (over && active.id !== over.id) {
            // 드래그 거리 확인 - 충분히 이동했을 때만 reorder
            const activeElement = document.querySelector(`[data-sortable-id="${active.id}"]`);
            const overElement = document.querySelector(`[data-sortable-id="${over.id}"]`);
            if (activeElement && overElement) {
                const activeRect = activeElement.getBoundingClientRect();
                const overRect = overElement.getBoundingClientRect();
                const distance = Math.abs(activeRect.left - overRect.left);
                // 충분한 거리(탭 너비의 절반 이상)를 이동한 경우만 reorder
                if (distance > 50 && onTabReorder) {
                    onTabReorder(String(active.id), String(over.id));
                }
            }
            else if (onTabReorder) {
                // 요소를 찾을 수 없는 경우 기존 로직 사용 (fallback)
                onTabReorder(String(active.id), String(over.id));
            }
        }
    }, [onTabReorder]);
    // 드래그 취소 핸들러
    const handleDragCancel = useCallback(() => {
        // 드래그 상태 제거
        document.body.removeAttribute("data-dragging");
        // body 스타일 복원
        document.body.style.userSelect = "";
        // 모든 탭에게 드래그 취소 알림 (브로드캐스트)
        window.dispatchEvent(new CustomEvent("tab-drag-cancel", { detail: { activeId: null } }));
        window.dispatchEvent(new CustomEvent("tab-drag-end", { detail: { activeId: null } }));
    }, []);
    const handleTabClick = useCallback((tab) => {
        if (onTabClick) {
            onTabClick(tab);
        }
    }, [onTabClick]);
    const handleTabClose = useCallback((tabId) => {
        // 즉시 닫기 처리 - 다른 상태나 이벤트와의 충돌 방지
        if (onTabClose) {
            onTabClose(tabId);
        }
    }, [onTabClose]);
    // CSS 모듈 클래스 조합
    const containerClass = [styles.tabBarContainer, className]
        .filter(Boolean)
        .join(" ");
    return (React.createElement("div", { className: containerClass },
        showHomeButton && (React.createElement(HomeButton, { isActive: homeButtonActive, onClick: onHomeClick, icon: homeButtonIcon, label: homeButtonLabel })),
        React.createElement("div", { className: styles.tabsContainer },
            React.createElement("div", { className: styles.tabsInnerContainer },
                React.createElement(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragStart: handleDragStart, onDragEnd: handleDragEnd, onDragCancel: handleDragCancel, modifiers: [restrictToHorizontalAxisStrict, restrictToWindowEdges] },
                    React.createElement(SortableContext, { items: tabs.map((tab) => tab.id), strategy: horizontalListSortingStrategy }, tabs.map((tab) => (React.createElement(Tab, { key: tab.id, tab: tab, isActive: tab.id === activeTabId, onTabClick: handleTabClick, onTabClose: handleTabClose }))))),
                showNewTabButton && renderNewTabButton && (React.createElement(React.Fragment, null, renderNewTabButton({
                    isDisabled: tabs.length >= maxTabs,
                    tabCount: tabs.length,
                    maxTabs: maxTabs,
                })))))));
}
/**
 * TabBar 스타일 상수 - 필요시 외부에서 참조 가능
 */
export const TAB_BAR_STYLES = {
    // CSS Modules를 사용하여 스타일이 완전히 격리됨
    // 더 이상 외부 CSS 클래스나 인라인 스타일이 필요하지 않음
    colors: {
        primary: "#3b82f6",
        background: "#f3f4f6",
        foreground: "#1f2937",
        muted: "#6b7280",
        border: "#d1d5db",
        surface: "#ffffff",
        hover: "#e5e7eb",
    },
    spacing: {
        tabPadding: "6px 12px",
        containerPadding: "4px 0",
        iconSize: "14px",
        closeButtonSize: "16px",
    },
    animation: {
        duration: "0.15s",
        easing: "ease-in-out",
    },
};
