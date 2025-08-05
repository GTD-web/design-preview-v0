import React, { useEffect, useState, useRef } from "react";
import { Button } from "./Button";

/**
 * 사용 가능한 폰트 옵션 정의
 */
export const fonts = [
  { key: "noto", label: "Noto Sans KR", className: "font-noto" },
  { key: "pretendard", label: "Pretendard", className: "font-pretendard" },
  { key: "system", label: "System Sans", className: "font-system" },
];

/**
 * 사용 가능한 테마 옵션 정의
 */
export const themes = [
  { key: "light", label: "라이트", className: "" },
  { key: "dark", label: "다크", className: "theme-dark" },
  {
    key: "shadcn-v0-light",
    label: "Shadcn V0 Light",
    className: "theme-shadcn-v0-light",
  },
  {
    key: "shadcn-v0-dark",
    label: "Shadcn V0 Dark",
    className: "theme-shadcn-v0-dark",
  },
  { key: "shadcn", label: "Shadcn", className: "theme-shadcn" },
  { key: "dracula", label: "드라큘라", className: "theme-dracula" },
  { key: "pastel", label: "파스텔", className: "theme-pastel" },
  { key: "ci", label: "CI 테마", className: "theme-ci" },
  { key: "github", label: "GitHub", className: "theme-github" },
  { key: "midnight", label: "미드나잇", className: "theme-midnight" },
  { key: "ocean", label: "오션", className: "theme-ocean" },
  { key: "forest", label: "포레스트", className: "theme-forest" },
  { key: "sunset", label: "선셋", className: "theme-sunset" },
  { key: "aurora", label: "오로라", className: "theme-aurora" },
  { key: "cosmic", label: "코스믹", className: "theme-cosmic" },
];

/**
 * DesignSettings 컴포넌트의 Props 인터페이스
 */
interface DesignSettingsProps {
  /** 폰트 변경 시 호출되는 콜백 함수 */
  onFontChange: (font: string) => void;
  /** 테마 변경 시 호출되는 콜백 함수 */
  onThemeChange: (theme: string) => void;
  /** 라운드 값 변경 시 호출되는 콜백 함수 */
  onRadiusChange: (radius: number) => void;
  /** 폰트 크기 변경 시 호출되는 콜백 함수 */
  onFontSizeChange: (fontSize: number) => void;
  /** 스페이싱 변경 시 호출되는 콜백 함수 */
  onSpacingChange: (spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  }) => void;
  /** 그리드 갭 변경 시 호출되는 콜백 함수 */
  onGapChange: (gap: number) => void;
  /** 레이아웃 타입 변경 시 호출되는 콜백 함수 */
  onLayoutTypeChange: (layoutType: "full" | "centered") => void;
  /** 최대 너비 변경 시 호출되는 콜백 함수 */
  onMaxWidthChange: (maxWidth: string) => void;
  /** 현재 선택된 폰트 */
  currentFont: string;
  /** 현재 선택된 테마 */
  currentTheme: string;
  /** 현재 라운드 값 (px) */
  currentRadius: number;
  /** 현재 폰트 크기 (px) */
  currentFontSize: number;
  /** 현재 스페이싱 설정 (px 단위) */
  currentSpacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  /** 현재 그리드 갭 값 (px) */
  currentGap: number;
  /** 현재 레이아웃 타입 */
  currentLayoutType: "full" | "centered";
  /** 현재 최대 너비 */
  currentMaxWidth: string;
}

/**
 * 디자인 설정을 실시간으로 변경할 수 있는 플로팅 위젯 컴포넌트
 */
