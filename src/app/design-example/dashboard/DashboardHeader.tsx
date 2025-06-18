import React from "react";

export default function DashboardHeader() {
  return (
    <header
      className="w-full h-14 flex items-center justify-between px-8 bg-white border border-border/60 rounded-2xl mb-8 transition-opacity duration-300"
      id="dashboard-header"
    >
      <div className="flex items-center gap-md">
        <span className="text-xl font-bold text-heading">사내 포털 대시보드</span>
      </div>
      <div className="flex items-center gap-md">
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
  );
}
