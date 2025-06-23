import * as React from "react";
import { ButtonHTMLAttributes } from "react";
export interface SelectOption {
    value: string;
    label: string;
}
export interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "value" | "onChange"> {
    selectSize?: "sm" | "md" | "lg";
    variant?: "default" | "outline";
    options: SelectOption[];
    value?: string;
    onChange?: (value: string) => void;
    label?: string;
    error?: string;
    helperText?: string;
    width?: string | number;
}
export declare function Select({ selectSize, variant, options, value, onChange, className, label, error, helperText, width, ...props }: SelectProps): React.JSX.Element;
