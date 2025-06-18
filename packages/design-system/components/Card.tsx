import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`bg-white border border-border/60 rounded-2xl p-lg ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
