import React from "react";

export default function TextLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-xs text-gray-500 font-normal ${className}`}>{children}</span>;
}
