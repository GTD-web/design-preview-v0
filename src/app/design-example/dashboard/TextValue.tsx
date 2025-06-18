import React from "react";

export default function TextValue({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`text-sm text-gray-600 font-medium ${className}`}>{children}</span>;
}
