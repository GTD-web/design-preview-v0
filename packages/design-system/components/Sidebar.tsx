"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "./Card";
import TextHeading from "./TextHeading";
import { TextValue } from "./Text";
import { VStack, VSpace } from "./Stack";
import { Button } from "./Button";

/**
 * 사이드바 메뉴 아이템 타입 정의
 */
interface SidebarMenuItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
}

/**
 * 사이드바 메뉴 그룹 타입 정의
 */
interface SidebarMenuGroup {
  title: string;
  items: SidebarMenuItem[];
}

/**
 * Sidebar 컴포넌트 Props 인터페이스
 */
interface SidebarProps {
  /** 사이드바 열림/닫힘 상태 */
  isOpen?: boolean;
  /** 사이드바 닫기 함수 */
  onClose?: () => void;
  /** 현재 활성 메뉴 경로 */
  activePath?: string;
  /** 메뉴 그룹 목록 (2차원 배열 구조) */
  menuGroups: SidebarMenuGroup[];
  /** 사이드바 너비 */
  width?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 사용자 정보 */
  user?: {
    name: string;
    email: string;
    avatar?: string;
    initials?: string;
  };
  /** 로그아웃 함수 */
  onLogout?: () => void;
  /** 관리자 모드 여부 */
  isAdminMode?: boolean;
  /** 관리자/사용자 모드 전환 함수 */
  onModeToggle?: () => void;
  /** 화면 이동 버튼 표시 여부 */
  showModeToggle?: boolean;
  /** 알림 아이콘 표시 여부 */
  showNotification?: boolean;
  /** 설정 아이콘 표시 여부 */
  showSettings?: boolean;
}

/**
 * 사이드바 컴포넌트
 *
 * 기능:
 * - 네비게이션 메뉴 제공
 * - 반응형 디자인 (모바일에서 자동 숨김)
 * - 현재 페이지 하이라이트
 * - 스크롤 가능한 메뉴 영역
 */
export function Sidebar({
  isOpen = true,
  onClose,
  activePath = "",
  menuGroups,
  width = "w-64",
  className = "",
  user,
  onLogout,
  isAdminMode = false,
  onModeToggle,
  showModeToggle = true,
  showNotification = true,
  showSettings = true,
}: SidebarProps) {
  const router = useRouter();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupTitle)) {
        newSet.delete(groupTitle);
      } else {
        newSet.add(groupTitle);
      }
      return newSet;
    });
  };

  const handleModeToggle = () => {
    onModeToggle?.();
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* 사이드바 */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-surface border-r-4 border-neutral-300 dark:border-neutral-600 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
          shadow-lg
          ${width} ${className}
        `}
      >
        <div className="flex flex-col h-full border-r-2 border-neutral-300 dark:border-neutral-600">
          {/* 헤더 */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DS</span>
                </div>
                <div>
                  <TextHeading size="lg" weight="semibold" className="text-foreground">
                    디자인 예제
                  </TextHeading>
                  <TextValue size="sm" color="muted" className="mt-1">
                    디자인 시스템
                  </TextValue>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>

          {/* 메뉴 */}
          <nav className="flex-1 overflow-y-auto p-4">
            <VStack gap="sm" align="start">
              {menuGroups.map((group) => {
                const isCollapsed = collapsedGroups.has(group.title);
                const contentRef = useRef<HTMLDivElement>(null);
                const [contentHeight, setContentHeight] = useState<number>(0);

                useEffect(() => {
                  if (contentRef.current) {
                    setContentHeight(isCollapsed ? 0 : contentRef.current.scrollHeight);
                  }
                }, [isCollapsed]);

                return (
                  <div key={group.title} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.title)}
                      className="flex items-center justify-between w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-200"
                    >
                      <TextHeading size="sm" weight="semibold" className="text-neutral-700 dark:text-neutral-300">
                        {group.title}
                      </TextHeading>
                      <div className="flex items-center">
                        {isCollapsed ? (
                          <svg
                            className="w-4 h-4 text-neutral-500 transition-all duration-300 ease-in-out"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-neutral-500 transition-all duration-300 ease-in-out"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        height: contentHeight,
                        opacity: isCollapsed ? 0 : 1,
                      }}
                    >
                      <div ref={contentRef} className="pb-1">
                        <VStack gap="xs" align="start">
                          {group.items.map((item) => (
                            <button
                              key={item.path}
                              type="button"
                              onClick={() => router.push(item.path)}
                              className={`
                                group flex items-center gap-3 w-full rounded-lg px-3 py-2 text-left transition-colors duration-200
                                hover:bg-neutral-100 dark:hover:bg-neutral-800
                                ${activePath === item.path ? "bg-neutral-800 dark:bg-neutral-700" : "text-neutral-600 dark:text-neutral-400"}
                              `}
                            >
                              <div
                                className={`
                                flex items-center justify-center w-5 h-5 transition-colors duration-200
                                ${
                                  activePath === item.path
                                    ? "text-white"
                                    : "text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300"
                                }
                              `}
                              >
                                {item.icon}
                              </div>
                              <span
                                className={`
                                text-sm font-medium transition-colors duration-200
                                ${activePath === item.path ? "text-white font-semibold" : "font-normal text-neutral-500 dark:text-neutral-400"}
                              `}
                              >
                                {item.title}
                              </span>
                            </button>
                          ))}
                        </VStack>
                      </div>
                    </div>
                  </div>
                );
              })}
            </VStack>
          </nav>

          {/* 관리자/사용자 전환 영역 */}
          {showModeToggle && (
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-foreground hover:text-primary hover:bg-surface/80 transition-all duration-200 group"
                onClick={handleModeToggle}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium">{isAdminMode ? "사용자 화면으로 이동" : "관리자 화면으로 이동"}</span>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-muted group-hover:text-primary transition-colors duration-200">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Button>
            </div>
          )}

          {/* 푸터 */}
          <div className="p-4 border-t border-border">
            <div className="p-3 rounded-lg bg-surface/50 hover:bg-surface/70 transition-colors duration-200">
              <div className="flex items-center justify-between">
                {/* 사용자 프로필 정보 - 간략화 */}
                <div className="flex items-center gap-2">
                  <div className="min-w-0">
                    <TextValue size="sm" weight="semibold" className="text-foreground block truncate">
                      {user?.name || "사용자"}
                    </TextValue>
                  </div>
                </div>

                {/* 액션 버튼들 - 간략화 */}
                <div className="flex items-center gap-1">
                  {/* 알림 버튼 */}
                  {showNotification && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted hover:text-foreground hover:bg-surface/80"
                      onClick={() => {
                        console.log("알림 클릭");
                      }}
                      title="알림"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                        <path
                          d="M10 18a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm6-4V9a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  )}

                  {/* 설정 버튼 */}
                  {showSettings && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted hover:text-foreground hover:bg-surface/80"
                      onClick={() => {
                        console.log("설정 클릭");
                      }}
                      title="설정"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </Button>
                  )}

                  {/* 로그아웃 버튼 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10"
                    onClick={onLogout}
                    title="로그아웃"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
