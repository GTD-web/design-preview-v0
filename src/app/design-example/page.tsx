"use client";

import React, { useEffect, useState } from "react";
import TextHeading from "@/packages/design-system/components/TextHeading";
import TextValue from "@/packages/design-system/components/TextValue";
import { DesignTokensPreview } from "../components/DesignTokensPreview";
import { useDesignSettings } from "@/packages/design-system/hooks/useDesignSettings";

export default function DesignExamplePage() {
  // useDesignSettings 훅 사용
  const {
    theme,
    setTheme,
  } = useDesignSettings();

  // 현재 적용된 클래스들을 확인하기 위한 상태
  const [bodyClasses, setBodyClasses] = useState<string>("");
  const [cssVariables, setCssVariables] = useState<Record<string, string>>({});

  // body 클래스와 CSS 변수 모니터링
  useEffect(() => {
    const updateDebugInfo = () => {
      // body 클래스 확인
      setBodyClasses(document.body.className);
      
      // CSS 변수 값 확인
      const computedStyle = getComputedStyle(document.body);
      const variables: Record<string, string> = {};
      
      // shadcn 관련 주요 변수들 확인
      const varsToCheck = [
        '--background',
        '--foreground', 
        '--primary',
        '--secondary',
        '--card',
        '--border',
        '--muted',
        '--accent'
      ];
      
      varsToCheck.forEach(varName => {
        variables[varName] = computedStyle.getPropertyValue(varName).trim();
      });
      
      setCssVariables(variables);
    };

    // 초기 실행
    updateDebugInfo();
    
    // MutationObserver로 body 클래스 변경 감지
    const observer = new MutationObserver(updateDebugInfo);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-8">
        <div className="space-y-8">
          <div className="text-center">
            <TextHeading size="3xl" weight="bold" className="mb-4">
              디자인 토큰 미리보기
            </TextHeading>
            <TextValue className="text-lg">
              디자인 시스템의 토큰들을 확인하고 테스트할 수 있습니다.
            </TextValue>
          </div>

          <div className="space-y-8">
            <DesignTokensPreview />
          </div>

          {/* 테스트 버튼들 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Shadcn 테마 전환</h2>
                <p className="text-muted-foreground">
                  아래 버튼들을 클릭해서 각 shadcn 토큰 조합을 직접 테스트해보세요.
                </p>
              </div>
              
              <div className="space-y-6">
                {/* 기본 테마 버튼들 */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    기본 테마
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`px-4 py-2.5 font-medium rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'bg-gray-100 border-gray-400 text-gray-800 shadow-md' 
                          : 'bg-background border-border text-foreground hover:bg-muted hover:border-gray-300'
                      }`}
                    >
                      🌞 Default Light
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`px-4 py-2.5 font-medium rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-500 text-gray-100 shadow-md' 
                          : 'bg-background border-border text-foreground hover:bg-muted hover:border-gray-300'
                      }`}
                    >
                      🌙 Default Dark
                    </button>
                  </div>
                </div>

                {/* Shadcn V0 테마 버튼들 */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Shadcn V0 테마
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setTheme('shadcn-v0-light')}
                      className={`px-4 py-2.5 font-medium rounded-lg border-2 transition-all ${
                        theme === 'shadcn-v0-light'
                          ? 'bg-blue-500 border-blue-600 text-white shadow-lg transform scale-105' 
                          : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300'
                      }`}
                    >
                      ☀️ Shadcn V0 Light
                    </button>
                    <button 
                      onClick={() => setTheme('shadcn-v0-dark')}
                      className={`px-4 py-2.5 font-medium rounded-lg border-2 transition-all ${
                        theme === 'shadcn-v0-dark'
                          ? 'bg-blue-600 border-blue-700 text-white shadow-lg transform scale-105' 
                          : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300'
                      }`}
                    >
                      🌚 Shadcn V0 Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 현재 상태 표시 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <span className="text-2xl">🎨</span>
                현재 적용된 테마 상태
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 기본 정보 */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    테마 정보
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">현재 테마:</span>
                      <span className="font-medium text-foreground">{theme}</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">상태:</span>
                        <span className="font-bold text-primary">
                          {theme === 'shadcn-v0-light' ? 'Shadcn V0 Light 적용됨' : 
                           theme === 'shadcn-v0-dark' ? 'Shadcn V0 Dark 적용됨' : 
                           `${theme} 테마 적용됨`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CSS 클래스 정보 */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    CSS 클래스
                  </h3>
                  <div className="bg-background border border-border rounded p-3">
                    <code id="current-classes" className="text-xs text-foreground break-all">
                      Body Classes: {bodyClasses || "클래스 없음"}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CSS 변수 값 표시 */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                CSS 변수 값 미리보기
              </h2>
              <p className="text-sm text-muted-foreground">
                현재 적용된 shadcn 토큰의 실제 CSS 변수 값들을 확인할 수 있습니다.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 주요 색상 변수들 */}
                {[
                  { name: 'background', id: 'bg-value', class: 'bg-background' },
                  { name: 'foreground', id: 'fg-value', class: 'bg-foreground' },
                  { name: 'primary', id: 'primary-value', class: 'bg-primary' },
                  { name: 'secondary', id: 'secondary-value', class: 'bg-secondary' },
                  { name: 'muted', id: 'muted-value', class: 'bg-muted' },
                  { name: 'border', id: 'border-value', class: 'bg-border' },
                  { name: 'card', id: 'card-value', class: 'bg-card' },
                  { name: 'radius', id: 'radius-value', class: 'bg-accent' },
                ].map((variable) => (
                  <div key={variable.name} className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-4 h-4 rounded border border-border ${variable.class}`}></div>
                      <span className="font-medium text-foreground">--{variable.name}</span>
                    </div>
                    <div className="bg-background border border-border rounded px-2 py-1">
                      <code id={variable.id} className="text-xs text-foreground">
                        {cssVariables[variable.name] || "값 없음"}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 디버깅 정보 */}
        <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔍 디버깅 정보</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Body 클래스:</h3>
              <code className="text-sm bg-white dark:bg-gray-900 p-2 rounded border block">
                {bodyClasses || "클래스 없음"}
              </code>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">CSS 변수 값:</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(cssVariables).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-mono text-blue-600 dark:text-blue-400">{key}:</span>
                    <span className="ml-2 font-mono bg-white dark:bg-gray-900 px-1 rounded">
                      {value || "값 없음"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
