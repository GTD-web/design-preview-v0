# TabBar 컴포넌트

브라우저 탭과 유사한 동작을 제공하는 탭 바 컴포넌트입니다.

## 주요 기능

- ✨ **자동 탭 관리**: 링크로 접속했을 때 자동으로 탭 추가/활성화
- 🔄 **드래그 앤 드롭**: 탭 순서를 드래그로 변경 가능
- 🏠 **홈 버튼**: 홈으로 빠르게 이동
- ➕ **새 탭 추가**: 마지막 탭 옆에 + 버튼 표시
- 🎨 **커스터마이징**: 아이콘, 스타일 등 다양한 커스터마이징 옵션

## 설치

```bash
npm install @dnd-kit/core @dnd-kit/sortable framer-motion
```

## 기본 사용법

### 1. useTabManager hook 사용 (권장)

링크로 접속 시 자동으로 탭을 추가하거나 활성화하는 가장 쉬운 방법입니다.

```tsx
"use client";

import { useRouter } from "next/navigation";
import { TabBar, useTabManager } from "@/components/TabBar";

export default function MyPage() {
  const router = useRouter();

  const {
    tabs,
    activeTabId,
    handleTabClick,
    handleTabClose,
    handleTabReorder,
  } = useTabManager({
    maxTabs: 10,
    getTabFromPath: (path) => {
      if (path === "/") return null; // 홈은 탭으로 만들지 않음

      return {
        title: path.split("/").pop() || "페이지",
        path: path,
        closable: true,
      };
    },
    homePath: "/",
  });

  return (
    <TabBar
      tabs={tabs}
      activeTabId={activeTabId}
      onTabClick={(tab) => {
        handleTabClick(tab);
        router.push(tab.path);
      }}
      onTabClose={handleTabClose}
      onTabReorder={handleTabReorder}
      showHomeButton={true}
      onHomeClick={() => router.push("/")}
    />
  );
}
```

### 2. 수동 상태 관리

더 세밀한 제어가 필요한 경우 직접 상태를 관리할 수 있습니다.

```tsx
"use client";

import { useState } from "react";
import { TabBar, TabItem } from "@/components/TabBar";

export default function MyPage() {
  const [tabs, setTabs] = useState<TabItem[]>([
    { id: "1", title: "홈", path: "/", closable: false },
    { id: "2", title: "페이지1", path: "/page1", closable: true },
  ]);
  const [activeTabId, setActiveTabId] = useState("1");

  const handleTabClick = (tab: TabItem) => {
    setActiveTabId(tab.id);
    // router.push(tab.path);
  };

  const handleTabClose = (tabId: string) => {
    setTabs((prev) => prev.filter((tab) => tab.id !== tabId));
  };

  const handleTabReorder = (activeId: string, overId: string) => {
    setTabs((prev) => {
      const activeIndex = prev.findIndex((tab) => tab.id === activeId);
      const overIndex = prev.findIndex((tab) => tab.id === overId);
      const newTabs = [...prev];
      const [moved] = newTabs.splice(activeIndex, 1);
      newTabs.splice(overIndex, 0, moved);
      return newTabs;
    });
  };

  return (
    <TabBar
      tabs={tabs}
      activeTabId={activeTabId}
      onTabClick={handleTabClick}
      onTabClose={handleTabClose}
      onTabReorder={handleTabReorder}
    />
  );
}
```

## API

### useTabManager(options)

탭 상태를 자동으로 관리하는 hook입니다.

#### Options

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `initialTabs` | `TabItem[]` | `[]` | 초기 탭 목록 |
| `maxTabs` | `number` | `10` | 최대 탭 개수 |
| `getTabFromPath` | `(path: string) => Omit<TabItem, "id"> \| null` | - | 경로에서 탭 정보를 생성하는 함수 |
| `homePath` | `string` | `"/"` | 홈 경로 (이 경로는 탭으로 추가되지 않음) |

#### 반환값

