import React, { HTMLAttributes } from "react";
interface StackProps extends HTMLAttributes<HTMLDivElement> {
    gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    wrap?: boolean;
    children: React.ReactNode;
}
export declare const HStack: React.ForwardRefExoticComponent<StackProps & React.RefAttributes<HTMLDivElement>>;
export declare const VStack: React.ForwardRefExoticComponent<StackProps & React.RefAttributes<HTMLDivElement>>;
export declare const VSpace: React.ForwardRefExoticComponent<Omit<StackProps, "justify"> & React.RefAttributes<HTMLDivElement>>;
export declare const HSpace: React.ForwardRefExoticComponent<Omit<StackProps, "justify"> & React.RefAttributes<HTMLDivElement>>;
interface FlexProps extends StackProps {
    direction?: "row" | "col" | "row-reverse" | "col-reverse";
}
export declare const Flex: React.ForwardRefExoticComponent<FlexProps & React.RefAttributes<HTMLDivElement>>;
export {};
