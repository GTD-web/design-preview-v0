"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageSelector } from "./PageSelector";
import type { PageInfo } from "../hooks/useTabBar";

/**
 * 탭 아이템 타입 정의
 */
export interface TabItem {
  id: string;
  title: string;
  path: string;
  icon?: React.ReactNode;
  closable?: boolean;
}

/**
 * TabBar 컴포넌트 Props 인터페이스
 */
export interface TabBarProps {
  /** 탭 목록 */
  tabs: TabItem[];
  /** 활성 탭 ID */
  activeTabId?: string;
  /** 탭 클릭 시 호출되는 콜백 */
  onTabClick?: (tab: TabItem) => void;
  /** 탭 닫기 시 호출되는 콜백 */
  onTabClose?: (tabId: string) => void;
  /** 새 탭 추가 시 호출되는 콜백 (기본 홈페이지로) */
  onNewTab?: () => void;
  /** 페이지 선택해서 탭 추가 시 호출되는 콜백 */
  onPageSelect?: (pageInfo: PageInfo) => void;
  /** 사용 가능한 모든 페이지 목록 */
  availablePages?: PageInfo[];
  /** 최대 탭 개수 */
  maxTabs?: number;
  /** 추가 클래스명 */
  className?: string;
  /** 새 탭 버튼 표시 여부 */
  showNewTabButton?: boolean;
}

/**
 * 개별 탭 컴포넌트
 */
interface TabProps {
  tab: TabItem;
  isActive: boolean;
  onTabClick: (tab: TabItem) => void;
  onTabClose: (tabId: string) => void;
}

function Tab({ tab, isActive, onTabClick, onTabClose }: TabProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onTabClose(tab.id);
    },
    [tab.id, onTabClose]
  );

  return (
    <motion.button
      layout
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className={`
        group relative flex items-center gap-2 px-3 py-1.5 min-w-0 max-w-40 
        transition-all duration-200 ease-out
        border-b-2 hover:bg-surface/50
        border-r-2
        ${
          isActive
            ? "bg-white border-primary text-foreground shadow-lg relative z-10"
            : "bg-gray-100 border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-gray-200"
        }
      `}
      style={{
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "6px",
      }}
      onClick={() => onTabClick(tab)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      title={tab.title}
    >
      {/* 탭 아이콘 */}
      {tab.icon && (
        <div className="flex-shrink-0 w-3.5 h-3.5 flex items-center justify-center">
          {tab.icon}
        </div>
      )}

      {/* 탭 제목 */}
      <span className="flex-1 text-xs font-medium truncate min-w-0">
        {tab.title}
      </span>

      {/* 닫기 버튼 */}
      {tab.closable !== false && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovering || isActive ? 1 : 0,
            scale: isHovering || isActive ? 1 : 0.8,
          }}
          transition={{ duration: 0.15 }}
          className={`
            flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full
            transition-colors duration-200 hover:bg-muted-foreground/20
            ${
              isActive
                ? "text-muted-foreground hover:text-foreground"
                : "text-muted-foreground/60"
            }
          `}
          onClick={handleCloseClick}
          title="탭 닫기"
        >
          <svg
            className="w-2.5 h-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </motion.button>
      )}

      {/* 활성 탭 표시 */}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          style={{
            borderBottomLeftRadius: "2px",
            borderBottomRightRadius: "2px",
          }}
        />
      )}
    </motion.button>
  );
}

/**
 * TabBar 컴포넌트 - 브라우저 탭과 유사한 동작을 제공하는 탭 바
 */
export function TabBar({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onPageSelect,
  availablePages = [],
  maxTabs = 10,
  className = "",
  showNewTabButton = true,
}: TabBarProps) {
  const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);
  const handleTabClick = useCallback(
    (tab: TabItem) => {
      onTabClick?.(tab);
    },
    [onTabClick]
  );

  const handleTabClose = useCallback(
    (tabId: string) => {
      onTabClose?.(tabId);
    },
    [onTabClose]
  );

  const handlePageSelect = useCallback(
    (pageInfo: PageInfo) => {
      onPageSelect?.(pageInfo);
    },
    [onPageSelect]
  );

  const openTabPaths = tabs.map((tab) => tab.path);

  return (
    <div
      className={`
        flex items-end bg-gray-100 border-b border-border overflow-hidden py-1
        ${className}
      `}
    >
      {/* 탭 컨테이너 */}
      <div className="flex-1 flex items-end overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex items-end min-w-max">
          <AnimatePresence mode="popLayout" initial={false}>
            {tabs.map((tab) => (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.15,
                  ease: "easeInOut",
                }}
                layout
                style={{ originX: 0.5, originY: 0.5 }}
              >
                <Tab
                  tab={tab}
                  isActive={tab.id === activeTabId}
                  onTabClick={handleTabClick}
                  onTabClose={handleTabClose}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 새 탭 버튼 */}
      {showNewTabButton && (
        <PageSelector
          availablePages={availablePages}
          openTabPaths={openTabPaths}
          onPageSelect={handlePageSelect}
          isOpen={isPageSelectorOpen}
          onClose={() => setIsPageSelectorOpen(false)}
        >
          <motion.button
            className={`
                flex-shrink-0 inline-flex items-center justify-center w-4 h-4 mx-1
                text-muted-foreground hover:text-foreground hover:bg-gray-200
                rounded-md transition-colors duration-200 relative
                ${tabs.length >= maxTabs ? "opacity-50 cursor-not-allowed" : ""}
              `}
            onClick={() => {
              if (tabs.length < maxTabs) {
                setIsPageSelectorOpen(!isPageSelectorOpen);
              }
            }}
            disabled={tabs.length >= maxTabs}
            title="새 탭 추가"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </motion.button>
        </PageSelector>
      )}
    </div>
  );
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
