"use client";

import React from "react";
import { DesignSettingsProvider } from "@lumir-company/design-system-v0";
import "../globals.css";

export default function ColorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DesignSettingsProvider>
        {children}
      </DesignSettingsProvider>
    </div>
  );
} 