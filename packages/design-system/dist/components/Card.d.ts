import React from "react";
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}
export declare function Card({ children, className, ...props }: CardProps): React.JSX.Element;
export {};
