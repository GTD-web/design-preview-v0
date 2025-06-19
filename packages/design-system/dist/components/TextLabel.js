import React from "react";
export default function TextLabel({ children, className = "" }) {
    return React.createElement("span", { className: `text-xs font-normal text-[var(--foreground)] ${className}` }, children);
}
