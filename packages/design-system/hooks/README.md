# TabBar Hook 리팩토링

`useTabBar.tsx` 파일이 1248줄로 매우 길어져서 기능별로 분리하여 리팩토링했습니다.

## 📂 새로운 파일 구조

### 1. **`types.ts`** - 타입 정의

- `PageInfo` - 페이지 정보 타입
- `TabItem` - 탭 아이템 타입
- `UseTabBarOptions` - 훅 옵션 타입
- `UseTabBarReturn` - 훅 반환값 타입

### 2. **`tabStorageUtils.ts`** - 로컬 스토리지 관리

- `loadTabsFromStorage()` - 로컬 스토리지에서 탭 데이터 로드
- `saveTabsToStorage()` - 로컬 스토리지에 탭 데이터 저장

### 3. **`tabPathUtils.ts`** - 경로 관련 유틸리티

- `createPathNormalizer()` - 경로 정규화 함수 생성
- `createTabIdGenerator()` - 탭 ID 생성 함수 생성
- `createPathComparer()` - 경로 비교 함수 생성
- `extractTabNameFromQuery()` - 쿼리에서 탭 이름 추출

### 4. **`tabComparisonUtils.ts`** - 탭 비교/매칭 로직

- `createTabFinder()` - 기존 탭 찾기 함수 생성
- `findMatchingTab()` - 현재 경로와 일치하는 탭 찾기
- `countSamePathTabs()` - 같은 경로 탭 개수 세기
- `checkTabExists()` - 탭 존재 여부 확인

### 5. **`useTabBar.tsx`** - 메인 훅 (리팩토링됨)

- 유틸리티 함수들을 사용하여 더 간결해짐
- `useMemo`를 사용해 유틸리티 함수들을 메모이제이션
- 의존성 배열 최적화

### 6. **`index.ts`** - 통합 export

- 모든 타입과 함수들의 중앙 집중식 export

## 🚀 개선된 점

### 1. **가독성 향상**

- 1248줄 → 각 파일 100-200줄로 분리
- 기능별로 명확하게 구분
- 주석과 문서화 개선

### 2. **재사용성 증대**

- 유틸리티 함수들을 독립적으로 사용 가능
- 다른 컴포넌트에서도 활용 가능
- 테스트 용이성 향상

### 3. **성능 최적화**

- `useMemo`를 활용한 함수 메모이제이션
- 불필요한 재계산 방지
- 의존성 배열 최적화

### 4. **유지보수성**

- 각 기능별로 독립적인 파일
- 수정 시 영향 범위 최소화
- 코드 중복 제거

## 🔄 마이그레이션 가이드

### 기존 사용법 (변경 없음)

```typescript
import { useTabBar } from "@/packages/design-system/hooks/useTabBar";

// 기존과 동일하게 사용 가능
const {
  tabs,
  activeTabId,
  addTab,
  removeTab,
  // ...
} = useTabBar({
  // options
});
```

### 새로운 import 방식 (권장)

```typescript
import { useTabBar, PageInfo, TabItem } from "@/packages/design-system/hooks";

// 또는 개별 유틸리티 사용
import { extractTabNameFromQuery } from "@/packages/design-system/hooks/tabPathUtils";
```

## 📊 리팩토링 전후 비교

| 항목              | 리팩토링 전             | 리팩토링 후   |
| ----------------- | ----------------------- | ------------- |
| 파일 수           | 1개                     | 6개           |
| 메인 파일 라인 수 | 1248줄                  | ~600줄        |
| 함수 분리도       | 모든 함수가 하나의 파일 | 기능별로 분리 |
| 재사용성          | 낮음                    | 높음          |
| 테스트 용이성     | 어려움                  | 쉬움          |
| 유지보수성        | 어려움                  | 쉬움          |

## 🧪 테스트

각 유틸리티 함수들이 독립적으로 분리되어 단위 테스트가 더 쉬워졌습니다:

```typescript
import {
  createPathNormalizer,
  extractTabNameFromQuery,
} from "@/packages/design-system/hooks/tabPathUtils";

// 단위 테스트 예시
describe("tabPathUtils", () => {
  test("createPathNormalizer should normalize paths correctly", () => {
    const normalize = createPathNormalizer();
    expect(normalize("/path/")).toBe("/path");
  });

  test("extractTabNameFromQuery should extract tab names", () => {
    const result = extractTabNameFromQuery("/path?tab-name=test");
    expect(result).toBe("test");
  });
});
```

## 🏗️ 향후 개선사항

1. **더 세분화된 분리**: 필요시 더 작은 단위로 분리 가능
2. **성능 모니터링**: 리팩토링 후 성능 변화 추적
3. **타입 안전성 강화**: 더 엄격한 타입 정의 추가
4. **에러 핸들링 개선**: 각 유틸리티별 에러 처리 강화
