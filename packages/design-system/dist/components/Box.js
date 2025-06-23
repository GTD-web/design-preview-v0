import React, { forwardRef } from "react";
export const Box = forwardRef(({ className = "", children, ...props }, ref) => {
    return (React.createElement("div", { ref: ref, className: className, ...props }, children));
});
const flexClasses = {
    "1": "flex-1",
    auto: "flex-auto",
    initial: "flex-initial",
    none: "flex-none",
};
const minWidthClasses = {
    "0": "min-w-0",
    auto: "min-w-auto",
};
const overflowClasses = {
    hidden: "overflow-hidden",
    visible: "overflow-visible",
    auto: "overflow-auto",
    scroll: "overflow-scroll",
};
const positionClasses = {
    relative: "relative",
    absolute: "absolute",
    fixed: "fixed",
    sticky: "sticky",
};
export const Flex = forwardRef(({ flex = "1", minWidth, overflow, position, className = "", children, ...props }, ref) => {
    const classes = [
        flexClasses[flex],
        minWidth && minWidthClasses[minWidth],
        overflow && overflowClasses[overflow],
        position && positionClasses[position],
        className,
    ]
        .filter(Boolean)
        .join(" ");
    return (React.createElement("div", { ref: ref, className: classes, ...props }, children));
});
const minHeightClasses = {
    screen: "min-h-screen",
    full: "min-h-full",
    auto: "min-h-auto",
};
const widthClasses = {
    full: "w-full",
    auto: "w-auto",
    "max-xs": "max-w-xs",
    "max-sm": "max-w-sm",
    "max-md": "max-w-md",
    "max-lg": "max-w-lg",
    "max-xl": "max-w-xl",
};
export const Container = forwardRef(({ minHeight, position, width, className = "", children, ...props }, ref) => {
    const classes = [minHeight && minHeightClasses[minHeight], position && positionClasses[position], width && widthClasses[width], className]
        .filter(Boolean)
        .join(" ");
    return (React.createElement("div", { ref: ref, className: classes, ...props }, children));
});
// 편의를 위한 별칭 컴포넌트들
export const Flex1 = forwardRef((props, ref) => React.createElement(Flex, { ref: ref, flex: "1", ...props }));
export const Flex1Relative = forwardRef((props, ref) => (React.createElement(Flex, { ref: ref, flex: "1", position: "relative", ...props })));
export const Flex1MinW0 = forwardRef((props, ref) => React.createElement(Flex, { ref: ref, flex: "1", minWidth: "0", ...props }));
export const Relative = forwardRef((props, ref) => React.createElement(Container, { ref: ref, position: "relative", ...props }));
const iconSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
};
export const Icon = forwardRef(({ size = "md", className = "", children, ...props }, ref) => {
    const classes = [iconSizeClasses[size], "flex items-center justify-center", className].filter(Boolean).join(" ");
    return (React.createElement("div", { ref: ref, className: classes, ...props }, children));
});
// 컴포넌트 이름 지정
Box.displayName = "Box";
Flex.displayName = "Flex";
Container.displayName = "Container";
Flex1.displayName = "Flex1";
Flex1Relative.displayName = "Flex1Relative";
Flex1MinW0.displayName = "Flex1MinW0";
Relative.displayName = "Relative";
Icon.displayName = "Icon";