export function DesignSettings({
  onFontChange,
  onThemeChange,
  onRadiusChange,
  onFontSizeChange,
  onSpacingChange,
  onGapChange,
  onLayoutTypeChange,
  onMaxWidthChange,
  currentFont,
  currentTheme,
  currentRadius,
  currentFontSize,
  currentSpacing,
  currentGap,
  currentLayoutType,
  currentMaxWidth,
}: DesignSettingsProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, mounted]);

  return (
    <>
      {/* 플로팅 설정 버튼 */}
      <button
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700 transition"
        aria-label="디자인 설정 열기"
        onClick={() => setOpen((v) => !v)}
      >
        ⚙️
      </button>

      {/* 설정 패널 */}
      {open && (
        <div
          ref={widgetRef}
          className="fixed bottom-20 right-3 md:right-6 md:bottom-24 z-[9999] w-[320px] max-w-[90vw] max-h-[75vh] md:max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          {/* 헤더 */}
          <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <span className="font-semibold text-base text-gray-900 dark:text-white">
              디자인 퀵 설정
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-lg p-1"
              aria-label="닫기"
              onClick={() => setOpen(false)}
            >
              ×
            </Button>
          </div>

          {/* 스크롤 가능한 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {/* 테마 선택 섹션 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                테마
              </label>
              <div className="flex gap-3 flex-wrap">
                {themes.map((t) => (
                  <Button
                    key={t.key}
                    variant="toggle"
                    size="sm"
                    selected={currentTheme === t.key}
                    onClick={() => onThemeChange(t.key)}
                  >
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 폰트 선택 섹션 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                폰트
              </label>
              <div className="flex gap-3 flex-wrap">
                {fonts.map((f) => (
                  <Button
                    key={f.key}
                    variant="toggle"
                    size="sm"
                    selected={currentFont === f.key}
                    onClick={() => onFontChange(f.key)}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 레이아웃 타입 선택 섹션 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                레이아웃
              </label>
              <div className="flex gap-3 flex-wrap">
                <Button
                  variant="toggle"
                  size="sm"
                  selected={currentLayoutType === "full"}
                  onClick={() => onLayoutTypeChange("full")}
                >
                  전체
                </Button>
                <Button
                  variant="toggle"
                  size="sm"
                  selected={currentLayoutType === "centered"}
                  onClick={() => onLayoutTypeChange("centered")}
                >
                  중앙
                </Button>
              </div>
            </div>

            {/* 최대 너비 선택 섹션 */}
            {currentLayoutType === "centered" && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                  최대 너비
                </label>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant="toggle"
                    size="sm"
                    selected={currentMaxWidth === "max-w-4xl"}
                    onClick={() => onMaxWidthChange("max-w-4xl")}
                  >
                    4xl
                  </Button>
                  <Button
                    variant="toggle"
                    size="sm"
                    selected={currentMaxWidth === "max-w-5xl"}
                    onClick={() => onMaxWidthChange("max-w-5xl")}
                  >
                    5xl
                  </Button>
                  <Button
                    variant="toggle"
                    size="sm"
                    selected={currentMaxWidth === "max-w-6xl"}
                    onClick={() => onMaxWidthChange("max-w-6xl")}
                  >
                    6xl
                  </Button>
                  <Button
                    variant="toggle"
                    size="sm"
                    selected={currentMaxWidth === "max-w-7xl"}
                    onClick={() => onMaxWidthChange("max-w-7xl")}
                  >
                    7xl
                  </Button>
                </div>
              </div>
            )}

            {/* 수치 조정 섹션 */}
            <div className="mb-6 flex gap-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                  라운드
                </label>
                <input
                  type="range"
                  min={0}
                  max={32}
                  value={currentRadius}
                  onChange={(e) => onRadiusChange(Number(e.target.value))}
                  className="w-20"
                  aria-label="라운드 값 조정"
                  title={`라운드 값: ${currentRadius}px`}
                />
                <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                  {currentRadius}px
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                  폰트크기
                </label>
                <input
                  type="range"
                  min={12}
                  max={24}
                  value={currentFontSize}
                  onChange={(e) => onFontSizeChange(Number(e.target.value))}
                  className="w-20"
                  aria-label="폰트 크기 조정"
                  title={`폰트 크기: ${currentFontSize}px`}
                />
                <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                  {currentFontSize}px
                </span>
              </div>
            </div>

            {/* 기본 스페이싱 조정 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                기본 Spacing
              </label>
              <input
                type="range"
                min={2}
                max={32}
                value={currentSpacing.md}
                onChange={(e) =>
                  onSpacingChange({
                    ...currentSpacing,
                    md: Number(e.target.value),
                  })
                }
                className="w-32"
                aria-label="기본 스페이싱 조정"
                title={`기본 스페이싱: ${currentSpacing.md}px`}
              />
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                {currentSpacing.md}px
              </span>
            </div>

            {/* 그리드 갭 조정 */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                Grid Gap (갭)
              </label>
              <input
                type="range"
                min={0}
                max={64}
                value={currentGap}
                onChange={(e) => onGapChange(Number(e.target.value))}
                className="w-32"
                aria-label="그리드 갭 조정"
                title={`그리드 갭: ${currentGap}px`}
              />
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                {currentGap}px
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
