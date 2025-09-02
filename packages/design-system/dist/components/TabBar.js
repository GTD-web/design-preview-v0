"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageSelector } from "./PageSelector";
import styles from "./TabBar.module.css";
function Tab({ tab, isActive, onTabClick, onTabClose }) {
    const [isHovering, setIsHovering] = useState(false);
    const handleCloseClick = useCallback((e) => {
        e.stopPropagation();
        onTabClose(tab.id);
    }, [tab.id, onTabClose]);
    // CSS 모듈 클래스 조합
    const tabButtonClass = [
        styles.tabButton,
        styles.tabButtonHover,
        isActive ? styles.tabButtonActive : styles.tabButtonInactive,
    ].join(" ");
    const closeButtonClass = [
        styles.closeButton,
        isActive ? styles.closeButtonActive : styles.closeButtonInactive,
    ].join(" ");
    return (React.createElement(motion.button, { layout: true, transition: { duration: 0.15, ease: "easeInOut" }, className: tabButtonClass, onClick: () => onTabClick(tab), onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), title: tab.title },
        tab.icon && React.createElement("div", { className: styles.tabIcon }, tab.icon),
        React.createElement("span", { className: styles.tabTitle }, tab.title),
        tab.closable !== false && (React.createElement(motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: {
                opacity: isHovering || isActive ? 1 : 0,
                scale: isHovering || isActive ? 1 : 0.8,
            }, transition: { duration: 0.15 }, className: closeButtonClass, onClick: handleCloseClick, title: "\uD0ED \uB2EB\uAE30" },
            React.createElement("svg", { className: styles.closeButtonIcon, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))))));
}
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
export function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onPageSelect, availablePages = [], maxTabs = 10, className = "", showNewTabButton = true, showHomeButton = false, onHomeClick, homeButtonActive = false, homePath = "홈", }) {
    const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);
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
                React.createElement(AnimatePresence, { mode: "popLayout", initial: false }, tabs.map((tab) => (React.createElement(motion.div, { key: tab.id, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: {
                        duration: 0.15,
                        ease: "easeInOut",
                    }, layout: true, style: { originX: 0.5, originY: 0.5 } },
                    React.createElement(Tab, { tab: tab, isActive: tab.id === activeTabId, onTabClick: handleTabClick, onTabClose: handleTabClose }))))))),
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
