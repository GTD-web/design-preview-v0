"use client";

import React, { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PageInfo } from "../hooks";
import styles from "./PageSelector.module.css";

/**
 * PageSelector Props
 */
export interface PageSelectorProps {
  /** 사용 가능한 모든 페이지 목록 */
  availablePages: PageInfo[];
  /** 이미 열린 탭들의 경로 목록 */
  openTabPaths: string[];
  /** 페이지 선택 시 호출되는 콜백 */
  onPageSelect: (pageInfo: PageInfo) => void;
  /** 선택창 열림/닫힘 상태 */
  isOpen: boolean;
  /** 선택창 닫기 콜백 */
  onClose: () => void;
  /** 트리거 요소 (+ 버튼) */
  children: React.ReactNode;
}

/**
 * 개별 페이지 아이템 컴포넌트
 */
interface PageItemProps {
  page: PageInfo;
  onPageClick: (page: PageInfo) => void;
}

function PageItem({ page, onPageClick }: PageItemProps) {
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

  return (
    <motion.button
      className={styles.pageItem}
      onClick={() => onPageClick(page)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* 아이콘 */}
      <div className={iconClass}>
        {page.icon || (
          <svg
            className={styles.pageIconSvg}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
      </div>

      {/* 페이지 정보 */}
      <div className={styles.pageContent}>
        <p className={titleClass}>
          {page.title}
          {page.allowDuplicate && (
            <span
              style={{
                marginLeft: "6px",
                fontSize: "0.75em",
                opacity: 0.7,
                fontWeight: "normal",
              }}
            >
              (중복 가능)
            </span>
          )}
        </p>
        <p className={styles.pagePath}>{page.path}</p>
      </div>

      {/* 화살표 */}
      <div className={arrowClass}>
        <svg
          className={styles.pageArrowIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </motion.button>
  );
}

/**
 * 페이지 선택 컴포넌트 - + 버튼 클릭 시 사용 가능한 페이지 목록을 보여줌
 */
export function PageSelector({
  availablePages,
  openTabPaths,
  onPageSelect,
  isOpen,
  onClose,
  children,
}: PageSelectorProps) {
  // 중복 허용 페이지는 항상 표시, 아닌 경우 이미 열린 탭 제외
  const selectablePages = availablePages.filter(
    (page) => page.allowDuplicate || !openTabPaths.includes(page.path)
  );

  const handlePageClick = useCallback(
    (pageInfo: PageInfo) => {
      // 중복 허용 페이지인 경우 자동으로 tab-id 생성
      if (pageInfo.allowDuplicate) {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 5);
        const tabIdParam = `tab-id=${timestamp}-${randomId}`;

        let finalPath = pageInfo.path;
        if (finalPath.includes("?")) {
          finalPath += `&${tabIdParam}`;
        } else {
          finalPath += `?${tabIdParam}`;
        }

        const pageInfoWithTabId = {
          ...pageInfo,
          path: finalPath,
        };

        onPageSelect(pageInfoWithTabId);
      } else {
        onPageSelect(pageInfo);
      }
      onClose();
    },
    [onPageSelect, onClose]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div className={styles.container}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 백드롭 */}
            <div className={styles.backdrop} onClick={handleBackdropClick} />

            {/* 페이지 선택 팝오버 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className={styles.popover}
            >
              {/* 헤더 */}
              <div className={styles.header}>
                <div className={styles.headerContent}>
                  <h3 className={styles.headerTitle}>
                    탭으로 추가할 페이지 선택
                  </h3>
                  <button className={styles.closeButton} onClick={onClose}>
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
                </div>
                <p className={styles.headerDescription}>
                  {selectablePages.length}개의 페이지를 추가할 수 있습니다
                  {availablePages.some((page) => page.allowDuplicate) &&
                    " (일부 페이지는 중복 열기 가능)"}
                </p>
              </div>

              {/* 페이지 목록 */}
              <div className={styles.scrollArea}>
                {selectablePages.length > 0 ? (
                  <div className={styles.pageList}>
                    {selectablePages.map((page) => (
                      <PageItem
                        key={page.path}
                        page={page}
                        onPageClick={handlePageClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>
                      <svg
                        className={styles.emptyStateIconSvg}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className={styles.emptyStateTitle}>
                      추가할 수 있는 페이지가 없습니다
                    </p>
                    <p className={styles.emptyStateDescription}>
                      모든 페이지가 이미 탭으로 열려있습니다
                      {availablePages.some((page) => page.allowDuplicate) &&
                        " (중복 열기 가능한 페이지는 없습니다)"}
                    </p>
                  </div>
                )}
              </div>

              {/* 푸터 */}
              {selectablePages.length > 0 && (
                <div className={styles.footer}>
                  <p className={styles.footerText}>클릭하여 새 탭으로 추가</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
