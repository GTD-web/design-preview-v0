"use client";

import React, { useState } from "react";
import { Card } from "@/packages/design-system/components/Card";
import TextLabel from "@/packages/design-system/components/TextLabel";
import TextValue from "@/packages/design-system/components/TextValue";
import TextHeading from "@/packages/design-system/components/TextHeading";
import Badge from "../../../../packages/design-system/components/Badge";

// 차트 데이터
const chartData = [
  { month: "1월", users: 1200, revenue: 45000, orders: 89 },
  { month: "2월", users: 1400, revenue: 52000, orders: 102 },
  { month: "3월", users: 1100, revenue: 48000, orders: 95 },
  { month: "4월", users: 1600, revenue: 61000, orders: 118 },
  { month: "5월", users: 1800, revenue: 68000, orders: 135 },
  { month: "6월", users: 2200, revenue: 82000, orders: 156 },
];

const topProducts = [
  { name: "프리미엄 이어폰", sales: 1234, revenue: 159186000, growth: 12.5 },
  { name: "스마트 워치", sales: 856, revenue: 255944000, growth: 8.2 },
  { name: "무선 충전기", sales: 789, revenue: 27615000, growth: -2.1 },
  { name: "블루투스 스피커", sales: 567, revenue: 50463000, growth: 15.7 },
  { name: "노트북 스탠드", sales: 234, revenue: 10530000, growth: 5.3 },
];

