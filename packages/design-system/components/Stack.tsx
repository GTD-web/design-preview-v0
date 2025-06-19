import React, { HTMLAttributes, forwardRef } from "react";

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  children: React.ReactNode;
}

const gapClasses = {
  none: "",
  xs: "gap-xs",
  sm: "gap-sm",
  md: "gap-md",
  lg: "gap-lg",
  xl: "gap-xl",
};

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

export const HStack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap = "md", align = "center", justify = "start", wrap = false, className = "", children, ...props }, ref) => {
    const classes = ["flex", "flex-row", gap !== "none" && gapClasses[gap], alignClasses[align], justifyClasses[justify], wrap && "flex-wrap", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

export const VStack = forwardRef<HTMLDivElement, StackProps>(
  ({ gap = "md", align = "stretch", justify = "start", wrap = false, className = "", children, ...props }, ref) => {
    const classes = ["flex", "flex-col", gap !== "none" && gapClasses[gap], alignClasses[align], justifyClasses[justify], wrap && "flex-wrap", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

interface FlexProps extends StackProps {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ direction = "row", gap = "md", align = "stretch", justify = "start", wrap = false, className = "", children, ...props }, ref) => {
    const classes = [
      "flex",
      `flex-${direction}`,
      gap !== "none" && gapClasses[gap],
      alignClasses[align],
      justifyClasses[justify],
      wrap && "flex-wrap",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

// 컴포넌트 이름 지정
HStack.displayName = "HStack";
VStack.displayName = "VStack";
Flex.displayName = "Flex";
