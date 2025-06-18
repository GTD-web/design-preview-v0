"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          if (currentScroll > lastScroll && currentScroll > 40) {
            setShowHeader(false); // 아래로 스크롤 시 숨김
          } else {
            setShowHeader(true); // 위로 스크롤 시 보임
          }
          setLastScroll(currentScroll);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      <div className="relative">
        <div
          style={{
            transition: "opacity 0.3s",
            opacity: showHeader ? 1 : 0,
            position: "fixed",
            top: 24, // p-6 = 24px
            left: 0,
            right: 0,
            zIndex: 50,
            width: "100%",
            pointerEvents: showHeader ? "auto" : "none",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", margin: "0 50px" }}>
            <DashboardHeader />
          </div>
        </div>
        {/* 헤더 높이만큼 패딩 */}
        <div style={{ paddingTop: 72 }}>{children}</div>
      </div>
    </div>
  );
}
