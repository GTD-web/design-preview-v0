"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import React, { useEffect, useState, useRef } from "react";
// import { Sidebar } from "./Sidebar";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // page.tsx에서 사용하던 상태를 이곳으로 이동
  const fonts = [
    { key: "noto", label: "Noto Sans KR", className: "font-noto" },
    { key: "pretendard", label: "Pretendard", className: "font-pretendard" },
    { key: "system", label: "System Sans", className: "font-system" },
  ];
  const themes = [
    { key: "light", label: "라이트", className: "" },
    { key: "dark", label: "다크", className: "theme-dark" },
    { key: "dracula", label: "드라큘라", className: "theme-dracula" },
    { key: "pastel", label: "파스텔", className: "theme-pastel" },
    { key: "ci", label: "CI 테마", className: "theme-ci" },
  ];
  const [font, setFont] = useState("noto");
  useEffect(() => {
    document.body.classList.remove("font-noto", "font-pretendard", "font-system");
    document.body.classList.add(fonts.find((f) => f.key === font)?.className || "font-noto");
  }, [font]);

  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-dracula", "theme-pastel", "theme-ci");
    if (theme !== "light") {
      document.body.classList.add(themes.find((t) => t.key === theme)?.className || "");
    }
  }, [theme]);

  const [radius, setRadius] = useState(8);
  useEffect(() => {
    document.body.style.setProperty("--radius", `${radius}px`);
  }, [radius]);

  const [fontSize, setFontSize] = useState(16);
  useEffect(() => {
    document.body.style.setProperty("--font-size-base", `${fontSize}px`);
  }, [fontSize]);

  const [spacing, setSpacing] = useState({
    xs: 4, // px
    sm: 8,
    md: 16,
    lg: 32,
    xl: 64,
  });
  useEffect(() => {
    document.body.style.setProperty("--spacing-xs", `${spacing.xs / 16}rem`);
    document.body.style.setProperty("--spacing-sm", `${spacing.sm / 16}rem`);
    document.body.style.setProperty("--spacing-md", `${spacing.md / 16}rem`);
    document.body.style.setProperty("--spacing-lg", `${spacing.lg / 16}rem`);
    document.body.style.setProperty("--spacing-xl", `${spacing.xl / 16}rem`);
  }, [spacing]);

  const [gap, setGap] = useState(24); // px 단위, 기본값 24px(1.5rem)
  useEffect(() => {
    document.body.style.setProperty("--grid-gutter", `${gap / 16}rem`);
  }, [gap]);

  // 위젯 상태
  const [open, setOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
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
  }, [open]);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-row min-h-screen">
          <main className="flex-1 min-h-screen bg-background">{children}</main>
          {/* 오른쪽 아래 고정 플로팅 버튼 */}
          <button
            className="fixed bottom-6 right-6 z-[1200] w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center text-3xl hover:bg-primary/90 transition"
            aria-label="디자인 설정 열기"
            onClick={() => setOpen((v) => !v)}
          >
            ⚙️
          </button>
          {/* 우측 아래 위젯 */}
          {open && (
            <div
              ref={widgetRef}
              className="fixed bottom-24 right-6 z-[1201] w-[320px] max-w-[90vw] bg-surface rounded-2xl shadow-2xl border border-border p-lg animate-widgetSlideIn"
              style={{ transition: "all 0.2s cubic-bezier(.4,2,.6,1)" }}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex justify-between items-center mb-md">
                <span className="font-heading text-base text-primary">디자인 퀵 설정</span>
                <button className="text-lg text-body hover:text-danger transition" aria-label="닫기" onClick={() => setOpen(false)}>
                  ×
                </button>
              </div>
              {/* 테마 선택 */}
              <div className="mb-md">
                <label className="block text-sm font-medium mb-xs">테마</label>
                <div className="flex gap-xs flex-wrap">
                  {themes.map((t) => (
                    <button
                      key={t.key}
                      className={`px-sm py-xs rounded border text-sm font-medium transition ${
                        theme === t.key ? "bg-primary text-white border-primary" : "bg-surface border-border hover:bg-primary/10"
                      }`}
                      onClick={() => setTheme(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* 폰트 선택 */}
              <div className="mb-md">
                <label className="block text-sm font-medium mb-xs">폰트</label>
                <div className="flex gap-xs flex-wrap">
                  {fonts.map((f) => (
                    <button
                      key={f.key}
                      className={`px-sm py-xs rounded border text-sm font-medium transition ${
                        font === f.key ? "bg-primary text-white border-primary" : "bg-surface border-border hover:bg-primary/10"
                      }`}
                      onClick={() => setFont(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* 라운드, 폰트크기, 스페이싱 */}
              <div className="mb-md flex gap-md">
                <div>
                  <label className="block text-sm font-medium mb-xs">라운드</label>
                  <input type="range" min={0} max={32} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-20" />
                  <span className="ml-xs text-xs">{radius}px</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-xs">폰트크기</label>
                  <input type="range" min={12} max={24} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-20" />
                  <span className="ml-xs text-xs">{fontSize}px</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-xs">기본 Spacing</label>
                <input
                  type="range"
                  min={2}
                  max={32}
                  value={spacing.md}
                  onChange={(e) => setSpacing({ ...spacing, md: Number(e.target.value) })}
                  className="w-32"
                />
                <span className="ml-xs text-xs">{spacing.md}px</span>
              </div>
              <div className="mt-md">
                <label className="block text-sm font-medium mb-xs">Grid Gap (갭)</label>
                <input type="range" min={0} max={64} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="w-32" />
                <span className="ml-xs text-xs">{gap}px</span>
              </div>
            </div>
          )}
        </div>
        <style>{`
          @keyframes animate-widgetSlideIn {
            from { opacity: 0; transform: translateY(40px) scale(0.98); }
            to { opacity: 1; transform: none; }
          }
        `}</style>
      </body>
    </html>
  );
}
