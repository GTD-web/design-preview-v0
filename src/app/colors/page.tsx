"use client";

import React from "react";
import { Card } from "@/packages/design-system/components/Card";
import { Button } from "@/packages/design-system/components/Button";
import Badge from "@/packages/design-system/components/Badge";
import { Text } from "@/packages/design-system/components/Text";
import { Grid, GridItem } from "@/packages/design-system/components/Grid";
import { useDesignSettings } from "@lumir-company/design-system-v0";

// 색상 정보 데이터
const colorData = [
  {
    name: "primary",
    title: "Primary (주색상)",
    description: "브랜드나 서비스의 대표 색상으로, 버튼, 링크, 강조 텍스트 등 가장 중심이 되는 요소에 사용합니다.",
    usage: ["주요 액션 버튼", "중요 링크", "브랜드 강조"],
    usageDetails: "UI의 전체적인 톤을 결정하는 메인 색상으로, 페이지당 1-2개의 요소에만 제한적으로 사용하세요.",
    className: "bg-primary",
    textClass: "text-primary-foreground",
    example: <Button className="bg-primary text-primary-foreground text-sm px-4 py-2">주요 액션</Button>
  },
  {
    name: "secondary",
    title: "Secondary (보조색상)",
    description: "primarycolor를 보완하는 색상으로, 보조 버튼, 카드, 탭 등에서 사용됩니다.",
    usage: ["보조 액션 버튼", "정보 카드", "탭 메뉴"],
    usageDetails: "주로 primarycolor와 대비되거나 조화를 이루는 색상으로 적당히 사용하세요.",
    className: "bg-secondary",
    textClass: "text-secondary-foreground",
    example: <Button className="bg-secondary text-secondary-foreground text-sm px-4 py-2">보조 액션</Button>
  },
  {
    name: "accent",
    title: "Accent (강조색상)",
    description: "사용자 시선을 끌고 싶은 버튼, 링크, 알림, 활성화된 요소 등에 소량 사용합니다.",
    usage: ["알림 배지", "강조 버튼", "활성화 상태"],
    usageDetails: "인터페이스에서 중요한 부분을 강조하거나 구분할 때 매우 제한적으로 사용하세요.",
    className: "bg-accent",
    textClass: "text-accent-foreground",
    example: <Badge color="primary" className="bg-accent text-accent-foreground text-xs">NEW</Badge>
  },
  {
    name: "success",
    title: "Success (성공 색상)",
    description: "동작이 성공적으로 완료됐을 때 메시지, 배지, 아이콘 등에 사용합니다.",
    usage: ["성공 메시지", "완료 상태", "승인 표시"],
    usageDetails: "일반적으로 초록색 계열로, 긍정적인 피드백을 제공할 때 사용합니다.",
    className: "bg-success",
    textClass: "text-white",
    example: <div className="bg-success/10 border border-success text-success px-3 py-1 rounded text-sm flex items-center gap-1">
      <span>✅</span>성공!
    </div>
  },
  {
    name: "warning",
    title: "Warning (경고 색상)",
    description: "주의가 필요한 상황(예: 만료 임박, 위험 가능성 등)에 메시지, 배지, 아이콘 등에 사용합니다.",
    usage: ["경고 메시지", "주의 알림", "만료 임박"],
    usageDetails: "주로 노란색 계열로, 사용자의 주의를 끌어야 할 때 사용합니다.",
    className: "bg-warning",
    textClass: "text-black",
    example: <div className="bg-warning/10 border border-warning text-warning px-3 py-1 rounded text-sm flex items-center gap-1">
      <span>⚠️</span>주의!
    </div>
  },
  {
    name: "danger",
    title: "Danger (위험/실패 색상)",
    description: "오류, 실패, 삭제, 위험 등 부정적인 상황을 나타낼 때 사용합니다.",
    usage: ["오류 메시지", "삭제 버튼", "실패 상태"],
    usageDetails: "일반적으로 빨간색 계열로, 위험하거나 되돌릴 수 없는 동작에 사용합니다.",
    className: "bg-danger",
    textClass: "text-white",
    example: <Button className="bg-danger text-white text-sm px-3 py-1">삭제</Button>
  },
  {
    name: "info",
    title: "Info (정보 색상)",
    description: "정보 제공, 안내 메시지, 힌트 등 중립적인 알림에 사용합니다.",
    usage: ["정보 메시지", "안내 알림", "힌트"],
    usageDetails: "파란색 계열로, 중립적인 정보를 전달할 때 사용합니다.",
    className: "bg-info",
    textClass: "text-white",
    example: <div className="bg-info/10 border border-info text-info px-3 py-1 rounded text-sm flex items-center gap-1">
      <span>ℹ️</span>정보
    </div>
  },
  {
    name: "surface",
    title: "Surface (표면 색상)",
    description: "카드, 모달, 팝오버 등 UI 컴포넌트의 표면(배경) 색상에 사용합니다.",
    usage: ["카드 배경", "모달 표면", "팝오버"],
    usageDetails: "일반 backgroundcolor와 구분되는 색상으로 계층감을 줍니다.",
    className: "bg-surface",
    textClass: "text-foreground",
    example: <Card className="bg-surface border-border p-3"><Text size="sm">카드 내용</Text></Card>
  },
  {
    name: "background",
    title: "Background (배경 색상)",
    description: "전체 페이지, 섹션, 앱의 기본 배경에 사용합니다.",
    usage: ["페이지 배경", "섹션 배경", "앱 기본"],
    usageDetails: "가장 넓은 면적을 차지하는 기본 배경 색상입니다.",
    className: "bg-background",
    textClass: "text-foreground",
    example: <div className="bg-background border border-border p-3 rounded text-sm">기본 배경</div>
  },
  {
    name: "foreground",
    title: "Foreground (전경 색상)",
    description: "텍스트, 아이콘 등 배경 위에 올라가는 주요 콘텐츠의 색상입니다.",
    usage: ["기본 텍스트", "아이콘", "전경 요소"],
    usageDetails: "backgroundcolor와 대비를 이루어 가독성을 높입니다.",
    className: "bg-foreground",
    textClass: "text-background",
    example: <Text className="text-foreground">기본 텍스트</Text>
  },
  {
    name: "muted",
    title: "Muted (약화 색상)",
    description: "비활성화된 버튼, 보조 텍스트, 덜 중요한 정보 등 눈에 띄지 않게 하고 싶은 요소에 사용합니다.",
    usage: ["보조 텍스트", "비활성 상태", "덜 중요한 정보"],
    usageDetails: "주요 콘텐츠보다 덜 중요한 정보를 표시할 때 사용합니다.",
    className: "bg-muted",
    textClass: "text-muted-foreground",
    example: <Text className="text-muted-foreground text-sm">보조 텍스트</Text>
  }
];

