"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy, useSortable, } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis, restrictToWindowEdges, } from "@dnd-kit/modifiers";
import { PageSelector } from "./PageSelector";
import styles from "./TabBar.module.css";
function SortableTab({ tab, isActive, onTabClick, onTabClose }) {
    const [isHovering, setIsHovering] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: tab.id });
    const handleCloseClick = useCallback((e) => {
        e.stopPropagation();
        onTabClose(tab.id);
    }, [tab.id, onTabClose]);
    const handleTabClick = useCallback((e) => {
        // 드래그 중일 때만 클릭 차단
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        // 일반적인 탭 클릭은 즉시 처리
        onTabClick(tab);
    }, [tab, onTabClick, isDragging]);
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
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? "none" : transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1000 : "auto",
        touchAction: "none",
        userSelect: "none",
        willChange: isDragging ? "transform" : "auto",
    };
    return (React.createElement("div", { ref: setNodeRef, style: style, ...attributes },
        React.createElement("button", { className: tabButtonClass, onClick: handleTabClick, onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), title: tab.title, ...listeners },
            tab.icon && React.createElement("div", { className: styles.tabIcon }, tab.icon),
            React.createElement("span", { className: styles.tabTitle }, tab.title),
            tab.closable !== false && (React.createElement("button", { className: closeButtonClass, onClick: handleCloseClick, onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), title: "\uD0ED \uB2EB\uAE30", style: {
                    opacity: isHovering || isActive ? 1 : 0,
                    transform: `scale(${isHovering || isActive ? 1 : 0.8})`,
                    transition: "opacity 0.15s, transform 0.15s",
                } },
                React.createElement("svg", { className: styles.closeButtonIcon, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })))))));
}
// 이전 Tab 컴포넌트를 SortableTab으로 대체
const Tab = SortableTab;
function HomeButton({ isActive = false, onClick, homePath = "홈", }) {
    // CSS 모듈 클래스 조합
    const homeButtonClass = [
        styles.homeButton,
        isActive ? styles.homeButtonActive : "",
    ]
        .filter(Boolean)
        .join(" ");
    return (React.createElement(motion.button, { className: homeButtonClass, onClick: onClick, title: `${homePath}으로 이동`, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } },
        React.createElement("svg", { className: styles.homeButtonIcon, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }))));
}
/**
 * TabBar 컴포넌트 - 브라우저 탭과 유사한 동작을 제공하는 탭 바
 */
export function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onTabReorder, onPageSelect, availablePages = [], maxTabs = 10, className = "", showNewTabButton = true, showHomeButton = false, onHomeClick, homeButtonActive = false, homePath = "홈", }) {
    const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);
    const [activeId, setActiveId] = useState(null);
    // 드래그 앤 드롭 센서 설정 - 더 엄격한 제약 조건 적용
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5, // 5px 이상 수평으로 움직여야 드래그 시작
            tolerance: 5,
            delay: 100, // 100ms 대기
        },
    }), useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
    }));
    // 드래그 시작 핸들러
    const handleDragStart = useCallback((event) => {
        setActiveId(String(event.active.id));
        // 페이지 스크롤 방지를 위해 body 스크롤 차단
        document.body.style.touchAction = "none";
        document.body.style.userSelect = "none";
    }, []);
    // 드래그 종료 핸들러
    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        console.log("DragEnd event:", { active: active.id, over: over?.id });
        setActiveId(null);
        // body 스크롤 복원
        document.body.style.touchAction = "";
        document.body.style.userSelect = "";
        if (over && active.id !== over.id) {
            console.log(`Reordering: ${active.id} -> ${over.id}`);
            console.log("onTabReorder function:", onTabReorder);
            if (onTabReorder) {
                onTabReorder(String(active.id), String(over.id));
                console.log("onTabReorder called successfully");
            }
            else {
                console.warn("onTabReorder is not provided!");
            }
        }
        else {
            console.log("No reordering needed - same position or no valid drop target");
        }
    }, [onTabReorder]);
    // 드래그 취소 핸들러
    const handleDragCancel = useCallback(() => {
        setActiveId(null);
        // body 스크롤 복원
        document.body.style.touchAction = "";
        document.body.style.userSelect = "";
    }, []);
    const handleTabClick = useCallback((tab) => {
        onTabClick?.(tab);
    }, [onTabClick]);
    const handleTabClose = useCallback((tabId) => {
        onTabClose?.(tabId);
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
        showHomeButton && (React.createElement(HomeButton, { isActive: homeButtonActive, onClick: onHomeClick, homePath: homePath })),
        React.createElement("div", { className: styles.tabsContainer },
            React.createElement("div", { className: styles.tabsInnerContainer },
                React.createElement(DndContext, { sensors: sensors, collisionDetection: closestCenter, onDragStart: handleDragStart, onDragEnd: handleDragEnd, onDragCancel: handleDragCancel, modifiers: [restrictToHorizontalAxis, restrictToWindowEdges] },
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
