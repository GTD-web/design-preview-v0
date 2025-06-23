import React, { forwardRef } from "react";
const gapClasses = {
    none: "",
    xs: "gap-xs",
    sm: "gap-sm",
    md: "gap-md",
    lg: "gap-lg",
    xl: "gap-xl",
    "2xl": "gap-2xl",
    "3xl": "gap-3xl",
};
const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
};
const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
};
export const HStack = forwardRef(({ gap = "md", align = "center", justify = "start", wrap = false, className = "", children, ...props }, ref) => {
    const classes = ["flex", "flex-row", gap !== "none" && gapClasses[gap], alignClasses[align], justifyClasses[justify], wrap && "flex-wrap", className]
        .filter(Boolean)
        .join(" ");
    return (React.createElement("div", { ref: ref, className: classes, ...props }, children));
});
export const VStack = forwardRef(({ gap = "md", align = "stretch", justify = "start", wrap = false, className = "", children, ...props }, ref) => {
    const classes = ["flex", "flex-col", gap !== "none" && gapClasses[gap], alignClasses[align], justifyClasses[justify], wrap && "flex-wrap", className]
        .filter(Boolean)
        .join(" ");
    return (React.createElement("div", { ref: ref, className: classes, ...props }, children));
});
// CSS 변수를 사용하는 동적 VStack (기존 VSpace 기능)
export const VSpace = forwardRef(({ gap = "lg", align = "stretch", wrap = false, className = "", children, ...props }, ref) => {
    // CSS 변수를 직접 사용하여 동적 간격 설정
    const getGapStyle = (gapSize) => {
        switch (gapSize) {
            case "none":
                return "0";
            case "xs":
                return "var(--spacing-xs, 0.25rem)";
            case "sm":
                return "var(--spacing-sm, 0.5rem)";
            case "md":
                return "var(--spacing-md, 1rem)";
            case "lg":
                return "var(--flex-gap, 1.5rem)"; // 갭 설정과 연동
            case "xl":
                return "var(--spacing-xl, 4rem)";
            case "2xl":
                return "8rem";
            case "3xl":
                return "16rem";
            default:
                return "var(--flex-gap, 1.5rem)";
        }
    };
    const style = {
        display: "flex",
        flexDirection: "column",
        gap: getGapStyle(gap),
        alignItems: align === "start" ? "flex-start" : align === "center" ? "center" : align === "end" ? "flex-end" : align === "baseline" ? "baseline" : "stretch",
        flexWrap: wrap ? "wrap" : "nowrap",
        ...props.style,
    };
    return (React.createElement("div", { ref: ref, className: className, style: style, ...props }, children));
});
// CSS 변수를 사용하는 동적 HStack (기존 HSpace 기능)
export const HSpace = forwardRef(({ gap = "md", align = "center", wrap = false, className = "", children, ...props }, ref) => {
    // CSS 변수를 직접 사용하여 동적 간격 설정
    const getGapStyle = (gapSize) => {
        switch (gapSize) {
            case "none":
                return "0";
            case "xs":
                return "var(--spacing-xs, 0.25rem)";
            case "sm":
                return "var(--spacing-sm, 0.5rem)";
            case "md":
                return "var(--spacing-md, 1rem)";
            case "lg":
                return "var(--flex-gap, 1.5rem)"; // 갭 설정과 연동
            case "xl":
                return "var(--spacing-xl, 4rem)";
            case "2xl":
                return "8rem";
            case "3xl":
                return "16rem";
            default:
                return "var(--flex-gap, 1.5rem)";
        }
    };
    const style = {
        display: "flex",
        flexDirection: "row",
        gap: getGapStyle(gap),
        alignItems: align === "start" ? "flex-start" : align === "center" ? "center" : align === "end" ? "flex-end" : align === "baseline" ? "baseline" : "stretch",
        flexWrap: wrap ? "wrap" : "nowrap",
        ...props.style,
    };
    return (React.createElement("div", { ref: ref, className: className, style: style, ...props }, children));
});
export const Flex = forwardRef(({ direction = "row", gap = "md", align = "stretch", justify = "start", wrap = false, className = "", children, ...props }, ref) => {
    const classes = [
        "flex",
        `flex-${direction}`,
        gap !== "none" && gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        wrap && "flex-wrap",
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (React.createElement("div", { ref: ref, className: classes, ...props }, children));
});
// 컴포넌트 이름 지정
HStack.displayName = "HStack";
VStack.displayName = "VStack";
VSpace.displayName = "VSpace";
HSpace.displayName = "HSpace";
Flex.displayName = "Flex";
