import React from "react";
declare const colorMap: Record<string, string>;
export default function Badge({ children, color, className, size, }: {
    children: React.ReactNode;
    color?: keyof typeof colorMap;
    className?: string;
    size?: "sm" | "md" | "lg";
}): React.JSX.Element;
export {};
