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
    getTabFromPath: (pathname, fullPath) => {
      if (pathname === "/") return null; // 홈은 탭으로 만들지 않음

      return {
        title: pathname.split("/").pop() || "페이지",
        path: fullPath, // 쿼리 파라미터 포함된 전체 경로
        closable: true,
      };
    },
    homePath: "/",
    shouldAllowMultipleTabs: (pathname) => {
      // 특정 페이지는 여러 탭 허용 (예: 상세 페이지)
      return pathname.startsWith("/detail/");
    },
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

| 옵션                      | 타입                                                                  | 기본값        | 설명                                                                               |
| ------------------------- | --------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| `initialTabs`             | `TabItem[]`                                                           | `[]`          | 초기 탭 목록                                                                       |
| `maxTabs`                 | `number`                                                              | `10`          | 최대 탭 개수                                                                       |
| `getTabFromPath`          | `(pathname: string, fullPath: string) => Omit<TabItem, "id"> \| null` | -             | 경로에서 탭 정보를 생성하는 함수 (pathname: 경로, fullPath: 쿼리 파라미터 포함)    |
| `homePath`                | `string`                                                              | `"/"`         | 홈 경로 (이 경로는 탭으로 추가되지 않음)                                           |
| `shouldAllowMultipleTabs` | `(pathname: string, fullPath: string) => boolean`                     | `() => false` | 특정 경로가 여러 탭을 허용할지 결정하는 함수. true면 같은 경로에 여러 탭 생성 가능 |

#### 반환값

| 속성               | 타입                                         | 설명                 |
| ------------------ | -------------------------------------------- | -------------------- |
| `tabs`             | `TabItem[]`                                  | 현재 탭 목록         |
| `activeTabId`      | `string \| undefined`                        | 활성 탭 ID           |
| `setTabs`          | `(tabs: TabItem[]) => void`                  | 탭 목록 설정 함수    |
| `setActiveTabId`   | `(id: string \| undefined) => void`          | 활성 탭 ID 설정 함수 |
| `handleTabClick`   | `(tab: TabItem) => void`                     | 탭 클릭 핸들러       |
| `handleTabClose`   | `(tabId: string) => void`                    | 탭 닫기 핸들러       |
| `handleTabReorder` | `(activeId: string, overId: string) => void` | 탭 순서 변경 핸들러  |
| `handleNewTab`     | `() => void`                                 | 새 탭 추가 핸들러    |

### TabBar Props

| Prop                 | 타입                                         | 기본값   | 설명                          |
| -------------------- | -------------------------------------------- | -------- | ----------------------------- |
| `tabs`               | `TabItem[]`                                  | **필수** | 탭 목록                       |
| `activeTabId`        | `string`                                     | -        | 활성 탭 ID                    |
| `onTabClick`         | `(tab: TabItem) => void`                     | -        | 탭 클릭 시 호출되는 콜백      |
| `onTabClose`         | `(tabId: string) => void`                    | -        | 탭 닫기 시 호출되는 콜백      |
| `onTabReorder`       | `(activeId: string, overId: string) => void` | -        | 탭 순서 변경 시 호출되는 콜백 |
| `onNewTab`           | `() => void`                                 | -        | 새 탭 추가 시 호출되는 콜백   |
| `maxTabs`            | `number`                                     | `10`     | 최대 탭 개수                  |
| `className`          | `string`                                     | `""`     | 추가 클래스명                 |
| `showNewTabButton`   | `boolean`                                    | `true`   | 새 탭 버튼 표시 여부          |
| `showHomeButton`     | `boolean`                                    | `false`  | 홈 버튼 표시 여부             |
| `onHomeClick`        | `() => void`                                 | -        | 홈 버튼 클릭 시 호출되는 콜백 |
| `homeButtonActive`   | `boolean`                                    | `false`  | 홈 버튼 활성 상태             |
| `homeButtonIcon`     | `React.ReactNode`                            | -        | 홈 버튼 커스텀 아이콘         |
| `homeButtonLabel`    | `string`                                     | `"홈"`   | 홈 버튼 텍스트                |
| `renderNewTabButton` | `(props) => React.ReactNode`                 | -        | 새 탭 버튼 커스텀 렌더링 함수 |

### TabItem 인터페이스

```tsx
interface TabItem {
  id: string; // 고유 ID
  title: string; // 탭 제목
  path: string; // 탭 경로
  icon?: React.ReactNode; // 탭 아이콘 (선택)
  closable?: boolean; // 닫기 가능 여부 (기본: true)
}
```

## 고급 사용법

### 쿼리 파라미터 처리

`useTabManager`는 쿼리 파라미터가 포함된 URL을 자동으로 처리합니다.

#### 기본 동작 (여러 탭 허용 안 함)

