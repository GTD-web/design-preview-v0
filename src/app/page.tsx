"use client";
import { useEffect, useState } from "react";
import { DesignTokensPreview } from "@/components/DesignTokensPreview";

const themes = [
  { key: "light", label: "라이트", className: "" },
  { key: "dark", label: "다크", className: "theme-dark" },
  { key: "dracula", label: "드라큘라", className: "theme-dracula" },
  { key: "pastel", label: "파스텔", className: "theme-pastel" },
  { key: "ci", label: "CI 테마", className: "theme-ci" },
];

export default function Home() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.body.classList.remove(
      "theme-dark",
      "theme-dracula",
      "theme-pastel",
      "theme-ci"
    );
    if (theme !== "light") {
      document.body.classList.add(
        themes.find((t) => t.key === theme)?.className || ""
      );
    }
  }, [theme]);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 min-h-screen bg-background flex items-center">
        <div className="w-full">
          <DesignTokensPreview />
        </div>
      </main>
    </div>
  );
}
