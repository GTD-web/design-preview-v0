import React from "react";
declare const colorMap: Record<string, string>;
export default function Badge({ children, color, className }: {
    children: React.ReactNode;
    color?: keyof typeof colorMap;
    className?: string;
}): React.JSX.Element;
export {};
