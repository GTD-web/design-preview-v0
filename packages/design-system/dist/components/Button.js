import * as React from "react";
export function Button({ variant = "primary", children, ...props }) {
    return (React.createElement("button", { className: `px-4 py-2 rounded font-semibold transition-colors
        ${variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
      `, ...props }, children));
}
