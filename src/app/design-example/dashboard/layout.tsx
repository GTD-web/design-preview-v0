"use client";

import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[var(--color-background)]">{children}</div>;
}
