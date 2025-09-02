"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToHorizontalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
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
  /** 탭 순서 변경 시 호출되는 콜백 */
  onTabReorder?: (activeId: string, overId: string) => void;
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

function SortableTab({ tab, isActive, onTabClick, onTabClose }: TabProps) {
  const [isHovering, setIsHovering] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  const handleCloseClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onTabClose(tab.id);
    },
    [tab.id, onTabClose]
  );

  const handleTabClick = useCallback(
    (e: React.MouseEvent) => {
      // 드래그 중일 때만 클릭 차단
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // 일반적인 탭 클릭은 즉시 처리
      onTabClick(tab);
    },
    [tab, onTabClick, isDragging]
  );

  // CSS 모듈 클래스 조합
  const tabButtonClass = [
    styles.tabButton,
    styles.tabButtonHover,
    isActive ? styles.tabButtonActive : styles.tabButtonInactive,
    isDragging ? styles.tabButtonDragging : "",
  ]
    .filter(Boolean)
    .join(" ");

  const closeButtonClass = [
    styles.closeButton,
    isActive ? styles.closeButtonActive : styles.closeButtonInactive,
  ].join(" ");

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : "auto",
    touchAction: "none" as const,
    userSelect: "none" as const,
    willChange: isDragging ? "transform" : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <button
        className={tabButtonClass}
        onClick={handleTabClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        title={tab.title}
        {...listeners}
      >
        {/* 탭 아이콘 */}
        {tab.icon && <div className={styles.tabIcon}>{tab.icon}</div>}

        {/* 탭 제목 */}
        <span className={styles.tabTitle}>{tab.title}</span>

        {/* 닫기 버튼 */}
        {tab.closable !== false && (
          <button
            className={closeButtonClass}
            onClick={handleCloseClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            title="탭 닫기"
            style={{
              opacity: isHovering || isActive ? 1 : 0,
              transform: `scale(${isHovering || isActive ? 1 : 0.8})`,
              transition: "opacity 0.15s, transform 0.15s",
            }}
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
          </button>
        )}
      </button>
    </div>
  );
}

// 이전 Tab 컴포넌트를 SortableTab으로 대체
const Tab = SortableTab;

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
  onTabReorder,
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

  // 드래그 앤 드롭 센서 설정 - 더 엄격한 제약 조건 적용
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px 이상 수평으로 움직여야 드래그 시작
        tolerance: 5,
        delay: 100, // 100ms 대기
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 시작 핸들러
  const handleDragStart = useCallback(() => {
    // 페이지 스크롤 방지를 위해 body 스크롤 차단
    document.body.style.touchAction = "none";
    document.body.style.userSelect = "none";
  }, []);

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      console.log("DragEnd event:", { active: active.id, over: over?.id });

      // body 스크롤 복원
      document.body.style.touchAction = "";
      document.body.style.userSelect = "";

      if (over && active.id !== over.id) {
        console.log(`Reordering: ${active.id} -> ${over.id}`);
        console.log("onTabReorder function:", onTabReorder);
        if (onTabReorder) {
          onTabReorder(String(active.id), String(over.id));
          console.log("onTabReorder called successfully");
        } else {
          console.warn("onTabReorder is not provided!");
        }
      } else {
        console.log(
          "No reordering needed - same position or no valid drop target"
        );
      }
    },
    [onTabReorder]
  );

  // 드래그 취소 핸들러
  const handleDragCancel = useCallback(() => {
    // body 스크롤 복원
    document.body.style.touchAction = "";
    document.body.style.userSelect = "";
  }, []);

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
          >
            <SortableContext
              items={tabs.map((tab) => tab.id)}
              strategy={horizontalListSortingStrategy}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  tab={tab}
                  isActive={tab.id === activeTabId}
                  onTabClick={handleTabClick}
                  onTabClose={handleTabClose}
                />
              ))}
            </SortableContext>
          </DndContext>
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
