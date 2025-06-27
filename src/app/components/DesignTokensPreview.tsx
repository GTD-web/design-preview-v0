"use client";

import React from "react";
import { Button } from "@/packages/design-system/components/Button";

/**
 * 단일 색상 정의
 */
const singleColors = [
  // 기본 디자인 시스템 색상
  { name: "primary", className: "bg-primary", text: "text-primary-foreground" },
  { name: "secondary", className: "bg-secondary", text: "text-secondary-foreground" },
  { name: "accent", className: "bg-accent", text: "text-accent-foreground" },
  { name: "success", className: "bg-success", text: "text-white" },
  { name: "warning", className: "bg-warning", text: "text-black" },
  { name: "danger", className: "bg-danger", text: "text-white" },
  { name: "info", className: "bg-info", text: "text-white" },
  { name: "surface", className: "bg-surface", text: "text-foreground border border-border" },
  { name: "background", className: "bg-background", text: "text-foreground border border-border" },
  { name: "border", className: "bg-border", text: "text-foreground border border-gray-400" },
  
  // Shadcn 토큰 색상들
  { name: "foreground", className: "bg-foreground", text: "text-background" },
  { name: "card", className: "bg-card", text: "text-card-foreground border border-border" },
  { name: "card-foreground", className: "bg-card-foreground", text: "text-card" },
  { name: "popover", className: "bg-popover", text: "text-popover-foreground border border-border" },
  { name: "popover-foreground", className: "bg-popover-foreground", text: "text-popover" },
  { name: "muted", className: "bg-muted", text: "text-muted-foreground" },
  { name: "muted-foreground", className: "bg-muted-foreground", text: "text-muted" },
  { name: "destructive", className: "bg-destructive", text: "text-destructive-foreground" },
  { name: "destructive-foreground", className: "bg-destructive-foreground", text: "text-destructive" },
  { name: "input", className: "bg-input", text: "text-foreground border border-border" },
  { name: "ring", className: "bg-ring", text: "text-foreground" },
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
 * 특정 색상 팔레트의 모든 단계를 세로로 표시합니다.
 */
function PalettePreview({ name }: { name: string }) {
  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-2 capitalize">{name}</h4>
      <div className="flex flex-col gap-1">
        {paletteSteps.map((step) => (
          <div key={step} className={`h-8 flex items-center justify-between rounded px-2 bg-${name}-${step} border`}>
            <span className="text-xs font-mono bg-white/70 rounded px-1 py-0.5">{step}</span>
            <span className="text-xs font-mono text-white drop-shadow-sm">
              #{name}-{step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 그라데이션 버튼 예제 컴포넌트
 */
function GradientButtonExamples() {
  const gradientTypes = [
    "primary",
    "secondary",
    "accent",
    "success",
    "warning",
    "danger",
    "info",
    "blue",
    "purple",
    "pink",
    "green",
    "orange",
    "red",
    "teal",
    "cyan",
    "indigo",
    "violet",
    "fuchsia",
    "rose",
    "sunset",
    "ocean",
    "forest",
    "fire",
    "aurora",
    "cosmic",
    "spring",
    "summer",
    "autumn",
    "winter",
  ];

  return (
    <div className="mb-10">
      <h3 className="text-h3 font-heading leading-heading tracking-heading mb-4">Gradient Buttons</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
        {gradientTypes.map((type) => (
          <div key={type} className="flex flex-col items-center space-y-2">
            <Button gradient gradientType={type as any} size="sm" className="w-full">
              {type}
            </Button>
            <span className="text-xs text-gray-500 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
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
export function DesignTokensPreview() {
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
    <section className="space-y-8">
      {/* 메인 제목 */}
      <h2 className="text-h1 font-heading leading-heading tracking-heading mb-6 text-foreground">디자인 시스템 컬러 프리뷰</h2>

      {/* 단일 색상 섹션 */}
      <div className="mb-12">
        <h3 className="text-h2 font-heading leading-heading tracking-heading mb-4 text-foreground">Single Colors</h3>
        <p className="text-sm text-muted-foreground mb-6">기본 디자인 시스템 색상과 Shadcn 토큰 색상들을 확인할 수 있습니다.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {singleColors.map((color) => (
            <div
              key={color.name}
              className={`h-20 flex flex-col items-center justify-center rounded-lg ${color.className} ${color.text} transition-all duration-200 hover:scale-105 hover:shadow-lg`}
            >
              <span className="text-xs font-mono font-medium">{color.name}</span>
              <span className="text-xs opacity-75 mt-1">
                {color.name.includes('-') ? color.name.split('-')[1] : 'color'}
              </span>
            </div>
          ))}
        </div>
        
        {/* 색상 사용법 안내 */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2">사용법:</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <div><code className="bg-background px-1 rounded">bg-primary</code> - 배경색</div>
            <div><code className="bg-background px-1 rounded">text-primary-foreground</code> - 텍스트 색상</div>
            <div><code className="bg-background px-1 rounded">border-border</code> - 테두리 색상</div>
          </div>
        </div>
      </div>

      {/* 팔레트 색상 섹션 */}
      <div className="mb-12">
        <h3 className="text-h2 font-heading leading-heading tracking-heading mb-2 text-foreground">Palette Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div
                className="bg-primary w-8 rounded-sm"
                style={{
                  height:
                    sp.size === "xs"
                      ? "0.25rem"
                      : sp.size === "sm"
                      ? "0.5rem"
                      : sp.size === "md"
                      ? "1rem"
                      : sp.size === "lg"
                      ? "2rem"
                      : sp.size === "xl"
                      ? "4rem"
                      : "1rem",
                }}
              />
              <span className="text-xs mt-1 text-foreground">{sp.name}</span>
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

      {/* 그라데이션 버튼 예제 섹션 */}
      <GradientButtonExamples />
    </section>
  );
}
