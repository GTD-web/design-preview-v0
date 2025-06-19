"use client";

import React from "react";

/**
 * 단일 색상 정의
 */
const singleColors = [
  { name: "primary", className: "bg-primary", text: "onPrimary" },
  { name: "secondary", className: "bg-secondary", text: "onSecondary" },
  { name: "accent", className: "bg-accent", text: "onAccent" },
  { name: "success", className: "bg-success", text: "onSuccess" },
  { name: "warning", className: "bg-warning", text: "onWarning" },
  { name: "danger", className: "bg-danger", text: "onDanger" },
  { name: "info", className: "bg-info", text: "onInfo" },
  { name: "surface", className: "bg-surface", text: "onSurface border border-border" },
  { name: "background", className: "bg-background", text: "onBackground border border-border" },
  { name: "border", className: "bg-border", text: "text-onSurface border border-border" },
];

/**
 * 팔레트 색상 정의
 */
const paletteColors = [
  "neutral",
  "gray",
  "blue",
  "red",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "teal",
  "cyan",
  "indigo",
  "lime",
  "amber",
  "emerald",
  "violet",
  "fuchsia",
  "rose",
];

/**
 * 팔레트 단계 정의
 */
const paletteSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

/**
 * 팔레트 프리뷰 컴포넌트
 * 특정 색상 팔레트의 모든 단계를 표시합니다.
 */
function PalettePreview({ name }: { name: string }) {
  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-2 capitalize">{name}</h4>
      <div className="flex flex-wrap gap-2">
        {paletteSteps.map((step) => (
          <div key={step} className={`w-16 h-16 flex flex-col items-center justify-center rounded bg-${name}-${step} border`}>
            <span className="text-xs font-mono bg-white/70 rounded px-1 py-0.5 mt-8 -mb-2">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 디자인 토큰 프리뷰 컴포넌트 Props 인터페이스
 */
interface DesignTokensPreviewProps {
  /** 현재 선택된 테마 */
  theme?: string;
}

/**
 * 디자인 시스템의 모든 토큰들을 시각적으로 보여주는 프리뷰 컴포넌트
 *
 * 포함 내용:
 * - 단일 색상 (primary, secondary, accent 등)
 * - 팔레트 색상 (neutral, gray, blue 등)
 * - 폰트 패밀리
 * - 스페이싱
 * - 보더 라디우스
 * - 박스 섀도우
 */
export function DesignTokensPreview({ theme }: DesignTokensPreviewProps) {
  // 폰트 옵션 정의
  const fonts = [
    { key: "noto", label: "Noto Sans KR", className: "font-noto" },
    { key: "pretendard", label: "Pretendard", className: "font-pretendard" },
    { key: "system", label: "System Sans", className: "font-system" },
  ];

  // 스페이싱 옵션 정의
  const spacings = [
    { name: "xs", size: "xs" },
    { name: "sm", size: "sm" },
    { name: "md", size: "md" },
    { name: "lg", size: "lg" },
    { name: "xl", size: "xl" },
  ];

  // 보더 라디우스 옵션 정의
  const radii = [
    { name: "sm", className: "rounded-sm" },
    { name: "md", className: "rounded-md" },
    { name: "lg", className: "rounded-lg" },
    { name: "xl", className: "rounded-xl" },
    { name: "full", className: "rounded-full" },
  ];

  // 박스 섀도우 옵션 정의
  const shadows = [
    { name: "sm", className: "shadow-sm" },
    { name: "md", className: "shadow-md" },
    { name: "lg", className: "shadow-lg" },
  ];

  return (
    <section
      className="mx-auto mt-20 p-md gap-layout max-w-layout"
      style={{
        maxWidth: "var(--grid-max-width)",
        paddingLeft: "var(--grid-gutter)",
        paddingRight: "var(--grid-gutter)",
      }}
    >
      {/* 메인 제목 */}
      <h2 className="text-h1 font-heading leading-heading tracking-heading mb-6 text-foreground">디자인 시스템 컬러 프리뷰</h2>

      {/* 단일 색상 섹션 */}
      <div className="mb-12">
        <h3 className="text-h2 font-heading leading-heading tracking-heading mb-2 text-foreground">Single Colors</h3>
        <div className="grid grid-cols-layout gap-layout">
          {singleColors.map((color) => (
            <div
              key={color.name}
              className={`h-16 flex flex-col items-center justify-center rounded-md ${color.className} ${color.text} ${
                color.name === "warning" || color.name === "success"
                  ? theme === "dracula"
                    ? "text-foreground"
                    : "text-[var(--foreground-inverse)]"
                  : "text-foreground"
              }`}
            >
              <span className="text-xs font-mono opacity-80">{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 팔레트 색상 섹션 */}
      <div className="mb-12">
        <h3 className="text-h2 font-heading leading-heading tracking-heading mb-2 text-foreground">Palette Colors</h3>
        <div className="grid grid-cols-layout gap-layout">
          {paletteColors.map((name) => (
            <PalettePreview key={name} name={name} />
          ))}
        </div>
      </div>

      {/* 폰트 패밀리 섹션 */}
      <div className="mb-10">
        <h3 className="text-h3 font-heading leading-heading tracking-heading mb-2">Font Family</h3>
        <div className="flex gap-lg">
          {fonts.map((font) => (
            <div key={font.key} className="flex flex-col items-center">
              <span className={`text-lg ${font.className}`}>{font.label}</span>
              <span className="text-xs text-gray-500">.{font.className}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 스페이싱 섹션 */}
      <div className="mb-10">
        <h3 className="text-h3 font-heading leading-heading tracking-heading mb-2">Spacing</h3>
        <div className="flex gap-lg items-end">
          {spacings.map((sp) => (
            <div key={sp.name} className="flex flex-col items-center">
              <div className={`bg-primary/30 w-8`} style={{ height: `var(--spacing-${sp.size}, 1rem)` }} />
              <span className="text-xs mt-1">{sp.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 보더 라디우스 섹션 */}
      <div className="mb-10">
        <h3 className="text-h3 font-heading leading-heading tracking-heading mb-2">Border Radius</h3>
        <div className="flex gap-lg">
          {radii.map((r) => (
            <div key={r.name} className={`w-12 h-12 bg-primary/30 border border-primary ${r.className} flex items-center justify-center`}>
              <span className="text-xs text-primary font-mono">{r.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 박스 섀도우 섹션 */}
      <div className="mb-10">
        <h3 className="text-h3 font-heading leading-heading tracking-heading mb-2">Box Shadow</h3>
        <div className="flex gap-lg">
          {shadows.map((s) => (
            <div key={s.name} className={`w-20 h-12 bg-white border border-gray-200 flex items-center justify-center ${s.className}`}>
              <span className="text-xs text-gray-700 font-mono">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
