import React from "react";

const colorMap: Record<string, string> = {
  warning: "bg-warning/20 text-warning border-warning/30",
  primary: "bg-primary/20 text-primary border-primary/30",
  success: "bg-success/20 text-success border-success/30",
  danger: "bg-danger/20 text-danger border-danger/30",
  info: "bg-info/20 text-info border-info/30",
  gray: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function Badge({
  children,
  color = "gray",
  className = "",
  size = "md",
}: {
  children: React.ReactNode;
  color?: keyof typeof colorMap;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium tracking-wide
        border rounded-full
        shadow-sm
        transition-all duration-200
        hover:shadow-md
        ${colorMap[color] || colorMap.gray}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
