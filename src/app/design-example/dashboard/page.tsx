"use client";

import { Card } from "@/packages/design-system/components/Card";
import TextHeading from "@/packages/design-system/components/TextHeading";
import TextLabel from "@/packages/design-system/components/TextLabel";
import TextValue from "@/packages/design-system/components/TextValue";
import { useState } from "react";
import Badge from "../../../../packages/design-system/components/Badge";

export default function DashboardPage() {
  // 예시 조직도 데이터
  const orgData = [
    {
      name: "대표",
      children: [
        {
          name: "Product Group",
          count: 12,
          children: [
            {
              name: "LX Tribe",
              count: 12,
              children: [
                { name: "Time Tracking Squad A", count: 12 },
                { name: "Time Tracking Squad B", count: 12 },
                { name: "Time Tracking Squad C", count: 12 },
              ],
            },
            {
              name: "Data Platform Tribe",
              count: 8,
              children: [
                { name: "Data Infra Squad", count: 4 },
                { name: "Data Analytics Squad", count: 4 },
              ],
            },
          ],
        },
        {
          name: "Business Group",
          count: 7,
          children: [
            {
              name: "Sales Tribe",
              count: 7,
              children: [
                { name: "Domestic Sales Squad", count: 3 },
                { name: "Global Sales Squad", count: 4 },
              ],
            },
          ],
        },
      ],
    },
  ];

  // 각 계층별 open/close 상태 관리 (key: 경로 문자열)
  const [openMap, setOpenMap] = useState<{ [key: string]: boolean }>({
    "0": true,
    "0-0": true,
    "0-0-0": true,
    "0-0-1": false,
    "0-1": false,
    "0-1-0": false,
  });

  // 트리 렌더 함수
  const renderTree = (node: any, path: string, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = openMap[path] ?? false;
    // 스타일 프리셋
    const paddings = ["pl-0", "pl-4", "pl-8", "pl-12", "pl-16"]; // depth별 인덴트
    return (
      <div key={path} className={`${paddings[depth] || "pl-16"}`}>
        <div
          className={`flex items-center min-h-[48px] py-3 px-3 rounded-lg hover:bg-surface/50 transition-colors border-b border-border/50`}
        >
          {hasChildren && (
            <button
              type="button"
              className="mr-3 flex items-center justify-center w-6 h-6 text-muted hover:bg-surface rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              onClick={() =>
                setOpenMap((prev) => ({ ...prev, [path]: !isOpen }))
              }
              aria-label={isOpen ? "접기" : "펼치기"}
              tabIndex={0}
            >
              {isOpen ? (
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M8 6l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          )}
          {/* 하위(Squad)면 불릿 */}
          {!hasChildren && (
            <span className="inline-block w-6 text-center text-muted select-none text-lg">
              •
            </span>
          )}
          <TextValue className="ml-1 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
            {node.name}
          </TextValue>
          {node.count !== undefined && (
            <Badge color="gray" className="ml-2">
              {node.count}
            </Badge>
          )}
        </div>
        {hasChildren && isOpen && (
          <div className="mt-1">
            {node.children.map((child: any, idx: number) =>
              renderTree(child, `${path}-${idx}`, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-8">
        {/* 헤더 */}
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <TextHeading
                size="2xl"
                weight="semibold"
                className="text-foreground mb-2"
              >
                2024년 1월 1일 조직도
              </TextHeading>
              <TextLabel className="text-secondary flex items-center gap-2">
                <span className="w-2 h-2 bg-success rounded-full"></span>
                최근 업데이트: 2024. 1. 1 · 김경훈 · 3분기 조직 확장으로
                조직도로 변경함
              </TextLabel>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-surface rounded-lg px-4 py-2 border border-border">
                <span className="text-sm font-medium text-foreground">
                  전체 <span className="text-primary font-semibold">56</span>
                </span>
              </div>
              <div className="relative w-64">
                <input
                  className="w-full border border-border rounded-lg px-4 py-2 text-sm bg-surface text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 pr-10 shadow-sm"
                  placeholder="조직 검색..."
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <circle
                      cx="7.5"
                      cy="7.5"
                      r="5.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M13 13l-2-2"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface hover:shadow-sm transition-all border border-border"
                aria-label="전체화면"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M3 8V3h5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17 8V3h-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 12v5h5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17 12v5h-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Card>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 좌측: 변경내역/사이드바 */}
          <div className="space-y-6">
            {/* 조직도 변경내역 섹션 */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <TextHeading size="lg" className="text-foreground">
                  조직도 변경내역
                </TextHeading>
              </div>
              <ul className="space-y-4">
                <li className="flex flex-col gap-2 p-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <TextLabel className="text-sm text-secondary">
                      2024년 1월 15일
                    </TextLabel>
                    <Badge color="warning" className="text-xs">
                      예약
                    </Badge>
                  </div>
                  <TextValue className="text-foreground font-medium">
                    김경훈 · Core Squad 외 10건 변경
                  </TextValue>
                </li>
                <li className="flex flex-col gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <TextLabel className="text-sm text-secondary">
                      2024년 1월 1일
                    </TextLabel>
                    <Badge color="primary" className="text-xs">
                      현재
                    </Badge>
                  </div>
                  <TextValue className="text-foreground font-medium">
                    김경훈 · Review Squad 변경
                  </TextValue>
                </li>
                <li className="flex flex-col gap-2 p-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <TextLabel className="text-sm text-secondary">
                    2023년 10월 20일
                  </TextLabel>
                  <TextValue className="text-foreground font-medium">
                    김경훈 · Product Group 변경
                  </TextValue>
                </li>
                <li className="flex flex-col gap-2 p-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <TextLabel className="text-sm text-secondary">
                    2023년 10월 15일
                  </TextLabel>
                  <TextValue className="text-foreground font-medium">
                    이지나 · AI Lovable TF 외 3건 변경
                  </TextValue>
                </li>
                <li className="flex flex-col gap-2 p-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <TextLabel className="text-sm text-secondary">
                    2023년 8월 1일
                  </TextLabel>
                  <TextValue className="text-foreground font-medium">
                    이지나 · Data Engineering Team 변경
                  </TextValue>
                </li>
                <li className="flex flex-col gap-2 p-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <TextLabel className="text-sm text-secondary">
                    2023년 7월 30일
                  </TextLabel>
                  <TextValue className="text-foreground font-medium">
                    이지나 · Security Dev Team 변경
                  </TextValue>
                </li>
              </ul>
            </Card>

            {/* 지급 내역 섹션 */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <TextHeading size="lg" className="text-foreground">
                  지급 내역
                </TextHeading>
              </div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <TextLabel className="text-sm text-secondary">
                    2024. 12. 1 - 2024. 12. 31
                  </TextLabel>
                </div>
                <TextValue size="xl" weight="semibold" className="text-primary">
                  4,287,676원
                </TextValue>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <TextLabel className="text-foreground font-medium">
                    기본급
                  </TextLabel>
                  <TextValue className="text-foreground font-semibold">
                    4,000,000원
                  </TextValue>
                </div>
                <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <TextLabel className="text-foreground font-medium">
                    근무미달차감금
                  </TextLabel>
                  <TextValue className="text-danger font-semibold">
                    -200,000원
                  </TextValue>
                </div>
                <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <TextLabel className="text-foreground font-medium">
                    초과근무수당
                  </TextLabel>
                  <TextValue className="text-success font-semibold">
                    1,326,270원
                  </TextValue>
                </div>
                <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <TextLabel className="text-foreground font-medium">
                      초과근무수당
                    </TextLabel>
                    <Badge color="gray" className="text-xs">
                      고정
                    </Badge>
                  </div>
                  <TextValue className="text-success font-semibold">
                    456,780원
                  </TextValue>
                </div>
                <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <TextLabel className="text-foreground font-medium">
                      식비
                    </TextLabel>
                    <Badge color="gray" className="text-xs">
                      비과세
                    </Badge>
                  </div>
                  <TextValue className="text-foreground font-semibold">
                    100,000원
                  </TextValue>
                </div>
                <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <TextLabel className="text-foreground font-medium">
                      인재추천비
                    </TextLabel>
                    <Badge color="gray" className="text-xs">
                      1명 추천
                    </Badge>
                  </div>
                  <TextValue className="text-foreground font-semibold">
                    500,000원
                  </TextValue>
                </div>
                <div className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <TextLabel className="text-foreground font-medium">
                      인재추천비
                    </TextLabel>
                    <Badge color="gray" className="text-xs">
                      비과세
                    </Badge>
                  </div>
                  <TextValue className="text-foreground font-semibold">
                    500,000원
                  </TextValue>
                </div>
              </div>
            </Card>
          </div>

          {/* 중앙: 메인 섹션 */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 bg-info rounded-full"></div>
                <TextHeading size="lg" className="text-foreground">
                  조직 구조
                </TextHeading>
              </div>
              <div className="flex flex-col gap-2">
                {orgData.map((node, idx) => renderTree(node, `${idx}`))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
