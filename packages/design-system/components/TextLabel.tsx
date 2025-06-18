import React from "react";

export default function TextLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-xs font-normal text-[var(--foreground)] ${className}`}>{children}</span>;
}
