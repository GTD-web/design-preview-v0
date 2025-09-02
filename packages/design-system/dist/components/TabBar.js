"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageSelector } from "./PageSelector";
function Tab({ tab, isActive, onTabClick, onTabClose }) {
    const [isHovering, setIsHovering] = useState(false);
    const handleCloseClick = useCallback((e) => {
        e.stopPropagation();
        onTabClose(tab.id);
    }, [tab.id, onTabClose]);
    return (React.createElement(motion.button, { layout: true, transition: { duration: 0.15, ease: "easeInOut" }, className: `
        group relative flex items-center gap-2 px-3 py-1.5 min-w-0 max-w-40 
        transition-all duration-200 ease-out
        border-b-2 hover:bg-surface/50
        border-r-2
        ${isActive
            ? "bg-white border-primary text-foreground shadow-lg relative z-10"
            : "bg-gray-100 border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-gray-200"}
      `, style: {
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px",
            borderBottomLeftRadius: "6px",
            borderBottomRightRadius: "6px",
        }, onClick: () => onTabClick(tab), onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), title: tab.title },
        tab.icon && (React.createElement("div", { className: "flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center" }, tab.icon)),
        React.createElement("span", { className: "flex-1 text-xs font-medium truncate min-w-0" }, tab.title),
        tab.closable !== false && (React.createElement(motion.button, { initial: { opacity: 0, scale: 0.8 }, animate: {
                opacity: isHovering || isActive ? 1 : 0,
                scale: isHovering || isActive ? 1 : 0.8,
            }, transition: { duration: 0.15 }, className: `
            flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full
            transition-colors duration-200 hover:bg-muted-foreground/20
            ${isActive
                ? "text-muted-foreground hover:text-foreground"
                : "text-muted-foreground/60"}
          `, onClick: handleCloseClick, title: "\uD0ED \uB2EB\uAE30" },
            React.createElement("svg", { className: "w-2.5 h-2.5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })))),
        isActive && (React.createElement(motion.div, { layoutId: "activeTab", className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary", style: {
                borderBottomLeftRadius: "2px",
                borderBottomRightRadius: "2px",
            } }))));
}
/**
 * TabBar 컴포넌트 - 브라우저 탭과 유사한 동작을 제공하는 탭 바
 */
export function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onPageSelect, availablePages = [], maxTabs = 10, className = "", showNewTabButton = true, }) {
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
    return (React.createElement("div", { className: `
        flex items-end bg-gray-100 border-b border-border overflow-hidden py-1
        ${className}
      ` },
        React.createElement("div", { className: "flex-1 flex items-end overflow-x-auto overflow-y-hidden scrollbar-hide" },
            React.createElement("div", { className: "flex items-end min-w-max" },
                React.createElement(AnimatePresence, { mode: "popLayout", initial: false }, tabs.map((tab) => (React.createElement(motion.div, { key: tab.id, initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: {
                        duration: 0.15,
                        ease: "easeInOut",
                    }, layout: true, style: { originX: 0.5, originY: 0.5 } },
                    React.createElement(Tab, { tab: tab, isActive: tab.id === activeTabId, onTabClick: handleTabClick, onTabClose: handleTabClose }))))))),
        showNewTabButton && (React.createElement(PageSelector, { availablePages: availablePages, openTabPaths: openTabPaths, onPageSelect: handlePageSelect, isOpen: isPageSelectorOpen, onClose: () => setIsPageSelectorOpen(false) },
            React.createElement(motion.button, { className: `
                flex-shrink-0 inline-flex items-center justify-center w-4 h-4 mx-1
                text-muted-foreground hover:text-foreground hover:bg-gray-200
                rounded-md transition-colors duration-200 relative
                ${tabs.length >= maxTabs ? "opacity-50 cursor-not-allowed" : ""}
              `, onClick: () => {
                    if (tabs.length < maxTabs) {
                        setIsPageSelectorOpen(!isPageSelectorOpen);
                    }
                }, disabled: tabs.length >= maxTabs, title: "\uC0C8 \uD0ED \uCD94\uAC00", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } },
                React.createElement("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" })))))));
}
/**
 * 기본 탭 스타일 적용을 위한 CSS 클래스
 */
export const TAB_BAR_STYLES = {
    scrollbar: `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `,
};
