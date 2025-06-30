"use client";
import { DesignTokensPreview } from "./components/DesignTokensPreview";
import { useDesignSettings } from "@/packages/design-system/hooks/useDesignSettings";

export default function Home() {
  const {
    theme,
    setShadcnV0Light,
    setShadcnV0Dark,
  } = useDesignSettings();

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 테마 전환 버튼들 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-foreground">디자인 시스템 프리뷰</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">Shadcn 테마:</span>
                
                {/* V0 버튼들 */}
                <div className="flex gap-1">
                  <button 
                    onClick={setShadcnV0Light}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      theme === 'shadcn-v0-light'
                        ? 'bg-blue-500 text-white shadow-md' 
                        : 'bg-muted text-muted-foreground hover:bg-blue-100 hover:text-blue-700'
                    }`}
                  >
                    V0 Light
                  </button>
                  <button 
                    onClick={setShadcnV0Dark}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      theme === 'shadcn-v0-dark'
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-muted text-muted-foreground hover:bg-blue-100 hover:text-blue-700'
                    }`}
                  >
                    V0 Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 현재 상태 표시 */}
          <div className="mt-2 text-xs text-muted-foreground">
            현재: <span className="font-medium text-foreground">
              {theme === 'shadcn-v0-light' ? 'Shadcn V0 Light' : 
               theme === 'shadcn-v0-dark' ? 'Shadcn V0 Dark' : 
               `${theme} 테마`} 모드
            </span>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8">
        <DesignTokensPreview />
      </div>
    </div>
  );
}
