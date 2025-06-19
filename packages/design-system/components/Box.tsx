import React, { HTMLAttributes, forwardRef } from "react";

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(({ className = "", children, ...props }, ref) => {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
});

interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  flex?: "1" | "auto" | "initial" | "none";
  minWidth?: "0" | "auto";
  overflow?: "hidden" | "visible" | "auto" | "scroll";
  position?: "relative" | "absolute" | "fixed" | "sticky";
  children: React.ReactNode;
}

const flexClasses = {
  "1": "flex-1",
  auto: "flex-auto",
  initial: "flex-initial",
  none: "flex-none",
};

const minWidthClasses = {
  "0": "min-w-0",
  auto: "min-w-auto",
};

const overflowClasses = {
  hidden: "overflow-hidden",
  visible: "overflow-visible",
  auto: "overflow-auto",
  scroll: "overflow-scroll",
};

const positionClasses = {
  relative: "relative",
  absolute: "absolute",
  fixed: "fixed",
  sticky: "sticky",
};

export const Flex = forwardRef<HTMLDivElement, FlexProps>(({ flex = "1", minWidth, overflow, position, className = "", children, ...props }, ref) => {
  const classes = [
    flexClasses[flex],
    minWidth && minWidthClasses[minWidth],
    overflow && overflowClasses[overflow],
    position && positionClasses[position],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  minHeight?: "screen" | "full" | "auto";
  position?: "relative" | "absolute" | "fixed" | "sticky";
  width?: "full" | "auto" | "max-xs" | "max-sm" | "max-md" | "max-lg" | "max-xl";
  children: React.ReactNode;
}

const minHeightClasses = {
  screen: "min-h-screen",
  full: "min-h-full",
  auto: "min-h-auto",
};

const widthClasses = {
  full: "w-full",
  auto: "w-auto",
  "max-xs": "max-w-xs",
  "max-sm": "max-w-sm",
  "max-md": "max-w-md",
  "max-lg": "max-w-lg",
  "max-xl": "max-w-xl",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(({ minHeight, position, width, className = "", children, ...props }, ref) => {
  const classes = [minHeight && minHeightClasses[minHeight], position && positionClasses[position], width && widthClasses[width], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

// 편의를 위한 별칭 컴포넌트들
export const Flex1 = forwardRef<HTMLDivElement, Omit<FlexProps, "flex">>((props, ref) => <Flex ref={ref} flex="1" {...props} />);

export const Flex1Relative = forwardRef<HTMLDivElement, Omit<FlexProps, "flex" | "position">>((props, ref) => (
  <Flex ref={ref} flex="1" position="relative" {...props} />
));

export const Flex1MinW0 = forwardRef<HTMLDivElement, Omit<FlexProps, "flex" | "minWidth">>((props, ref) => <Flex ref={ref} flex="1" minWidth="0" {...props} />);

export const Relative = forwardRef<HTMLDivElement, Omit<ContainerProps, "position">>((props, ref) => <Container ref={ref} position="relative" {...props} />);

// 컴포넌트 이름 지정
Box.displayName = "Box";
Flex.displayName = "Flex";
Container.displayName = "Container";
Flex1.displayName = "Flex1";
Flex1Relative.displayName = "Flex1Relative";
Flex1MinW0.displayName = "Flex1MinW0";
Relative.displayName = "Relative";
