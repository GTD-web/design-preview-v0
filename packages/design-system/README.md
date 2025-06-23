## 디자인 시스템 사용법 (Using The Design System)

이 프로젝트는 [@lumir-company/design-system-v0](https://www.npmjs.com/package/@lumir-company/design-system-v0) 패키지를 사용하여 구축되었습니다. 다음은 디자인 시스템을 설정하고 사용하는 방법에 대한 안내입니다.

### 0. 설치 (Installation)

먼저, 다음 명령어를 사용하여 디자인 시스템 패키지를 설치합니다.

```bash
npm install @lumir-company/design-system-v0
```

### 1. CSS 스타일 임포트 (Importing CSS Styles)

먼저, 디자인 시스템의 핵심 스타일, 컴포넌트, 유틸리티를 프로젝트에 포함해야 합니다. `app/globals.css` 파일에 다음 코드를 추가하여 스타일시트를 임포트하세요.

```css
@import "@lumir-company/design-system-v0/styles/tailwind.css";
```

그런 다음, 이 `globals.css` 파일을 최상위 `app/layout.tsx` 파일에서 임포트해야 합니다.

```tsx
import "./globals.css";
```

### 2. Tailwind CSS 설정 (Tailwind CSS Configuration)

Tailwind CSS가 프로젝트 내에서 사용된 디자인 시스템 클래스를 인식하고 CSS로 빌드할 수 있도록 설정해야 합니다.

#### 권장 설정 방식 (Recommended)

`tailwind.config.ts` 파일에서 `presets` 옵션을 사용하면 `node_modules` 내의 파일을 직접 수정하지 않고도 안전하게 설정을 확장할 수 있어 이 방법을 강력히 권장합니다.

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";
import designSystem from "@lumir-company/design-system-v0/tailwind.config";

const config: Config = {
  presets: [designSystem],
  content: [
    // 현재 프로젝트의 소스 코드 경로
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // 디자인 시스템 패키지의 컴포넌트 경로
    "./node_modules/@lumir-company/design-system-v0/dist/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
export default config;
```

이 설정은 디자인 시스템의 모든 스타일(색상, 폰트, 간격 등)을 상속받으면서, 현재 프로젝트의 `app` 폴더와 디자인 시스템 패키지의 컴포넌트 파일을 스캔하여 필요한 클래스만 최종 CSS 파일에 포함시킵니다.

### 3. 테마 및 스타일 동적 관리 (Using Hooks and Components)

디자인 시스템은 `DesignSettingsProvider`와 `DesignSettingsWidget`을 통해 테마, 폰트, 레이아웃 등 다양한 스타일을 동적으로 제어하는 기능을 제공합니다.

#### 3.1. DesignSettingsProvider 설정

모든 동적 설정은 `DesignSettingsProvider` 컨텍스트를 통해 관리됩니다. App Router 환경에서는 서버 컴포넌트인 Root Layout과 클라이언트 기반의 컨텍스트를 함께 사용하기 위해 다음과 같이 별도의 클라이언트 컴포넌트로 프로바이더를 감싸주는 것이 좋습니다.

1.  **`app/providers.tsx` 파일 생성**

    ```tsx
    // app/providers.tsx
    "use client";

    import { DesignSettingsProvider } from "@lumir-company/design-system-v0/hooks/useDesignSettings";
    import { ReactNode } from "react";

    export function Providers({ children }: { children: ReactNode }) {
      return <DesignSettingsProvider>{children}</DesignSettingsProvider>;
    }
    ```

2.  **`app/layout.tsx`에 프로바이더 적용**

    ```tsx
    // app/layout.tsx
    import { Providers } from "./providers";

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body>
            <Providers>{children}</Providers>
          </body>
        </html>
      );
    }
    ```

#### 3.2. 실시간 설정 UI 추가 (`DesignSettingsWidget`)

`DesignSettingsWidget`은 사용자가 직접 디자인 설정을 변경할 수 있는 플로팅 위젯입니다. `DesignSettingsProvider` 하위라면 어디든 추가하기만 하면 바로 동작합니다.

**`app/layout.tsx`에 위젯 추가:**

```tsx
// app/layout.tsx
import { Providers } from "./providers";
import { DesignSettingsWidget } from "@lumir-company/design-system-v0/hooks/useDesignSettings";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <DesignSettingsWidget />
        </Providers>
      </body>
    </html>
  );
}
```

#### 3.3. `useDesignSettings` 훅으로 상태 제어

클라이언트 컴포넌트 내에서 `useDesignSettings` 훅을 사용하면 현재 디자인 설정 값을 읽거나, 특정 이벤트에 따라 설정을 변경할 수 있습니다.

```tsx
// 예시 컴포넌트
"use client";

import { useDesignSettings } from "@lumir-company/design-system-v0/hooks/useDesignSettings";

function MyThemeComponent() {
  const { theme, setTheme, layoutType, maxWidth } = useDesignSettings();

  return (
    <div className={layoutType === "centered" ? maxWidth : "w-full"}>
      <p>현재 테마는 '{theme}' 입니다.</p>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="bg-primary text-foreground px-4 py-2 rounded-md"
      >
        테마 전환
      </button>
    </div>
  );
}
```

자세한 사용 예시는 `/app/test/page.tsx`에 생성된 **디자인 시스템 쇼케이스 페이지**에서 확인할 수 있습니다.

### 4. 개발 가이드 (Cursor Rule)

이 디자인 시스템을 사용하여 일관된 스타일을 유지하려면, 라이브러리에 포함된 `tailwind.config.ts`와 `styles/tailwind.css` 파일을 참고하여 프로젝트를 설정하는 것을 권장합니다. 이 파일들은 디자인 시스템의 모든 설정과 변수, 기본 스타일을 정의하는 **핵심 가이드(Cursor Rule)** 역할을 합니다.

- **`tailwind.config.ts`**: 테마, 색상, 폰트, 간격 등 모든 디자인 토큰이 정의되어 있습니다. 프로젝트의 Tailwind 설정을 구성할 때 이 파일을 기준으로 삼으세요.
- **`styles/tailwind.css`**: 기본 CSS 변수, 폰트 임포트, 테마 클래스 등 전역 스타일이 정의되어 있습니다.

이 가이드를 따르면 디자인 시스템의 의도에 맞게 일관된 UI를 구축할 수 있습니다.
