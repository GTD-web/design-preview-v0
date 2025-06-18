import * as React from "react";
import { ButtonHTMLAttributes, ReactNode } from "react";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    children?: ReactNode;
}
export declare function Button({ variant, children, ...props }: ButtonProps): React.JSX.Element;
