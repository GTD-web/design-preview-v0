import React, { useState } from "react";
import { Card } from "@/packages/design-system/components/Card";
import { useRouter, useSearchParams } from "next/navigation";

const THEMES = [
  { label: "라이트", value: "" },
  { label: "다크", value: "theme-dark" },
  { label: "Dracula", value: "theme-dracula" },
  { label: "Pastel", value: "theme-pastel" },
  { label: "CI", value: "theme-ci" },
];

export default function DashboardHeader() {
  const [theme, setTheme] = useState("");
  const [isCustomNameDialogOpen, setIsCustomNameDialogOpen] = useState(false);
  const [customTabName, setCustomTabName] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setTheme(next);
    // 모든 테마 클래스 제거 후 새 테마 적용
    document.body.classList.remove(
      "theme-dark",
      "theme-dracula",
      "theme-pastel",
      "theme-ci"
    );
    if (next) document.body.classList.add(next);
  };

  const handleCustomTabName = () => {
    if (customTabName.trim()) {
      // 현재 URL의 쿼리 파라미터 가져오기
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("tab-name", customTabName.trim());

      // 새 URL로 이동
      const newUrl = `/design-example/dashboard?${currentParams.toString()}`;
      router.push(newUrl);

      setIsCustomNameDialogOpen(false);
      setCustomTabName("");
    }
  };

  return (
    <Card
      className="w-full h-14 flex items-center justify-between"
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      <header
        className="w-full flex items-center justify-between"
        id="dashboard-header"
      >
        <div className="flex items-center gap-md">
          <span className="text-xl font-bold text-heading">
            사내 포털 대시보드
          </span>
          <button
            onClick={() => setIsCustomNameDialogOpen(true)}
            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            title="탭 이름 설정"
          >
            탭 이름 설정
          </button>
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
          <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center border border-border text-gray-700 text-sm font-medium">
            U
          </div>
        </div>
      </header>

      {/* 탭 이름 설정 다이얼로그 */}
      {isCustomNameDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold mb-4">탭 이름 설정</h3>
            <div className="mb-4">
              <label
                htmlFor="custom-tab-name"
                className="block text-sm font-medium mb-2"
              >
                새로운 탭 이름을 입력하세요:
              </label>
              <input
                id="custom-tab-name"
                type="text"
                value={customTabName}
                onChange={(e) => setCustomTabName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="예: 월간 대시보드"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCustomTabName();
                  } else if (e.key === "Escape") {
                    setIsCustomNameDialogOpen(false);
                    setCustomTabName("");
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsCustomNameDialogOpen(false);
                  setCustomTabName("");
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCustomTabName}
                disabled={!customTabName.trim()}
                className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
