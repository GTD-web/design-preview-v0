"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import type { PageInfo } from "../hooks/useTabBar";

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
  // 이미 열린 탭을 제외한 페이지들만 필터링
  const selectablePages = availablePages.filter(
    (page) => !openTabPaths.includes(page.path)
  );

  const handlePageClick = useCallback(
    (pageInfo: PageInfo) => {
      onPageSelect(pageInfo);
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
    <div className="relative">
      {children}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 백드롭 */}
            <div
              className="fixed inset-0 z-[200] bg-black/30"
              onClick={handleBackdropClick}
            />

            {/* 페이지 선택 팝오버 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[999] bg-surface border border-border rounded-lg shadow-2xl overflow-hidden"
              style={{
                width: "384px",
                maxWidth: "calc(100vw - 32px)",
                maxHeight: "calc(100vh - 120px)",
                top: "60px", // TabBar 아래 위치
                right: "20px", // 오른쪽 여백
              }}
            >
              {/* 헤더 */}
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    탭으로 추가할 페이지 선택
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      className="w-4 h-4"
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
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectablePages.length}개의 페이지를 추가할 수 있습니다
                </p>
              </div>

              {/* 페이지 목록 */}
              <div className="max-h-80 overflow-y-auto">
                {selectablePages.length > 0 ? (
                  <div className="p-2">
                    {selectablePages.map((page) => (
                      <motion.button
                        key={page.path}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-md hover:bg-muted/50 transition-colors duration-150 group"
                        onClick={() => handlePageClick(page)}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* 아이콘 */}
                        <div className="flex-shrink-0 w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors">
                          {page.icon || (
                            <svg
                              className="w-5 h-5"
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
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {page.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {page.path}
                          </p>
                        </div>

                        {/* 화살표 */}
                        <div className="flex-shrink-0 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-150 group-hover:translate-x-1">
                          <svg
                            className="w-4 h-4"
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
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50">
                      <svg
                        className="w-12 h-12"
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
                    <p className="text-sm text-muted-foreground">
                      추가할 수 있는 페이지가 없습니다
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      모든 페이지가 이미 탭으로 열려있습니다
                    </p>
                  </div>
                )}
              </div>

              {/* 푸터 */}
              {selectablePages.length > 0 && (
                <div className="px-4 py-2 border-t border-border bg-muted/20">
                  <p className="text-xs text-muted-foreground text-center">
                    클릭하여 새 탭으로 추가
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
