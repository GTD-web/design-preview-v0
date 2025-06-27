# Shadcn Tokens 버전 관리

이 문서는 디자인 시스템에서 shadcn 토큰의 다양한 버전을 사용하는 방법을 설명합니다.

## 사용 가능한 버전

### v0 (Original)
- 기본적인 shadcn 컬러 시스템
- 중성적인 색상 팔레트
- 표준 radius 값
- 기본 차트 컬러

### v1 (Enhanced)
- 향상된 색상 대비
- 더 나은 접근성
- 개선된 사이드바 토큰
- 확장된 차트 컬러 팔레트
- 모던 UI에 최적화

## 사용 방법

### 1. CSS Import 방식

```css
/* v0 버전 사용 */
@import '@lumir-company/design-system-v0/styles/shadcn-tokens-v0.css';

/* v1 버전 사용 */
@import '@lumir-company/design-system-v0/styles/shadcn-tokens-v1.css';
```

### 2. TypeScript에서 동적으로 사용

```typescript
import { getShadcnTokenPath, getTokenConfig } from '@lumir-company/design-system-v0';

// 특정 버전의 토큰 경로 가져오기
const tokenPath = getShadcnTokenPath('v1');

// 토큰 설정 정보 가져오기
const config = getTokenConfig('v1');
console.log(config.description); // "Enhanced shadcn tokens with improved contrast and accessibility"
```

### 3. 사용 가능한 모든 버전 조회

```typescript
import { getAvailableTokenVersions } from '@lumir-company/design-system-v0';

const versions = getAvailableTokenVersions();
versions.forEach(version => {
  console.log(`${version.version}: ${version.description}`);
});
```

## 마이그레이션 가이드

### v0에서 v1으로 마이그레이션

1. CSS import 경로 변경:
   ```css
   /* Before */
   @import '@lumir-company/design-system-v0/styles/shadcn-tokens-v0.css';
   
   /* After */
   @import '@lumir-company/design-system-v0/styles/shadcn-tokens-v1.css';
   ```

2. 향상된 기능들:
   - 더 나은 대비율로 인한 접근성 개선
   - 사이드바 컴포넌트의 향상된 시각적 구분
   - 차트에서 더 다양한 색상 옵션

## 커스터마이징

각 버전의 토큰은 CSS 변수로 정의되어 있으므로, 필요에 따라 오버라이드할 수 있습니다:

```css
:root {
  /* v1의 primary 색상을 커스터마이징 */
  --primary: 210 100% 50%;
  --primary-foreground: 0 0% 100%;
}
```

## 버전별 주요 차이점

| 특성 | v0 | v1 |
|------|----|----|
| 색상 대비 | 표준 | 향상됨 |
| 접근성 | 기본 | 개선됨 |
| 사이드바 토큰 | 기본 | 확장됨 |
| 차트 색상 | 5개 | 5개 (개선된 색상) |
| radius | 0.65rem | 0.5rem | 