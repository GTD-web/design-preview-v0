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
import { Drawer } from "@/packages/design-system/components/Drawer";

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
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop&crop=center",
    description: "고음질 무선 이어폰으로, 노이즈 캔슬링 기능이 탑재되어 있습니다. 최대 30시간 재생 가능하며, IPX4 방수 등급을 가지고 있습니다.",
    features: ["노이즈 캔슬링", "30시간 재생", "IPX4 방수", "빠른 충전"],
    colors: ["블랙", "화이트", "블루"],
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
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center",
    description: "심박수 모니터링, GPS 추적, 운동 모드 등 다양한 건강 관리 기능을 제공하는 스마트워치입니다.",
    features: ["심박수 모니터링", "GPS 추적", "운동 모드", "7일 배터리"],
    colors: ["실버", "블랙", "로즈골드"],
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
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop&crop=center",
    description: "노트북을 더 편안한 각도로 사용할 수 있게 해주는 알루미늄 스탠드입니다.",
    features: ["알루미늄 소재", "조절 가능한 각도", "휴대용", "안정적인 지지"],
    colors: ["실버", "스페이스그레이"],
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
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop&crop=center",
    description: "360도 사운드를 제공하는 휴대용 블루투스 스피커입니다. IPX7 방수 등급으로 야외에서도 안전하게 사용할 수 있습니다.",
    features: ["360도 사운드", "IPX7 방수", "20시간 재생", "파티 모드"],
    colors: ["블랙", "레드", "블루", "옐로우"],
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
    imageUrl: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=100&h=100&fit=crop&crop=center",
    description: "15W 고속 무선 충전을 지원하는 충전 패드입니다. 다양한 기기와 호환되며 LED 표시등이 있어 충전 상태를 쉽게 확인할 수 있습니다.",
    features: ["15W 고속 충전", "LED 표시등", "다중 기기 호환", "과열 보호"],
    colors: ["화이트", "블랙"],
  },
];

const categories = ["전체", "전자제품", "웨어러블", "액세서리", "오디오"];
const statuses = ["전체", "판매중", "품절"];

