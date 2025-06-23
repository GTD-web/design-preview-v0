"use client";
import React from "react";
const sizeMap = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
};
const weightMap = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
};
export default function TextHeading({ children, className = "", size = "base", weight = "semibold", }) {
    return (React.createElement("div", { className: `
        font-heading
        ${sizeMap[size] || sizeMap.base}
        ${weightMap[weight] || weightMap.semibold}
        text-foreground
        ${className}
      ` }, children));
}
