import React from "react";

const colorMap: Record<string, string> = {
  warning: "bg-warning/10 text-warning",
  primary: "bg-primary/10 text-primary",
  gray: "bg-gray-100 text-gray-400",
};

export default function Badge({ children, color = "gray", className = "" }: { children: React.ReactNode; color?: keyof typeof colorMap; className?: string }) {
  return <span className={`text-xs rounded px-sm py-0.5 ml-xs font-normal ${colorMap[color] || colorMap.gray} ${className}`}>{children}</span>;
}
