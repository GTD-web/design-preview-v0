"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import TextHeading from "./TextHeading";
import { TextValue } from "./Text";
import { VStack, VSpace } from "./Stack";
import { Button } from "./Button";
/**
 * 사이드바 컴포넌트
 *
 * 기능:
 * - 네비게이션 메뉴 제공
 * - 반응형 디자인 (모바일에서 자동 숨김)
 * - 현재 페이지 하이라이트
 * - 스크롤 가능한 메뉴 영역
 */
export function Sidebar({ isOpen = true, onClose, isCollapsed = false, onToggleCollapse, activePath = "", menuGroups, width = "w-64", collapsedWidth = "w-20", className = "", user, onLogout, isAdminMode = false, onModeToggle, showModeToggle = true, showNotification = true, showSettings = true, logoUrl, logoText = "디자인시스템", logoTextShort = "DS", }) {
    const router = useRouter();
    const [collapsedGroups, setCollapsedGroups] = useState(new Set());
    const [showProfilePopup, setShowProfilePopup] = useState(false);
    // 모든 메뉴 그룹에 대한 refs와 상태를 미리 생성
    const groupRefs = useRef({});
    const [groupHeights, setGroupHeights] = useState({});
    const toggleGroup = (groupTitle) => {
        setCollapsedGroups((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(groupTitle)) {
                newSet.delete(groupTitle);
            }
            else {
                newSet.add(groupTitle);
            }
            return newSet;
        });
    };
    const handleModeToggle = () => {
        onModeToggle?.();
    };
    const handleProfileClick = () => {
        if (isCollapsed) {
            setShowProfilePopup(!showProfilePopup);
        }
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
    // 모든 그룹의 높이를 업데이트
    useEffect(() => {
        const newHeights = {};
        menuGroups.forEach((group) => {
            const ref = groupRefs.current[group.title];
            if (ref) {
                newHeights[group.title] = collapsedGroups.has(group.title)
                    ? 0
                    : ref.scrollHeight;
            }
        });
        setGroupHeights(newHeights);
    }, [collapsedGroups, menuGroups]);
    return (React.createElement(React.Fragment, null,
        isOpen && (React.createElement("div", { className: "fixed inset-0 bg-black/50 z-40 lg:hidden", onClick: onClose })),
        isCollapsed && (React.createElement("aside", { className: `
            fixed top-0 left-0 h-full bg-surface z-50
            transform transition-all duration-500 ease-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            shadow-lg
            ${collapsedWidth} ${className}
          `, style: {
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            } },
            React.createElement("div", { className: "flex flex-col h-full" },
                React.createElement("div", { className: "p-3 border-b border-border" },
                    React.createElement("div", { className: "flex flex-col items-center gap-3" },
                        logoUrl ? (React.createElement("img", { src: logoUrl, alt: "Logo", className: "w-10 h-10 object-contain" })) : (React.createElement("div", { className: "w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center transition-all duration-300" },
                            React.createElement("span", { className: "text-white font-bold text-base" }, logoTextShort))),
                        React.createElement(Button, { variant: "ghost", size: "sm", onClick: onToggleCollapse, className: "p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200", title: "\uC0AC\uC774\uB4DC\uBC14 \uD3BC\uCE58\uAE30" },
                            React.createElement("svg", { className: "w-4 h-4 transition-transform duration-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 5l7 7-7 7M5 5l7 7-7 7" }))))),
                React.createElement("nav", { className: "flex-1 overflow-y-auto p-2 pt-4" },
                    React.createElement("div", { className: "flex flex-col gap-sm items-center justify-start" }, menuGroups.map((group, groupIndex) => (React.createElement("div", { key: group.title, className: `w-full ${groupIndex === 0 ? "mt-2" : ""}` }, group.items.map((item) => (React.createElement("button", { key: item.path, type: "button", onClick: () => router.push(item.path), className: `
                          group flex items-center justify-center h-10 rounded-lg transition-all duration-200 ease-in-out
                          hover:bg-neutral-100 dark:hover:bg-neutral-800 w-10 mx-auto
                          ${activePath === item.path
                            ? "bg-neutral-800 dark:bg-neutral-700"
                            : "text-neutral-600 dark:text-neutral-400"}
                        `, title: item.title },
                        React.createElement("div", { className: `
                          flex items-center justify-center w-5 h-5 transition-all duration-200 ease-in-out
                          ${activePath === item.path
                                ? "text-white"
                                : "text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300"}
                        ` }, item.icon))))))))),
                React.createElement("div", { className: "p-2 border-t border-border" },
                    React.createElement("div", { className: "p-2 rounded-lg bg-surface/50 hover:bg-surface/70 transition-all duration-200 ease-in-out cursor-pointer", onClick: handleProfileClick },
                        React.createElement("div", { className: "flex justify-center" },
                            React.createElement("div", { className: "w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center transition-all duration-300" },
                                React.createElement("span", { className: "text-white font-bold text-sm" }, user?.initials || user?.name?.charAt(0) || "U")))))))),
        !isCollapsed && (React.createElement("aside", { className: `
            fixed top-0 left-0 h-full bg-surface z-50
            transform transition-transform duration-500 ease-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
            shadow-lg
            ${width} ${className}
          `, style: {
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            } },
            React.createElement("div", { className: "flex flex-col h-full" },
                React.createElement("div", { className: "p-4 flex items-center justify-between border-b border-border" },
                    React.createElement("div", { className: "flex items-center gap-3" },
                        logoUrl ? (React.createElement("img", { src: logoUrl, alt: "Logo", className: "h-10 object-contain" })) : (React.createElement("div", { className: "flex items-center gap-3" },
                            React.createElement("div", { className: "w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center transition-all duration-300" },
                                React.createElement("span", { className: "text-white font-bold text-base" }, logoTextShort)),
                            React.createElement("span", { className: "font-semibold text-lg transition-all duration-300" }, logoText))),
                        React.createElement(Button, { variant: "ghost", size: "sm", onClick: onToggleCollapse, className: "p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200", title: "\uC0AC\uC774\uB4DC\uBC14 \uC811\uAE30" },
                            React.createElement("svg", { className: "w-4 h-4 transition-transform duration-300", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 19l-7-7 7-7m8 14l-7-7 7-7" }))))),
                React.createElement("nav", { className: "flex-1 overflow-y-auto p-4" },
                    React.createElement(VSpace, { gap: "lg", align: "stretch" }, menuGroups.map((group) => (React.createElement("div", { key: group.title, className: "space-y-2" },
                        React.createElement("h3", { className: "text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider transition-all duration-300" }, group.title),
                        React.createElement(VStack, { gap: "sm", align: "stretch" }, group.items.map((item) => (React.createElement("button", { key: item.path, type: "button", onClick: () => router.push(item.path), className: `
                            group flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 ease-in-out
                            hover:bg-neutral-100 dark:hover:bg-neutral-800
                            ${activePath === item.path
                                ? "bg-neutral-800 dark:bg-neutral-700"
                                : "text-neutral-600 dark:text-neutral-400"}
                          ` },
                            React.createElement("div", { className: `
                            flex items-center justify-center w-5 h-5 transition-all duration-200 ease-in-out
                            ${activePath === item.path
                                    ? "text-white"
                                    : "text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300"}
                          ` }, item.icon),
                            React.createElement("span", { className: `font-medium transition-all duration-200 ease-in-out ${activePath === item.path
                                    ? "text-white"
                                    : "text-neutral-600 dark:text-neutral-400"}` }, item.title)))))))))),
                showModeToggle && (React.createElement("div", { className: "p-4 border-b border-t" },
                    React.createElement(Button, { variant: "ghost", size: "sm", className: "w-full justify-start text-foreground hover:text-primary hover:bg-surface/80 transition-all duration-200 group", onClick: handleModeToggle },
                        React.createElement("div", { className: "flex items-center justify-between w-full" },
                            React.createElement("span", { className: "text-sm font-medium" }, isAdminMode
                                ? "사용자 화면으로 이동"
                                : "관리자 화면으로 이동"),
                            React.createElement("svg", { width: "16", height: "16", fill: "none", viewBox: "0 0 24 24", className: "text-muted group-hover:text-primary transition-colors duration-200" },
                                React.createElement("path", { d: "M9 5l7 7-7 7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })))))),
                React.createElement("div", { className: "p-4" },
                    React.createElement("div", { className: "p-3 rounded-lg bg-surface/50 hover:bg-surface/70 transition-all duration-200 ease-in-out cursor-pointer", onClick: handleProfileClick },
                        React.createElement("div", { className: "flex items-center justify-between mb-3" },
                            React.createElement("div", { className: "flex-1 min-w-0 transition-all duration-300" },
                                React.createElement("p", { className: "text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate" }, user?.name || "사용자")),
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
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }),
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })))),
                                React.createElement(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10 transition-all duration-200", onClick: (e) => {
                                        e.stopPropagation();
                                        onLogout?.();
                                    }, title: "\uB85C\uADF8\uC544\uC6C3" },
                                    React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" })))))))))),
        showProfilePopup && isCollapsed && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "fixed inset-0 bg-black/50 z-50", onClick: () => setShowProfilePopup(false) },
                React.createElement("div", { className: "profile-popup fixed bg-surface rounded-lg shadow-2xl border border-border w-80 max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out", style: {
                        bottom: "1rem",
                        left: "calc(4rem + 1rem)", // 사이드바 너비(4rem) + 여백(1rem)
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
