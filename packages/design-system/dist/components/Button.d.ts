import * as React from "react";
import { ButtonHTMLAttributes, ReactNode } from "react";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "toggle" | "nav";
    size?: "sm" | "md" | "lg";
    selected?: boolean;
    gradient?: boolean;
    gradientType?: "primary" | "secondary" | "accent" | "success" | "warning" | "danger" | "info" | "blue" | "purple" | "pink" | "green" | "orange" | "red" | "teal" | "cyan" | "indigo" | "violet" | "fuchsia" | "rose" | "slate" | "gray" | "zinc" | "neutral" | "stone" | "lime" | "emerald" | "amber" | "yellow" | "sunset" | "ocean" | "forest" | "fire" | "aurora" | "cosmic" | "midnight" | "dawn" | "dusk" | "spring" | "summer" | "autumn" | "winter";
    children?: ReactNode;
}
export declare function Button({ variant, size, selected, gradient, gradientType, children, className, style, ...props }: ButtonProps): React.JSX.Element;
