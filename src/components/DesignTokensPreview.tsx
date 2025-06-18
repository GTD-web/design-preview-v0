const singleColors = [
  { name: "primary", className: "bg-primary", text: "onPrimary" },
  { name: "secondary", className: "bg-secondary", text: "onSecondary" },
  { name: "accent", className: "bg-accent", text: "onAccent" },
  { name: "success", className: "bg-success", text: "onSuccess" },
  { name: "warning", className: "bg-warning", text: "onWarning" },
  { name: "danger", className: "bg-danger", text: "onDanger" },
  { name: "info", className: "bg-info", text: "onInfo" },
  {
    name: "surface",
    className: "bg-surface",
    text: "onSurface border border-border",
  },
  {
    name: "background",
    className: "bg-background",
    text: "onBackground border border-border",
  },
  {
    name: "border",
    className: "bg-border",
    text: "text-onSurface border border-border",
  },
];

const paletteColors = [
  "neutral",
  "gray",
  "blue",
  "red",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "teal",
  "cyan",
  "indigo",
  "lime",
  "amber",
  "emerald",
  "violet",
  "fuchsia",
  "rose",
];
const paletteSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

function PalettePreview({ name }: { name: string }) {
  return (
    <div className="mb-8">
      <h4 className="font-semibold mb-2 capitalize">{name}</h4>
      <div className="flex flex-wrap gap-2">
        {paletteSteps.map((step) => (
          <div
            key={step}
            className={`w-16 h-16 flex flex-col items-center justify-center rounded bg-${name}-${step} border`}
          >
            <span className="text-xs font-mono bg-white/70 rounded px-1 py-0.5 mt-8 -mb-2">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DesignTokensPreviewProps {
  theme?: string;
}

export function DesignTokensPreview() {
  const fonts = [
    { key: "noto", label: "Noto Sans KR", className: "font-noto" },
    { key: "pretendard", label: "Pretendard", className: "font-pretendard" },
    { key: "system", label: "System Sans", className: "font-system" },
  ];

  const spacings = [
    { name: "xs", size: "xs" },
    { name: "sm", size: "sm" },
    { name: "md", size: "md" },
    { name: "lg", size: "lg" },
    { name: "xl", size: "xl" },
  ];

  const radii = [
    { name: "sm", className: "rounded-sm" },
    { name: "md", className: "rounded-md" },
    { name: "lg", className: "rounded-lg" },
    { name: "xl", className: "rounded-xl" },
    { name: "full", className: "rounded-full" },
  ];

  const shadows = [
    { name: "sm", className: "shadow-sm" },
    { name: "md", className: "shadow-md" },
    { name: "lg", className: "shadow-lg" },
  ];

  return (
    <section className="w-full max-w-[1200px] px-6">
      <h2 className="text-h1 font-heading leading-heading tracking-heading mb-6 text-foreground">
        디자인 시스템 컬러 프리뷰
      </h2>
      <div className="space-y-12">
        <div>
          <h3 className="text-h2 font-heading leading-heading tracking-heading mb-4 text-foreground">
            Single Colors
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {singleColors.map((color) => (
              <div
                key={color.name}
                className={`h-16 flex flex-col items-center justify-center rounded-md ${
                  color.className
                } ${color.text} ${
                  color.name === "warning" || color.name === "success"
                    ? "text-foreground"
                    : "text-[var(--foreground-inverse)]"
                }`}
              >
                <span className="text-xs font-mono opacity-80">
                  {color.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-h2 font-heading leading-heading tracking-heading mb-4 text-foreground">
            Palette Colors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paletteColors.map((name) => (
              <PalettePreview key={name} name={name} />
            ))}
          </div>
        </div>
        <div className="mb-10">
          <h3 className="text-h3 font-heading leading-heading tracking-heading mb-2">
            Font Family
          </h3>
          <div className="flex gap-lg">
            {fonts.map((font) => (
              <div key={font.key} className="flex flex-col items-center">
                <span className={`text-lg ${font.className}`}>
                  {font.label}
                </span>
                <span className="text-xs text-gray-500">.{font.className}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-10">
          <h3 className="text-h3 font-heading leading-heading tracking-heading mb-2">
            Spacing
          </h3>
          <div className="flex gap-lg items-end">
            {spacings.map((sp) => (
              <div key={sp.name} className="flex flex-col items-center">
                <div
                  className={`bg-primary/30 w-8`}
                  style={{ height: `var(--spacing-${sp.size}, 1rem)` }}
                />
                <span className="text-xs mt-1">{sp.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-10">
          <h3 className="text-h3 font-heading leading-heading tracking-heading mb-2">
            Border Radius
          </h3>
          <div className="flex gap-lg">
            {radii.map((r) => (
              <div
                key={r.name}
                className={`w-12 h-12 bg-primary/30 border border-primary ${r.className} flex items-center justify-center`}
              >
                <span className="text-xs text-primary font-mono">{r.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-10">
          <h3 className="text-h3 font-heading leading-heading tracking-heading mb-2">
            Box Shadow
          </h3>
          <div className="flex gap-lg">
            {shadows.map((s) => (
              <div
                key={s.name}
                className={`w-20 h-12 bg-white border border-gray-200 flex items-center justify-center ${s.className}`}
              >
                <span className="text-xs text-gray-700 font-mono">
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
