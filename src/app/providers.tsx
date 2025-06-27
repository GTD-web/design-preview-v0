"use client";

import { DesignSettingsProvider } from "@lumir-company/design-system-v0/hooks/useDesignSettings";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DesignSettingsProvider>
      {children}
    </DesignSettingsProvider>
  );
} 