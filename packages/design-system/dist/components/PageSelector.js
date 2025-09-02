"use client";
import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
/**
 * 페이지 선택 컴포넌트 - + 버튼 클릭 시 사용 가능한 페이지 목록을 보여줌
 */
export function PageSelector({ availablePages, openTabPaths, onPageSelect, isOpen, onClose, children, }) {
    // 이미 열린 탭을 제외한 페이지들만 필터링
    const selectablePages = availablePages.filter((page) => !openTabPaths.includes(page.path));
    const handlePageClick = useCallback((pageInfo) => {
        onPageSelect(pageInfo);
        onClose();
    }, [onPageSelect, onClose]);
    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);
    return (React.createElement("div", { className: "relative" },
        children,
        React.createElement(AnimatePresence, null, isOpen && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "fixed inset-0 z-[200] bg-black/30", onClick: handleBackdropClick }),
            React.createElement(motion.div, { initial: { opacity: 0, scale: 0.95, y: -10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -10 }, transition: { duration: 0.15 }, className: "fixed z-[999] bg-surface border border-border rounded-lg shadow-2xl overflow-hidden", style: {
                    width: "384px",
                    maxWidth: "calc(100vw - 32px)",
                    maxHeight: "calc(100vh - 120px)",
                    top: "60px", // TabBar 아래 위치
                    right: "20px", // 오른쪽 여백
                } },
                React.createElement("div", { className: "px-4 py-3 border-b border-border bg-muted/30" },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("h3", { className: "text-sm font-semibold text-foreground" }, "\uD0ED\uC73C\uB85C \uCD94\uAC00\uD560 \uD398\uC774\uC9C0 \uC120\uD0DD"),
                        React.createElement(Button, { variant: "ghost", size: "sm", onClick: onClose, className: "h-6 w-6 p-0 text-muted-foreground hover:text-foreground" },
                            React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })))),
                    React.createElement("p", { className: "text-xs text-muted-foreground mt-1" },
                        selectablePages.length,
                        "\uAC1C\uC758 \uD398\uC774\uC9C0\uB97C \uCD94\uAC00\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4")),
                React.createElement("div", { className: "max-h-80 overflow-y-auto" }, selectablePages.length > 0 ? (React.createElement("div", { className: "p-2" }, selectablePages.map((page) => (React.createElement(motion.button, { key: page.path, className: "w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-muted/50 transition-colors duration-150 group", onClick: () => handlePageClick(page), whileHover: { x: 2 }, whileTap: { scale: 0.98 } },
                    React.createElement("div", { className: "flex-shrink-0 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" }, page.icon || (React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })))),
                    React.createElement("div", { className: "flex-1 min-w-0" },
                        React.createElement("p", { className: "text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate" }, page.title),
                        React.createElement("p", { className: "text-xs text-muted-foreground truncate" }, page.path)),
                    React.createElement("div", { className: "flex-shrink-0 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-150 group-hover:translate-x-1" },
                        React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 5l7 7-7 7" })))))))) : (React.createElement("div", { className: "p-8 text-center" },
                    React.createElement("div", { className: "w-12 h-12 mx-auto mb-4 text-muted-foreground/50" },
                        React.createElement("svg", { className: "w-12 h-12", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }))),
                    React.createElement("p", { className: "text-sm text-muted-foreground" }, "\uCD94\uAC00\uD560 \uC218 \uC788\uB294 \uD398\uC774\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4"),
                    React.createElement("p", { className: "text-xs text-muted-foreground/80 mt-1" }, "\uBAA8\uB4E0 \uD398\uC774\uC9C0\uAC00 \uC774\uBBF8 \uD0ED\uC73C\uB85C \uC5F4\uB824\uC788\uC2B5\uB2C8\uB2E4")))),
                selectablePages.length > 0 && (React.createElement("div", { className: "px-4 py-2 border-t border-border bg-muted/20" },
                    React.createElement("p", { className: "text-xs text-muted-foreground text-center" }, "\uD074\uB9AD\uD558\uC5EC \uC0C8 \uD0ED\uC73C\uB85C \uCD94\uAC00")))))))));
}
