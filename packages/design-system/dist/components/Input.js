import React, { forwardRef } from "react";
const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-4 py-3 text-base",
};
const variantClasses = {
    default: "border border-border bg-surface focus:border-primary",
    filled: "border-0 bg-gray-100 focus:bg-white",
    outlined: "border-2 border-border bg-transparent focus:border-primary",
};
export const Input = forwardRef(({ size = "md", variant = "default", error = false, leftIcon, rightIcon, label, helperText, clearable = false, clearText = "지우기", onClear, className = "", value, ...props }, ref) => {
    const hasValue = value && String(value).length > 0;
    const showClearButton = clearable && hasValue;
    const clearType = typeof clearable === "string" ? clearable : "icon";
    // 아이콘이 있을 때 padding 조정
    const getInputPadding = () => {
        if (leftIcon && (rightIcon || showClearButton)) {
            return "pl-10 pr-10 py-2 text-sm"; // 양쪽 아이콘
        }
        else if (leftIcon) {
            return "pl-10 pr-4 py-2 text-sm"; // 왼쪽 아이콘만
        }
        else if (rightIcon || showClearButton) {
            return "pl-4 pr-10 py-2 text-sm"; // 오른쪽 아이콘만
        }
        else {
            return sizeClasses[size]; // 아이콘 없음
        }
    };
    const inputClasses = [
        "w-full rounded-lg transition-all duration-200 focus:outline-none",
        getInputPadding(),
        variantClasses[variant],
        error && "border-danger focus:border-danger",
    ]
        .filter(Boolean)
        .join(" ");
    const handleClear = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClear) {
            onClear();
        }
    };
    // 지우기 버튼 렌더링
    const renderClearButton = () => {
        if (!showClearButton)
            return null;
        switch (clearType) {
            case "icon":
                return (React.createElement("button", { type: "button", onClick: handleClear, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer z-10", "aria-label": "\uC9C0\uC6B0\uAE30" },
                    React.createElement("svg", { className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))));
            case "button":
                return (React.createElement("button", { type: "button", onClick: handleClear, className: "absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors cursor-pointer z-10", "aria-label": "\uC9C0\uC6B0\uAE30" }, clearText));
            case "text":
                return (React.createElement("button", { type: "button", onClick: handleClear, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer z-10 text-sm underline", "aria-label": "\uC9C0\uC6B0\uAE30" }, clearText));
            default:
                return null;
        }
    };
    const InputElement = (React.createElement("div", { className: `relative ${className}` },
        leftIcon && React.createElement("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" }, leftIcon),
        React.createElement("input", { ref: ref, className: inputClasses, value: value, ...props }),
        renderClearButton(),
        rightIcon && !showClearButton && React.createElement("div", { className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" }, rightIcon)));
    if (label || helperText) {
        return (React.createElement("div", { className: "w-full" },
            label && React.createElement("label", { className: "block text-sm font-medium mb-1 text-foreground" }, label),
            InputElement,
            helperText && React.createElement("p", { className: `mt-1 text-xs ${error ? "text-danger" : "text-gray-500"}` }, helperText)));
    }
    return InputElement;
});
// 컴포넌트 이름 지정
Input.displayName = "Input";