// 추가 색상 정보 (Shadcn 토큰)
const additionalColors = [
  {
    name: "card",
    title: "Card (카드 배경 색상)",
    description: "카드 컴포넌트의 배경에 사용합니다.",
    className: "bg-card",
    textClass: "text-card-foreground"
  },
  {
    name: "popover",
    title: "Popover (팝오버 배경 색상)",
    description: "팝오버, 툴팁 등 임시로 뜨는 UI 요소의 배경색입니다.",
    className: "bg-popover",
    textClass: "text-popover-foreground"
  },
  {
    name: "destructive",
    title: "Destructive (파괴적 동작 색상)",
    description: "삭제, 영구적 변경 등 위험하거나 되돌릴 수 없는 동작을 나타낼 때 사용합니다.",
    className: "bg-destructive",
    textClass: "text-destructive-foreground"
  },
  {
    name: "input",
    title: "Input (입력창 배경 색상)",
    description: "입력 필드, 텍스트박스 등 폼 요소의 배경색입니다.",
    className: "bg-input",
    textClass: "text-foreground"
  },
  {
    name: "ring",
    title: "Ring (포커스 링 색상)",
    description: "포커스가 갔을 때 요소 주위에 나타나는 테두리(아웃라인) 색상입니다.",
    className: "bg-ring",
    textClass: "text-foreground"
  },
  {
    name: "border",
    title: "Border (테두리 색상)",
    description: "카드, 입력창, 구분선 등 요소의 경계선을 표시할 때 사용합니다.",
    className: "bg-border",
    textClass: "text-foreground"
  }
];

