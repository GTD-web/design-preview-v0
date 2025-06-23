import React, { InputHTMLAttributes } from "react";
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    size?: "sm" | "md" | "lg";
    variant?: "default" | "filled" | "outlined";
    error?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    label?: string;
    helperText?: string;
    clearable?: boolean | "icon" | "button" | "text";
    clearText?: string;
    onClear?: () => void;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export {};