| 속성 | 타입 | 설명 |
|------|------|------|
| `tabs` | `TabItem[]` | 현재 탭 목록 |
| `activeTabId` | `string \| undefined` | 활성 탭 ID |
| `setTabs` | `(tabs: TabItem[]) => void` | 탭 목록 설정 함수 |
| `setActiveTabId` | `(id: string \| undefined) => void` | 활성 탭 ID 설정 함수 |
| `handleTabClick` | `(tab: TabItem) => void` | 탭 클릭 핸들러 |
| `handleTabClose` | `(tabId: string) => void` | 탭 닫기 핸들러 |
| `handleTabReorder` | `(activeId: string, overId: string) => void` | 탭 순서 변경 핸들러 |
| `handleNewTab` | `() => void` | 새 탭 추가 핸들러 |

### TabBar Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `tabs` | `TabItem[]` | **필수** | 탭 목록 |
| `activeTabId` | `string` | - | 활성 탭 ID |
| `onTabClick` | `(tab: TabItem) => void` | - | 탭 클릭 시 호출되는 콜백 |
| `onTabClose` | `(tabId: string) => void` | - | 탭 닫기 시 호출되는 콜백 |
| `onTabReorder` | `(activeId: string, overId: string) => void` | - | 탭 순서 변경 시 호출되는 콜백 |
| `onNewTab` | `() => void` | - | 새 탭 추가 시 호출되는 콜백 |
| `maxTabs` | `number` | `10` | 최대 탭 개수 |
| `className` | `string` | `""` | 추가 클래스명 |
| `showNewTabButton` | `boolean` | `true` | 새 탭 버튼 표시 여부 |
| `showHomeButton` | `boolean` | `false` | 홈 버튼 표시 여부 |
| `onHomeClick` | `() => void` | - | 홈 버튼 클릭 시 호출되는 콜백 |
| `homeButtonActive` | `boolean` | `false` | 홈 버튼 활성 상태 |
| `homeButtonIcon` | `React.ReactNode` | - | 홈 버튼 커스텀 아이콘 |
| `homeButtonLabel` | `string` | `"홈"` | 홈 버튼 텍스트 |
| `renderNewTabButton` | `(props) => React.ReactNode` | - | 새 탭 버튼 커스텀 렌더링 함수 |

### TabItem 인터페이스

```tsx
interface TabItem {
  id: string;          // 고유 ID
  title: string;       // 탭 제목
  path: string;        // 탭 경로
  icon?: React.ReactNode;  // 탭 아이콘 (선택)
  closable?: boolean;  // 닫기 가능 여부 (기본: true)
}
```

## 고급 사용법

### 커스텀 탭 생성 로직

```tsx
const { tabs, activeTabId, ... } = useTabManager({
  getTabFromPath: (path) => {
    // 특정 경로는 탭으로 만들지 않음
    if (path === "/" || path.startsWith("/auth")) {
      return null;
    }

    // 경로 패턴에 따라 다른 아이콘 설정
    let icon = null;
    let title = path.split("/").pop() || "페이지";

    if (path.startsWith("/design")) {
      icon = <DesignIcon />;
      title = "디자인 - " + title;
    } else if (path.startsWith("/docs")) {
      icon = <DocIcon />;
      title = "문서 - " + title;
    }

    return {
      title,
      path,
      icon,
      closable: true,
    };
  },
});
```

### 커스텀 새 탭 버튼

```tsx
<TabBar
  tabs={tabs}
  activeTabId={activeTabId}
  renderNewTabButton={({ isDisabled, tabCount, maxTabs }) => (
    <CustomPageSelector
      disabled={isDisabled}
      currentCount={tabCount}
      maxCount={maxTabs}
      onSelectPage={(page) => {
        // 페이지 선택 로직
      }}
    />
  )}
/>
```

## 스타일 커스터마이징

CSS Module을 사용하여 스타일이 격리되어 있습니다. 
커스터마이징이 필요한 경우 `TabBar.module.css`를 수정하거나 `className` prop을 사용하세요.

```tsx
<TabBar
  className="my-custom-tabbar"
  tabs={tabs}
  // ...
/>
```

## 주의사항

1. **Next.js App Router 필수**: `usePathname`을 사용하므로 Next.js App Router 환경에서만 동작합니다.
2. **"use client" 지시어**: 클라이언트 컴포넌트에서만 사용 가능합니다.
3. **최대 탭 개수**: `maxTabs`에 도달하면 새 탭이 추가되지 않습니다.

## 예제

더 자세한 예제는 `TabBar.example.tsx` 파일을 참고하세요.

