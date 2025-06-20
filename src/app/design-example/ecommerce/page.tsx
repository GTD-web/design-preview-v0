"use client";

import React, { useState } from "react";
import { Card } from "@/packages/design-system/components/Card";
import { TextLabel, TextValue, TextHeading, TextSpan } from "@/packages/design-system/components/Text";
import Badge from "../../../../packages/design-system/components/Badge";
import { Button } from "@/packages/design-system/components/Button";
import { Select } from "@/packages/design-system/components/Select";
import { Input } from "@/packages/design-system/components/Input";
import { HStack, VStack, VSpace } from "@/packages/design-system/components/Stack";
import { Grid, GridItem } from "@/packages/design-system/components/Grid";
import { Flex1MinW0, Icon } from "@/packages/design-system/components/Box";

// 상품 데이터
const products = [
  {
    id: 1,
    name: "프리미엄 무선 이어폰",
    category: "전자제품",
    price: 129000,
    stock: 45,
    status: "active",
    rating: 4.8,
    sales: 1234,
    image: "🎧",
  },
  {
    id: 2,
    name: "스마트 워치 Pro",
    category: "웨어러블",
    price: 299000,
    stock: 12,
    status: "active",
    rating: 4.6,
    sales: 856,
    image: "⌚",
  },
  {
    id: 3,
    name: "노트북 스탠드",
    category: "액세서리",
    price: 45000,
    stock: 0,
    status: "out_of_stock",
    rating: 4.2,
    sales: 234,
    image: "💻",
  },
  {
    id: 4,
    name: "블루투스 스피커",
    category: "오디오",
    price: 89000,
    stock: 23,
    status: "active",
    rating: 4.5,
    sales: 567,
    image: "🔊",
  },
  {
    id: 5,
    name: "무선 충전기",
    category: "액세서리",
    price: 35000,
    stock: 67,
    status: "active",
    rating: 4.3,
    sales: 789,
    image: "🔋",
  },
];

const categories = ["전체", "전자제품", "웨어러블", "액세서리", "오디오"];
const statuses = ["전체", "판매중", "품절"];

export default function EcommercePage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "전체" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "전체" ||
      (selectedStatus === "판매중" && product.status === "active") ||
      (selectedStatus === "품절" && product.status === "out_of_stock");
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "sales":
        return b.sales - a.sales;
      case "rating":
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const totalRevenue = products.reduce((sum, product) => sum + product.price * product.sales, 0);
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;

  return (
    <div className="min-h-screen p-6">
      <Grid cols={4} gap="layout" className="grid-cols-1 lg:grid-cols-4">
        {/* 좌측 사이드바 */}
        <GridItem span={1} className="lg:col-span-1">
          <VSpace gap="lg">
            {/* 통계 카드 */}
            <Card className="p-lg">
              <TextHeading size="lg" className="mb-md">
                상점 통계
              </TextHeading>
              <VSpace gap="md">
                <HStack justify="between" align="center">
                  <TextLabel>총 매출</TextLabel>
                  <TextValue size="lg" weight="semibold" className="text-primary">
                    {totalRevenue.toLocaleString()}원
                  </TextValue>
                </HStack>
                <HStack justify="between" align="center">
                  <TextLabel>총 상품</TextLabel>
                  <TextValue>{totalProducts}개</TextValue>
                </HStack>
                <HStack justify="between" align="center">
                  <TextLabel>판매중</TextLabel>
                  <TextValue>{activeProducts}개</TextValue>
                </HStack>
              </VSpace>
            </Card>

            {/* 필터 */}
            <Card className="p-lg">
              <TextHeading size="lg" className="mb-md">
                필터
              </TextHeading>
              <VStack gap="md">
                <Select
                  label="카테고리"
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                  options={categories.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                  width="240px"
                />
                <Select
                  label="상태"
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value)}
                  options={statuses.map((status) => ({
                    value: status,
                    label: status,
                  }))}
                  width="240px"
                />
              </VStack>
            </Card>
          </VSpace>
        </GridItem>

        {/* 메인 콘텐츠 */}
        <GridItem span={3} className="lg:col-span-3">
          <Card className="p-lg">
            {/* 헤더 */}
            <HStack justify="between" align="center" className="mb-lg">
              <div>
                <TextHeading size="2xl" weight="semibold">
                  상품 관리
                </TextHeading>
                <TextLabel className="mt-xs">총 {sortedProducts.length}개의 상품</TextLabel>
              </div>
              <Button className="w-fit" gradient gradientType="primary">
                + 새 상품 추가
              </Button>
            </HStack>

            {/* 검색 및 정렬 */}
            <HStack gap="md" className="mb-lg">
              <Input
                type="text"
                placeholder="상품명으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                clearable="button"
                clearText="초기화"
                onClear={() => setSearchQuery("")}
                className="flex-1"
              />
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                options={[
                  { value: "name", label: "이름순" },
                  { value: "price", label: "가격순" },
                  { value: "sales", label: "판매순" },
                  { value: "rating", label: "평점순" },
                ]}
                width="160px"
              />
            </HStack>

            {/* 상품 목록 */}
            <VStack gap="md">
              {sortedProducts.map((product) => (
                <HStack gap="md" align="center" className="p-4 border border-border rounded-lg hover:bg-surface/50 transition-colors">
                  <Icon size="2xl">{product.image}</Icon>
                  <Flex1MinW0>
                    <HStack gap="md" align="center" className="mb-1">
                      <TextValue weight="semibold" className="truncate">
                        {product.name}
                      </TextValue>
                      {product.status === "out_of_stock" && <Badge color="black">품절</Badge>}
                    </HStack>
                    <HStack gap="md" align="center" className="text-sm text-gray-600">
                      <TextSpan size="sm" color="muted">
                        {product.category}
                      </TextSpan>
                      <TextSpan size="sm" color="muted">
                        ⭐ {product.rating}
                      </TextSpan>
                      <TextSpan size="sm" color="muted">
                        판매 {product.sales}개
                      </TextSpan>
                    </HStack>
                  </Flex1MinW0>
                  <div className="text-right">
                    <VStack gap="xs" align="end">
                      <TextValue weight="semibold" className="text-primary">
                        {product.price.toLocaleString()}원
                      </TextValue>
                      <TextSpan size="sm" color="muted">
                        재고: {product.stock}개
                      </TextSpan>
                    </VStack>
                  </div>
                  <HStack gap="md">
                    <Button variant="ghost" size="sm">
                      수정
                    </Button>
                    <Button variant="ghost" size="sm">
                      삭제
                    </Button>
                  </HStack>
                </HStack>
              ))}
            </VStack>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📦</div>
                <TextValue>검색 결과가 없습니다.</TextValue>
              </div>
            )}
          </Card>
        </GridItem>
      </Grid>
    </div>
  );
}
