"use client";

import { DesignSettingsProvider } from "@lumir-company/design-system-v0";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DesignSettingsProvider>
      {children}
    </DesignSettingsProvider>
  );
} 