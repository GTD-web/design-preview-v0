"use client";

import { DesignSettingsProvider } from "@/packages/design-system/hooks/useDesignSettings";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DesignSettingsProvider>
      {children}
    </DesignSettingsProvider>
  );
} 