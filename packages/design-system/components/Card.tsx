import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`bg-[var(--color-surface)] border border-border rounded-md p-lg ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
