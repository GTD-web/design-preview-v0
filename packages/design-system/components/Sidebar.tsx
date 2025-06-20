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
  menuGroups?: SidebarMenuGroup[];
  /** 사이드바 너비 */
  width?: string;
  /** 추가 클래스명 */
  className?: string;
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
export function Sidebar({ isOpen = true, onClose, activePath = "", menuGroups = [], width = "w-72", className = "" }: SidebarProps) {
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

  const defaultMenuGroups: SidebarMenuGroup[] = [
    {
      title: "대시보드",
      items: [
        {
          title: "대시보드",
          path: "/design-example/dashboard",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "E-commerce",
      items: [
        {
          title: "E-commerce",
          path: "/design-example/ecommerce",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "Analytics",
      items: [
        {
          title: "Analytics",
          path: "/design-example/analytics",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      title: "Task Management",
      items: [
        {
          title: "Task Management",
          path: "/design-example/task-management",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          ),
        },
      ],
    },
    {
      title: "User Profile",
      items: [
        {
          title: "User Profile",
          path: "/design-example/user-profile",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
        },
      ],
    },
  ];

  const items = menuGroups.length > 0 ? menuGroups : defaultMenuGroups;

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
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-background font-bold text-sm">DS</span>
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
              {items.map((group) => {
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
                                ${
                                  activePath === item.path
                                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-900"
                                    : "text-neutral-600 dark:text-neutral-400"
                                }
                              `}
                            >
                              <div
                                className={`
                                flex items-center justify-center w-5 h-5 transition-colors duration-200
                                ${
                                  activePath === item.path
                                    ? "text-neutral-900 dark:text-neutral-900"
                                    : "text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300"
                                }
                              `}
                              >
                                {item.icon}
                              </div>
                              <span
                                className={`
                                text-sm font-medium transition-colors duration-200
                                ${activePath === item.path ? "text-neutral-900 dark:text-neutral-900" : "font-normal"}
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

          {/* 푸터 */}
          <div className="p-4 border-t border-border">
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <VStack gap="sm">
                <TextValue size="sm" weight="medium" color="default" className="text-neutral-900 dark:text-neutral-900" style={{ color: "#171717" }}>
                  Tailwind CSS 기반
                </TextValue>
                <TextValue size="xs" color="muted">
                  디자인 시스템 컴포넌트
                </TextValue>
              </VStack>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
