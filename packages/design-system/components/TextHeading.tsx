import React, { useEffect, useState } from "react";

const sizeMap: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};
const weightMap: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export default function TextHeading({
  children,
  className = "",
  size = "base",
  weight = "semibold",
}: {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizeMap;
  weight?: keyof typeof weightMap;
}) {
  const [mounted, setMounted] = useState(false);
  const [dynamicFontSize, setDynamicFontSize] = useState<string>("");

  // 클라이언트 사이드에서만 마운트
  useEffect(() => {
    setMounted(true);
  }, []);

  // 동적 폰트 크기 계산
  useEffect(() => {
    if (!mounted) return;

    const updateFontSize = () => {
      // document.body에서 CSS 변수를 읽도록 수정
      const baseSize = parseInt(getComputedStyle(document.body).getPropertyValue("--font-size-base") || "16");
      const sizeMultipliers: Record<string, number> = {
        xs: 0.75,
        sm: 0.875,
        base: 1,
        lg: 1.125,
        xl: 1.25,
        "2xl": 1.5,
      };
      const multiplier = sizeMultipliers[size] || 1;
      setDynamicFontSize(`${baseSize * multiplier}px`);
    };

    updateFontSize();

    // CSS 변수 변경 감지를 위한 MutationObserver
    const observer = new MutationObserver(updateFontSize);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, [mounted, size]);

  return (
    <div
      className={`
        font-heading
        ${weightMap[weight] || weightMap.semibold}
        text-[var(--foreground)]
        ${className}
      `}
      style={{
        fontSize: mounted ? dynamicFontSize : undefined,
        lineHeight: size === "2xl" ? "2rem" : size === "xl" ? "1.75rem" : "1.5rem",
      }}
    >
      {children}
    </div>
  );
}
