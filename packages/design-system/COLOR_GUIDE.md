# 디자인 시스템 색상 가이드

## 📋 개요
이 문서는 `@lumir-company/design-system-v0`의 색상 시스템과 각 색상의 용도를 설명합니다.

## 🎨 주요 색상 토큰별 사용 용도

### 1. **primarycolor (주색상)**
- **용도**: 브랜드나 서비스의 대표 색상으로, 버튼, 링크, 강조 텍스트 등 가장 중심이 되는 요소에 사용합니다.
- **특징**: UI의 전체적인 톤을 결정하는 메인 색상
- **사용 예시**:
  ```tsx
  <Button className="bg-primary text-primary-foreground">주요 액션</Button>
  <Link className="text-primary hover:text-primary/80">중요 링크</Link>
  ```

### 2. **secondarycolor (보조색상)**
- **용도**: primarycolor를 보완하는 색상으로, 보조 버튼, 카드, 탭 등에서 사용됩니다.
- **특징**: 주로 primarycolor와 대비되거나 조화를 이루는 색상
- **사용 예시**:
  ```tsx
  <Button variant="secondary" className="bg-secondary text-secondary-foreground">보조 액션</Button>
  <Card className="bg-secondary/10 border-secondary/20">정보 카드</Card>
  ```

### 3. **accentcolor (강조색상)**
- **용도**: 사용자 시선을 끌고 싶은 버튼, 링크, 알림, 활성화된 요소 등에 소량 사용합니다.
- **특징**: 인터페이스에서 중요한 부분을 강조하거나 구분할 때 사용
- **사용 예시**:
  ```tsx
  <Badge className="bg-accent text-accent-foreground">NEW</Badge>
  <Button variant="accent" className="bg-accent text-accent-foreground">강조 버튼</Button>
  ```

### 4. **successcolor (성공 색상)**
- **용도**: 동작이 성공적으로 완료됐을 때 메시지, 배지, 아이콘 등에 사용합니다.
- **특징**: 일반적으로 초록색 계열
- **사용 예시**:
  ```tsx
  <Alert className="bg-success/10 border-success text-success">
    <CheckIcon className="text-success" />
    성공적으로 저장되었습니다.
  </Alert>
  ```

### 5. **warningcolor (경고 색상)**
- **용도**: 주의가 필요한 상황(예: 만료 임박, 위험 가능성 등)에 메시지, 배지, 아이콘 등에 사용합니다.
- **특징**: 주로 노란색 계열
- **사용 예시**:
  ```tsx
  <Alert className="bg-warning/10 border-warning text-warning">
    <AlertTriangleIcon className="text-warning" />
    주의: 계정이 곧 만료됩니다.
  </Alert>
  ```

### 6. **dangercolor (위험/실패 색상)**
- **용도**: 오류, 실패, 삭제, 위험 등 부정적인 상황을 나타낼 때 사용합니다.
- **특징**: 일반적으로 빨간색 계열
- **사용 예시**:
  ```tsx
  <Button variant="destructive" className="bg-danger text-white">
    <TrashIcon className="w-4 h-4" />
    삭제
  </Button>
  ```

### 7. **infocolor (정보 색상)**
- **용도**: 정보 제공, 안내 메시지, 힌트 등 중립적인 알림에 사용합니다.
- **특징**: 파란색 계열이 많음
- **사용 예시**:
  ```tsx
  <Alert className="bg-info/10 border-info text-info">
    <InfoIcon className="text-info" />
    추가 정보를 확인하세요.
  </Alert>
  ```

### 8. **surfacecolor (표면 색상)**
- **용도**: 카드, 모달, 팝오버 등 UI 컴포넌트의 표면(배경) 색상에 사용합니다.
- **특징**: 일반적으로 backgroundcolor와 구분되는 밝은 색이나 중간색
- **사용 예시**:
  ```tsx
  <Card className="bg-surface border-border">
    <CardContent>카드 내용</CardContent>
  </Card>
  ```

### 9. **backgroundcolor (배경 색상)**
- **용도**: 전체 페이지, 섹션, 앱의 기본 배경에 사용합니다.
- **특징**: 가장 넓은 면적을 차지하는 색상
- **사용 예시**:
  ```tsx
  <div className="bg-background min-h-screen">
    <main className="bg-background">메인 콘텐츠</main>
  </div>
  ```

### 10. **bordercolor (테두리 색상)**
- **용도**: 카드, 입력창, 구분선 등 요소의 경계선을 표시할 때 사용합니다.
- **사용 예시**:
  ```tsx
  <Input className="border-border focus:border-ring" />
  <Separator className="bg-border" />
  ```

### 11. **foregroundcolor (전경 색상)**
- **용도**: 텍스트, 아이콘 등 배경 위에 올라가는 주요 콘텐츠의 색상입니다.
- **특징**: backgroundcolor와 대비를 이루어 가독성을 높임
- **사용 예시**:
  ```tsx
  <p className="text-foreground">기본 텍스트</p>
  <Icon className="text-foreground" />
  ```

### 12. **cardcolor (카드 배경 색상)**
- **용도**: 카드 컴포넌트의 배경에 사용합니다.
- **특징**: 일반 backgroundcolor와 차별화해 계층감을 줌
- **사용 예시**:
  ```tsx
  <Card className="bg-card border-border">
    <CardHeader className="text-card-foreground">
      <CardTitle>카드 제목</CardTitle>
    </CardHeader>
  </Card>
  ```

### 13. **popovercolor (팝오버 배경 색상)**
- **용도**: 팝오버, 툴팁 등 임시로 뜨는 UI 요소의 배경색입니다.
- **사용 예시**:
  ```tsx
  <Popover>
    <PopoverContent className="bg-popover text-popover-foreground">
      팝오버 내용
    </PopoverContent>
  </Popover>
  ```

