import React, { HTMLAttributes } from "react";
interface BoxProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}
export declare const Box: React.ForwardRefExoticComponent<BoxProps & React.RefAttributes<HTMLDivElement>>;
interface FlexProps extends HTMLAttributes<HTMLDivElement> {
    flex?: "1" | "auto" | "initial" | "none";
    minWidth?: "0" | "auto";
    overflow?: "hidden" | "visible" | "auto" | "scroll";
    position?: "relative" | "absolute" | "fixed" | "sticky";
    children: React.ReactNode;
}
export declare const Flex: React.ForwardRefExoticComponent<FlexProps & React.RefAttributes<HTMLDivElement>>;
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    minHeight?: "screen" | "full" | "auto";
    position?: "relative" | "absolute" | "fixed" | "sticky";
    width?: "full" | "auto" | "max-xs" | "max-sm" | "max-md" | "max-lg" | "max-xl";
    children: React.ReactNode;
}
export declare const Container: React.ForwardRefExoticComponent<ContainerProps & React.RefAttributes<HTMLDivElement>>;
export declare const Flex1: React.ForwardRefExoticComponent<Omit<FlexProps, "flex"> & React.RefAttributes<HTMLDivElement>>;
export declare const Flex1Relative: React.ForwardRefExoticComponent<Omit<FlexProps, "flex" | "position"> & React.RefAttributes<HTMLDivElement>>;
export declare const Flex1MinW0: React.ForwardRefExoticComponent<Omit<FlexProps, "flex" | "minWidth"> & React.RefAttributes<HTMLDivElement>>;
export declare const Relative: React.ForwardRefExoticComponent<Omit<ContainerProps, "position"> & React.RefAttributes<HTMLDivElement>>;
interface IconProps extends HTMLAttributes<HTMLDivElement> {
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    children: React.ReactNode;
}
export declare const Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<HTMLDivElement>>;
export {};
