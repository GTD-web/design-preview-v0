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

export default function TextValue({
  children,
  className = "",
  size = "sm",
  weight = "medium",
}: {
  children: React.ReactNode;
  className?: string;
  size?: keyof typeof sizeMap;
  weight?: keyof typeof weightMap;
}) {
  return (
    <span
      className={`
        ${sizeMap[size] || sizeMap.sm}
        ${weightMap[weight] || weightMap.medium}
        text-[var(--foreground)]
        ${className}
      `}
    >
      {children}
    </span>
  );
}
