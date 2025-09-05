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
        x: transform.x || 0, // X축 변화만 허용
        y: 0, // Y축 변화를 강제로 0으로 설정
        scaleX: 1, // 스케일 변화도 방지
        scaleY: 1,
    };
};
function SortableTab({ tab, isActive, onTabClick, onTabClose }) {
    const [isHovering, setIsHovering] = useState(false);
    const [isDragStarted, setIsDragStarted] = useState(false);
    const mouseDownTimeRef = React.useRef(0);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({ id: tab.id });
    const handleCloseClick = useCallback((e) => {
        e.stopPropagation();
        onTabClose(tab.id);
    }, [tab.id, onTabClose]);
    const handleMouseDown = useCallback((e) => {
        // 왼쪽 마우스 버튼이 아닌 경우 무시
        if (e.button !== 0)
            return;
        mouseDownTimeRef.current = Date.now();
    }, []);
    const handleMouseUp = useCallback((e) => {
        // 왼쪽 마우스 버튼이 아닌 경우 무시
        if (e.button !== 0)
            return;
        const mouseUpTime = Date.now();
        const clickDuration = mouseUpTime - mouseDownTimeRef.current;
        // 드래그가 진행 중이 아니고, 클릭 시간이 합리적인 범위 내인 경우 클릭 처리
        if (!isDragging && clickDuration < 500) {
            console.log("MouseUp click detected, processing tab:", tab.title);
            onTabClick(tab);
        }
        else {
            console.log("MouseUp click ignored - duration:", clickDuration, "isDragging:", isDragging, "isDragStarted:", isDragStarted);
        }
    }, [tab, onTabClick, isDragging, isDragStarted]);
    // 드래그 이벤트 구독
    React.useEffect(() => {
        const handleDragStart = (event) => {
            if (event.detail?.activeId === tab.id) {
                setIsDragStarted(true);
            }
        };
        const handleDragEnd = () => {
            // 드래그 종료 시 상태를 즉시 리셋
            setTimeout(() => {
                setIsDragStarted(false);
            }, 50); // 짧은 딜레이로 확실한 리셋
        };
        window.addEventListener("tab-drag-start", handleDragStart);
        window.addEventListener("tab-drag-end", handleDragEnd);
        return () => {
            window.removeEventListener("tab-drag-start", handleDragStart);
            window.removeEventListener("tab-drag-end", handleDragEnd);
        };
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
            : undefined, // Y축을 강제로 0으로 고정, X축만 이동
        transition: isDragging ? "none" : transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1000 : "auto",
        touchAction: "pan-x", // 수평 방향 터치만 허용
        userSelect: "none",
        willChange: isDragging ? "transform" : "auto",
    };
    return (React.createElement("div", { ref: setNodeRef, style: style, ...attributes },
        React.createElement("button", { className: tabButtonClass, onMouseDown: handleMouseDown, onMouseUp: handleMouseUp, onClick: () => {
                // 백업 클릭 처리 - 드래그가 아닌 경우에만
                if (!isDragging && !isDragStarted) {
                    console.log("Fallback click handler triggered for tab:", tab.title);
                    onTabClick(tab);
                }
                else {
                    console.log("Fallback click ignored - isDragging:", isDragging, "isDragStarted:", isDragStarted);
                }
            }, onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), title: tab.title, ...listeners },
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
    // 드래그 앤 드롭 센서 설정 - 수평 방향 드래그만 엄격하게 감지
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 20, // 20px 이상 움직여야 드래그 시작 (더 엄격하게)
            tolerance: 3, // 더 엄격한 tolerance
            delay: 150, // 150ms 딜레이로 의도적인 드래그만 감지 (더 길게)
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
        // 드래그 상태 제거
        document.body.removeAttribute("data-dragging");
        // body 스타일 복원
        document.body.style.userSelect = "";
        // 모든 탭에게 드래그 취소 알림 (브로드캐스트)
        window.dispatchEvent(new CustomEvent("tab-drag-end", { detail: { activeId: null } }));
    }, []);
    const handleTabClick = useCallback((tab) => {
        console.log("TabBar handleTabClick called with tab:", tab);
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
