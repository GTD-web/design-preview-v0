"use client";

import { useState } from "react";
import { useDesignSettings } from "@/packages/design-system/hooks/useDesignSettings";
import {
  Button,
  Card,
  Input,
  Select,
  Badge,
  Box,
  Grid,
  GridItem,
  HStack,
  VStack,
  TextSpan,
  TextP,
  TextDiv,
  TextHeading,
  TextValue,
  TextLabel,
  Drawer,
  LayoutContainer,
} from "@lumir-company/design-system-v0";

export default function ComponentLibrary() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  
  const {
    theme,
    setShadcnV0Light,
    setShadcnV0Dark,
  } = useDesignSettings();

  const selectOptions = [
    { value: "option1", label: "옵션 1" },
    { value: "option2", label: "옵션 2" },
    { value: "option3", label: "옵션 3" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 네비게이션 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-foreground">컴포넌트 라이브러리</h1>
              <a 
                href="/" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← 홈으로
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground mr-2">테마:</span>
              <div className="flex gap-1">
                <button 
                  onClick={setShadcnV0Light}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    theme === 'shadcn-v0-light'
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-muted text-muted-foreground hover:bg-blue-100 hover:text-blue-700'
                  }`}
                >
                  Shadcn V0 Light
                </button>
                <button 
                  onClick={setShadcnV0Dark}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    theme === 'shadcn-v0-dark'
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-muted text-muted-foreground hover:bg-blue-100 hover:text-blue-700'
                  }`}
                >
                  Shadcn V0 Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Button 컴포넌트 */}
          <section>
            <TextHeading className="text-2xl font-bold mb-6">Button 컴포넌트</TextHeading>
            <Card className="p-6">
              <VStack gap="md">
                <div>
                  <TextLabel className="block mb-2">기본 Variant</TextLabel>
                  <HStack gap="md">
                    <Button variant="primary">기본 버튼</Button>
                    <Button variant="secondary">보조 버튼</Button>
                    <Button variant="outline">아웃라인 버튼</Button>
                    <Button variant="ghost">고스트 버튼</Button>
                  </HStack>
                </div>
                
                <div>
                  <TextLabel className="block mb-2">사이즈</TextLabel>
                  <HStack gap="md">
                    <Button size="sm">작은 버튼</Button>
                    <Button size="md">기본 버튼</Button>
                    <Button size="lg">큰 버튼</Button>
                  </HStack>
                </div>
                
                <div>
                  <TextLabel className="block mb-2">특수 버튼</TextLabel>
                  <HStack gap="md">
                    <Button variant="toggle">토글 버튼</Button>
                    <Button variant="toggle" selected>선택된 토글</Button>
                  </HStack>
                </div>

                <div>
                  <TextLabel className="block mb-2">Gradient 버튼</TextLabel>
                  <HStack gap="md">
                    <Button gradient gradientType="primary">Primary Gradient</Button>
                    <Button gradient gradientType="sunset">Sunset Gradient</Button>
                    <Button gradient gradientType="ocean">Ocean Gradient</Button>
                  </HStack>
                </div>
                
                <div>
                  <TextLabel className="block mb-2">비활성화 상태 (Disabled)</TextLabel>
                  <VStack gap="sm">
                    <HStack gap="md">
                      <Button disabled>기본 비활성화</Button>
                      <Button disabled variant="primary">Primary 비활성화</Button>
                      <Button disabled variant="secondary">Secondary 비활성화</Button>
                      <Button disabled variant="outline">Outline 비활성화</Button>
                    </HStack>
                    <HStack gap="md">
                      <Button disabled variant="ghost">Ghost 비활성화</Button>
                      <Button disabled variant="toggle">Toggle 비활성화</Button>
                      <Button disabled size="sm">작은 비활성화</Button>
                      <Button disabled size="lg">큰 비활성화</Button>
                    </HStack>
                    <HStack gap="md">
                      <Button disabled gradient gradientType="primary">Gradient 비활성화</Button>
                      <Button disabled gradient gradientType="sunset">Sunset 비활성화</Button>
                    </HStack>
                  </VStack>
                </div>
              </VStack>
            </Card>
          </section>

          {/* Input 컴포넌트 */}
          <section>
            <TextHeading className="text-2xl font-bold mb-6">Input 컴포넌트</TextHeading>
            <Card className="p-6">
              <VStack gap="md">
                <div className="w-full max-w-md">
                  <TextLabel className="block mb-2">기본 입력</TextLabel>
                  <Input
                    placeholder="여기에 입력하세요"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <div className="w-full max-w-md">
                  <TextLabel className="block mb-2">비밀번호 입력</TextLabel>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                  />
                </div>
                <div className="w-full max-w-md">
                  <TextLabel className="block mb-2">비활성화 입력</TextLabel>
                  <Input
                    placeholder="비활성화된 입력"
                    disabled
                  />
                </div>
              </VStack>
            </Card>
          </section>

          {/* Select 컴포넌트 */}
          <section>
            <TextHeading className="text-2xl font-bold mb-6">Select 컴포넌트</TextHeading>
            <Card className="p-6">
              <div className="w-full max-w-md">
                <TextLabel className="block mb-2">선택 컴포넌트</TextLabel>
                <Select
                  options={selectOptions}
                  value={selectValue}
                  onChange={setSelectValue}
                />
              </div>
            </Card>
          </section>

          {/* Badge 컴포넌트 */}
          <section>
            <TextHeading className="text-2xl font-bold mb-6">Badge 컴포넌트</TextHeading>
            <Card className="p-6">
              <HStack gap="md">
                <Badge color="primary">기본</Badge>
                <Badge color="success">성공</Badge>
                <Badge color="warning">경고</Badge>
                <Badge color="danger">위험</Badge>
                <Badge color="info">정보</Badge>
                <Badge color="gray">회색</Badge>
              </HStack>
            </Card>
          </section>

          {/* Text 컴포넌트들 */}
          <section>
            <TextHeading className="text-2xl font-bold mb-6">Text 컴포넌트</TextHeading>
            <Card className="p-6">
              <VStack gap="md">
                <TextHeading>이것은 제목입니다</TextHeading>
                <TextP>이것은 단락 텍스트입니다. 일반적인 본문 내용을 표시할 때 사용합니다.</TextP>
                <TextDiv>이것은 div 텍스트입니다.</TextDiv>
                <div>
                  <TextLabel>레이블:</TextLabel>
                  <TextValue className="ml-2">값</TextValue>
                </div>
                <TextSpan>이것은 span 텍스트입니다.</TextSpan>
              </VStack>
            </Card>
          </section>

          {/* Layout 컴포넌트들 */}
          <section>
            <TextHeading className="text-2xl font-bold mb-6">Layout 컴포넌트</TextHeading>
            <Card className="p-6">
              <VStack gap="lg">
                <div>
                  <TextLabel className="block mb-2">Box 컴포넌트</TextLabel>
                  <Box className="p-4 bg-muted rounded">
                    Box 컴포넌트 예시
                  </Box>
                </div>
                
                <div>
                  <TextLabel className="block mb-2">Grid 컴포넌트</TextLabel>
                  <Grid cols={3} gap="md">
                    <GridItem>
                      <Box className="p-4 bg-muted rounded text-center">Grid 1</Box>
                    </GridItem>
                    <GridItem>
                      <Box className="p-4 bg-muted rounded text-center">Grid 2</Box>
                    </GridItem>
                    <GridItem>
                      <Box className="p-4 bg-muted rounded text-center">Grid 3</Box>
                    </GridItem>
                  </Grid>
                </div>

                <div>
                  <TextLabel className="block mb-2">Stack 컴포넌트</TextLabel>
                  <VStack gap="sm">
                    <Box className="p-2 bg-muted rounded">VStack 아이템 1</Box>
                    <Box className="p-2 bg-muted rounded">VStack 아이템 2</Box>
                  </VStack>
                  <div className="my-4" />
                  <HStack gap="sm">
                    <Box className="p-2 bg-muted rounded">HStack 아이템 1</Box>
                    <Box className="p-2 bg-muted rounded">HStack 아이템 2</Box>
                  </HStack>
                </div>
              </VStack>
            </Card>
          </section>

          {/* Drawer 컴포넌트 */}
          <section>
            <TextHeading className="text-2xl font-bold mb-6">Drawer 컴포넌트</TextHeading>
            <Card className="p-6">
              <Button onClick={() => setIsDrawerOpen(true)}>
                Drawer 열기
              </Button>
              <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="예시 Drawer"
              >
                <div className="p-4">
                  <TextP>이것은 Drawer 내용입니다.</TextP>
                  <div className="my-4" />
                  <Button onClick={() => setIsDrawerOpen(false)}>
                    닫기
                  </Button>
                </div>
              </Drawer>
            </Card>
          </section>

          {/* LayoutContainer 컴포넌트 */}
          <section>
            <TextHeading className="text-2xl font-bold mb-6">LayoutContainer 컴포넌트</TextHeading>
            <Card className="p-6">
              <LayoutContainer>
                <TextP>LayoutContainer 안의 내용입니다. 이 컴포넌트는 일관된 레이아웃을 제공합니다.</TextP>
              </LayoutContainer>
            </Card>
          </section>

          {/* Card 컴포넌트 */}
          <section>
            <TextHeading className="text-2xl font-bold mb-6">Card 컴포넌트</TextHeading>
            <Grid cols={2} gap="md">
              <GridItem>
                <Card className="p-4">
                  <TextHeading className="text-lg mb-2">카드 제목 1</TextHeading>
                  <TextP>카드 내용입니다.</TextP>
                </Card>
              </GridItem>
              <GridItem>
                <Card className="p-4">
                  <TextHeading className="text-lg mb-2">카드 제목 2</TextHeading>
                  <TextP>또 다른 카드 내용입니다.</TextP>
                </Card>
              </GridItem>
            </Grid>
          </section>

        </div>
      </div>
    </div>
  );
} 