const recentActivity = [
  { type: "order", message: "새로운 주문 #12345", time: "2분 전", amount: "129,000원" },
  { type: "user", message: "새 사용자 가입", time: "5분 전" },
  { type: "payment", message: "결제 완료 #12344", time: "12분 전", amount: "299,000원" },
  { type: "refund", message: "환불 요청 #12343", time: "1시간 전", amount: "45,000원" },
  { type: "order", message: "새로운 주문 #12342", time: "2시간 전", amount: "89,000원" },
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6개월");

  const totalUsers = chartData.reduce((sum, data) => sum + data.users, 0);
  const totalRevenue = chartData.reduce((sum, data) => sum + data.revenue, 0);
  const totalOrders = chartData.reduce((sum, data) => sum + data.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  // 간단한 차트 렌더링 (SVG 기반)
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));
  const chartHeight = 200;
  const chartWidth = 600;

  return (
    <div className="min-h-screen">
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <TextHeading size="2xl" weight="semibold">
              Analytics 대시보드
            </TextHeading>
            <TextLabel className="mt-xs">실시간 데이터 및 인사이트</TextLabel>
          </div>
          <select
            className="border border-border rounded-lg px-4 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7일">최근 7일</option>
            <option value="30일">최근 30일</option>
            <option value="3개월">최근 3개월</option>
            <option value="6개월">최근 6개월</option>
            <option value="1년">최근 1년</option>
          </select>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <TextLabel className="text-gray-600 mb-2 block">총 사용자</TextLabel>
                <TextValue weight="semibold" className="text-primary text-2xl block">
                  {totalUsers.toLocaleString()}
                </TextValue>
                <TextLabel className="text-success text-sm block">+12.5% 지난 달 대비</TextLabel>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </Card>

          <Card className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <TextLabel className="text-gray-600 mb-2 block">총 매출</TextLabel>
                <TextValue weight="semibold" className="text-primary text-2xl block">
                  {totalRevenue.toLocaleString()}원
                </TextValue>
                <TextLabel className="text-success text-sm block">+8.2% 지난 달 대비</TextLabel>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </Card>

          <Card className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <TextLabel className="text-gray-600 mb-2 block">총 주문</TextLabel>
                <TextValue weight="semibold" className="text-primary text-2xl block">
                  {totalOrders.toLocaleString()}
                </TextValue>
                <TextLabel className="text-success text-sm block">+15.7% 지난 달 대비</TextLabel>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </Card>

          <Card className="p-lg">
            <div className="flex items-center justify-between">
              <div>
                <TextLabel className="text-gray-600 mb-2 block">평균 주문 금액</TextLabel>
                <TextValue weight="semibold" className="text-primary text-2xl block">
                  {avgOrderValue.toLocaleString()}원
                </TextValue>
                <TextLabel className="text-warning text-sm block">-2.1% 지난 달 대비</TextLabel>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </Card>
        </div>

        {/* 차트 및 상세 데이터 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 매출 차트 */}
          <div className="lg:col-span-2">
            <Card className="p-lg">
              <div className="flex items-center justify-between mb-lg">
                <TextHeading size="lg">매출 추이</TextHeading>
                <Badge color="primary">{selectedPeriod}</Badge>
              </div>

              {/* 간단한 SVG 차트 */}
              <div className="overflow-x-auto">
                <svg width={chartWidth} height={chartHeight} className="w-full">
                  {/* 그리드 라인 */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={chartHeight - (i * chartHeight) / 4}
                      x2={chartWidth}
                      y2={chartHeight - (i * chartHeight) / 4}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}

                  {/* 데이터 포인트 연결 */}
                  <polyline
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                    points={chartData
                      .map((data, i) => `${(i * chartWidth) / (chartData.length - 1)},${chartHeight - (data.revenue / maxRevenue) * chartHeight}`)
                      .join(" ")}
                  />

                  {/* 데이터 포인트 */}
                  {chartData.map((data, i) => (
                    <circle
                      key={i}
                      cx={(i * chartWidth) / (chartData.length - 1)}
                      cy={chartHeight - (data.revenue / maxRevenue) * chartHeight}
                      r="4"
                      fill="var(--color-primary)"
                    />
                  ))}

                  {/* X축 라벨 */}
                  {chartData.map((data, i) => (
                    <text key={i} x={(i * chartWidth) / (chartData.length - 1)} y={chartHeight + 20} textAnchor="middle" className="text-xs fill-gray-600">
                      {data.month}
                    </text>
                  ))}
                </svg>
              </div>
            </Card>
          </div>

          {/* 실시간 활동 */}
          <div className="lg:col-span-1">
            <Card className="p-lg">
              <TextHeading size="lg" className="mb-lg">
                실시간 활동
              </TextHeading>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-surface/50 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "order"
                          ? "bg-primary"
                          : activity.type === "user"
                          ? "bg-success"
                          : activity.type === "payment"
                          ? "bg-info"
                          : "bg-warning"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <TextValue className="truncate text-sm">{activity.message}</TextValue>
                      <TextLabel className="text-gray-500 text-xs">{activity.time}</TextLabel>
                    </div>
                    {activity.amount && (
                      <TextValue size="sm" weight="semibold" className="text-primary">
                        {activity.amount}
                      </TextValue>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* 인기 상품 */}
        <Card className="p-lg">
          <TextHeading size="lg" className="mb-lg">
            인기 상품
          </TextHeading>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">
                    <TextLabel>상품명</TextLabel>
                  </th>
                  <th className="text-right py-3 px-4">
                    <TextLabel>판매량</TextLabel>
                  </th>
                  <th className="text-right py-3 px-4">
                    <TextLabel>매출</TextLabel>
                  </th>
                  <th className="text-right py-3 px-4">
                    <TextLabel>성장률</TextLabel>
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b border-border hover:bg-surface/30">
                    <td className="py-3 px-4">
                      <TextValue weight="semibold">{product.name}</TextValue>
                    </td>
                    <td className="text-right py-3 px-4">
                      <TextValue>{product.sales.toLocaleString()}</TextValue>
                    </td>
                    <td className="text-right py-3 px-4">
                      <TextValue weight="semibold" className="text-primary">
                        {product.revenue.toLocaleString()}원
                      </TextValue>
                    </td>
                    <td className="text-right py-3 px-4">
                      <TextValue className={product.growth >= 0 ? "text-success" : "text-danger"}>
                        {product.growth >= 0 ? "+" : ""}
                        {product.growth}%
                      </TextValue>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
