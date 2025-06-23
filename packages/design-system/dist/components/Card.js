import React from "react";
export function Card({ children, className = "", ...props }) {
    return (React.createElement("div", { className: `bg-[var(--color-surface)] border border-border rounded-md p-lg ${className}`.trim(), ...props }, children));
}