```tsx
const { tabs, activeTabId, ... } = useTabManager({
  getTabFromPath: (pathname, fullPath) => {
    // pathname: '/user/profile'
    // fullPath: '/user/profile?id=123&tab=settings'

    return {
      title: pathname.split("/").pop() || "페이지",
      path: fullPath, // 쿼리 파라미터 포함된 전체 경로 저장
      closable: true,
    };
  },
});
```

**동작 방식:**

- `/user/profile?id=123` 접속 → 새 탭 생성
- `/user/profile?id=456` 접속 → 기존 탭의 쿼리 파라미터를 `id=456`으로 업데이트 (새 탭 생성 안 함)

#### 여러 탭 허용 (특정 페이지만)

```tsx
const { tabs, activeTabId, ... } = useTabManager({
  getTabFromPath: (pathname, fullPath) => {
    return {
      title: pathname.split("/").pop() || "페이지",
      path: fullPath,
      closable: true,
    };
  },
  shouldAllowMultipleTabs: (pathname, fullPath) => {
    // employee-evaluation 페이지는 여러 탭 허용
    if (pathname.includes("employee-evaluation")) {
      return true;
    }
    // 다른 상세 페이지들도 여러 탭 허용
    if (pathname.startsWith("/detail/") || pathname.startsWith("/edit/")) {
      return true;
    }
    return false;
  },
});
```

**동작 방식:**

- `/employee-evaluation?periodId=123&employeeId=456` → 새 탭 생성
- `/employee-evaluation?periodId=789&employeeId=012` → 새 탭 생성 (쿼리 파라미터가 다르므로)
- 일반 페이지는 기존처럼 쿼리 파라미터만 업데이트

### 실제 사용 예시

```tsx
const { tabs, activeTabId, ... } = useTabManager({
  getTabFromPath: (pathname, fullPath) => {
    // URL에서 쿼리 파라미터 추출하여 제목에 반영
    const params = new URLSearchParams(fullPath.split("?")[1] || "");

    if (pathname.includes("employee-evaluation")) {
      const employeeId = params.get("employeeId");
      return {
        title: `직원 평가 ${employeeId ? `- ${employeeId.slice(0, 8)}...` : ""}`,
        path: fullPath,
        closable: true,
      };
    }

    return {
      title: pathname.split("/").pop() || "페이지",
      path: fullPath,
      closable: true,
    };
  },
  shouldAllowMultipleTabs: (pathname) => {
    // 평가 관련 페이지는 여러 탭 허용
    return pathname.includes("evaluation") || pathname.includes("review");
  },
});
```

### 커스텀 탭 생성 로직

```tsx
const { tabs, activeTabId, ... } = useTabManager({
  getTabFromPath: (pathname, fullPath) => {
    // 특정 경로는 탭으로 만들지 않음
    if (pathname === "/" || pathname.startsWith("/auth")) {
      return null;
    }

    // 경로 패턴에 따라 다른 아이콘 설정
    let icon = null;
    let title = pathname.split("/").pop() || "페이지";

    if (pathname.startsWith("/design")) {
      icon = <DesignIcon />;
      title = "디자인 - " + title;
    } else if (pathname.startsWith("/docs")) {
      icon = <DocIcon />;
      title = "문서 - " + title;
    }

    return {
      title,
      path: fullPath, // 쿼리 파라미터 포함
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

1. **Next.js App Router 필수**: `usePathname`, `useSearchParams`를 사용하므로 Next.js App Router 환경에서만 동작합니다.
2. **"use client" 지시어**: 클라이언트 컴포넌트에서만 사용 가능합니다.
3. **최대 탭 개수**: `maxTabs`에 도달하면 새 탭이 추가되지 않습니다.
4. **쿼리 파라미터**:
   - 기본적으로 같은 경로(pathname)의 탭은 쿼리 파라미터만 업데이트됩니다.
   - `shouldAllowMultipleTabs`를 사용하여 특정 페이지는 여러 탭을 허용할 수 있습니다.
5. **탭 비교**: 탭의 동일성은 pathname으로 비교되며, 쿼리 파라미터는 탭 내용 업데이트에만 사용됩니다.

## 쿼리 파라미터 처리 흐름

```
사용자가 URL 접속
    ↓
pathname 추출 (예: /employee-evaluation)
    ↓
같은 pathname의 탭 존재?
    ↓                    ↓
   Yes                  No
    ↓                    ↓
여러 탭 허용?        새 탭 생성
    ↓        ↓
   Yes      No
    ↓        ↓
새 탭 생성  쿼리 파라미터만 업데이트
```

## 예제

더 자세한 예제는 다음 파일들을 참고하세요:

- `TabBar.usage-example.tsx` - 쿼리 파라미터 처리 포함 실제 사용 예시
- README의 "고급 사용법" 섹션 참고
