import React from "react";

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
  return (
    <div
      className={`
        font-heading
        ${sizeMap[size] || sizeMap.base}
        ${weightMap[weight] || weightMap.semibold}
        text-[var(--foreground)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