### 14. **mutedcolor (약화 색상)**
- **용도**: 비활성화된 버튼, 보조 텍스트, 덜 중요한 정보 등 눈에 띄지 않게 하고 싶은 요소에 사용합니다.
- **사용 예시**:
  ```tsx
  <p className="text-muted-foreground">보조 텍스트</p>
  <Button disabled className="bg-muted text-muted-foreground">비활성화 버튼</Button>
  ```

### 15. **destructivecolor (파괴적 동작 색상)**
- **용도**: 삭제, 영구적 변경 등 위험하거나 되돌릴 수 없는 동작을 나타낼 때 사용합니다.
- **특징**: dangercolor와 유사하게 빨간색 계열이 많음
- **사용 예시**:
  ```tsx
  <Button variant="destructive" className="bg-destructive text-destructive-foreground">
    영구 삭제
  </Button>
  ```

### 16. **inputcolor (입력창 배경 색상)**
- **용도**: 입력 필드, 텍스트박스 등 폼 요소의 배경색입니다.
- **사용 예시**:
  ```tsx
  <Input className="bg-input border-border text-foreground" />
  <Textarea className="bg-input border-border text-foreground" />
  ```

### 17. **ringcolor (포커스 링 색상)**
- **용도**: 포커스가 갔을 때(예: 탭 이동, 클릭 등) 요소 주위에 나타나는 테두리(아웃라인) 색상입니다.
- **사용 예시**:
  ```tsx
  <Button className="focus:ring-2 focus:ring-ring focus:ring-offset-2">
    포커스 버튼
  </Button>
  ```

## 📊 색상 역할 요약표

| 색상 이름 | 주요 사용처 | 예시 컴포넌트 | CSS 클래스 |
|-----------|-------------|---------------|------------|
| primary | 대표 버튼, 링크, 브랜드 강조 | Button, Link | `bg-primary`, `text-primary` |
| secondary | 보조 버튼, 탭, 카드 | Button, Card, Tabs | `bg-secondary`, `text-secondary` |
| accent | 강조 버튼, 활성화 요소, 알림 배지 | Badge, Button | `bg-accent`, `text-accent` |
| success | 성공 메시지, 승인, 완료 표시 | Alert, Toast | `bg-success`, `text-success` |
| warning | 경고 메시지, 주의 필요 상황 | Alert, Toast | `bg-warning`, `text-warning` |
| danger | 오류, 삭제, 실패, 위험 동작 | Alert, Button | `bg-danger`, `text-danger` |
| info | 정보 메시지, 안내, 힌트 | Alert, Tooltip | `bg-info`, `text-info` |
| surface | 카드, 모달, 팝오버 표면 | Card, Modal | `bg-surface` |
| background | 전체 배경, 섹션 배경 | Body, Section | `bg-background` |
| border | 테두리, 구분선 | Input, Card | `border-border` |
| foreground | 텍스트, 아이콘 전경 요소 | Text, Icon | `text-foreground` |
| card | 카드 배경 | Card | `bg-card` |
| popover | 팝오버/툴팁 배경 | Popover, Tooltip | `bg-popover` |
| muted | 비활성, 보조 텍스트 | Disabled, Helper | `bg-muted`, `text-muted-foreground` |
| destructive | 삭제, 위험 동작 | Button, Alert | `bg-destructive` |
| input | 입력 필드 배경 | Input, Textarea | `bg-input` |
| ring | 포커스 아웃라인 | Focus states | `ring-ring` |

## 🎯 사용 가이드라인

### 1. 색상 우선순위
1. **Primary**: 가장 중요한 액션 (페이지당 1-2개)
2. **Secondary**: 보조 액션 (적당히 사용)
3. **Accent**: 강조 요소 (매우 제한적 사용)

### 2. 접근성 고려사항
- 충분한 색상 대비를 위해 `foreground` 색상과 함께 사용
- 색상만으로 정보를 전달하지 않고 텍스트나 아이콘과 함께 사용
- 색맹 사용자를 위한 대체 표현 제공

### 3. 일관성 유지
- 같은 의미의 액션에는 같은 색상 사용
- 브랜드 아이덴티티와 일관된 색상 팔레트 유지
- 테마 변경 시에도 색상 의미 유지

### 4. 반응형 고려사항
- 다크 모드와 라이트 모드에서 모두 적절한 대비 유지
- 모바일 환경에서도 터치하기 쉬운 색상 사용

## 🌈 테마별 색상 변형

### 라이트 테마
```css
:root {
  --primary: #171717;
  --secondary: #525252;
  --accent: #737373;
  --success: #16a34a;
  --warning: #fbbf24;
  --danger: #ef4444;
  --info: #0ea5e9;
}
```

### 다크 테마
```css
@media (prefers-color-scheme: dark) {
  :root {
    --primary: #fafafa;
    --secondary: #a3a3a3;
    --accent: #737373;
    --success: #4ade80;
    --warning: #fde047;
    --danger: #f87171;
    --info: #38bdf8;
  }
}
```

## 🔧 개발자 도구

### 색상 토큰 확인
```typescript
import { getTokenConfig } from '@lumir-company/design-system-v0';

// 토큰 설정 조회
const config = getTokenConfig('v1');
console.log(config.description);
```

### 사용 가능한 색상 조회
```typescript
import { getAvailableTokenVersions } from '@lumir-company/design-system-v0';

const versions = getAvailableTokenVersions();
versions.forEach(version => {
  console.log(`${version.version}: ${version.description}`);
});
```

---

이 가이드를 통해 일관되고 접근성이 높은 UI를 구축하세요! 🚀 