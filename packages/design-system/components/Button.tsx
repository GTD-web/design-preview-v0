import * as React from "react";
import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "toggle";
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  gradient?: boolean;
  gradientType?:
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "blue"
    | "purple"
    | "pink"
    | "green"
    | "orange"
    | "red"
    | "teal"
    | "cyan"
    | "indigo"
    | "violet"
    | "fuchsia"
    | "rose"
    | "slate"
    | "gray"
    | "zinc"
    | "neutral"
    | "stone"
    | "lime"
    | "emerald"
    | "amber"
    | "yellow"
    | "sunset"
    | "ocean"
    | "forest"
    | "fire"
    | "aurora"
    | "cosmic"
    | "midnight"
    | "dawn"
    | "dusk"
    | "spring"
    | "summer"
    | "autumn"
    | "winter";
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  selected = false,
  gradient = false,
  gradientType = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "font-medium transition-all duration-200 rounded border";

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const getVariantClasses = () => {
    if (gradient) {
      const gradientMap: Record<string, string> = {
        primary: "bg-gradient-to-r from-blue-500 to-blue-700",
        secondary: "bg-gradient-to-r from-gray-500 to-gray-700",
        accent: "bg-gradient-to-r from-cyan-400 to-cyan-600",
        success: "bg-gradient-to-r from-green-500 to-green-700",
        warning: "bg-gradient-to-r from-yellow-400 to-yellow-600",
        danger: "bg-gradient-to-r from-red-500 to-red-700",
        info: "bg-gradient-to-r from-sky-400 to-sky-600",
        blue: "bg-gradient-to-r from-blue-500 to-blue-700",
        purple: "bg-gradient-to-r from-purple-500 to-purple-700",
        pink: "bg-gradient-to-r from-pink-500 to-pink-700",
        green: "bg-gradient-to-r from-green-500 to-green-700",
        orange: "bg-gradient-to-r from-orange-400 to-orange-600",
        red: "bg-gradient-to-r from-red-500 to-red-700",
        teal: "bg-gradient-to-r from-teal-400 to-teal-600",
        cyan: "bg-gradient-to-r from-cyan-400 to-cyan-600",
        indigo: "bg-gradient-to-r from-indigo-500 to-indigo-700",
        violet: "bg-gradient-to-r from-violet-500 to-violet-700",
        fuchsia: "bg-gradient-to-r from-fuchsia-500 to-fuchsia-700",
        rose: "bg-gradient-to-r from-rose-500 to-rose-700",
        sunset: "bg-gradient-to-r from-orange-400 to-pink-500",
        ocean: "bg-gradient-to-r from-sky-400 to-blue-500",
        forest: "bg-gradient-to-r from-green-500 to-emerald-500",
        fire: "bg-gradient-to-r from-red-500 to-orange-500",
        aurora: "bg-gradient-to-r from-purple-400 to-cyan-400",
        cosmic: "bg-gradient-to-r from-indigo-500 to-pink-500",
        spring: "bg-gradient-to-r from-green-400 to-emerald-400",
        summer: "bg-gradient-to-r from-yellow-400 to-orange-400",
        autumn: "bg-gradient-to-r from-orange-400 to-red-400",
        winter: "bg-gradient-to-r from-blue-400 to-cyan-400",
      };
      const gradientClass = gradientMap[gradientType] || gradientMap.primary;
      return `${gradientClass} text-white border-transparent hover:opacity-90 hover:shadow-lg`;
    }

    return {
      primary: "bg-primary text-white border-primary hover:bg-primary/90 hover:border-primary/90",
      secondary: "bg-secondary text-white border-secondary hover:bg-secondary/90 hover:border-secondary/90",
      outline: "bg-transparent text-primary border-primary hover:bg-primary/10",
      ghost: "bg-transparent text-body border-transparent hover:bg-surface hover:border-border",
      toggle: selected
        ? "bg-primary text-white border-primary hover:bg-primary/90"
        : "bg-surface text-body border-border hover:bg-primary/10 hover:border-primary/30",
    }[variant];
  };

  const classes = [baseClasses, sizeClasses[size], getVariantClasses(), className].filter(Boolean).join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
