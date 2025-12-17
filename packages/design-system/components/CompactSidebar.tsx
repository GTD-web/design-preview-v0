"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import TextHeading from "./TextHeading";
import { TextValue } from "./Text";
import { VStack, VSpace } from "./Stack";
import { Button } from "./Button";
import { useSidebarIcons } from "../hooks/useSidebarIcons";

/**
 * 뱃지 사이즈 타입 정의
 */
export type CompactBadgeSize = "xs" | "sm" | "md" | "lg";

/**
 * 뱃지 사이즈에 따른 스타일 클래스 반환
 */
const getCompactBadgeStyles = (size: CompactBadgeSize = "sm") => {
  const sizeStyles = {
    xs: "text-xs px-1 py-0.5 min-w-4 h-4",
    sm: "text-xs px-1 py-0.5 min-w-5 h-5",
    md: "text-sm px-2 py-1 min-w-6 h-6",
    lg: "text-sm px-2 py-1 min-w-7 h-7",
  };

  return `${sizeStyles[size]} bg-neutral-900 /*dark:bg-neutral-800*/ text-white rounded font-medium border border-neutral-700 max-w-16 text-center overflow-hidden leading-none flex items-center justify-center`;
};

/**
 * 사이드바 메뉴 아이템 타입 정의
 */
export interface CompactSidebarMenuItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeSize?: CompactBadgeSize;
}

/**
 * 사이드바 메뉴 그룹 타입 정의
 */
export interface CompactSidebarMenuGroup {
  title: string;
  items: CompactSidebarMenuItem[];
}

/**
 * 공통 사이드바 Props 인터페이스
 */
export interface CompactSidebarBaseProps {
  /** 로고 이미지 URL */
  logoUrl?: string;
  /** 로고 텍스트 (전체) */
  logoText?: string;
  /** 로고 텍스트 (축약) */
  logoTextShort?: string;
  /** 현재 활성 메뉴 경로 */
  activePath?: string;
  /** 메뉴 그룹 목록 */
  menuGroups: CompactSidebarMenuGroup[];
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
  /** 호버 모드 활성화 여부 */
  isHoverEnabled?: boolean;
  /** 호버 모드 활성화 상태 아이콘 */
  hoverActiveIcon?: React.ReactNode;
  /** 호버 모드 비활성화 상태 아이콘 */
  hoverInActiveIcon?: React.ReactNode;
  /** 메뉴 클릭 시 탭 추가 콜백 */
  onMenuClick?: (path: string, title: string, icon?: React.ReactNode) => void;
  /** 커스텀 알림 컴포넌트 */
  customNotificationComponent?: React.ComponentType<{
    isOpen: boolean;
    onClose: () => void;
    position: { bottom: string; left: string };
  }>;
}

/**
 * 접힌 사이드바 Props 인터페이스
 */
export interface CompactSidebarCollapsedProps
  extends Omit<
    CompactSidebarBaseProps,
    "logoText" | "isAdminMode" | "onModeToggle" | "showModeToggle"
  > {
  /** 사이드바 펼치기 토글 함수 */
  onToggleExpand?: () => void;
  /** 사이드바 펼치기 아이콘 */
  expandIcon?: React.ReactNode;
  /** 접힌 사이드바 너비 */
  width?: string;
  /** 호버 토글 함수 */
  onToggleHover?: () => void;
}

/**
 * 펼쳐진 사이드바 Props 인터페이스
 */
export interface CompactSidebarExpandedProps
  extends Omit<
    CompactSidebarBaseProps,
    "isAdminMode" | "onModeToggle" | "showModeToggle"
  > {
  /** 사이드바 접기 토글 함수 */
  onToggleCollapse?: () => void;
  /** 사이드바 접기 아이콘 */
  collapseIcon?: React.ReactNode;
  /** 펼쳐진 사이드바 너비 */
  width?: string;
  /** 호버 토글 함수 */
  onToggleHover?: () => void;
}

/**
 * CompactSidebar 컴포넌트 Props 인터페이스
 */
