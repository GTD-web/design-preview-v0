"use client";

import React from "react";
import { ChromeTabBar } from "./ChromeTabBar";
import { useChromeTabBar } from "../hooks/useChromeTabBar";
import type { PageInfo } from "../hooks/types";

/**
 * ChromeTabBar 사용 예시 컴포넌트
 */
export function ChromeTabBarExample() {
  // 페이지 매핑 정의 - 실제 애플리케이션의 페이지들
  const pageMapping: Record<string, PageInfo> = {
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
  const faviconResolver = (path: string): string | undefined => {
    const iconMap: Record<string, string> = {
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
  const {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    createNewTab,
    forceAddDuplicateTab,
    handleTabClick,
    reorderTabs,
  } = useChromeTabBar({
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
    allowDuplicatesByQuery: true, // 쿼리파라미터가 다르면 다른 탭으로 취급
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
    forceAddDuplicateTab({
      path: "/users",
      title: "사용자 관리",
      closable: true,
    });
  };

  return (
    <div className="chrome-tabbar-example">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold mb-4">ChromeTabBar 예시</h2>

        {/* 탭바 */}
        <ChromeTabBar
          tabs={tabs}
          onTabClick={handleTabClick}
          onTabClose={removeTab}
          onTabReorder={reorderTabs}
          onNewTab={createNewTab}
          showNewTabButton={true}
          maxTabs={8}
          darkMode={false}
        />

        {/* 컨트롤 버튼들 */}
        <div className="mt-4 space-x-2 flex flex-wrap gap-2">
          <button
            onClick={addDashboardTab}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            대시보드 탭 추가
          </button>
          <button
            onClick={addUsersTab}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            사용자 관리 탭 추가
          </button>
          <button
            onClick={addUsersTabWithQuery}
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
          >
            사용자 관리 (쿼리) 탭 추가
          </button>
          <button
            onClick={addUsersTabWithCustomName}
            className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
          >
            사용자 관리 (커스텀명) 탭 추가
          </button>
          <button
            onClick={addProductsTab}
            className="px-3 py-1 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600"
          >
            제품 관리 탭 추가
          </button>
          <button
            onClick={forceDuplicateUsersTab}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            중복 사용자 탭 강제 추가
          </button>
        </div>

        {/* 현재 상태 표시 */}
        <div className="mt-4 p-3 bg-white rounded border">
          <h3 className="font-medium mb-2">현재 상태</h3>
          <div className="text-sm space-y-1">
            <div>
              <strong>총 탭 개수:</strong> {tabs.length}
            </div>
            <div>
              <strong>활성 탭 ID:</strong> {activeTabId || "없음"}
            </div>
            <div>
              <strong>활성 탭 경로:</strong>{" "}
              {tabs.find((tab) => tab.active)?.path || "없음"}
            </div>
          </div>
        </div>

        {/* 탭 목록 */}
        <div className="mt-4 p-3 bg-white rounded border">
          <h3 className="font-medium mb-2">탭 목록</h3>
          <div className="space-y-2">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`flex items-center justify-between p-2 rounded text-sm ${
                  tab.active ? "bg-blue-100 border-blue-300" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs bg-gray-200 px-1 rounded">
                    {index}
                  </span>
                  {tab.favicon && (
                    <span className="text-base">{tab.favicon}</span>
                  )}
                  <span className={tab.active ? "font-semibold" : ""}>
                    {tab.title}
                  </span>
                  <span className="text-gray-500 text-xs">({tab.id})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 max-w-xs truncate">
                    {tab.path}
                  </span>
                  {tab.active && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded">
                      활성
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChromeTabBarExample;
