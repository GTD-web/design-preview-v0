"use client";

import React, { useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

// react-chrome-tabs를 동적으로 로드 (SSR 방지)
const Tabs = dynamic(
  () =>
    import("@sinm/react-chrome-tabs").then((mod) => ({ default: mod.Tabs })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "46px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          color: "#9aa0a6",
        }}
      >
        탭 로딩 중...
      </div>
    ),
  }
) as any;

// CSS 정적 import (Next.js에서 처리)
import "@sinm/react-chrome-tabs/css/chrome-tabs.css";

// Chrome Tabs Bottom Bar 스타일 추가
const chromeTabsBottomBarStyles = `
  .chrome-tabs .chrome-tabs-bottom-bar {
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 1px !important;
    background: #202124 !important;
    z-index: 10 !important;
  }
  
  .chrome-tab-bar-dark .chrome-tabs .chrome-tabs-bottom-bar {
    background: #5f6368 !important;
  }
  
  /* 추가적인 오버라이드 */
  .chrome-tabs-custom .chrome-tabs-bottom-bar,
  .chrome-tabs-custom .chrome-tabs .chrome-tabs-bottom-bar {
    background: #DEE1E6 !important;
    height: 2px !important;
  }
  
  .chrome-tab-bar-dark .chrome-tabs-custom .chrome-tabs-bottom-bar,
  .chrome-tab-bar-dark .chrome-tabs-custom .chrome-tabs .chrome-tabs-bottom-bar {
    background: #DEE1E6 !important;
  }
  
  .chrome-tabs-custom {
    height: 46px !important;
  }
  
  .chrome-tabs-custom .chrome-tab {
    height: 46px !important;
  }
`;

// 스타일 주입 함수 (클라이언트에서만 실행)
const injectCustomStyles = () => {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const existingStyle = document.getElementById("chrome-tabs-custom-styles");
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = "chrome-tabs-custom-styles";
      style.textContent = chromeTabsBottomBarStyles;
      document.head.appendChild(style);
    }
  }
};

/**
 * 크롬 탭 아이템 타입 정의
 */
export interface ChromeTabItem {
  id: string;
  title: string;
  path: string;
  favicon?: string;
  active: boolean;
}

/**
 * ChromeTabBar 컴포넌트 Props 인터페이스
 */
export interface ChromeTabBarProps {
  /** 탭 목록 */
  tabs: ChromeTabItem[];
  /** 탭 클릭 시 호출되는 콜백 */
  onTabClick?: (tab: ChromeTabItem) => void;
  /** 탭 닫기 시 호출되는 콜백 */
  onTabClose?: (tabId: string) => void;
  /** 탭 순서 변경 시 호출되는 콜백 */
  onTabReorder?: (fromIndex: number, toIndex: number) => void;
  /** 새 탭 추가 시 호출되는 콜백 */
  onNewTab?: () => void;
  /** 최대 탭 개수 */
  maxTabs?: number;
  /** 추가 클래스명 */
  className?: string;
  /** 새 탭 버튼 표시 여부 */
  showNewTabButton?: boolean;
  /** 다크 모드 여부 */
  darkMode?: boolean;
}

/**
 * ChromeTabBar 컴포넌트 - 크롬 브라우저와 유사한 탭 바
 */
export function ChromeTabBar({
  tabs = [],
  onTabClick,
  onTabClose,
  onTabReorder,
  onNewTab,
  maxTabs = 10,
  className = "",
  showNewTabButton = true,
  darkMode = false,
}: ChromeTabBarProps) {
  // 스타일 주입 (클라이언트에서만)
  useEffect(() => {
    injectCustomStyles();
  }, []);

  // 탭 클릭 핸들러 (onTabActive는 tabId를 받음)
  const handleTabClick = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId);
      if (tab && onTabClick) {
        onTabClick(tab);
      }
    },
    [tabs, onTabClick]
  );

  // 탭 닫기 핸들러 (onTabClose는 tabId를 받음)
  const handleTabClose = useCallback(
    (tabId: string) => {
      if (onTabClose) {
        onTabClose(tabId);
      }
    },
    [onTabClose]
  );

  // 탭 순서 변경 핸들러
  const handleTabReorder = useCallback(
    (tabId: string, fromIndex: number, toIndex: number) => {
      if (onTabReorder) {
        onTabReorder(fromIndex, toIndex);
      }
    },
    [onTabReorder]
  );

  // 새 탭 버튼 클릭 핸들러
  const handleNewTabClick = useCallback(() => {
    if (tabs.length < maxTabs && onNewTab) {
      onNewTab();
    }
  }, [tabs.length, maxTabs, onNewTab]);

  // 크롬 탭 데이터 변환 - react-chrome-tabs API에 맞게 조정
  const chromeTabsData = tabs.map((tab) => ({
    id: tab.id,
    title: tab.title,
    favicon: tab.favicon || false, // boolean | string 타입
    active: tab.active,
  }));

  // 컨테이너 클래스
  const containerClass = [
    "chrome-tab-bar-container",
    darkMode ? "chrome-tab-bar-dark" : "chrome-tab-bar-light",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClass}
      style={{
        backgroundColor: darkMode ? "#2d2d30" : "#f1f3f4",
        borderBottom: `1px solid ${darkMode ? "#3c3c3c" : "#dadce0"}`,
        minHeight: "46px",
        height: "46px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1, height: "46px" }}>
        <Tabs
          tabs={chromeTabsData}
          onTabActive={handleTabClick}
          onTabClose={handleTabClose}
          onTabReorder={handleTabReorder}
          darkMode={darkMode}
          className="chrome-tabs-custom"
        />
      </div>

      {/* 새 탭 버튼 */}
      {showNewTabButton && (
        <button
          onClick={handleNewTabClick}
          disabled={tabs.length >= maxTabs}
          className="new-tab-button"
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: "transparent",
            border: "none",
            cursor: tabs.length >= maxTabs ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: darkMode ? "#9aa0a6" : "#5f6368",
            marginRight: "8px",
            marginLeft: "8px",
            borderRadius: "50%",
            opacity: tabs.length >= maxTabs ? 0.5 : 1,
            transition: "all 0.2s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            if (tabs.length < maxTabs) {
              e.currentTarget.style.backgroundColor = darkMode
                ? "#3c4043"
                : "#dadce0";
              e.currentTarget.style.transform = "scale(1.1)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.transform = "scale(1)";
          }}
          title="새 탭"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * ChromeTabBar 스타일 상수
 */
export const CHROME_TAB_BAR_STYLES = {
  colors: {
    light: {
      background: "#f1f3f4",
      border: "#dadce0",
      text: "#202124",
      hover: "#e8eaed",
    },
    dark: {
      background: "#2d2d30",
      border: "#3c3c3c",
      text: "#ffffff",
      hover: "#404040",
    },
  },
  dimensions: {
    height: "46px",
    newTabButtonSize: "28px",
  },
} as const;
