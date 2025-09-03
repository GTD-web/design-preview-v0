"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import TextHeading from "./TextHeading";
import { TextValue } from "./Text";
import { VStack, VSpace } from "./Stack";
import { Button } from "./Button";
import { useSidebarIcons } from "../hooks/useSidebarIcons";
/**
 * 접힌 사이드바 컴포넌트
 */
export function SidebarCollapsed({ logoUrl, logoTextShort = "DS", activePath = "", menuGroups, width = "w-20", className = "", user, onLogout, isAdminMode = false, onModeToggle, showModeToggle = true, showNotification = true, showSettings = true, }) {
    const router = useRouter();
    const { isLoaded } = useSidebarIcons();
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    const handleModeToggle = () => {
        onModeToggle?.();
    };
    const handleProfileClick = () => {
        setShowProfilePopup(!showProfilePopup);
    };
    // 팝업 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;
            if (showProfilePopup && !target.closest(".profile-popup")) {
                setShowProfilePopup(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProfilePopup]);
    if (!isLoaded) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("aside", { className: `
          h-full bg-surface
          overflow-x-hidden
          shadow-lg ${width} ${className}
        ` },
            React.createElement("div", { className: "flex flex-col h-full overflow-hidden overflow-x-hidden" },
                React.createElement("div", { className: "border-b overflow-x-hidden p-3" },
                    React.createElement("div", { className: "flex flex-col items-center" }, logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    React.createElement("img", { src: logoUrl, alt: "Logo", className: "w-10 h-10 object-contain transition-all duration-300" })) : (React.createElement("div", { className: "w-10 h-10 bg-neutral-800 /*dark:bg-neutral-700*/ rounded-lg flex items-center justify-center transition-all duration-300" },
                        React.createElement("span", { className: "text-white font-bold text-base" }, logoTextShort))))),
                React.createElement("nav", { className: "flex-1 overflow-y-auto overflow-x-hidden p-2 pt-4" },
                    React.createElement("div", { className: "flex flex-col gap-sm items-center justify-start" }, menuGroups.map((group, groupIndex) => (React.createElement("div", { key: group.title, className: `w-full ${groupIndex === 0 ? "mt-2" : ""}` }, group.items.map((item) => (React.createElement("div", { key: item.path, className: "relative" },
                        React.createElement("button", { type: "button", onClick: () => router.push(item.path), className: `
                          group flex items-center justify-center h-12 w-12 rounded-lg transition-all duration-200 ease-in-out mx-auto relative
                          ${activePath === item.path
                                ? "bg-neutral-800 /*dark:bg-neutral-700*/"
                                : "text-neutral-600 /*dark:text-neutral-400*/ hover:bg-neutral-100 /*dark:hover:bg-neutral-800*/"}
                        `, title: item.title },
                            React.createElement("div", { className: `
                            flex items-center justify-center w-6 h-6 transition-all duration-200 ease-in-out
                            ${activePath === item.path
                                    ? "text-white"
                                    : "text-neutral-500 group-hover:text-neutral-700 /*dark:text-neutral-400 dark:group-hover:text-neutral-300*/"}
                          ` }, item.icon)),
                        item.badge && (React.createElement("div", { className: "absolute -top-1 -right-1 bg-neutral-900 /*dark:bg-neutral-800*/ text-white px-1 py-0.5 rounded font-medium border border-neutral-700 max-w-8 text-center overflow-hidden leading-none", style: { fontSize: "10px", lineHeight: "12px" }, title: item.badge },
                            React.createElement("span", { className: "block truncate" }, item.badge.length > 3
                                ? `${item.badge.slice(0, 2)}...`
                                : item.badge))))))))))),
                React.createElement("div", { className: "border-t overflow-x-hidden p-2" },
                    React.createElement("div", { className: "p-2 rounded-lg bg-surface/50 hover:bg-surface/70 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden", onClick: handleProfileClick },
                        React.createElement("div", { className: "flex justify-center" },
                            React.createElement("div", { className: "w-10 h-10 bg-neutral-800 /*dark:bg-neutral-700*/ rounded-lg flex items-center justify-center transition-all duration-300" },
                                React.createElement("span", { className: "text-white font-bold text-sm" }, user?.initials || user?.name?.charAt(0) || "U"))))))),
        showProfilePopup && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "fixed inset-0 bg-black/50 z-50", onClick: () => setShowProfilePopup(false) },
                React.createElement("div", { className: "profile-popup fixed bg-surface rounded-lg shadow-2xl border w-80 max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out", style: {
                        bottom: "1rem",
                        left: "calc(5rem + 1rem)",
                    }, onClick: (e) => e.stopPropagation() },
                    React.createElement("div", { className: "flex flex-col h-full" },
                        React.createElement("div", { className: "flex-1 p-4 overflow-y-auto" },
                            React.createElement("div", { className: "space-y-4" },
                                React.createElement("div", { className: "text-center" },
                                    React.createElement(TextHeading, { size: "lg", weight: "semibold", className: "text-foreground mb-1" }, user?.name || "사용자"),
                                    React.createElement(TextValue, { size: "sm", color: "muted" }, user?.email || "user@example.com")),
                                React.createElement("div", { className: "space-y-2" },
                                    showNotification && (React.createElement(Button, { variant: "ghost", size: "lg", className: "w-full text-left text-foreground hover:bg-surface/80", onClick: () => {
                                            console.log("알림 클릭");
                                            setShowProfilePopup(false);
                                        } },
                                        React.createElement("div", { className: "flex items-center w-full" },
                                            React.createElement("svg", { width: "20", height: "20", fill: "none", viewBox: "0 0 20 20", className: "mr-3 flex-shrink-0" },
                                                React.createElement("path", { d: "M10 18a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm6-4V9a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })),
                                            React.createElement("span", { className: "text-left" }, "\uC54C\uB9BC")))),
                                    showSettings && (React.createElement(Button, { variant: "ghost", size: "lg", className: "w-full text-left text-foreground hover:bg-surface/80", onClick: () => {
                                            console.log("설정 클릭");
                                            setShowProfilePopup(false);
                                        } },
                                        React.createElement("div", { className: "flex items-center w-full" },
                                            React.createElement("svg", { className: "w-5 h-5 mr-3 flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
                                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })),
                                            React.createElement("span", { className: "text-left" }, "\uC124\uC815")))),
                                    showModeToggle && (React.createElement(Button, { variant: "ghost", size: "lg", className: "w-full text-left text-foreground hover:bg-surface/80", onClick: () => {
                                            handleModeToggle();
                                            setShowProfilePopup(false);
                                        } },
                                        React.createElement("div", { className: "flex items-center w-full" },
                                            React.createElement("svg", { className: "w-5 h-5 mr-3 flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" })),
                                            React.createElement("span", { className: "text-left" }, isAdminMode
                                                ? "사용자 화면으로 이동"
                                                : "관리자 화면으로 이동")))),
                                    React.createElement(Button, { variant: "ghost", size: "lg", className: "w-full text-left text-danger hover:bg-danger/10", onClick: () => {
                                            onLogout?.();
                                            setShowProfilePopup(false);
                                        } },
                                        React.createElement("div", { className: "flex items-center w-full" },
                                            React.createElement("svg", { className: "w-5 h-5 mr-3 flex-shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" })),
                                            React.createElement("span", { className: "text-left" }, "\uB85C\uADF8\uC544\uC6C3")))))))))))));
}
/**
 * 펼쳐진 사이드바 컴포넌트
 */
