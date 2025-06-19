import React, { HTMLAttributes, forwardRef } from "react";

interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  size?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  direction?: "vertical" | "horizontal";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
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

export const Space = forwardRef<HTMLDivElement, SpaceProps>(
  ({ size = "md", direction = "vertical", align = "stretch", wrap = false, className = "", children, ...props }, ref) => {
    const isVertical = direction === "vertical";

    const classes = ["flex", isVertical ? "flex-col" : "flex-row", size !== "none" && gapClasses[size], alignClasses[align], wrap && "flex-wrap", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

// 편의를 위한 별칭 컴포넌트들
export const VSpace = forwardRef<HTMLDivElement, Omit<SpaceProps, "direction">>(({ size = "lg", className = "", children, ...props }, ref) => {
  // CSS 변수를 직접 사용하여 동적 간격 설정
  const getGapStyle = (size: string) => {
    switch (size) {
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
    gap: getGapStyle(size),
    ...props.style,
  };

  return (
    <div ref={ref} className={className} style={style} {...props}>
      {children}
    </div>
  );
});

export const HSpace = forwardRef<HTMLDivElement, Omit<SpaceProps, "direction">>((props, ref) => <Space ref={ref} direction="horizontal" {...props} />);

// 컴포넌트 이름 지정
Space.displayName = "Space";
VSpace.displayName = "VSpace";
HSpace.displayName = "HSpace";
