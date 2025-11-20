"use client";

import localFont from "next/font/local";
import React, {
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import "../globals.css";
import { usePathname, useRouter } from "next/navigation";
import ClientOnly from "@/components/ClientOnly";
import Loading from "../loading";
import { TabBar } from "@/packages/design-system/components/TabBar";
import { PageSelector } from "./PageSelector";
import { LayoutContainer } from "@/packages/design-system/components/LayoutContainer";
import { DesignSettings } from "@/packages/design-system/components/DesignSettings";
import { CompactSidebar } from "@/packages/design-system/components/CompactSidebar";
import {
  Button,
  DesignSettingsProvider,
  useDesignSettings,
  TextHeading,
  TextValue,
} from "@/packages/design-system";
import { PageInfo, useTabBar } from "@/packages/design-system/hooks";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// 커스텀 알림 컴포넌트
function CustomNotificationPopup({
  isOpen,
  onClose,
  position,
}: {
  isOpen: boolean;
  onClose: () => void;
  position: { bottom: string; left: string };
}) {
  // 커스텀 알림 데이터
  const notifications = [
    {
      id: 1,
      title: "새로운 업데이트",
      message: "디자인 시스템이 업데이트되었습니다.",
      time: "5분 전",
      isRead: false,
      type: "system",
    },
    {
      id: 2,
      title: "프로젝트 완료",
      message: "대시보드 프로젝트가 완료되었습니다.",
      time: "1시간 전",
      isRead: true,
      type: "project",
    },
    {
      id: 3,
      title: "팀 초대",
      message: "새로운 팀원이 초대되었습니다.",
      time: "2시간 전",
      isRead: true,
      type: "team",
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed bg-surface rounded-lg shadow-2xl border w-96 max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out z-50"
        style={position}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <TextHeading
                size="lg"
                weight="semibold"
                className="text-foreground"
              >
                알림 센터
              </TextHeading>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={onClose}
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
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <TextValue size="sm" color="muted">
                  알림이 없습니다.
                </TextValue>
              </div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-surface/80 mb-2 ${
                      !notification.isRead
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <TextHeading
                            size="sm"
                            weight="medium"
                            className="text-foreground"
                          >
                            {notification.title}
                          </TextHeading>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              notification.type === "system"
                                ? "bg-blue-100 text-blue-800"
                                : notification.type === "project"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {notification.type === "system"
                              ? "시스템"
                              : notification.type === "project"
                              ? "프로젝트"
                              : "팀"}
                          </span>
                        </div>
                        <TextValue size="sm" color="muted" className="mb-2">
                          {notification.message}
                        </TextValue>
                        <TextValue size="xs" color="muted">
                          {notification.time}
                        </TextValue>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => {
                  console.log("모든 알림 읽음 처리");
                  onClose();
                }}
              >
                모두 읽음
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  console.log("알림 설정");
                  onClose();
                }}
              >
                설정
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 사이드바 메뉴 데이터 정의
const sidebarMenuGroups = [
  {
    title: "디자인시스템",
    items: [
      {
        title: "디자인토큰",
        path: "/design-example",
        icon: (
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
              d="M4.5 12a7.5 7.5 0 0015 0 7.5 7.5 0 00-15 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        ),
      },
    ],
  },
  {
    title: "예시페이지",
    items: [
      {
        title: "대시보드",
        path: "/design-example/dashboard",
        badge: "NEW",
        icon: (
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
              d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
            />
          </svg>
        ),
      },
      {
        title: "이커머스",
        path: "/design-example/ecommerce",
        icon: (
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
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        ),
      },
      {
        title: "분석",
        path: "/design-example/analytics",
        badge: "긴급",
        icon: (
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
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
            />
          </svg>
        ),
      },
      {
        title: "업무관리",
        path: "/design-example/task-management",
        badge: "D-30",
        icon: (
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
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      {
        title: "사용자 프로필",
        path: "/design-example/user-profile",
        icon: (
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
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
    ],
  },
];

// 사이드바 Context 타입 정의
interface SidebarContextType {
  sidebarHidden: boolean;
  setSidebarHidden: (hidden: boolean) => void;
  toggleSidebarHidden: () => void;
}

// 사이드바 Context 생성
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// 사이드바 Context Hook
export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};

/**
 * 전체 앱 페이지 매핑 생성 (모든 페이지 포함)
 *
 * 각 페이지에 category 필드를 추가하면 PageSelector에서 카테고리별로 그룹화됩니다.
 *
 * 카테고리 설정 방법:
 * 1. PageInfo 객체에 category: "카테고리명" 추가
 * 2. 같은 category 값을 가진 페이지들이 자동으로 그룹화됨
 * 3. category를 지정하지 않으면 "기타" 카테고리로 분류됨
 *
 * 예시:
 * {
 *   path: "/example",
 *   title: "예시 페이지",
 *   category: "명세서",  // 이 값으로 그룹화
 *   icon: <SomeIcon />,
 *   closable: true,
 * }
 */
const createAllPagesMapping = (): Record<string, PageInfo> => {
  const mapping: Record<string, PageInfo> = {};

  // 메인 페이지들
  mapping["/"] = {
    path: "/",
    title: "디자인 시스템 홈",
    category: "메인", // 카테고리 추가
    icon: (
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    closable: true,
  };

  mapping["/component-library"] = {
    path: "/component-library",
    title: "컴포넌트 라이브러리",
    category: "디자인시스템", // 카테고리 추가
    icon: (
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
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    closable: true,
  };

  mapping["/colors"] = {
    path: "/colors",
    title: "색상 가이드",
    category: "디자인시스템", // 카테고리 추가
    icon: (
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
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 21a4 4 0 004-4V8a2 2 0 012-2h4a2 2 0 012 2v9a4 4 0 01-4 4 4 4 0 01-4-4z"
        />
      </svg>
    ),
    closable: true,
  };

  // 디자인 예제 페이지들 - 직접 매핑으로 정확한 제목 보장
  mapping["/design-example"] = {
    path: "/design-example",
    title: "디자인토큰",
    category: "디자인시스템", // 카테고리 추가
    icon: (
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
          d="M4.5 12a7.5 7.5 0 0015 0 7.5 7.5 0 00-15 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    ),
    closable: false,
  };

  mapping["/design-example/dashboard"] = {
    path: "/design-example/dashboard",
    title: "대시보드",
    category: "예시페이지", // 카테고리 추가
    icon: (
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
          d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25v2.25a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
        />
      </svg>
    ),
    closable: true,
    allowDuplicate: true, // 대시보드 페이지 중복 탭 허용
  };

  mapping["/design-example/ecommerce"] = {
    path: "/design-example/ecommerce",
    title: "이커머스",
    category: "예시페이지", // 카테고리 추가
    icon: (
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
          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a .375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
        />
      </svg>
    ),
    closable: true,
    allowDuplicate: true, // 이커머스 페이지 중복 탭 허용
  };

  mapping["/design-example/analytics"] = {
    path: "/design-example/analytics",
    title: "분석",
    category: "데이터", // 카테고리 추가
    icon: (
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
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
    closable: true,
    allowDuplicate: false, // 분석 페이지는 중복 탭 허용하지 않음
  };

  mapping["/design-example/task-management"] = {
    path: "/design-example/task-management",
    title: "업무관리",
    category: "업무", // 카테고리 추가
    icon: (
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
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    closable: true,
  };

  mapping["/design-example/user-profile"] = {
    path: "/design-example/user-profile",
    title: "사용자 프로필",
    category: "사용자", // 카테고리 추가
    icon: (
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
          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    closable: true,
  };

  // 추가 예시 페이지들 - 카테고리 분류를 더 명확하게 보여주기 위한 예시
  mapping["/design-example/card-statement"] = {
    path: "/design-example/card-statement",
    title: "이용내역 명세서",
    category: "명세서",
    icon: (
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    closable: true,
  };

  mapping["/design-example/payment-statement"] = {
    path: "/design-example/payment-statement",
    title: "결제내역 조회",
    category: "명세서",
    icon: (
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    closable: true,
  };

  mapping["/design-example/card-management"] = {
    path: "/design-example/card-management",
    title: "카드 관리",
    category: "카드",
    icon: (
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
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
      </svg>
    ),
    closable: true,
  };

  mapping["/design-example/card-benefits"] = {
    path: "/design-example/card-benefits",
    title: "카드 혜택",
    category: "카드",
    icon: (
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
          d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    ),
    closable: true,
  };

  mapping["/design-example/account-info"] = {
    path: "/design-example/account-info",
    title: "계좌 정보",
    category: "금융",
    icon: (
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
          d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
        />
      </svg>
    ),
    closable: true,
  };

  mapping["/design-example/transfer"] = {
    path: "/design-example/transfer",
    title: "계좌 이체",
    category: "금융",
    icon: (
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
          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        />
      </svg>
    ),
    closable: true,
  };

  mapping["/design-example/settings"] = {
    path: "/design-example/settings",
    title: "설정",
    category: "사용자",
    icon: (
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
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    closable: true,
  };

  mapping["/design-example/notifications"] = {
    path: "/design-example/notifications",
    title: "알림 설정",
    category: "사용자",
    icon: (
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
          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
        />
      </svg>
    ),
    closable: true,
  };

  return mapping;
};

// 내부 컴포넌트 - 디자인 설정 컨텍스트 사용
function DesignExampleContent({ children }: { children: React.ReactNode }) {
  // 디자인 설정 상태 관리를 커스텀 훅으로 처리
  const {
    font,
    theme,
    radius,
    fontSize,
    spacing,
    gap,
    layoutType,
    maxWidth,
    setFont,
    setTheme,
    setRadius,
    setFontSize,
    setSpacing,
    setGap,
    setLayoutType,
    setMaxWidth,
  } = useDesignSettings();

  // 사이드바 상태 관리
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // 초기 상태: 펼쳐진 사이드바
  const [sidebarHidden, setSidebarHidden] = useState(false); // 사이드바 완전 숨김 상태
  const [isHoverEnabled, setIsHoverEnabled] = useState(false);

  // PageSelector 상태 관리
  const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // TabBar용 경로 정규화 함수
  const pathNormalizer = useCallback((path: string): string => {
    // 마지막의 슬래시 제거
    let normalized = path.replace(/\/$/, "");

    // 빈 문자열이면 홈으로
    if (!normalized) normalized = "/";

    // analytics/, dashboard/ 등의 경우 앞에 /design-example 추가
    if (
      normalized.match(
        /^(analytics|dashboard|ecommerce|task-management|user-profile)$/
      )
    ) {
      normalized = `/design-example/${normalized}`;
    }

    return normalized;
  }, []);

  // TabBar용 기본 페이지 정보 리졸버
  const defaultPageInfoResolver = useCallback(
    (path: string, homePath: string): PageInfo => {
      // 기본값 생성 시 더 명확한 제목과 카테고리 생성
      let defaultTitle = "페이지";
      let defaultCategory = "기타";

      if (path.includes("/design-example/")) {
        const segment = path.split("/design-example/")[1];
        if (segment === "dashboard") {
          defaultTitle = "대시보드";
          defaultCategory = "예시페이지";
        } else if (segment === "ecommerce") {
          defaultTitle = "이커머스";
          defaultCategory = "예시페이지";
        } else if (segment === "analytics") {
          defaultTitle = "분석";
          defaultCategory = "데이터";
        } else if (segment === "task-management") {
          defaultTitle = "업무관리";
          defaultCategory = "업무";
        } else if (segment === "user-profile") {
          defaultTitle = "사용자 프로필";
          defaultCategory = "사용자";
        } else if (segment === "card-statement") {
          defaultTitle = "이용내역 명세서";
          defaultCategory = "명세서";
        } else if (segment === "payment-statement") {
          defaultTitle = "결제내역 조회";
          defaultCategory = "명세서";
        } else if (segment === "card-management") {
          defaultTitle = "카드 관리";
          defaultCategory = "카드";
        } else if (segment === "card-benefits") {
          defaultTitle = "카드 혜택";
          defaultCategory = "카드";
        } else if (segment === "account-info") {
          defaultTitle = "계좌 정보";
          defaultCategory = "금융";
        } else if (segment === "transfer") {
          defaultTitle = "계좌 이체";
          defaultCategory = "금융";
        } else if (segment === "settings") {
          defaultTitle = "설정";
          defaultCategory = "사용자";
        } else if (segment === "notifications") {
          defaultTitle = "알림 설정";
          defaultCategory = "사용자";
        } else if (segment) {
          defaultTitle = segment;
        }
      } else if (path === "/design-example") {
        defaultTitle = "디자인토큰";
        defaultCategory = "디자인시스템";
      } else if (path === "/") {
        defaultTitle = "홈";
        defaultCategory = "메인";
      } else if (path === "/component-library") {
        defaultTitle = "컴포넌트 라이브러리";
        defaultCategory = "디자인시스템";
      } else if (path === "/colors") {
        defaultTitle = "색상 가이드";
        defaultCategory = "디자인시스템";
      }

      // 중복 허용 페이지 확인
      const allowDuplicate =
        path === "/design-example/dashboard" ||
        path === "/design-example/ecommerce";

      return {
        path,
        title: defaultTitle,
        closable: path !== homePath,
        allowDuplicate,
        category: defaultCategory,
      };
    },
    []
  );

  // TabBar 상태 관리 - 페이지 매핑을 메모이제이션
  const allPagesMapping = useMemo(() => createAllPagesMapping(), []);
  const { tabs, activeTabId, removeTab, addTab, reorderTabs, handleTabClick } =
    useTabBar({
      pageMapping: allPagesMapping,
      homePath: "/design-example", // 홈 경로 설정
      maxTabs: 50, // 최대 50개 탭 허용 (실질적으로 무제한)
      pathNormalizer,
      defaultPageInfoResolver,
      initialTabs: [], // 초기 탭 없음
      autoCreateTabOnNavigation: true, // URL 직접 입력 등 네비게이션 시 자동으로 탭 생성
      ignoreQueryParamsForPaths: [
        // 쿼리파라미터를 무시할 경로들
      ],
    });

  // 홈 버튼 활성 상태 관리 (초기값을 현재 경로에 따라 설정)
  const [isHomeButtonActive, setIsHomeButtonActive] = useState(() => {
    const normalizedPathname = pathname.replace(/\/$/, "") || "/";
    return normalizedPathname === "/design-example";
  });

  // 현재 경로가 홈 경로인지 확인하고 홈 버튼 상태 업데이트
  React.useEffect(() => {
    // 경로 정규화 - 끝의 슬래시 제거
    const normalizedPathname = pathname.replace(/\/$/, "") || "/";
    const normalizedHomePath = "/design-example";

    if (normalizedPathname === normalizedHomePath) {
      setIsHomeButtonActive(true);
    } else {
      setIsHomeButtonActive(false);
    }
  }, [pathname]);

  // 활성 탭이 있을 때는 홈 버튼 비활성화
  React.useEffect(() => {
    const hasActiveTab = activeTabId !== undefined;
    if (hasActiveTab) {
      const normalizedPathname = pathname.replace(/\/$/, "") || "/";
      const normalizedHomePath = "/design-example";

      if (normalizedPathname !== normalizedHomePath) {
        setIsHomeButtonActive(false);
      }
    }
  }, [activeTabId, pathname]);

  // 관리자/사용자 화면 상태 관리
  const [isAdminMode, setIsAdminMode] = useState(false);

  // 사용자 정보 (실제로는 인증 상태에서 가져와야 함)
  const user = {
    name: "김디자이너",
    email: "designer@example.com",
    initials: "김",
  };

  // 로그아웃 함수
  const handleLogout = () => {
    // 실제 로그아웃 로직 구현
    console.log("로그아웃 처리 중...");
    // 예: 인증 토큰 삭제, 로그인 페이지로 리다이렉트 등
    alert("로그아웃되었습니다.");
  };

  // 관리자/사용자 화면 전환 함수
  const handleModeToggle = () => {
    setIsAdminMode(!isAdminMode);
    console.log(`${!isAdminMode ? "관리자" : "사용자"} 모드로 전환`);

    // 페이지 이동 로직 (예시)
    if (!isAdminMode) {
      // 관리자 모드로 전환 시 관리자 페이지로 이동
      window.location.href = "/design-example/admin";
    } else {
      // 사용자 모드로 전환 시 사용자 페이지로 이동
      window.location.href = "/design-example/dashboard";
    }
  };

  // 호버 모드 토글 함수
  const handleHoverToggle = () => {
    if (isHoverEnabled) {
      // 호버 모드 비활성화 → 펼친 사이드바로 변경
      setIsHoverEnabled(false);
      setSidebarCollapsed(false);
    } else {
      // 호버 모드 활성화 → 접힌 사이드바로 변경
      setIsHoverEnabled(true);
      setSidebarCollapsed(true);
    }
  };

  // 사이드바 완전 숨김 토글 함수
  const toggleSidebarHidden = () => {
    setSidebarHidden(!sidebarHidden);
  };

  // 홈 버튼 클릭 핸들러
  const handleHomeClick = useCallback(() => {
    setIsHomeButtonActive(true);
    router.push("/design-example");
  }, [router]);

  // 기존 탭 활성화 또는 새 탭 추가 (TabBar용)
  const activateOrAddTab = useCallback(
    (pageInfo: PageInfo) => {
      // 기존 탭 찾기
      const existingTab = tabs.find((tab) => {
        const tabBasePath = tab.path.split("?")[0];
        const pageBasePath = pageInfo.path.split("?")[0];
        return tabBasePath === pageBasePath;
      });

      if (existingTab) {
        // 기존 탭 활성화
        handleTabClick(existingTab);
      } else {
        // 새 탭 추가
        addTab(pageInfo);
      }
    },
    [tabs, handleTabClick, addTab]
  );

  // === 중복 탭 강제 생성 유틸리티 함수 (예시) ===
  const forceAddDuplicateTab = useCallback(
    (path: string, title: string, icon?: React.ReactNode) => {
      const pageInfo = allPagesMapping[path] || {
        path,
        title,
        icon,
        closable: true,
      };

      // 중복 허용으로 강제 생성 - tab-id가 자동으로 추가됨
      const duplicatePageInfo = {
        ...pageInfo,
        allowDuplicate: true,
      };

      addTab(duplicatePageInfo);
    },
    [addTab, allPagesMapping]
  );

  // === 커스텀 tab-id로 중복 탭 생성 유틸리티 함수 (예시) ===
  const addTabWithCustomId = useCallback(
    (
      path: string,
      title: string,
      customTabId: string,
      icon?: React.ReactNode
    ) => {
      const pageInfo = allPagesMapping[path] || {
        path,
        title,
        icon,
        closable: true,
      };

      const finalPath = path.includes("?")
        ? `${path}&tab-id=${customTabId}`
        : `${path}?tab-id=${customTabId}`;

      const duplicatePageInfo = {
        ...pageInfo,
        path: finalPath,
        allowDuplicate: true,
      };

      addTab(duplicatePageInfo);
    },
    [addTab, allPagesMapping]
  );

  // 홈 버튼 활성 상태는 별도 상태로 관리 (pathname과 무관)

  return (
    <ClientOnly fallback={<Loading />}>
      <SidebarContext.Provider
        value={{
          sidebarHidden,
          setSidebarHidden,
          toggleSidebarHidden,
        }}
      >
        <div className="flex flex-col h-screen overflow-x-hidden">
          {/* ChromeTabBar - 상단 고정, 사이드바보다 위에 배치 */}
          <div className="flex-shrink-0 bg-background z-[60] relative overflow-hidden">
            <div className="flex items-center min-w-0">
              {/* 홈 버튼 */}
              <button
                onClick={handleHomeClick}
                className={`flex-shrink-0 px-3 text-sm font-medium transition-colors ${
                  isHomeButtonActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                style={{
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  minHeight: "32px",
                }}
                title="디자인토큰으로 이동"
              >
                <div className="flex items-center space-x-2">
                  <span>🎨</span>
                  <span>디자인토큰</span>
                </div>
              </button>

              {/* 탭바 */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <TabBar
                  tabs={tabs}
                  activeTabId={activeTabId}
                  onTabClick={handleTabClick}
                  onTabClose={(tabId) => removeTab(tabId)}
                  onTabReorder={reorderTabs}
                  showNewTabButton={true}
                  maxTabs={50}
                  showHomeButton={false}
                  homeButtonActive={isHomeButtonActive}
                  onHomeClick={handleHomeClick}
                  renderNewTabButton={({ isDisabled, maxTabs }) => (
                    <PageSelector
                      availablePages={Object.values(allPagesMapping)}
                      openTabPaths={tabs.map((tab) => tab.path)}
                      onPageSelect={(pageInfo) => {
                        addTab(pageInfo);
                        setIsPageSelectorOpen(false);
                      }}
                      isOpen={isPageSelectorOpen}
                      onClose={() => setIsPageSelectorOpen(false)}
                    >
                      <button
                        className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded transition-colors ${
                          isDisabled
                            ? "text-muted-foreground/30 cursor-not-allowed"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        onClick={() => {
                          if (!isDisabled) {
                            setIsPageSelectorOpen(!isPageSelectorOpen);
                          }
                        }}
                        disabled={isDisabled}
                        title={
                          isDisabled
                            ? `최대 탭 개수(${maxTabs})에 도달했습니다`
                            : "새 탭 추가"
                        }
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </PageSelector>
                  )}
                />
              </div>
            </div>
          </div>

          {/* 사이드바와 메인 콘텐츠 영역 */}
          <div className="lg:flex flex-1 overflow-hidden">
            {/* 사이드바 */}
            <CompactSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              isCollapsed={sidebarCollapsed}
              isHidden={sidebarHidden}
              onToggleCollapse={() => {
                if (isHoverEnabled) {
                  // 호버 모드에서는 단순히 접기/펼치기만 수행 (호버 이벤트용)
                  setSidebarCollapsed(!sidebarCollapsed);
                } else if (!sidebarCollapsed) {
                  // 펼쳐진 상태에서 접기 버튼 클릭 → 호버 모드 활성화 + 접기
                  setIsHoverEnabled(true);
                  setSidebarCollapsed(true);
                } else {
                  // 일반 접힌 상태에서 펼치기
                  setSidebarCollapsed(false);
                }
              }}
              activePath={pathname}
              menuGroups={sidebarMenuGroups}
              user={user}
              onLogout={handleLogout}
              isAdminMode={isAdminMode}
              onModeToggle={handleModeToggle}
              showModeToggle={true}
              showNotification={true}
              showSettings={true}
              isHoverEnabled={isHoverEnabled}
              onToggleHover={handleHoverToggle}
              customNotificationComponent={CustomNotificationPopup}
              onMenuClick={(path, title, icon) => {
                // 디자인토큰(루트 페이지) 클릭 시에는 홈 버튼 활성화만 처리
                if (path === "/design-example") {
                  // 홈 페이지로 이동하고 홈 버튼 활성화
                  router.push("/design-example");
                  setIsHomeButtonActive(true);
                  // TabBar에서는 홈 버튼이 따로 있으므로 홈으로 이동만 처리
                } else {
                  // 다른 메뉴 클릭 시에는 기존 탭 활성화 또는 새 탭 추가
                  const pageInfo = allPagesMapping[path] || {
                    path,
                    title,
                    icon,
                    closable: path !== "/design-example",
                    allowDuplicate:
                      path === "/design-example/dashboard" ||
                      path === "/design-example/ecommerce", // 중복 허용 페이지 설정
                  };

                  // 중복 허용 페이지 확인
                  const isDuplicatePage =
                    path === "/design-example/dashboard" ||
                    path === "/design-example/ecommerce";

                  if (isDuplicatePage) {
                    // 중복 허용 페이지는 항상 새로운 탭 추가
                    const duplicatePageInfo = {
                      ...pageInfo,
                      allowDuplicate: true,
                    };
                    addTab(duplicatePageInfo);
                  } else {
                    // 일반 페이지는 기존 탭 활성화 또는 새 탭 생성
                    activateOrAddTab(pageInfo);
                  }

                  setIsHomeButtonActive(false);
                }
              }}
              // 로고를 사용하려면 아래 주석을 해제하고 로고 URL을 입력하세요.
              // logoUrl="https://via.placeholder.com/150/DDDDDD/808080?Text=LOGO"
              // 텍스트 로고를 변경하려면 아래 주석을 해제하고 원하는 텍스트를 입력하세요.
              logoText="커스텀 시스템"
              logoTextShort="CS"
              // === 중복 탭 허용 예시 ===
              // 위의 isDuplicatePage 로직에서 보듯이, 특정 페이지들은 여러 탭을 열 수 있습니다.
              //
              // 1. allowDuplicate: true 설정으로 중복 탭 허용
              // 2. useTabBar에서 자동으로 tab-id 쿼리파라미터 생성
              // 3. useTabInstance Hook으로 각 탭별 독립적인 상태 관리
              //
              // 사용 예시:
              // - 대시보드: 서로 다른 필터나 설정으로 여러 개 열기
              // - 이커머스: 상품관리와 주문관리 등 다른 업무로 여러 탭
              // - 프로젝트 상세: 여러 프로젝트 동시 비교
              //
              // 개발자 참고사항:
              // - pageInfo.allowDuplicate = true 설정
              // - useTabInstance Hook으로 탭별 상태 분리
              // - tab-id는 자동 생성되어 URL에 추가됨
              // - 예: /dashboard?tab-id=1638360000000-abc12
              //
              // === 프로그래밍 방식으로 중복 탭 생성하는 방법 ===
              //
              // 1. 자동 tab-id로 중복 탭 생성:
              // forceAddDuplicateTab("/design-example/dashboard", "새 대시보드", dashboardIcon);
              //
              // 2. 커스텀 tab-id로 중복 탭 생성:
              // addTabWithCustomId("/design-example/ecommerce", "이커머스 - 상품관리", "product-mgmt", ecommerceIcon);
              //
              // 3. 컴포넌트에서 탭별 독립 상태 사용:
              // const [tabData, setTabData] = useTabInstance({}, "dashboardData");
              // const [settings, setSettings] = useTabInstanceLocalStorage("settings", {});
              hoverActiveIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              }
              hoverInActiveIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m13.5 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              }

              // 사이드바 아이콘은 이제 설정에서 사용자가 직접 선택할 수 있습니다
              // collapseIcon과 expandIcon props는 필요시에만 사용하세요
            />

            {/* 메인 콘텐츠 */}
            <main className="flex-1 overflow-hidden">
              {/* 모바일 헤더 - TabBar 아래에 위치 */}
              <div className="lg:hidden flex items-center justify-between bg-surface border-b border-border p-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  ☰
                </Button>
                <span className="font-semibold">디자인 예제</span>
                <div className="w-8" />
              </div>

              {/* 콘텐츠 영역 */}
              <div className="h-full overflow-auto">
                <LayoutContainer
                  type={layoutType}
                  maxWidth={maxWidth}
                  hasSidebar={true}
                  sidebarCollapsed={sidebarCollapsed}
                  sidebarHidden={sidebarHidden}
                >
                  {/* 중복 탭 테스트 버튼 (개발 시에만 표시) */}
                  {process.env.NODE_ENV === "development" &&
                    pathname === "/design-example" && (
                      <div className="mb-6 p-4 bg-muted/30 border border-dashed border-border rounded-lg">
                        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                          중복 탭 테스트 (개발용)
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              forceAddDuplicateTab(
                                "/design-example/dashboard",
                                "대시보드 복사본"
                              )
                            }
                          >
                            대시보드 복사본 생성
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addTabWithCustomId(
                                "/design-example/ecommerce",
                                "이커머스 - 상품관리",
                                "product-management"
                              )
                            }
                          >
                            이커머스 상품관리 탭
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addTabWithCustomId(
                                "/design-example/ecommerce",
                                "이커머스 - 주문관리",
                                "order-management"
                              )
                            }
                          >
                            이커머스 주문관리 탭
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          각 탭은 독립적인 상태를 가지며, tab-id로 구분됩니다.
                        </p>
                      </div>
                    )}
                  {children}
                </LayoutContainer>
              </div>
            </main>
          </div>
        </div>

        <DesignSettings
          onFontChange={setFont}
          onThemeChange={setTheme}
          onRadiusChange={setRadius}
          onFontSizeChange={setFontSize}
          onSpacingChange={setSpacing}
          onGapChange={setGap}
          onLayoutTypeChange={setLayoutType}
          onMaxWidthChange={setMaxWidth}
          currentFont={font}
          currentTheme={theme}
          currentRadius={radius}
          currentFontSize={fontSize}
          currentSpacing={spacing}
          currentGap={gap}
          currentLayoutType={layoutType}
          currentMaxWidth={maxWidth}
        />
      </SidebarContext.Provider>
    </ClientOnly>
  );
}

export default function DesignExampleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--color-background)]`}
    >
      <DesignSettingsProvider>
        <DesignExampleContent>{children}</DesignExampleContent>
      </DesignSettingsProvider>
    </div>
  );
}
