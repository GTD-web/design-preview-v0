"use client";
import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./PageSelector.module.css";
function PageItem({ page, onPageClick }) {
    const [isHovering, setIsHovering] = useState(false);
    const iconClass = [styles.pageIcon, isHovering ? styles.pageIconActive : ""]
        .filter(Boolean)
        .join(" ");
    const titleClass = [styles.pageTitle, isHovering ? styles.pageTitleHover : ""]
        .filter(Boolean)
        .join(" ");
    const arrowClass = [
        styles.pageArrow,
        isHovering ? styles.pageArrowActive : "",
    ]
        .filter(Boolean)
        .join(" ");
    return (React.createElement(motion.button, { className: styles.pageItem, onClick: () => onPageClick(page), onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false), whileHover: { x: 2 }, whileTap: { scale: 0.98 } },
        React.createElement("div", { className: iconClass }, page.icon || (React.createElement("svg", { className: styles.pageIconSvg, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" })))),
        React.createElement("div", { className: styles.pageContent },
            React.createElement("p", { className: titleClass }, page.title),
            React.createElement("p", { className: styles.pagePath }, page.path)),
        React.createElement("div", { className: arrowClass },
            React.createElement("svg", { className: styles.pageArrowIcon, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M9 5l7 7-7 7" })))));
}
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
    return (React.createElement("div", { className: styles.container },
        children,
        React.createElement(AnimatePresence, null, isOpen && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: styles.backdrop, onClick: handleBackdropClick }),
            React.createElement(motion.div, { initial: { opacity: 0, scale: 0.95, y: -10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -10 }, transition: { duration: 0.15 }, className: styles.popover },
                React.createElement("div", { className: styles.header },
                    React.createElement("div", { className: styles.headerContent },
                        React.createElement("h3", { className: styles.headerTitle }, "\uD0ED\uC73C\uB85C \uCD94\uAC00\uD560 \uD398\uC774\uC9C0 \uC120\uD0DD"),
                        React.createElement("button", { className: styles.closeButton, onClick: onClose },
                            React.createElement("svg", { className: styles.closeButtonIcon, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })))),
                    React.createElement("p", { className: styles.headerDescription },
                        selectablePages.length,
                        "\uAC1C\uC758 \uD398\uC774\uC9C0\uB97C \uCD94\uAC00\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4")),
                React.createElement("div", { className: styles.scrollArea }, selectablePages.length > 0 ? (React.createElement("div", { className: styles.pageList }, selectablePages.map((page) => (React.createElement(PageItem, { key: page.path, page: page, onPageClick: handlePageClick }))))) : (React.createElement("div", { className: styles.emptyState },
                    React.createElement("div", { className: styles.emptyStateIcon },
                        React.createElement("svg", { className: styles.emptyStateIconSvg, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }))),
                    React.createElement("p", { className: styles.emptyStateTitle }, "\uCD94\uAC00\uD560 \uC218 \uC788\uB294 \uD398\uC774\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4"),
                    React.createElement("p", { className: styles.emptyStateDescription }, "\uBAA8\uB4E0 \uD398\uC774\uC9C0\uAC00 \uC774\uBBF8 \uD0ED\uC73C\uB85C \uC5F4\uB824\uC788\uC2B5\uB2C8\uB2E4")))),
                selectablePages.length > 0 && (React.createElement("div", { className: styles.footer },
                    React.createElement("p", { className: styles.footerText }, "\uD074\uB9AD\uD558\uC5EC \uC0C8 \uD0ED\uC73C\uB85C \uCD94\uAC00")))))))));
}
