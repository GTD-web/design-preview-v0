"use client";
import React from "react";
import { ChromeTabBar } from "./ChromeTabBar";
import { useChromeTabBar } from "../hooks/useChromeTabBar";
/**
 * ChromeTabBar 사용 예시 컴포넌트
 */
export function ChromeTabBarExample() {
    // 페이지 매핑 정의 - 실제 애플리케이션의 페이지들
    const pageMapping = {
        "/": {
            path: "/",
            title: "홈",
            closable: false,
        },
        "/dashboard": {
            path: "/dashboard",
            title: "대시보드",
            closable: true,
            allowDuplicate: false,
        },
        "/users": {
            path: "/users",
            title: "사용자 관리",
            closable: true,
            allowDuplicate: true, // 중복 탭 허용
        },
        "/products": {
            path: "/products",
            title: "제품 관리",
            closable: true,
            allowDuplicate: true, // 중복 탭 허용
        },
        "/settings": {
            path: "/settings",
            title: "설정",
            closable: true,
            allowDuplicate: false,
        },
    };
    // 파비콘 리졸버
    const faviconResolver = (path) => {
        const iconMap = {
            "/": "🏠",
            "/dashboard": "📊",
            "/users": "👥",
            "/products": "📦",
            "/settings": "⚙️",
        };
        const basePath = path.split("?")[0];
        return iconMap[basePath];
    };
    // 크롬 탭바 훅 사용
    const { tabs, activeTabId, addTab, removeTab, createNewTab, handleTabClick, reorderTabs, } = useChromeTabBar({
        initialTabs: [
            {
                id: "home",
                title: "홈",
                path: "/",
                closable: false,
            },
        ],
        pageMapping,
        homePath: "/",
        maxTabs: 8,
        allowDuplicatesByQuery: true,
        faviconResolver,
        enableLocalStorage: true,
        localStorageKey: "chrome-tabbar-example",
    });
    // 샘플 페이지 추가 핸들러들
    const addDashboardTab = () => {
        addTab({
            path: "/dashboard",
            title: "대시보드",
            closable: true,
            allowDuplicate: false,
        });
    };
    const addUsersTab = () => {
        addTab({
            path: "/users",
            title: "사용자 관리",
            closable: true,
            allowDuplicate: true,
        });
    };
    const addUsersTabWithQuery = () => {
        addTab({
            path: "/users?page=2&filter=active",
            title: "사용자 관리",
            closable: true,
            allowDuplicate: true,
        });
    };
    const addUsersTabWithCustomName = () => {
        addTab({
            path: "/users?tabName=활성 사용자 목록&filter=active",
            title: "사용자 관리",
            closable: true,
            allowDuplicate: true,
        });
    };
    const addProductsTab = () => {
        addTab({
            path: "/products?category=electronics",
            title: "제품 관리",
            closable: true,
            allowDuplicate: true,
        });
    };
    const forceDuplicateUsersTab = () => {
        addTab({
            path: "/users",
            title: "사용자 관리",
            closable: true,
            allowDuplicate: true,
        });
    };
    return (React.createElement("div", { className: "chrome-tabbar-example" },
        React.createElement("div", { className: "p-4 bg-gray-50 border-b" },
            React.createElement("h2", { className: "text-lg font-semibold mb-4" }, "ChromeTabBar \uC608\uC2DC"),
            React.createElement(ChromeTabBar, { tabs: tabs, onTabClick: handleTabClick, onTabClose: removeTab, onTabReorder: reorderTabs, onNewTab: createNewTab, showNewTabButton: true, maxTabs: 8, darkMode: false }),
            React.createElement("div", { className: "mt-4 space-x-2 flex flex-wrap gap-2" },
                React.createElement("button", { onClick: addDashboardTab, className: "px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600" }, "\uB300\uC2DC\uBCF4\uB4DC \uD0ED \uCD94\uAC00"),
                React.createElement("button", { onClick: addUsersTab, className: "px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600" }, "\uC0AC\uC6A9\uC790 \uAD00\uB9AC \uD0ED \uCD94\uAC00"),
                React.createElement("button", { onClick: addUsersTabWithQuery, className: "px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600" }, "\uC0AC\uC6A9\uC790 \uAD00\uB9AC (\uCFFC\uB9AC) \uD0ED \uCD94\uAC00"),
                React.createElement("button", { onClick: addUsersTabWithCustomName, className: "px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600" }, "\uC0AC\uC6A9\uC790 \uAD00\uB9AC (\uCEE4\uC2A4\uD140\uBA85) \uD0ED \uCD94\uAC00"),
                React.createElement("button", { onClick: addProductsTab, className: "px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600" }, "\uC81C\uD488 \uAD00\uB9AC \uD0ED \uCD94\uAC00"),
                React.createElement("button", { onClick: forceDuplicateUsersTab, className: "px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600" }, "\uC911\uBCF5 \uC0AC\uC6A9\uC790 \uD0ED \uAC15\uC81C \uCD94\uAC00")),
            React.createElement("div", { className: "mt-4 p-3 bg-white rounded border" },
                React.createElement("h3", { className: "font-medium mb-2" }, "\uD604\uC7AC \uC0C1\uD0DC"),
                React.createElement("div", { className: "text-sm space-y-1" },
                    React.createElement("div", null,
                        React.createElement("strong", null, "\uCD1D \uD0ED \uAC1C\uC218:"),
                        " ",
                        tabs.length),
                    React.createElement("div", null,
                        React.createElement("strong", null, "\uD65C\uC131 \uD0ED ID:"),
                        " ",
                        activeTabId || "없음"),
                    React.createElement("div", null,
                        React.createElement("strong", null, "\uD65C\uC131 \uD0ED \uACBD\uB85C:"),
                        " ",
                        tabs.find((tab) => tab.active)?.path || "없음"))),
            React.createElement("div", { className: "mt-4 p-3 bg-white rounded border" },
                React.createElement("h3", { className: "font-medium mb-2" }, "\uD0ED \uBAA9\uB85D"),
                React.createElement("div", { className: "space-y-2" }, tabs.map((tab, index) => (React.createElement("div", { key: tab.id, className: `flex items-center justify-between p-2 rounded text-sm ${tab.active ? "bg-blue-100 border-blue-300" : "bg-gray-50"}` },
                    React.createElement("div", { className: "flex items-center space-x-2" },
                        React.createElement("span", { className: "font-mono text-xs bg-gray-200 px-1 rounded" }, index),
                        tab.favicon && (React.createElement("span", { className: "text-base" }, tab.favicon)),
                        React.createElement("span", { className: tab.active ? "font-semibold" : "" }, tab.title),
                        React.createElement("span", { className: "text-gray-500 text-xs" },
                            "(",
                            tab.id,
                            ")")),
                    React.createElement("div", { className: "flex items-center space-x-2" },
                        React.createElement("span", { className: "text-xs text-gray-400 max-w-xs truncate" }, tab.path),
                        tab.active && (React.createElement("span", { className: "px-2 py-0.5 bg-blue-500 text-white text-xs rounded" }, "\uD65C\uC131")))))))))));
}
export default ChromeTabBarExample;
