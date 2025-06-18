import React from "react";

export function Sidebar({ font, setFont, fonts, theme, setTheme, themes, radius, setRadius, fontSize, setFontSize }: any) {
  return (
    <div className="fixed top-0 left-0 h-full w-80 bg-white/80 dark:bg-background/80 shadow-lg z-50 p-6 flex flex-col gap-6 overflow-y-auto">
      {/* 테마 선택 */}
      <div>
        <div className="font-bold mb-2 text-foreground">테마</div>
        <div className="flex flex-wrap gap-2">
          {themes.map((t: any) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={`px-3 py-1 rounded border ${theme === t.key ? "bg-primary text-white" : "bg-surface text-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {/* 글꼴 선택 */}
      <div>
        <div className="font-bold mb-2 text-foreground">글꼴</div>
        <div className="flex gap-flex flexDirection-custom items-custom justify-custom flex-wrap">
          {fonts.map((f: any) => (
            <button
              key={f.key}
              onClick={() => setFont(f.key)}
              className={`px-3 py-1 rounded border ${font === f.key ? "bg-primary text-white" : "bg-surface text-foreground"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {/* 보더 라운드 조절 */}
      <div>
        <div className="font-bold mb-2 text-foreground">모서리 둥글기</div>
        <div className="flex items-center gap-2">
          <label htmlFor="radius-range" className="text-xs text-foreground">
            {radius}px
          </label>
          <input id="radius-range" type="range" min={0} max={64} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-32" />
          <input
            type="number"
            min={0}
            max={64}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-14 border rounded px-1 text-xs"
          />
        </div>
      </div>
      {/* 글꼴 크기 조절 */}
      <div>
        <div className="font-bold mb-2 text-foreground">글꼴 크기</div>
        <div className="flex items-center gap-2">
          <label htmlFor="font-size-range" className="text-xs text-foreground">
            {fontSize}px
          </label>
          <input id="font-size-range" type="range" min={12} max={32} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-32" />
          <input
            type="number"
            min={12}
            max={32}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-14 border rounded px-1 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
