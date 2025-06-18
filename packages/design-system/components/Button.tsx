import * as React from "react";
import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children?: ReactNode;
}

export function Button({ variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded font-semibold transition-colors
        ${variant === "primary" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
