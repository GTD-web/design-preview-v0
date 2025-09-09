"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable, } from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { PageSelector } from "./PageSelector";
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
                console.log("Drag started for tab:", tab.title);
            }
        };
        const handleDragEnd = (event) => {
            // 드래그 종료 시 즉시 상태 리셋 - 클릭 반응성 향상
            // 모든 탭의 드래그 상태를 리셋하도록 변경
            setIsDragInProgress(false);
            console.log("Drag ended for tab:", tab.title);
        };
        const handleDragCancel = () => {
            // 드래그 취소 시도 상태 리셋
            setIsDragInProgress(false);
            console.log("Drag cancelled for tab:", tab.title);
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
            tab.closable !== false && (React.createElement("button", { className: closeButtonClass, onClick: handleCloseClick, onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), title: "\uD0ED \uB2EB\uAE30", style: {
                    opacity: isHovering || isActive ? 1 : 0.7,
                    transform: `scale(${isHovering ? 1.1 : 1})`,
                    transition: "opacity 0.15s, transform 0.15s",
                    // 클릭 영역 확대를 위한 패딩 추가
                    padding: "2px",
                    // 다른 요소와의 상호작용 방지
                    zIndex: 10,
                    position: "relative",
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
export function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onTabReorder, onPageSelect, availablePages = [], maxTabs = 10, className = "", showNewTabButton = true, showHomeButton = false, onHomeClick, homeButtonActive = false, homeButtonIcon, homeButtonLabel = "홈", }) {
    const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);
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
        console.log("Drag started for tab:", event.active.id);
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
        console.log("DragEnd event:", { active: active.id, over: over?.id });
        // 드래그 상태 제거
        document.body.removeAttribute("data-dragging");
        // body 스타일 복원
        document.body.style.userSelect = "";
        // 모든 탭에게 드래그 종료 알림 (브로드캐스트)
        window.dispatchEvent(new CustomEvent("tab-drag-end", { detail: { activeId: active.id } }));
        // 드래그가 실제로 발생했고, 다른 위치로 이동한 경우만 reorder 실행
        if (over && active.id !== over.id) {
            console.log(`Reordering: ${active.id} -> ${over.id}`);
            console.log("onTabReorder function:", onTabReorder);
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
                    console.log("onTabReorder called successfully");
                }
                else {
                    console.log("Drag distance too short, ignoring reorder");
                }
            }
            else if (onTabReorder) {
                // 요소를 찾을 수 없는 경우 기존 로직 사용 (fallback)
                onTabReorder(String(active.id), String(over.id));
                console.log("onTabReorder called successfully (fallback)");
            }
        }
        else {
            console.log("No reordering needed - same position or no valid drop target");
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
        console.log("Drag cancelled - resetting all drag states");
    }, []);
    const handleTabClick = useCallback((tab) => {
        // console.log("TabBar: handleTabClick called with tab:", tab.title, tab.id);
        // console.log("TabBar: onTabClick function exists:", !!onTabClick);
        if (onTabClick) {
            // console.log("TabBar: Calling onTabClick...");
            onTabClick(tab);
            // console.log("TabBar: onTabClick completed");
        }
        else {
            console.warn("TabBar: onTabClick is not provided to TabBar");
        }
    }, [onTabClick]);
    const handleTabClose = useCallback((tabId) => {
        // 즉시 닫기 처리 - 다른 상태나 이벤트와의 충돌 방지
        if (onTabClose) {
            onTabClose(tabId);
        }
    }, [onTabClose]);
    const handlePageSelect = useCallback((pageInfo) => {
        onPageSelect?.(pageInfo);
    }, [onPageSelect]);
    const openTabPaths = tabs.map((tab) => tab.path);
    // CSS 모듈 클래스 조합
    const containerClass = [styles.tabBarContainer, className]
        .filter(Boolean)
        .join(" ");
    const newTabButtonClass = [
        styles.newTabButton,
        tabs.length >= maxTabs ? styles.newTabButtonDisabled : "",
    ]
        .filter(Boolean)
        .join(" ");
    return (React.createElement("div", { className: containerClass },
        showHomeButton && (React.createElement(HomeButton, { isActive: homeButtonActive, onClick: onHomeClick, icon: homeButtonIcon, label: homeButtonLabel })),
        React.createElement("div", { className: styles.tabsContainer },
            React.createElement("div", { className: styles.tabsInnerContainer },
                React.createElement(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragStart: handleDragStart, onDragEnd: handleDragEnd, onDragCancel: handleDragCancel, modifiers: [restrictToHorizontalAxisStrict, restrictToWindowEdges] },
                    React.createElement(SortableContext, { items: tabs.map((tab) => tab.id), strategy: horizontalListSortingStrategy }, tabs.map((tab) => (React.createElement(Tab, { key: tab.id, tab: tab, isActive: tab.id === activeTabId, onTabClick: handleTabClick, onTabClose: handleTabClose }))))))),
        showNewTabButton && (React.createElement(PageSelector, { availablePages: availablePages, openTabPaths: openTabPaths, onPageSelect: handlePageSelect, isOpen: isPageSelectorOpen, onClose: () => setIsPageSelectorOpen(false) },
            React.createElement(motion.button, { className: newTabButtonClass, onClick: () => {
                    if (tabs.length < maxTabs) {
                        setIsPageSelectorOpen(!isPageSelectorOpen);
                    }
                }, disabled: tabs.length >= maxTabs, title: "\uC0C8 \uD0ED \uCD94\uAC00", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } },
                React.createElement("svg", { className: styles.newTabButtonIcon, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" })))))));
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
