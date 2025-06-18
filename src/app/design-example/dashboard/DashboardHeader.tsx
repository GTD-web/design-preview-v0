import React, { useState } from "react";
import { Card } from "@/packages/design-system/components/Card";

const THEMES = [
  { label: "라이트", value: "" },
  { label: "다크", value: "theme-dark" },
  { label: "Dracula", value: "theme-dracula" },
  { label: "Pastel", value: "theme-pastel" },
  { label: "CI", value: "theme-ci" },
];

export default function DashboardHeader() {
  const [theme, setTheme] = useState("");

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setTheme(next);
    // 모든 테마 클래스 제거 후 새 테마 적용
    document.body.classList.remove("theme-dark", "theme-dracula", "theme-pastel", "theme-ci");
    if (next) document.body.classList.add(next);
  };

  return (
    <Card className="w-full h-14 flex items-center justify-between mb-8" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <header className="w-full flex items-center justify-between" id="dashboard-header">
        <div className="flex items-center gap-md">
          <span className="text-xl font-bold text-heading">사내 포털 대시보드</span>
        </div>
        <div className="flex items-center gap-md">
          <select
            className="border border-border rounded px-4 py-1 text-sm bg-[var(--color-surface)] text-[var(--foreground)] focus:outline-none"
            value={theme}
            onChange={handleThemeChange}
            aria-label="테마 변경"
          >
            {THEMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button className="relative text-gray-400 hover:text-primary transition">
            <span className="sr-only">알림</span>
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path
                d="M10 18a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm6-4V9a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
          </button>
          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center border border-border text-gray-700 text-sm font-medium">U</div>
        </div>
      </header>
    </Card>
  );
}
