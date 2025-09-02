"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageSelector } from "./PageSelector";
import type { PageInfo } from "../hooks/useTabBar";
import styles from "./TabBar.module.css";

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
  /** 홈 버튼 표시 여부 */
  showHomeButton?: boolean;
  /** 홈 버튼 클릭 시 호출되는 콜백 */
  onHomeClick?: () => void;
  /** 홈 버튼 활성 상태 (현재 홈페이지인지 여부) */
  homeButtonActive?: boolean;
  /** 홈 경로 (툴팁용) */
  homePath?: string;
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

  // CSS 모듈 클래스 조합
  const tabButtonClass = [
    styles.tabButton,
    styles.tabButtonHover,
    isActive ? styles.tabButtonActive : styles.tabButtonInactive,
  ].join(" ");

  const closeButtonClass = [
    styles.closeButton,
    isActive ? styles.closeButtonActive : styles.closeButtonInactive,
  ].join(" ");

  return (
    <motion.button
      layout
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className={tabButtonClass}
      onClick={() => onTabClick(tab)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      title={tab.title}
    >
      {/* 탭 아이콘 */}
      {tab.icon && <div className={styles.tabIcon}>{tab.icon}</div>}

      {/* 탭 제목 */}
      <span className={styles.tabTitle}>{tab.title}</span>

      {/* 닫기 버튼 */}
      {tab.closable !== false && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovering || isActive ? 1 : 0,
            scale: isHovering || isActive ? 1 : 0.8,
          }}
          transition={{ duration: 0.15 }}
          className={closeButtonClass}
          onClick={handleCloseClick}
          title="탭 닫기"
        >
          <svg
            className={styles.closeButtonIcon}
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
    </motion.button>
  );
}

/**
 * 홈 버튼 컴포넌트
 */
interface HomeButtonProps {
  isActive?: boolean;
  onClick?: () => void;
  homePath?: string;
}

function HomeButton({
  isActive = false,
  onClick,
  homePath = "홈",
}: HomeButtonProps) {
  // CSS 모듈 클래스 조합
  const homeButtonClass = [
    styles.homeButton,
    isActive ? styles.homeButtonActive : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      className={homeButtonClass}
      onClick={onClick}
      title={`${homePath}으로 이동`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        className={styles.homeButtonIcon}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
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
  showHomeButton = false,
  onHomeClick,
  homeButtonActive = false,
  homePath = "홈",
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

  // CSS 모듈 클래스 조합
  const containerClass = [styles.tabBarContainer, className]
    .filter(Boolean)
    .join(" ");
  const newTabButtonClass = [
    styles.newTabButton,
    tabs.length >= maxTabs ? styles.newTabButtonDisabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass}>
      {/* 홈 버튼 */}
      {showHomeButton && (
        <HomeButton
          isActive={homeButtonActive}
          onClick={onHomeClick}
          homePath={homePath}
        />
      )}

      {/* 탭 컨테이너 */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsInnerContainer}>
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
            className={newTabButtonClass}
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
              className={styles.newTabButtonIcon}
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
 * TabBar 스타일 상수 - 필요시 외부에서 참조 가능
 */
export const TAB_BAR_STYLES = {
  // CSS Modules를 사용하여 스타일이 완전히 격리됨
  // 더 이상 외부 CSS 클래스나 인라인 스타일이 필요하지 않음
  colors: {
    primary: "#3b82f6",
    background: "#f3f4f6",
    foreground: "#1f2937",
    muted: "#6b7280",
    border: "#d1d5db",
    surface: "#ffffff",
    hover: "#e5e7eb",
  },
  spacing: {
    tabPadding: "6px 12px",
    containerPadding: "4px 0",
    iconSize: "14px",
    closeButtonSize: "16px",
  },
  animation: {
    duration: "0.15s",
    easing: "ease-in-out",
  },
} as const;
