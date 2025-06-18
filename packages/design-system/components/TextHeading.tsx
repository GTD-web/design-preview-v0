import React from "react";

export default function TextHeading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-base font-heading font-semibold text-gray-600 ${className}`}>{children}</div>;
}
