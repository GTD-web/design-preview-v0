import React, { HTMLAttributes, forwardRef } from "react";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "layout";
  children: React.ReactNode;
}

const gridColsClasses = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const gapClasses = {
  none: "",
  xs: "gap-xs",
  sm: "gap-sm",
  md: "gap-md",
  lg: "gap-lg",
  xl: "gap-xl",
  "2xl": "gap-2xl",
  "3xl": "gap-3xl",
  layout: "gap-layout",
};

export const Grid = forwardRef<HTMLDivElement, GridProps>(({ cols = 1, gap = "md", className = "", children, ...props }, ref) => {
  const classes = ["grid", gridColsClasses[cols], gap !== "none" && gapClasses[gap], className].filter(Boolean).join(" ");

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  children: React.ReactNode;
}

const gridSpanClasses = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  12: "col-span-12",
};

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(({ span = 1, className = "", children, ...props }, ref) => {
  const classes = [gridSpanClasses[span], className].filter(Boolean).join(" ");

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

// 컴포넌트 이름 지정
Grid.displayName = "Grid";
GridItem.displayName = "GridItem";