export function SidebarExpanded({ logoUrl, logoText = "디자인시스템", logoTextShort = "DS", activePath = "", menuGroups, width = "w-64", className = "", user, onLogout, isAdminMode = false, onModeToggle, showModeToggle = true, showNotification = true, showSettings = true, onToggleCollapse, collapseIcon, isHoverEnabled = false, onToggleHover, hoverActiveIcon, hoverInActiveIcon, }) {
    const router = useRouter();
    const { currentIcon, isLoaded } = useSidebarIcons();
    // 애니메이션 variants 정의 (opacity 제거)
    const expandedContentVariants = {
        hidden: {},
        visible: {},
        exit: {},
    };
    const staggerVariants = {
        hidden: {},
        visible: {},
        exit: {},
    };
    const itemVariants = {
        hidden: {},
        visible: {},
        exit: {},
    };
    const handleModeToggle = () => {
        onModeToggle?.();
    };
    if (!isLoaded) {
        return null;
    }
    return (React.createElement("aside", { className: `
        h-full bg-surface
        overflow-x-hidden
        shadow-lg ${width} ${className}
      ` },
        React.createElement("div", { className: "flex flex-col h-full overflow-hidden overflow-x-hidden" },
            React.createElement("div", { className: "border-b overflow-x-hidden p-4" },
                React.createElement(motion.div, { className: "flex items-center justify-between", initial: "hidden", animate: "visible", exit: "exit", variants: expandedContentVariants },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        React.createElement("img", { src: logoUrl, alt: "Logo", className: "h-10 object-contain transition-all duration-300" })) : (React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement("div", { className: "w-10 h-10 bg-neutral-800 /*dark:bg-neutral-700*/ rounded-lg flex items-center justify-center transition-all duration-300" },
                                React.createElement("span", { className: "text-white font-bold text-base" }, logoTextShort)),
                            React.createElement("span", { className: "font-semibold text-lg" }, logoText))),
                        React.createElement(Button, { variant: "ghost", size: "sm", onClick: isHoverEnabled ? onToggleHover : onToggleCollapse, className: `p-2 hover:bg-neutral-100 /*dark:hover:bg-neutral-800*/ rounded-lg transition-all duration-200 ${isHoverEnabled ? "bg-neutral-100 /*dark:bg-neutral-800*/" : ""}`, title: isHoverEnabled ? "호버 모드 비활성화" : "사이드바 접기" }, isHoverEnabled
                            ? hoverActiveIcon || (React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
                                React.createElement("path", { d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" })))
                            : hoverInActiveIcon ||
                                collapseIcon ||
                                currentIcon.collapseIcon)))),
            React.createElement("nav", { className: "flex-1 overflow-y-auto overflow-x-hidden p-4" },
                React.createElement(motion.div, { initial: "hidden", animate: "visible", exit: "exit", variants: staggerVariants },
                    React.createElement(VSpace, { gap: "lg", align: "stretch" }, menuGroups.map((group) => (React.createElement(motion.div, { key: group.title, className: "space-y-2", variants: itemVariants },
                        React.createElement(motion.h3, { className: "text-xs font-semibold text-neutral-500 /*dark:text-neutral-400*/ uppercase tracking-wider transition-all duration-300", variants: itemVariants }, group.title),
                        React.createElement(VStack, { gap: "sm", align: "stretch" }, group.items.map((item) => (React.createElement(motion.button, { key: item.path, type: "button", onClick: () => router.push(item.path), className: `
                          group flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 ease-in-out overflow-hidden
                          ${activePath === item.path
                                ? "bg-neutral-800 /*dark:bg-neutral-700*/"
                                : "text-neutral-600 /*dark:text-neutral-400*/ hover:bg-neutral-100 /*dark:hover:bg-neutral-800*/"}
                        `, variants: itemVariants },
                            React.createElement("div", { className: `
                            flex items-center justify-center w-5 h-5 transition-all duration-200 ease-in-out flex-shrink-0
                            ${activePath === item.path
                                    ? "text-white"
                                    : "text-neutral-500 group-hover:text-neutral-700 /*dark:text-neutral-400 dark:group-hover:text-neutral-300*/"}
                          ` }, item.icon),
                            React.createElement("div", { className: "flex items-center justify-between flex-1 min-w-0" },
                                React.createElement("span", { className: `font-medium transition-all duration-200 ease-in-out truncate ${activePath === item.path
                                        ? "text-white"
                                        : "text-neutral-600 /*dark:text-neutral-400*/"}` }, item.title),
                                item.badge && (React.createElement("div", { className: "bg-neutral-900 /*dark:bg-neutral-800*/ text-white text-xs px-2 py-1 rounded-md font-medium border border-neutral-700 max-w-16 overflow-hidden flex-shrink-0", title: item.badge },
                                    React.createElement("span", { className: "block truncate" }, item.badge)))))))))))))),
            React.createElement(AnimatePresence, null, showModeToggle && (React.createElement(motion.div, { className: "p-4 border-t overflow-x-hidden", initial: "hidden", animate: "visible", exit: "exit", variants: expandedContentVariants },
                React.createElement(Button, { variant: "ghost", size: "sm", className: "w-full justify-start text-foreground hover:text-primary hover:bg-surface/80 transition-all duration-200 group overflow-hidden", onClick: handleModeToggle },
                    React.createElement("div", { className: "flex items-center justify-between w-full" },
                        React.createElement("span", { className: "text-sm font-medium" }, isAdminMode
                            ? "사용자 화면으로 이동"
                            : "관리자 화면으로 이동"),
                        React.createElement("svg", { width: "16", height: "16", fill: "none", viewBox: "0 0 24 24", className: "text-secondary group-hover:text-primary transition-colors duration-200" },
                            React.createElement("path", { d: "M9 5l7 7-7 7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }))))))),
            React.createElement("div", { className: "border-t overflow-x-hidden p-4" },
                React.createElement(motion.div, { className: "p-3 rounded-lg bg-surface/50 hover:bg-surface/70 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden", initial: "hidden", animate: "visible", exit: "exit", variants: expandedContentVariants },
                    React.createElement("div", { className: "flex items-center justify-between" },
                        React.createElement("div", { className: "flex-1 min-w-0 transition-all duration-300" },
                            React.createElement("p", { className: "text-sm font-medium text-[var(--foreground)] truncate" }, user?.name || "사용자")),
                        React.createElement("div", { className: "flex items-center gap-1" },
                            showNotification && (React.createElement(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 text-muted hover:text-foreground hover:bg-surface/80 transition-all duration-200", onClick: (e) => {
                                    e.stopPropagation();
                                    console.log("알림 클릭");
                                }, title: "\uC54C\uB9BC" },
                                React.createElement("svg", { width: "16", height: "16", fill: "none", viewBox: "0 0 20 20" },
                                    React.createElement("path", { d: "M10 18a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm6-4V9a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })))),
                            showSettings && (React.createElement(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 text-muted hover:text-foreground hover:bg-surface/80 transition-all duration-200", onClick: (e) => {
                                    e.stopPropagation();
                                    console.log("설정 클릭");
                                }, title: "\uC124\uC815" },
                                React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.50 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
                                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })))),
                            React.createElement(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10 transition-all duration-200", onClick: (e) => {
                                    e.stopPropagation();
                                    onLogout?.();
                                }, title: "\uB85C\uADF8\uC544\uC6C3" },
                                React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" }))))))))));
}
/**
 * 사이드바 컴포넌트 (통합)
 *
 * 기능:
 * - 네비게이션 메뉴 제공
 * - 반응형 디자인 (모바일에서 자동 숨김)
 * - 현재 페이지 하이라이트
 * - 스크롤 가능한 메뉴 영역
 */
export function Sidebar({ isOpen = true, onClose, isCollapsed = false, isHidden = false, onToggleCollapse, activePath = "", menuGroups, width = "w-64", collapsedWidth = "w-20", className = "", user, onLogout, isAdminMode = false, onModeToggle, showModeToggle = true, showNotification = true, showSettings = true, logoUrl, logoText = "디자인시스템", logoTextShort = "DS", isHoverEnabled = false, onToggleHover, hoverActiveIcon, hoverInActiveIcon, }) {
    const { isLoaded } = useSidebarIcons();
    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [hoverTimeoutId, setHoverTimeoutId] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    // 화면 크기 감지
    useEffect(() => {
        const checkScreenSize = () => {
            setIsLargeScreen(window.innerWidth >= 1024);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);
    // 호버 타이머 정리
    useEffect(() => {
        return () => {
            if (hoverTimeoutId) {
                clearTimeout(hoverTimeoutId);
            }
        };
    }, [hoverTimeoutId]);
    // 호버 이벤트 핸들러
    const handleMouseEnter = () => {
        if (!isHoverEnabled || !isCollapsed || isAnimating)
            return;
        if (hoverTimeoutId) {
            clearTimeout(hoverTimeoutId);
            setHoverTimeoutId(null);
        }
        // 애니메이션 상태 설정
        setIsAnimating(true);
        // 호버 시 사이드바 펼치기
        onToggleCollapse?.();
        // 애니메이션 완료 후 상태 리셋
        setTimeout(() => {
            setIsAnimating(false);
        }, 250); // 애니메이션 시간보다 약간 길게
    };
    const handleMouseLeave = () => {
        if (!isHoverEnabled || isCollapsed || isAnimating)
            return;
        const timeoutId = setTimeout(() => {
            if (!isAnimating) {
                // 애니메이션 상태 설정
                setIsAnimating(true);
                // 호버 해제 시 사이드바 접기
                onToggleCollapse?.();
                // 애니메이션 완료 후 상태 리셋
                setTimeout(() => {
                    setIsAnimating(false);
                }, 0);
            }
            setHoverTimeoutId(null);
        }, 0);
        setHoverTimeoutId(timeoutId);
    };
    // 호버 토글 핸들러
    const handleToggleHover = () => {
        if (isHoverEnabled) {
            // 호버 모드 비활성화 시 진행 중인 타이머 정리
            if (hoverTimeoutId) {
                clearTimeout(hoverTimeoutId);
                setHoverTimeoutId(null);
            }
            // 애니메이션 상태 리셋
            setIsAnimating(false);
        }
        // 부모 컴포넌트의 호버 상태 토글
        onToggleHover?.();
    };
    // 저장된 아이콘이 로드되지 않았으면 로딩 상태 처리
    if (!isLoaded) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        isOpen && !isHidden && (React.createElement("div", { className: "fixed inset-0 bg-black/50 z-40 lg:hidden", onClick: onClose })),
        React.createElement("div", { className: "fixed left-0 z-50", style: {
                top: "var(--tab-bar-height, 40px)", // TabBar 높이만큼 아래에 위치
                height: "calc(100vh - var(--tab-bar-height, 40px))", // TabBar를 제외한 높이
                transform: isHidden
                    ? "translateX(-100%)"
                    : isLargeScreen
                        ? "translateX(0)"
                        : isOpen
                            ? "translateX(0)"
                            : "translateX(-100%)",
                transition: "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                willChange: "transform",
                width: isCollapsed ? "5rem" : "16rem",
            }, onMouseEnter: !isHidden ? handleMouseEnter : undefined, onMouseLeave: !isHidden ? handleMouseLeave : undefined },
            React.createElement(AnimatePresence, { mode: "wait" }, isCollapsed ? (React.createElement(motion.div, { key: "collapsed", initial: { x: -80, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -80, opacity: 0 }, transition: {
                    duration: 0.2,
                    ease: "easeOut",
                }, style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    willChange: "transform, opacity",
                } },
                React.createElement(SidebarCollapsed, { logoUrl: logoUrl, logoTextShort: logoTextShort, activePath: activePath, menuGroups: menuGroups, className: className, user: user, onLogout: onLogout, isAdminMode: isAdminMode, onModeToggle: onModeToggle, showModeToggle: showModeToggle, showNotification: showNotification, showSettings: showSettings, width: collapsedWidth, onToggleExpand: onToggleCollapse, isHoverEnabled: isHoverEnabled, onToggleHover: handleToggleHover }))) : (React.createElement(motion.div, { key: "expanded", initial: { x: -80, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -80, opacity: 0 }, transition: {
                    duration: 0.2,
                    ease: "easeOut",
                }, style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    willChange: "transform, opacity",
                } },
                React.createElement(SidebarExpanded, { logoUrl: logoUrl, logoText: logoText, logoTextShort: logoTextShort, activePath: activePath, menuGroups: menuGroups, className: className, user: user, onLogout: onLogout, isAdminMode: isAdminMode, onModeToggle: onModeToggle, showModeToggle: showModeToggle, showNotification: showNotification, showSettings: showSettings, width: width, onToggleCollapse: onToggleCollapse, isHoverEnabled: isHoverEnabled, onToggleHover: handleToggleHover, hoverActiveIcon: hoverActiveIcon, hoverInActiveIcon: hoverInActiveIcon })))))));
}
