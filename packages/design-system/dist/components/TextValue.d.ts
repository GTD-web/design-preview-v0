import React from "react";
declare const sizeMap: Record<string, string>;
declare const weightMap: Record<string, string>;
export default function TextValue({ children, className, size, weight, }: {
    children: React.ReactNode;
    className?: string;
    size?: keyof typeof sizeMap;
    weight?: keyof typeof weightMap;
}): React.JSX.Element;
export {};
