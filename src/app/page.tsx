"use client";
import { useEffect, useState } from "react";

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
const paletteSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

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

function DesignTokensPreview({ theme }: { theme?: string }) {
  const fonts = [
    { key: "noto", label: "Noto Sans KR", className: "font-noto" },
    { key: "pretendard", label: "Pretendard", className: "font-pretendard" },
    { key: "system", label: "System Sans", className: "font-system" },
  ];

  const spacings = [
    { name: "xs", size: "xs" },
    { name: "sm", size: "sm" },
    { name: "md", size: "md" },
    { name: "lg", size: "lg" },
    { name: "xl", size: "xl" },
  ];

  const radii = [
    { name: "sm", className: "rounded-sm" },
    { name: "md", className: "rounded-md" },
    { name: "lg", className: "rounded-lg" },
    { name: "xl", className: "rounded-xl" },
    { name: "full", className: "rounded-full" },
  ];

  const shadows = [
    { name: "sm", className: "shadow-sm" },
    { name: "md", className: "shadow-md" },
    { name: "lg", className: "shadow-lg" },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6 text-foreground">디자인 시스템 컬러 프리뷰</h2>
      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-2 text-foreground">Single Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
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
      <div className="mb-12">
        <h3 className="text-lg font-semibold mb-2">Palette Colors</h3>
        {paletteColors.map((name) => (
          <PalettePreview key={name} name={name} />
        ))}
      </div>
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">Font Family</h3>
        <div className="flex gap-6">
          {fonts.map((font) => (
            <div key={font.key} className="flex flex-col items-center">
              <span className={`text-lg ${font.className}`}>{font.label}</span>
              <span className="text-xs text-gray-500">.{font.className}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">Spacing</h3>
        <div className="flex gap-4 items-end">
          {spacings.map((sp) => (
            <div key={sp.name} className="flex flex-col items-center">
              <div className={`bg-primary/30 w-8`} style={{ height: `var(--spacing-${sp.size}, 1rem)` }} />
              <span className="text-xs mt-1">{sp.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">Border Radius</h3>
        <div className="flex gap-4">
          {radii.map((r) => (
            <div key={r.name} className={`w-12 h-12 bg-primary/30 border border-primary ${r.className} flex items-center justify-center`}>
              <span className="text-xs text-primary font-mono">{r.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-10">
        <h3 className="text-lg font-semibold mb-2">Box Shadow</h3>
        <div className="flex gap-4">
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

export default function Home() {
  // 글꼴 선택 관련
  const fonts = [
    { key: "noto", label: "Noto Sans KR", className: "font-noto" },
    { key: "pretendard", label: "Pretendard", className: "font-pretendard" },
    { key: "system", label: "System Sans", className: "font-system" },
  ];
  const [font, setFont] = useState("noto");
  useEffect(() => {
    document.body.classList.remove("font-noto", "font-pretendard", "font-system");
    document.body.classList.add(fonts.find((f) => f.key === font)?.className || "font-noto");
  }, [font]);

  // 테마 선택 관련
  const themes = [
    { key: "light", label: "라이트", className: "" },
    { key: "dark", label: "다크", className: "theme-dark" },
    { key: "dracula", label: "드라큘라", className: "theme-dracula" },
    { key: "pastel", label: "파스텔", className: "theme-pastel" },
    { key: "ci", label: "CI 테마", className: "theme-ci" },
  ];
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-dracula", "theme-pastel", "theme-ci");
    if (theme !== "light") {
      document.body.classList.add(themes.find((t) => t.key === theme)?.className || "");
    }
  }, [theme]);

  // 세밀한 보더 라운드 조절
  const [radius, setRadius] = useState(8);
  useEffect(() => {
    document.body.style.setProperty("--radius", `${radius}px`);
  }, [radius]);

  // 세밀한 글꼴 사이즈 조절
  const [fontSize, setFontSize] = useState(16);
  useEffect(() => {
    document.body.style.setProperty("--font-size-base", `${fontSize}px`);
  }, [fontSize]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="fixed top-0 right-0 h-full w-64 bg-white/80 dark:bg-background/80 shadow-lg z-50 p-6 flex flex-col gap-6">
        {/* 테마 선택 */}
        <div>
          <div className="font-bold mb-2 text-foreground">테마</div>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme(t.key)}
                className={`px-3 py-1 rounded border ${theme === t.key ? "bg-primary text-white" : "bg-surface text-foreground"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {/* 글꼴 선택 */}
        <div>
          <div className="font-bold mb-2 text-foreground">글꼴</div>
          <div className="flex flex-wrap gap-2">
            {fonts.map((f) => (
              <button
                key={f.key}
                onClick={() => setFont(f.key)}
                className={`px-3 py-1 rounded border ${font === f.key ? "bg-primary text-white" : "bg-surface text-foreground"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {/* 보더 라운드 조절 */}
        <div>
          <div className="font-bold mb-2 text-foreground">모서리 둥글기</div>
          <div className="flex items-center gap-2">
            <label htmlFor="radius-range" className="text-xs text-foreground">
              {radius}px
            </label>
            <input id="radius-range" type="range" min={0} max={64} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-32" />
            <input
              type="number"
              min={0}
              max={64}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-14 border rounded px-1 text-xs"
            />
          </div>
        </div>
        {/* 글꼴 크기 조절 */}
        <div>
          <div className="font-bold mb-2 text-foreground">글꼴 크기</div>
          <div className="flex items-center gap-2">
            <label htmlFor="font-size-range" className="text-xs text-foreground">
              {fontSize}px
            </label>
            <input
              id="font-size-range"
              type="range"
              min={12}
              max={32}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-32"
            />
            <input
              type="number"
              min={12}
              max={32}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-14 border rounded px-1 text-xs"
            />
          </div>
        </div>
      </div>
      <DesignTokensPreview theme={theme} />
    </div>
  );
}
