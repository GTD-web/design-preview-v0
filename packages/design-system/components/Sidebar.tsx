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
  /** 사이드바 접힘 상태 */
  isCollapsed?: boolean;
  /** 사이드바 접기/펼치기 토글 함수 */
  onToggleCollapse?: () => void;
  /** 현재 활성 메뉴 경로 */
  activePath?: string;
  /** 메뉴 그룹 목록 (2차원 배열 구조) */
  menuGroups: SidebarMenuGroup[];
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
  isCollapsed = false,
  onToggleCollapse,
  activePath = "",
  menuGroups,
  width = "w-64",
  collapsedWidth = "w-20",
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
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  // 모든 메뉴 그룹에 대한 refs와 상태를 미리 생성
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [groupHeights, setGroupHeights] = useState<{ [key: string]: number }>({});

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

  const handleProfileClick = () => {
    if (isCollapsed) {
      setShowProfilePopup(!showProfilePopup);
    }
  };

  // 팝업 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showProfilePopup && !target.closest(".profile-popup")) {
        setShowProfilePopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfilePopup]);

  // 모든 그룹의 높이를 업데이트
  useEffect(() => {
    const newHeights: { [key: string]: number } = {};
    menuGroups.forEach((group) => {
      const ref = groupRefs.current[group.title];
      if (ref) {
        newHeights[group.title] = collapsedGroups.has(group.title) ? 0 : ref.scrollHeight;
      }
    });
    setGroupHeights(newHeights);
  }, [collapsedGroups, menuGroups]);

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* 사이드바 - 접힌 상태 */}
      {isCollapsed && (
        <aside
          className={`
            fixed top-0 left-0 h-full bg-surface border-r-4 border-neutral-300 dark:border-neutral-600 z-50
            transform transition-all duration-500 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:z-auto
            shadow-lg
            ${collapsedWidth} ${className}
          `}
          style={{
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="flex flex-col h-full border-r-2 border-neutral-300 dark:border-neutral-600">
            {/* 헤더 - 접힌 상태 */}
            <div className="p-3 border-b border-border">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center transition-all duration-300">
                  <span className="text-white font-bold text-base">DS</span>
                </div>
                {/* 접기/펼치기 버튼 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
                  title="사이드바 펼치기"
                >
                  <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* 메뉴 - 접힌 상태 */}
            <nav className="flex-1 overflow-y-auto p-2 pt-4">
              <div className="flex flex-col gap-sm items-center justify-start">
                {menuGroups.map((group, groupIndex) => (
                  <div key={group.title} className={`w-full ${groupIndex === 0 ? "mt-2" : ""}`}>
                    {group.items.map((item) => (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => router.push(item.path)}
                        className={`
                          group flex items-center justify-center h-10 rounded-lg transition-all duration-200 ease-in-out
                          hover:bg-neutral-100 dark:hover:bg-neutral-800 w-10 mx-auto
                          ${activePath === item.path ? "bg-neutral-800 dark:bg-neutral-700" : "text-neutral-600 dark:text-neutral-400"}
                        `}
                        title={item.title}
                      >
                        <div
                          className={`
                          flex items-center justify-center w-5 h-5 transition-all duration-200 ease-in-out
                          ${
                            activePath === item.path
                              ? "text-white"
                              : "text-neutral-500 group-hover:text-neutral-700 dark:text-neutral-400 dark:group-hover:text-neutral-300"
                          }
                        `}
                        >
                          {item.icon}
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </nav>

            {/* 푸터 - 접힌 상태 */}
            <div className="p-2 border-t border-border">
              <div
                className="p-2 rounded-lg bg-surface/50 hover:bg-surface/70 transition-all duration-200 ease-in-out cursor-pointer"
                onClick={handleProfileClick}
              >
                <div className="flex justify-center">
                  <div className="w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center transition-all duration-300">
                    <span className="text-white font-bold text-sm">{user?.initials || user?.name?.charAt(0) || "U"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 사이드바 - 펼쳐진 상태 */}
      {!isCollapsed && (
        <aside
          className={`
            fixed top-0 left-0 h-full bg-surface border-r-4 border-neutral-300 dark:border-neutral-600 z-50
            transform transition-all duration-500 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:z-auto
            shadow-lg
            ${width} ${className}
          `}
          style={{
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <div className="flex flex-col h-full border-r-2 border-neutral-300 dark:border-neutral-600">
            {/* 헤더 - 펼쳐진 상태 */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-800 dark:bg-neutral-700 rounded-lg flex items-center justify-center transition-all duration-300">
                    <span className="text-white font-bold text-base">DS</span>
                  </div>
                  <span className="font-semibold text-lg transition-all duration-300">디자인시스템</span>
                </div>
                {/* 접기/펼치기 버튼 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200"
                  title="사이드바 접기"
                >
                  <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* 메뉴 - 펼쳐진 상태 */}
            <nav className="flex-1 overflow-y-auto p-4">
              <VSpace gap="lg" align="stretch">
                {menuGroups.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider transition-all duration-300">
                      {group.title}
                    </h3>
                    <VStack gap="sm" align="stretch">
                      {group.items.map((item) => (
                        <button
                          key={item.path}
                          type="button"
                          onClick={() => router.push(item.path)}
                          className={`
                            group flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all duration-200 ease-in-out
                            hover:bg-neutral-100 dark:hover:bg-neutral-800
                            ${activePath === item.path ? "bg-neutral-800 dark:bg-neutral-700" : "text-neutral-600 dark:text-neutral-400"}
                          `}
                        >
                          <div
                            className={`
                            flex items-center justify-center w-5 h-5 transition-all duration-200 ease-in-out
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
                            className={`font-medium transition-all duration-200 ease-in-out ${
                              activePath === item.path ? "text-white" : "text-neutral-600 dark:text-neutral-400"
                            }`}
                          >
                            {item.title}
                          </span>
                        </button>
                      ))}
                    </VStack>
                  </div>
                ))}
              </VSpace>
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

            {/* 푸터 - 펼쳐진 상태 */}
            <div className="p-4 border-t border-border">
              <div
                className="p-3 rounded-lg bg-surface/50 hover:bg-surface/70 transition-all duration-200 ease-in-out cursor-pointer"
                onClick={handleProfileClick}
              >
                {/* 사용자 프로필 정보 - 첫 번째 줄 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 min-w-0 transition-all duration-300">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{user?.name || "사용자"}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* 알림 버튼 */}
                    {showNotification && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted hover:text-foreground hover:bg-surface/80 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
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
                        className="h-8 w-8 p-0 text-muted hover:text-foreground hover:bg-surface/80 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
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
                      className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLogout?.();
                      }}
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
      )}

      {/* 프로필 팝업 */}
      {showProfilePopup && isCollapsed && (
        <>
          {/* 팝업 오버레이 */}
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowProfilePopup(false)}>
            {/* 팝업 컨테이너 */}
            <div
              className="profile-popup fixed bg-surface rounded-lg shadow-2xl border border-border w-80 max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out"
              style={{
                bottom: "1rem",
                left: "calc(4rem + 1rem)", // 사이드바 너비(4rem) + 여백(1rem)
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* 팝업 콘텐츠 */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {/* 사용자 정보 */}
                    <div className="text-center">
                      <TextHeading size="lg" weight="semibold" className="text-foreground mb-1">
                        {user?.name || "사용자"}
                      </TextHeading>
                      <TextValue size="sm" color="muted">
                        {user?.email || "user@example.com"}
                      </TextValue>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="space-y-2">
                      {/* 알림 버튼 */}
                      {showNotification && (
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full text-left text-foreground hover:bg-surface/80"
                          onClick={() => {
                            console.log("알림 클릭");
                            setShowProfilePopup(false);
                          }}
                        >
                          <div className="flex items-center w-full">
                            <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="mr-3 flex-shrink-0">
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

                      {/* 설정 버튼 */}
                      {showSettings && (
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full text-left text-foreground hover:bg-surface/80"
                          onClick={() => {
                            console.log("설정 클릭");
                            setShowProfilePopup(false);
                          }}
                        >
                          <div className="flex items-center w-full">
                            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-left">설정</span>
                          </div>
                        </Button>
                      )}

                      {/* 관리자/사용자 전환 버튼 */}
                      {showModeToggle && (
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full text-left text-foreground hover:bg-surface/80"
                          onClick={() => {
                            handleModeToggle();
                            setShowProfilePopup(false);
                          }}
                        >
                          <div className="flex items-center w-full">
                            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span className="text-left">{isAdminMode ? "사용자 화면으로 이동" : "관리자 화면으로 이동"}</span>
                          </div>
                        </Button>
                      )}

                      {/* 로그아웃 버튼 */}
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
                          <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
