"use client";
import { useEffect, useState } from "react";
import { DesignTokensPreview } from "./components/DesignTokensPreview";

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

  // 세밀한 스페이싱 조절
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <DesignTokensPreview theme={theme} />
    </div>
  );
}