export default function ColorsPage() {
  // 테마 변경 훅 사용
  const { theme, setTheme } = useDesignSettings();

  // 테마 토글 함수
  const toggleTheme = () => {
    setTheme(theme === 'shadcn-v0-light' ? 'shadcn-v0-dark' : 'shadcn-v0-light');
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* 네비게이션 */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          뒤로 가기
        </Button>
      </div>

      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-h1 font-heading font-weight-heading">
            🎨 디자인 시스템 색상 가이드
          </h1>
          
          {/* 테마 변경 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="flex items-center gap-2"
          >
            {theme === 'shadcn-v0-light' ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                다크 모드
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                라이트 모드
              </>
            )}
          </Button>
        </div>
        
        <Text className="text-muted-foreground text-lg">
          디자인 시스템의 색상 토큰과 각 색상의 용도를 확인할 수 있습니다. 테마를 변경하여 다크/라이트 모드에서의 색상을 비교해보세요.
        </Text>
      </div>

      {/* 주요 색상 */}
      <div className="mb-12">
        <h2 className="text-h2 font-heading font-weight-heading mb-6">
          주요 색상 토큰
        </h2>
        <Grid cols={1} gap="lg" className="md:grid-cols-2 lg:grid-cols-3">
          {colorData.map((color) => (
            <GridItem key={color.name}>
              <Card className="p-6 h-full">
                {/* 색상 미리보기 */}
                <div className={`w-full h-24 rounded-lg mb-4 flex items-center justify-center ${color.className} ${color.textClass}`}>
                  <span className="font-mono text-sm font-medium">
                    {color.name}
                  </span>
                </div>

                {/* 색상 정보 */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {color.title}
                    </h3>
                    <Text size="sm" className="text-muted-foreground">
                      {color.description}
                    </Text>
                  </div>

                  {/* 사용 용도 */}
                  <div>
                    <Text size="sm" className="font-medium text-foreground mb-2">
                      주요 사용처:
                    </Text>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {color.usage.map((use, index) => (
                        <Badge key={index} color="gray" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                    <Text size="xs" className="text-muted-foreground">
                      {color.usageDetails}
                    </Text>
                  </div>

                  {/* CSS 클래스 */}
                  <div>
                    <Text size="sm" className="font-medium text-foreground mb-2">
                      CSS 클래스:
                    </Text>
                    <div className="bg-muted rounded px-2 py-1">
                      <code className="text-xs font-mono text-muted-foreground">
                        {color.className}
                      </code>
                    </div>
                  </div>

                  {/* 사용 예시 */}
                  <div>
                    <Text size="sm" className="font-medium text-foreground mb-2">
                      사용 예시:
                    </Text>
                    <div className="flex items-center">
                      {color.example}
                    </div>
                  </div>
                </div>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </div>

      {/* Shadcn 토큰 색상 */}
      <div className="mb-12">
        <h2 className="text-h2 font-heading font-weight-heading mb-6">
          Shadcn 토큰 색상
        </h2>
        <Grid cols={1} gap="md" className="md:grid-cols-2 lg:grid-cols-3">
          {additionalColors.map((color) => (
            <GridItem key={color.name}>
              <Card className="p-4">
                {/* 색상 미리보기 */}
                <div className={`w-full h-16 rounded mb-3 flex items-center justify-center ${color.className} ${color.textClass}`}>
                  <span className="font-mono text-sm font-medium">
                    {color.name}
                  </span>
                </div>

                {/* 색상 정보 */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {color.title}
                  </h3>
                  <Text size="sm" className="text-muted-foreground">
                    {color.description}
                  </Text>
                  <div className="bg-muted rounded px-2 py-1">
                    <code className="text-xs font-mono text-muted-foreground">
                      {color.className}
                    </code>
                  </div>
                </div>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </div>

      {/* 색상 사용 가이드라인 */}
      <div className="mb-12">
        <h2 className="text-h2 font-heading font-weight-heading mb-6">
          사용 가이드라인
        </h2>
        <Grid cols={1} gap="lg" className="md:grid-cols-2 lg:grid-cols-3">
          <GridItem>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                🎯 색상 우선순위
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <Text size="sm">
                    <strong>Primary:</strong> 가장 중요한 액션 (페이지당 1-2개)
                  </Text>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-secondary rounded"></div>
                  <Text size="sm">
                    <strong>Secondary:</strong> 보조 액션 (적당히 사용)
                  </Text>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-accent rounded"></div>
                  <Text size="sm">
                    <strong>Accent:</strong> 강조 요소 (매우 제한적 사용)
                  </Text>
                </div>
              </div>
            </Card>
          </GridItem>

          <GridItem>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                ♿ 접근성 고려사항
              </h3>
              <div className="space-y-2">
                <Text size="sm">
                  • 충분한 색상 대비로 가독성 확보
                </Text>
                <Text size="sm">
                  • 색상만으로 정보 전달 금지
                </Text>
                <Text size="sm">
                  • 색맹 사용자를 위한 대체 표현 제공
                </Text>
                <Text size="sm">
                  • 다크/라이트 모드 모두 고려
                </Text>
              </div>
            </Card>
          </GridItem>

          <GridItem>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                🌓 테마 적응성
              </h3>
              <div className="space-y-3">
                <Text size="sm">
                  현재 테마: <Badge color="primary" className="ml-1">
                    {theme === 'shadcn-v0-light' ? '라이트 모드' : '다크 모드'}
                  </Badge>
                </Text>
                <Text size="sm">
                  • 모든 색상은 테마에 따라 자동 조정됩니다
                </Text>
                <Text size="sm">
                  • 대비비는 WCAG 기준을 준수합니다
                </Text>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-full mt-2"
                >
                  {theme === 'shadcn-v0-light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
                </Button>
              </div>
            </Card>
          </GridItem>
        </Grid>
      </div>

      {/* 테마 비교 섹션 */}
      <div className="mb-12">
        <h2 className="text-h2 font-heading font-weight-heading mb-6">
          테마별 색상 비교
        </h2>
        <Card className="p-6">
          <div className="mb-4">
            <Text className="font-medium text-foreground mb-2">
              현재 {theme === 'light' ? '라이트' : '다크'} 모드에서의 색상 표현:
            </Text>
            <Text size="sm" className="text-muted-foreground">
              테마를 변경하여 다른 모드에서의 색상을 확인해보세요.
            </Text>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {["primary", "secondary", "accent", "success", "warning", "danger"].map((colorName) => (
              <div key={colorName} className="text-center">
                <div className={`w-full h-16 rounded mb-2 bg-${colorName} border border-border`}></div>
                <Text size="xs" className="text-muted-foreground capitalize">
                  {colorName}
                </Text>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <Text size="sm" className="text-muted-foreground">
              💡 <strong>팁:</strong> 위의 테마 변경 버튼을 클릭하여 실시간으로 색상 변화를 확인할 수 있습니다. 
              각 색상은 라이트/다크 모드에서 최적의 가독성과 대비를 제공하도록 자동으로 조정됩니다.
            </Text>
          </div>
        </Card>
      </div>

      {/* 실제 활용 예시 */}
      <div>
        <h2 className="text-h2 font-heading font-weight-heading mb-6">
          실제 활용 예시
        </h2>
        <Card className="p-6">
          <div className="space-y-6">
            {/* 버튼 예시 */}
            <div>
              <Text className="font-medium text-foreground mb-3">버튼 활용:</Text>
              <div className="flex flex-wrap gap-2">
                <Button className="bg-primary text-primary-foreground">주요 액션</Button>
                <Button className="bg-secondary text-secondary-foreground">보조 액션</Button>
                <Button className="bg-danger text-white">삭제</Button>
              </div>
            </div>
            
            {/* 배지 예시 */}
            <div>
              <Text className="font-medium text-foreground mb-3">배지 활용:</Text>
              <div className="flex flex-wrap gap-2">
                <Badge color="success">성공</Badge>
                <Badge color="warning">경고</Badge>
                <Badge color="info">정보</Badge>
                <Badge color="primary">NEW</Badge>
              </div>
            </div>

            {/* 알림 메시지 예시 */}
            <div>
              <Text className="font-medium text-foreground mb-3">알림 메시지 활용:</Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-success/10 border border-success text-success p-3 rounded">
                  ✅ 성공적으로 저장되었습니다.
                </div>
                <div className="bg-warning/10 border border-warning text-warning p-3 rounded">
                  ⚠️ 주의: 계정이 곧 만료됩니다.
                </div>
                <div className="bg-danger/10 border border-danger text-danger p-3 rounded">
                  ❌ 오류가 발생했습니다.
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 