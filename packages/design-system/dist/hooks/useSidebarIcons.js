"use client";
import React from "react";
import { useState, useEffect } from "react";
// 사용 가능한 아이콘 목록
export const sidebarIconOptions = [
    {
        id: "default",
        name: "기본",
        collapseIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 19l-7-7 7-7m8 14l-7-7 7-7" }))),
        expandIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 5l7 7-7 7M5 5l7 7-7 7" }))),
    },
    {
        id: "arrow",
        name: "화살표",
        collapseIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16l-4-4m0 0l4-4m-4 4h18" }))),
        expandIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }))),
    },
    {
        id: "chevron",
        name: "쉐브론",
        collapseIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }))),
        expandIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }))),
    },
    {
        id: "menu",
        name: "메뉴",
        collapseIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))),
        expandIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }))),
    },
    {
        id: "plus-minus",
        name: "플러스/마이너스",
        collapseIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12H4" }))),
        expandIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }))),
    },
    {
        id: "toggle",
        name: "토글",
        collapseIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" }))),
        expandIcon: (React.createElement("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" }))),
    },
];
const STORAGE_KEY = "sidebar-icon-preference";
export function useSidebarIcons() {
    const [selectedIconId, setSelectedIconId] = useState("default");
    const [isLoaded, setIsLoaded] = useState(false);
    // localStorage에서 아이콘 설정 불러오기
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setSelectedIconId(saved);
            }
            setIsLoaded(true);
        }
    }, []);
    // 아이콘 설정 변경
    const setSelectedIcon = (iconId) => {
        setSelectedIconId(iconId);
        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, iconId);
        }
    };
    // 현재 선택된 아이콘 찾기
    const currentIcon = sidebarIconOptions.find((icon) => icon.id === selectedIconId) ||
        sidebarIconOptions[0];
    return {
        selectedIconId,
        setSelectedIcon,
        currentIcon,
        iconOptions: sidebarIconOptions,
        isLoaded,
    };
}
