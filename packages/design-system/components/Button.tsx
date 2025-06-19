import * as React from "react";
import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "toggle";
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  children?: ReactNode;
}

export function Button({ variant = "primary", size = "md", selected = false, children, className = "", ...props }: ButtonProps) {
  const baseClasses = "font-medium transition-all duration-200 rounded border";

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const variantClasses = {
    primary: "bg-primary text-white border-primary hover:bg-primary/90 hover:border-primary/90",
    secondary: "bg-secondary text-white border-secondary hover:bg-secondary/90 hover:border-secondary/90",
    outline: "bg-transparent text-primary border-primary hover:bg-primary/10",
    ghost: "bg-transparent text-body border-transparent hover:bg-surface hover:border-border",
    toggle: selected
      ? "bg-primary text-white border-primary hover:bg-primary/90"
      : "bg-surface text-body border-border hover:bg-primary/10 hover:border-primary/30",
  };

  const classes = [baseClasses, sizeClasses[size], variantClasses[variant], className].filter(Boolean).join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