export default function EcommercePage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
  const totalSales = products.reduce((sum, product) => sum + product.sales, 0);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <TextHeading size="2xl" weight="semibold">
              상품 관리
            </TextHeading>
            <TextLabel className="mt-xs">총 {sortedProducts.length}개의 상품</TextLabel>
          </div>
          <Button className="w-fit" gradient gradientType="primary">
            + 새 상품 추가
          </Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <TextLabel className="text-gray-600">총 매출</TextLabel>
                <TextValue weight="semibold" className="text-primary text-2xl">
                  {totalRevenue.toLocaleString()}원
                </TextValue>
                <TextLabel className="text-success text-sm">+8.2% 지난 달 대비</TextLabel>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </Card>

          <Card className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <TextLabel className="text-gray-600">총 상품</TextLabel>
                <TextValue weight="semibold" className="text-primary text-2xl">
                  {totalProducts}개
                </TextValue>
                <TextLabel className="text-success text-sm">+5.3% 지난 달 대비</TextLabel>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </Card>

          <Card className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <TextLabel className="text-gray-600">판매중</TextLabel>
                <TextValue weight="semibold" className="text-primary text-2xl">
                  {activeProducts}개
                </TextValue>
                <TextLabel className="text-success text-sm">+12.5% 지난 달 대비</TextLabel>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </Card>

          <Card className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <TextLabel className="text-gray-600">총 판매량</TextLabel>
                <TextValue weight="semibold" className="text-primary text-2xl">
                  {totalSales.toLocaleString()}개
                </TextValue>
                <TextLabel className="text-success text-sm">+15.7% 지난 달 대비</TextLabel>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </Card>
        </div>

        {/* 필터 및 검색 */}
        <Card className="p-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
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
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                options={categories.map((category) => ({
                  value: category,
                  label: category,
                }))}
                width="160px"
              />
              <Select
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
                options={statuses.map((status) => ({
                  value: status,
                  label: status,
                }))}
                width="160px"
              />
            </div>
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
          </div>
        </Card>

        {/* 상품 목록 테이블 */}
        <Card className="p-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted">상품</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted">카테고리</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted">가격</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted">재고</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted">평점</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted">판매량</th>
                  <th className="text-right py-3 px-4 font-medium text-sm text-muted">액션</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border/50 hover:bg-surface/50 transition-colors cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <td className="py-3 px-4">
                      <HStack gap="md" align="center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface flex items-center justify-center">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // 이미지 로드 실패시 이모지로 대체
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.nextElementSibling!.textContent = product.image;
                            }}
                          />
                          <span className="text-2xl hidden">{product.image}</span>
                        </div>
                        <div>
                          <TextValue weight="semibold" className="block">
                            {product.name}
                          </TextValue>
                        </div>
                      </HStack>
                    </td>
                    <td className="py-3 px-4">
                      <TextValue size="sm" color="muted">
                        {product.category}
                      </TextValue>
                    </td>
                    <td className="py-3 px-4">
                      <TextValue weight="semibold" className="text-primary">
                        {product.price.toLocaleString()}원
                      </TextValue>
                    </td>
                    <td className="py-3 px-4">
                      <TextValue size="sm">{product.stock}개</TextValue>
                    </td>
                    <td className="py-3 px-4">
                      {product.status === "active" ? (
                        <Badge color="success" size="md">
                          판매중
                        </Badge>
                      ) : (
                        <Badge color="danger" size="md">
                          품절
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <TextValue size="sm">⭐ {product.rating}</TextValue>
                    </td>
                    <td className="py-3 px-4">
                      <TextValue size="sm">{product.sales}개</TextValue>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <HStack gap="xs" justify="end">
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()} className="text-xs">
                          수정
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()} className="text-xs text-danger hover:text-danger">
                          삭제
                        </Button>
                      </HStack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📦</div>
              <TextValue>검색 결과가 없습니다.</TextValue>
            </div>
          )}
        </Card>
      </div>

      {/* 상품 상세 드로워 */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title="상품 상세"
        position="bottom"
        animationDuration={400}
        animationTiming="cubic-bezier(0.4, 0, 0.2, 1)"
        enableAnimation={true}
      >
        {/* 상품 이미지 */}
        <div className="text-center mb-lg">
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-surface mx-auto mb-md">
            <img
              src={selectedProduct?.imageUrl}
              alt={selectedProduct?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // 이미지 로드 실패시 이모지로 대체
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling!.textContent = selectedProduct?.image;
              }}
            />
            <span className="text-6xl items-center justify-center w-full h-full">{selectedProduct?.image}</span>
          </div>
        </div>

        {/* 상품 정보 */}
        <div>
          <TextHeading size="xl" weight="semibold" className="mb-xs">
            {selectedProduct?.name}
          </TextHeading>
          <TextValue size="lg" weight="semibold" className="text-primary">
            {selectedProduct?.price.toLocaleString()}원
          </TextValue>
        </div>

        <div>
          <TextLabel className="mb-xs block">카테고리</TextLabel>
          <TextValue className="block">{selectedProduct?.category}</TextValue>
        </div>

        <div>
          <TextLabel className="mb-xs block">상태</TextLabel>
          <div className="flex flex-col gap-xs">
            <TextValue className="block">{selectedProduct?.status === "active" ? "판매중" : "품절"}</TextValue>
          </div>
        </div>

        <div>
          <TextLabel className="mb-xs block">평점</TextLabel>
          <HStack gap="xs" align="center">
            <TextValue>⭐ {selectedProduct?.rating}</TextValue>
          </HStack>
        </div>

        <div>
          <TextLabel className="mb-xs block">판매량</TextLabel>
          <TextValue className="block">{selectedProduct?.sales}개</TextValue>
        </div>

        <div>
          <TextLabel className="mb-xs block">재고</TextLabel>
          <TextValue className="block">{selectedProduct?.stock}개</TextValue>
        </div>

        <div>
          <TextLabel className="mb-xs block">설명</TextLabel>
          <TextValue className="text-sm leading-relaxed block">{selectedProduct?.description}</TextValue>
        </div>

        <div>
          <TextLabel className="mb-xs">주요 기능</TextLabel>
          <div className="flex flex-wrap gap-xs">
            {selectedProduct?.features.map((feature: string, index: number) => (
              <Badge key={index} color="blue" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <TextLabel className="mb-xs">색상 옵션</TextLabel>
          <div className="flex flex-wrap gap-xs">
            {selectedProduct?.colors.map((color: string, index: number) => (
              <Badge key={index} color="gray" className="text-xs">
                {color}
              </Badge>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <HStack gap="md" className="mt-lg">
          <Button variant="outline" className="flex-1" onClick={closeDrawer}>
            닫기
          </Button>
          <Button className="flex-1" gradient gradientType="primary">
            수정하기
          </Button>
        </HStack>
      </Drawer>
    </div>
  );
}