interface CompactSidebarProps {
  /** 로고 이미지 URL */
  logoUrl?: string;
  /** 로고 텍스트 (전체) */
  logoText?: string;
  /** 로고 텍스트 (축약) */
  logoTextShort?: string;
  /** 사이드바 열림/닫힘 상태 */
  isOpen?: boolean;
  /** 사이드바 닫기 함수 */
  onClose?: () => void;
  /** 사이드바 접힘 상태 */
  isCollapsed?: boolean;
  /** 사이드바 완전 숨김 상태 */
  isHidden?: boolean;
  /** 사이드바 접기/펼치기 토글 함수 */
  onToggleCollapse?: () => void;
  /** 현재 활성 메뉴 경로 */
  activePath?: string;
  /** 메뉴 그룹 목록 (2차원 배열 구조) */
  menuGroups: CompactSidebarMenuGroup[];
  /** 사이드바 너비 */
  width?: string;
  /** 접힌 사이드바 너비 */
  collapsedWidth?: string;
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
  /** 사이드바 접기 아이콘 (펼쳐진 상태에서 표시) */
  collapseIcon?: React.ReactNode;
  /** 사이드바 펼치기 아이콘 (접힌 상태에서 표시) */
  expandIcon?: React.ReactNode;
  /** 호버 모드 활성화 여부 */
  isHoverEnabled?: boolean;
  /** 호버 모드 토글 함수 */
  onToggleHover?: () => void;
  /** 호버 모드 활성화 상태 아이콘 */
  hoverActiveIcon?: React.ReactNode;
  /** 호버 모드 비활성화 상태 아이콘 */
  hoverInActiveIcon?: React.ReactNode;
  /** 메뉴 클릭 시 탭 추가 콜백 */
  onMenuClick?: (path: string, title: string, icon?: React.ReactNode) => void;
  /** 커스텀 알림 컴포넌트 */
  customNotificationComponent?: React.ComponentType<{
    isOpen: boolean;
    onClose: () => void;
    position: { bottom: string; left: string };
  }>;
}

/**
 * 알림 팝업 컴포넌트
 */
