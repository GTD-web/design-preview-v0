import React, { HTMLAttributes } from "react";
interface TextProps extends HTMLAttributes<HTMLSpanElement> {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    weight?: "thin" | "extralight" | "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold" | "black";
    color?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "muted" | "default" | "black";
    variant?: "span" | "p" | "div";
    children: React.ReactNode;
}
export declare const Text: React.ForwardRefExoticComponent<TextProps & React.RefAttributes<HTMLSpanElement>>;
export declare const TextSpan: React.ForwardRefExoticComponent<Omit<TextProps, "variant"> & React.RefAttributes<HTMLSpanElement>>;
export declare const TextP: React.ForwardRefExoticComponent<Omit<TextProps, "variant"> & React.RefAttributes<HTMLParagraphElement>>;
export declare const TextDiv: React.ForwardRefExoticComponent<Omit<TextProps, "variant"> & React.RefAttributes<HTMLDivElement>>;
export declare const TextHeading: React.ForwardRefExoticComponent<Omit<TextProps, "variant"> & React.RefAttributes<HTMLDivElement>>;
export declare const TextValue: React.ForwardRefExoticComponent<Omit<TextProps, "variant"> & React.RefAttributes<HTMLSpanElement>>;
export declare const TextLabel: React.ForwardRefExoticComponent<Omit<TextProps, "variant"> & React.RefAttributes<HTMLSpanElement>>;
export {};
