import React from "react";
const colorMap = {
    warning: "bg-warning/20 text-warning",
    primary: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    danger: "bg-danger/20 text-danger",
    info: "bg-info/20 text-info",
    gray: "bg-gray-100 text-gray-700",
};
export default function Badge({ children, color = "gray", className = "", size = "md", }) {
    const sizeClasses = {
        sm: "text-xs px-2.5 py-1",
        md: "text-xs px-3 py-1.5",
        lg: "text-sm px-4 py-2",
    };
    const getBorderStyle = () => {
        switch (color) {
            case "warning":
                return { borderColor: "var(--color-warning)" };
            case "primary":
                return { borderColor: "var(--color-primary)" };
            case "success":
                return { borderColor: "var(--color-success)" };
            case "danger":
                return { borderColor: "var(--color-danger)" };
            case "info":
                return { borderColor: "var(--color-info)" };
            case "gray":
            default:
                return { borderColor: "var(--color-border)" };
        }
    };
    return (React.createElement("span", { className: `
        inline-flex items-center justify-center
        font-medium tracking-wide
        border rounded-full
        shadow-sm
        transition-all duration-200
        hover:shadow-md
        ${colorMap[color] || colorMap.gray}
        ${sizeClasses[size]}
        ${className}
      `, style: getBorderStyle() }, children));
}
