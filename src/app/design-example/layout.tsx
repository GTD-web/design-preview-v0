"use client";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import React, { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";

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

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-row min-h-screen">
          <Sidebar
            font={font}
            setFont={setFont}
            fonts={fonts}
            theme={theme}
            setTheme={setTheme}
            themes={themes}
            radius={radius}
            setRadius={setRadius}
            fontSize={fontSize}
            setFontSize={setFontSize}
            spacing={spacing}
            setSpacing={setSpacing}
          />
          <main className="flex-1 min-h-screen flex items-center justify-center bg-background" style={{ marginLeft: 0 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