function NotificationPopup({
  isOpen,
  onClose,
  position,
}: {
  isOpen: boolean;
  onClose: () => void;
  position: { bottom: string; left: string };
}) {
  // 샘플 알림 데이터
  const notifications = [
    {
      id: 1,
      title: "새로운 메시지",
      message: "김철수님이 메시지를 보냈습니다.",
      time: "2분 전",
      isRead: false,
    },
    {
      id: 2,
      title: "시스템 업데이트",
      message: "새로운 기능이 추가되었습니다.",
      time: "1시간 전",
      isRead: true,
    },
    {
      id: 3,
      title: "알림",
      message: "오늘의 할 일을 확인해보세요.",
      time: "3시간 전",
      isRead: true,
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed bg-surface rounded-lg shadow-2xl border w-80 max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out z-50"
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
                알림
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
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-surface/80 ${
                      !notification.isRead
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <TextHeading
                          size="sm"
                          weight="medium"
                          className="text-foreground mb-1"
                        >
                          {notification.title}
                        </TextHeading>
                        <TextValue size="sm" color="muted" className="mb-1">
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
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onClose();
              }}
            >
              모든 알림 읽음 처리
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * 설정 팝업 컴포넌트 - 주석 처리됨
 */
// function SettingsPopup({
//   isOpen,
//   onClose,
//   position,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   position: { bottom: string; left: string };
// }) {
//   const [selectedTheme, setSelectedTheme] = useState("light");
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true);
//   const [language, setLanguage] = useState("ko");

//   if (!isOpen) return null;

//   return (
//     <>
//       <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
//       <div
//         className="fixed bg-surface rounded-lg shadow-2xl border w-80 max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out z-50"
//         style={position}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-4 border-b">
//             <div className="flex items-center justify-between">
//               <TextHeading
//                 size="lg"
//                 weight="semibold"
//                 className="text-foreground"
//               >
//                 설정
//               </TextHeading>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-8 w-8 p-0"
//                 onClick={onClose}
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </Button>
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4">
//             <div className="space-y-6">
//               <div>
//                 <TextHeading
//                   size="sm"
//                   weight="medium"
//                   className="text-foreground mb-3"
//                 >
//                   테마
//                 </TextHeading>
//                 <div className="space-y-2">
//                   {[
//                     { value: "light", label: "라이트 모드" },
//                     { value: "dark", label: "다크 모드" },
//                     { value: "auto", label: "시스템 설정" },
//                   ].map((theme) => (
//                     <label
//                       key={theme.value}
//                       className="flex items-center cursor-pointer"
//                     >
//                       <input
//                         type="radio"
//                         name="theme"
//                         value={theme.value}
//                         checked={selectedTheme === theme.value}
//                         onChange={(e) => setSelectedTheme(e.target.value)}
//                         className="mr-3"
//                       />
//                       <TextValue size="sm" className="text-foreground">
//                         {theme.label}
//                       </TextValue>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <TextHeading
//                   size="sm"
//                   weight="medium"
//                   className="text-foreground mb-3"
//                 >
//                   알림
//                 </TextHeading>
//                 <div className="flex items-center justify-between">
//                   <TextValue size="sm" className="text-foreground">
//                     알림 받기
//                   </TextValue>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={notificationsEnabled}
//                       onChange={(e) =>
//                         setNotificationsEnabled(e.target.checked)
//                       }
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                   </label>
//                 </div>
//               </div>

//               <div>
//                 <TextHeading
//                   size="sm"
//                   weight="medium"
//                   className="text-foreground mb-3"
//                 >
//                   언어
//                 </TextHeading>
//                 <select
//                   value={language}
//                   onChange={(e) => setLanguage(e.target.value)}
//                   className="w-full p-2 border border-neutral-300 rounded-lg bg-surface text-foreground"
//                 >
//                   <option value="ko">한국어</option>
//                   <option value="en">English</option>
//                   <option value="ja">日本語</option>
//                 </select>
//               </div>

//               <div>
//                 <TextHeading
//                   size="sm"
//                   weight="medium"
//                   className="text-foreground mb-3"
//                 >
//                   계정
//                 </TextHeading>
//                 <div className="space-y-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="w-full justify-start text-foreground hover:bg-surface/80"
//                     onClick={() => {
//                       console.log("프로필 편집");
//                       onClose();
//                     }}
//                   >
//                     프로필 편집
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="w-full justify-start text-foreground hover:bg-surface/80"
//                     onClick={() => {
//                       console.log("비밀번호 변경");
//                       onClose();
//                     }}
//                   >
//                     비밀번호 변경
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="p-4 border-t">
//             <Button
//               variant="primary"
//               size="sm"
//               className="w-full"
//               onClick={() => {
//                 console.log("설정 저장");
//                 onClose();
//               }}
//             >
//               설정 저장
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

/**
 * 접힌 컴팩트 사이드바 컴포넌트
 */
export function CompactSidebarCollapsed({
  logoUrl,
  logoTextShort = "DS",
  activePath = "",
  menuGroups,
  width = "w-20",
  className = "",
  user,
  onLogout,
  showNotification = true,
  showSettings = true,
  onMenuClick,
  customNotificationComponent,
}: CompactSidebarCollapsedProps) {
  const router = useRouter();
  const { isLoaded } = useSidebarIcons();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const handleProfileClick = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  const handleNotificationClick = () => {
    setShowNotificationPopup(!showNotificationPopup);
    setShowProfilePopup(false);
  };

  // 팝업 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showProfilePopup && !target.closest(".profile-popup")) {
        setShowProfilePopup(false);
      }
      if (showNotificationPopup && !target.closest(".notification-popup")) {
        setShowNotificationPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfilePopup, showNotificationPopup]);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <aside
        className={`
          h-full bg-surface
          overflow-x-hidden
          shadow-lg ${width} ${className}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden overflow-x-hidden">
          {/* 헤더 */}
          <div className="border-b overflow-x-hidden p-3">
            <div className="flex flex-col items-center">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="w-10 h-10 object-contain transition-all duration-300"
                />
              ) : (
                <div className="w-10 h-10 bg-neutral-800 /*dark:bg-neutral-700*/ rounded-lg flex items-center justify-center transition-all duration-300">
                  <span className="text-white font-bold text-base">
                    {logoTextShort}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 메뉴 */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2 pt-4">
            <div className="flex flex-col gap-sm items-center justify-start">
              {menuGroups.map((group, groupIndex) => (
                <div
                  key={group.title}
                  className={`w-full ${groupIndex === 0 ? "mt-2" : ""}`}
                >
                  {group.items.map((item) => (
                    <div key={item.path} className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          if (onMenuClick) {
                            onMenuClick(item.path, item.title, item.icon);
                          } else {
                            router.push(item.path);
                          }
                        }}
                        className={`
                          group flex items-center justify-center h-[30px] w-[30px] rounded-lg transition-all duration-200 ease-in-out mx-auto relative
                          ${
                            activePath === item.path
                              ? "bg-neutral-800 /*dark:bg-neutral-700*/"
                              : "text-neutral-600 /*dark:text-neutral-400*/ hover:bg-neutral-100 /*dark:hover:bg-neutral-800*/"
                          }
                        `}
                        title={item.title}
                      >
                        <div
                          className={`
                            flex items-center justify-center w-4 h-4 transition-all duration-200 ease-in-out
                            ${
                              activePath === item.path
                                ? "text-white"
                                : "text-neutral-500 group-hover:text-neutral-700 /*dark:text-neutral-400 dark:group-hover:text-neutral-300*/"
                            }
                          `}
                        >
                          {item.icon}
                        </div>
                      </button>
                      {item.badge && (
                        <div
                          className={`absolute -top-1 -right-1 ${getCompactBadgeStyles(
                            item.badgeSize
                          )}`}
                          title={item.badge}
                        >
                          <span className="block truncate">
                            {item.badge.length > 3
                              ? `${item.badge.slice(0, 2)}...`
                              : item.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </nav>

          {/* 푸터 */}
          <div className="border-t overflow-x-hidden p-2">
            <div className="space-y-2">
              {/* 알림 및 설정 버튼 */}
              <div className="flex justify-center gap-1">
                {showNotification && (
                  <button
                    type="button"
                    onClick={handleNotificationClick}
                    className="group flex items-center justify-center h-[30px] w-[30px] rounded-lg transition-all duration-200 ease-in-out relative"
                    title="알림"
                  >
                    <div className="flex items-center justify-center w-4 h-4 transition-all duration-200 ease-in-out text-neutral-500 group-hover:text-neutral-700">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M10 18a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm6-4V9a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </button>
                )}

                {/* 설정 버튼 - 주석 처리됨 */}
                {/* {showSettings && (
                  <button
                    type="button"
                    onClick={handleSettingsClick}
                    className="group flex items-center justify-center h-[30px] w-[30px] rounded-lg transition-all duration-200 ease-in-out relative"
                    title="설정"
                  >
                    <div className="flex items-center justify-center w-4 h-4 transition-all duration-200 ease-in-out text-neutral-500 group-hover:text-neutral-700">
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
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.50 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </button>
                )} */}
              </div>

              {/* 프로필 버튼 */}
              <div
                className="p-2 rounded-lg bg-surface/50 hover:bg-surface/70 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
                onClick={handleProfileClick}
              >
                <div className="flex justify-center">
                  <div className="w-10 h-10 bg-neutral-800 /*dark:bg-neutral-700*/ rounded-lg flex items-center justify-center transition-all duration-300">
                    <span className="text-white font-bold text-sm">
                      {user?.initials || user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 알림 팝업 */}
      {customNotificationComponent ? (
        React.createElement(customNotificationComponent, {
          isOpen: showNotificationPopup,
          onClose: () => setShowNotificationPopup(false),
          position: {
            bottom: "1rem",
            left: "calc(5rem + 1rem)",
          },
        })
      ) : (
        <NotificationPopup
          isOpen={showNotificationPopup}
          onClose={() => setShowNotificationPopup(false)}
          position={{
            bottom: "1rem",
            left: "calc(5rem + 1rem)",
          }}
        />
      )}

      {/* 설정 팝업 - 주석 처리됨 */}
      {/* <SettingsPopup
        isOpen={showSettingsPopup}
        onClose={() => setShowSettingsPopup(false)}
        position={{
          bottom: "1rem",
          left: "calc(5rem + 1rem)",
        }}
      /> */}

      {/* 프로필 팝업 */}
      {showProfilePopup && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowProfilePopup(false)}
          >
            <div
              className="profile-popup fixed bg-surface rounded-lg shadow-2xl border w-80 max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out"
              style={{
                bottom: "1rem",
                left: "calc(5rem + 1rem)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="text-center">
                      <TextHeading
                        size="lg"
                        weight="semibold"
                        className="text-foreground mb-1"
                      >
                        {user?.name || "사용자"}
                      </TextHeading>
                      <TextValue size="sm" color="muted">
                        {user?.email || "user@example.com"}
                      </TextValue>
                    </div>

                    <div className="space-y-2">
                      {showNotification && (
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full text-left text-foreground hover:bg-surface/80"
                          onClick={() => {
                            setShowProfilePopup(false);
                          }}
                        >
                          <div className="flex items-center w-full">
                            <svg
                              width="20"
                              height="20"
                              fill="none"
                              viewBox="0 0 20 20"
                              className="mr-3 flex-shrink-0"
                            >
                              <path
                                d="M10 18a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm6-4V9a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-left">알림</span>
                          </div>
                        </Button>
                      )}

                      {showSettings && (
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full text-left text-foreground hover:bg-surface/80"
                          onClick={() => {
                            setShowProfilePopup(false);
                          }}
                        >
                          <div className="flex items-center w-full">
                            <svg
                              className="w-5 h-5 mr-3 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span className="text-left">설정</span>
                          </div>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-full text-left text-danger hover:bg-danger/10"
                        onClick={() => {
                          onLogout?.();
                          setShowProfilePopup(false);
                        }}
                      >
                        <div className="flex items-center w-full">
                          <svg
                            className="w-5 h-5 mr-3 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="text-left">로그아웃</span>
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/**
 * 펼쳐진 컴팩트 사이드바 컴포넌트 (헤더 없음)
 */
export function CompactSidebarExpanded({
  activePath = "",
  menuGroups,
  width = "w-64",
  className = "",
  user,
  onLogout,
  showNotification = true,
  showSettings: _showSettings = true, // eslint-disable-line @typescript-eslint/no-unused-vars
  onMenuClick,
  customNotificationComponent,
}: CompactSidebarExpandedProps) {
  const router = useRouter();
  const { isLoaded } = useSidebarIcons();
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const handleNotificationClick = () => {
    setShowNotificationPopup(!showNotificationPopup);
  };

  // 팝업 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotificationPopup && !target.closest(".notification-popup")) {
        setShowNotificationPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotificationPopup]);

  // 애니메이션 variants 정의 (opacity 제거)
  const expandedContentVariants: Variants = {
    hidden: {},
    visible: {},
    exit: {},
  };

  const staggerVariants: Variants = {
    hidden: {},
    visible: {},
    exit: {},
  };

  const itemVariants: Variants = {
    hidden: {},
    visible: {},
    exit: {},
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <aside
      className={`
        h-full bg-surface
        overflow-x-hidden
        shadow-lg ${width} ${className}
      `}
    >
      <div className="flex flex-col h-full overflow-hidden overflow-x-hidden">
        {/* 메뉴 - 헤더 없음 */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={staggerVariants}
          >
            <VSpace gap="lg" align="stretch">
              {menuGroups.map((group) => (
                <motion.div
                  key={group.title}
                  className="space-y-2"
                  variants={itemVariants}
                >
                  <motion.h3
                    className="text-xs font-semibold text-neutral-500 /*dark:text-neutral-400*/ uppercase tracking-tight transition-all duration-300"
                    variants={itemVariants}
                  >
                    {group.title}
                  </motion.h3>
                  <VStack gap="sm" align="stretch">
                    {group.items.map((item) => (
                      <motion.button
                        key={item.path}
                        type="button"
                        onClick={() => {
                          if (onMenuClick) {
                            onMenuClick(item.path, item.title, item.icon);
                          } else {
                            router.push(item.path);
                          }
                        }}
                        className={`
                          group flex items-center gap-3 w-full px-3 py-1 h-[30px] rounded-lg transition-all duration-200 ease-in-out overflow-hidden
                          ${
                            activePath === item.path
                              ? "bg-neutral-800 /*dark:bg-neutral-700*/"
                              : "text-neutral-600 /*dark:text-neutral-400*/ hover:bg-neutral-100 /*dark:hover:bg-neutral-800*/"
                          }
                        `}
                        variants={itemVariants}
                      >
                        <div
                          className={`
                            flex items-center justify-center w-4 h-4 transition-all duration-200 ease-in-out flex-shrink-0
                            ${
                              activePath === item.path
                                ? "text-white"
                                : "text-neutral-500 group-hover:text-neutral-700 /*dark:text-neutral-400 dark:group-hover:text-neutral-300*/"
                            }
                          `}
                        >
                          {item.icon}
                        </div>
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span
                            className={`font-medium transition-all duration-200 ease-in-out truncate ${
                              activePath === item.path
                                ? "text-white"
                                : "text-neutral-600 /*dark:text-neutral-400*/"
                            }`}
                          >
                            {item.title}
                          </span>
                          {item.badge && (
                            <div
                              className={`${getCompactBadgeStyles(
                                item.badgeSize
                              )} flex-shrink-0`}
                              title={item.badge}
                            >
                              <span className="block truncate">
                                {item.badge}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </VStack>
                </motion.div>
              ))}
            </VSpace>
          </motion.div>
        </nav>

        {/* 푸터 */}
        <div className="border-t overflow-x-hidden p-4">
          <motion.div
            className="rounded-lg bg-surface/50 hover:bg-surface/70 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={expandedContentVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 transition-all duration-300">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">
                  {user?.name || "사용자"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {showNotification && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted hover:text-foreground hover:bg-surface/80 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNotificationClick();
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

                {/* 설정 버튼 - 주석 처리됨 */}
                {/* {showSettings && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted hover:text-foreground hover:bg-surface/80 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSettingsClick();
                    }}
                    title="설정"
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
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.50 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </Button>
                )} */}

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogout?.();
                  }}
                  title="로그아웃"
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 알림 팝업 */}
      {customNotificationComponent ? (
        React.createElement(customNotificationComponent, {
          isOpen: showNotificationPopup,
          onClose: () => setShowNotificationPopup(false),
          position: {
            bottom: "1rem",
            left: "calc(16rem + 1rem)",
          },
        })
      ) : (
        <NotificationPopup
          isOpen={showNotificationPopup}
          onClose={() => setShowNotificationPopup(false)}
          position={{
            bottom: "1rem",
            left: "calc(16rem + 1rem)",
          }}
        />
      )}

      {/* 설정 팝업 - 주석 처리됨 */}
      {/* <SettingsPopup
        isOpen={showSettingsPopup}
        onClose={() => setShowSettingsPopup(false)}
        position={{
          bottom: "1rem",
          left: "calc(16rem + 1rem)",
        }}
      /> */}
    </aside>
  );
}

/**
 * 컴팩트 사이드바 컴포넌트 (통합) - 헤더 없는 버전
 *
 * 기능:
 * - 네비게이션 메뉴 제공
 * - 반응형 디자인 (모바일에서 자동 숨김)
 * - 현재 페이지 하이라이트
 * - 스크롤 가능한 메뉴 영역
 * - 30px 메뉴 아이템 크기
 * - 헤더 영역 없음
 */
export function CompactSidebar({
  isOpen = true,
  onClose,
  isCollapsed = false,
  isHidden = false,
  onToggleCollapse,
  activePath = "",
  menuGroups,
  width = "w-64",
  collapsedWidth = "w-20",
  className = "",
  user,
  onLogout,
  showNotification = true,
  showSettings = true,
  logoUrl,
  logoText = "디자인시스템",
  logoTextShort = "DS",
  isHoverEnabled = false,
  onToggleHover,
  hoverActiveIcon,
  hoverInActiveIcon,
  onMenuClick,
  customNotificationComponent,
}: CompactSidebarProps) {
  const { isLoaded } = useSidebarIcons();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [hoverTimeoutId, setHoverTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 호버 타이머 정리
  useEffect(() => {
    return () => {
      if (hoverTimeoutId) {
        clearTimeout(hoverTimeoutId);
      }
    };
  }, [hoverTimeoutId]);

  // 호버 이벤트 핸들러
  const handleMouseEnter = () => {
    if (!isHoverEnabled || !isCollapsed || isAnimating) return;

    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId);
      setHoverTimeoutId(null);
    }

    // 애니메이션 상태 설정
    setIsAnimating(true);

    // 호버 시 사이드바 펼치기
    onToggleCollapse?.();

    // 애니메이션 완료 후 상태 리셋
    setTimeout(() => {
      setIsAnimating(false);
    }, 250); // 애니메이션 시간보다 약간 길게
  };

  const handleMouseLeave = () => {
    if (!isHoverEnabled || isCollapsed || isAnimating) return;

    const timeoutId = setTimeout(() => {
      if (!isAnimating) {
        // 애니메이션 상태 설정
        setIsAnimating(true);

        // 호버 해제 시 사이드바 접기
        onToggleCollapse?.();

        // 애니메이션 완료 후 상태 리셋
        setTimeout(() => {
          setIsAnimating(false);
        }, 0);
      }
      setHoverTimeoutId(null);
    }, 0);

    setHoverTimeoutId(timeoutId);
  };

  // 호버 토글 핸들러
  const handleToggleHover = () => {
    if (isHoverEnabled) {
      // 호버 모드 비활성화 시 진행 중인 타이머 정리
      if (hoverTimeoutId) {
        clearTimeout(hoverTimeoutId);
        setHoverTimeoutId(null);
      }
      // 애니메이션 상태 리셋
      setIsAnimating(false);
    }
    // 부모 컴포넌트의 호버 상태 토글
    onToggleHover?.();
  };

  // 저장된 아이콘이 로드되지 않았으면 로딩 상태 처리
  if (!isLoaded) {
    return null;
  }

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && !isHidden && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 렌더링 - TabBar 아래에 위치 */}
      <div
        className="fixed left-0 z-50"
        style={{
          top: "var(--tab-bar-height, 40px)", // TabBar 높이만큼 아래에 위치
          height: "calc(100vh - var(--tab-bar-height, 40px))", // TabBar를 제외한 높이
          transform: isHidden
            ? "translateX(-100%)"
            : isLargeScreen
            ? "translateX(0)"
            : isOpen
            ? "translateX(0)"
            : "translateX(-100%)",
          transition: "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          willChange: "transform",
          width: isCollapsed ? "5rem" : "16rem",
        }}
        onMouseEnter={!isHidden ? handleMouseEnter : undefined}
        onMouseLeave={!isHidden ? handleMouseLeave : undefined}
      >
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="collapsed"
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                willChange: "transform, opacity",
              }}
            >
              <CompactSidebarCollapsed
                logoUrl={logoUrl}
                logoTextShort={logoTextShort}
                activePath={activePath}
                menuGroups={menuGroups}
                className={className}
                user={user}
                onLogout={onLogout}
                showNotification={showNotification}
                showSettings={showSettings}
                width={collapsedWidth}
                onToggleExpand={onToggleCollapse}
                isHoverEnabled={isHoverEnabled}
                onToggleHover={handleToggleHover}
                onMenuClick={onMenuClick}
                customNotificationComponent={customNotificationComponent}
              />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                willChange: "transform, opacity",
              }}
            >
              <CompactSidebarExpanded
                logoUrl={logoUrl}
                logoText={logoText}
                logoTextShort={logoTextShort}
                activePath={activePath}
                menuGroups={menuGroups}
                className={className}
                user={user}
                onLogout={onLogout}
                showNotification={showNotification}
                showSettings={showSettings}
                width={width}
                onToggleCollapse={onToggleCollapse}
                isHoverEnabled={isHoverEnabled}
                onToggleHover={handleToggleHover}
                hoverActiveIcon={hoverActiveIcon}
                hoverInActiveIcon={hoverInActiveIcon}
                onMenuClick={onMenuClick}
                customNotificationComponent={customNotificationComponent}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
