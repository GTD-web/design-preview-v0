import React, { forwardRef } from "react";
const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
};
const weightClasses = {
    thin: "font-thin",
    extralight: "font-extralight",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
};
const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    info: "text-info",
    muted: "text-gray-500",
    default: "text-foreground",
    black: "text-neutral-900 dark:text-neutral-900",
};
export const Text = forwardRef(({ size = "md", weight = "normal", color = "default", variant = "span", className = "", children, ...props }, ref) => {
    const classes = [sizeClasses[size], weightClasses[weight], colorClasses[color], className].filter(Boolean).join(" ");
    if (variant === "p") {
        return (React.createElement("p", { ref: ref, className: classes, ...props }, children));
    }
    if (variant === "div") {
        return (React.createElement("div", { ref: ref, className: classes, ...props }, children));
    }
    return (React.createElement("span", { ref: ref, className: classes, ...props }, children));
});
// 편의를 위한 별칭 컴포넌트들
export const TextSpan = forwardRef((props, ref) => React.createElement(Text, { ref: ref, variant: "span", ...props }));
export const TextP = forwardRef((props, ref) => React.createElement(Text, { ref: ref, variant: "p", ...props }));
export const TextDiv = forwardRef((props, ref) => React.createElement(Text, { ref: ref, variant: "div", ...props }));
// 특정 용도별 컴포넌트들
export const TextHeading = forwardRef(({ size = "lg", weight = "semibold", className = "", ...props }, ref) => (React.createElement(TextDiv, { ref: ref, size: size, weight: weight, className: `font-heading ${className}`, ...props })));
export const TextValue = forwardRef(({ size = "sm", weight = "medium", color, ...props }, ref) => (React.createElement(TextSpan, { ref: ref, size: size, weight: weight, color: color, ...props })));
export const TextLabel = forwardRef(({ size = "xs", weight = "normal", color = "default", ...props }, ref) => (React.createElement(TextSpan, { ref: ref, size: size, weight: weight, color: color, ...props })));
// 컴포넌트 이름 지정
Text.displayName = "Text";
TextSpan.displayName = "TextSpan";
TextP.displayName = "TextP";
TextDiv.displayName = "TextDiv";
TextHeading.displayName = "TextHeading";
TextValue.displayName = "TextValue";
TextLabel.displayName = "TextLabel";
