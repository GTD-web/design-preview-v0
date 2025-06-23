import React, { HTMLAttributes } from "react";
interface GridProps extends HTMLAttributes<HTMLDivElement> {
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "layout";
    children: React.ReactNode;
}
export declare const Grid: React.ForwardRefExoticComponent<GridProps & React.RefAttributes<HTMLDivElement>>;
interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    children: React.ReactNode;
}
export declare const GridItem: React.ForwardRefExoticComponent<GridItemProps & React.RefAttributes<HTMLDivElement>>;
export {};
