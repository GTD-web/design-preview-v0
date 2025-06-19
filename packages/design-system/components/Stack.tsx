import React, { HTMLAttributes, forwardRef } from "react";

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
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
  "2xl": "gap-2xl",
  "3xl": "gap-3xl",
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

// CSS 변수를 사용하는 동적 VStack (기존 VSpace 기능)
export const VSpace = forwardRef<HTMLDivElement, Omit<StackProps, "justify">>(
  ({ gap = "lg", align = "stretch", wrap = false, className = "", children, ...props }, ref) => {
    // CSS 변수를 직접 사용하여 동적 간격 설정
    const getGapStyle = (gapSize: string) => {
      switch (gapSize) {
        case "none":
          return "0";
        case "xs":
          return "var(--spacing-xs, 0.25rem)";
        case "sm":
          return "var(--spacing-sm, 0.5rem)";
        case "md":
          return "var(--spacing-md, 1rem)";
        case "lg":
          return "var(--flex-gap, 1.5rem)"; // 갭 설정과 연동
        case "xl":
          return "var(--spacing-xl, 4rem)";
        case "2xl":
          return "8rem";
        case "3xl":
          return "16rem";
        default:
          return "var(--flex-gap, 1.5rem)";
      }
    };

    const style = {
      display: "flex",
      flexDirection: "column" as const,
      gap: getGapStyle(gap),
      alignItems:
        align === "start" ? "flex-start" : align === "center" ? "center" : align === "end" ? "flex-end" : align === "baseline" ? "baseline" : "stretch",
      flexWrap: wrap ? "wrap" : "nowrap",
      ...props.style,
    };

    return (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    );
  }
);

// CSS 변수를 사용하는 동적 HStack (기존 HSpace 기능)
export const HSpace = forwardRef<HTMLDivElement, Omit<StackProps, "justify">>(
  ({ gap = "md", align = "center", wrap = false, className = "", children, ...props }, ref) => {
    // CSS 변수를 직접 사용하여 동적 간격 설정
    const getGapStyle = (gapSize: string) => {
      switch (gapSize) {
        case "none":
          return "0";
        case "xs":
          return "var(--spacing-xs, 0.25rem)";
        case "sm":
          return "var(--spacing-sm, 0.5rem)";
        case "md":
          return "var(--spacing-md, 1rem)";
        case "lg":
          return "var(--flex-gap, 1.5rem)"; // 갭 설정과 연동
        case "xl":
          return "var(--spacing-xl, 4rem)";
        case "2xl":
          return "8rem";
        case "3xl":
          return "16rem";
        default:
          return "var(--flex-gap, 1.5rem)";
      }
    };

    const style = {
      display: "flex",
      flexDirection: "row" as const,
      gap: getGapStyle(gap),
      alignItems:
        align === "start" ? "flex-start" : align === "center" ? "center" : align === "end" ? "flex-end" : align === "baseline" ? "baseline" : "stretch",
      flexWrap: wrap ? "wrap" : "nowrap",
      ...props.style,
    };

    return (
      <div ref={ref} className={className} style={style} {...props}>
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
VSpace.displayName = "VSpace";
HSpace.displayName = "HSpace";
Flex.displayName = "Flex";
