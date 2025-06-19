"use client";
import { DesignTokensPreview } from "@/components/DesignTokensPreview";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 min-h-screen bg-background flex items-center">
        <div className="w-full">
          <DesignTokensPreview />
        </div>
      </main>
    </div>
  );
}
