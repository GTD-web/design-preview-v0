"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/packages/design-system/components/Card";
import TextLabel from "@/packages/design-system/components/TextLabel";
import TextValue from "@/packages/design-system/components/TextValue";
import TextHeading from "@/packages/design-system/components/TextHeading";
import Badge from "../../../../packages/design-system/components/Badge";
import DashboardHeader from "./DashboardHeader";

export default function DashboardPage() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          if (currentScroll > lastScroll && currentScroll > 40) {
            setShowHeader(false); // 아래로 스크롤 시 숨김
          } else {
            setShowHeader(true); // 위로 스크롤 시 보임
          }
          setLastScroll(currentScroll);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

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
        <div className={`flex items-center min-h-[44px] py-2 border-b border-gray-100`}>
          {hasChildren && (
            <button
              type="button"
              className="mr-2 flex items-center justify-center w-5 h-5 text-gray-300 hover:bg-gray-100 rounded transition-colors focus:outline-none"
              onClick={() => setOpenMap((prev) => ({ ...prev, [path]: !isOpen }))}
              aria-label={isOpen ? "접기" : "펼치기"}
              tabIndex={0}
            >
              {isOpen ? (
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M6 8l4 4 4-4" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M8 6l4 4-4 4" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          )}
          {/* 하위(Squad)면 불릿 */}
          {!hasChildren && <span className="inline-block w-4 text-center text-gray-200 select-none">•</span>}
          <TextValue className="ml-0.5 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{node.name}</TextValue>
          {node.count !== undefined && (
            <TextValue size="xs" weight="normal" className="ml-1 text-gray-300">
              {node.count}
            </TextValue>
          )}
        </div>
        {hasChildren && isOpen && <div>{node.children.map((child: any, idx: number) => renderTree(child, `${path}-${idx}`, depth + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* 고정 헤더 */}
      <div
        style={{
          transition: "opacity 0.3s",
          opacity: showHeader ? 1 : 0,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          width: "100%",
          pointerEvents: showHeader ? "auto" : "none",
        }}
      >
        <div className="p-6">
          <DashboardHeader />
        </div>
      </div>

      {/* 헤더 높이만큼 패딩 */}
      <div style={{ paddingTop: 120 }}>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-layout h-[calc(100vh-8rem)]">
            {/* 좌측: 변경내역/사이드바 */}
            <Card className="flex flex-col gap-lg h-full bg-surface p-lg rounded-lg">
              {/* 조직도 변경내역 섹션 */}
              <div>
                <TextHeading className="mb-md">조직도 변경내역</TextHeading>
                <ul className="flex flex-col gap-md">
                  <li className="flex flex-col gap-1">
                    <TextLabel>
                      2024년 1월 15일 <Badge color="warning">예약</Badge>
                    </TextLabel>
                    <TextValue>김경훈 · Core Squad 외 10건 변경</TextValue>
                  </li>
                  <li className="flex flex-col gap-1 bg-primary/5 rounded-lg p-sm border border-primary/20">
                    <TextLabel>
                      2024년 1월 1일 <Badge color="primary">현재</Badge>
                    </TextLabel>
                    <TextValue>김경훈 · Review Squad 변경</TextValue>
                  </li>
                  <li className="flex flex-col gap-1">
                    <TextLabel>2023년 10월 20일</TextLabel>
                    <TextValue>김경훈 · Product Group 변경</TextValue>
                  </li>
                  <li className="flex flex-col gap-1">
                    <TextLabel>2023년 10월 15일</TextLabel>
                    <TextValue>이지나 · AI Lovable TF 외 3건 변경</TextValue>
                  </li>
                  <li className="flex flex-col gap-1">
                    <TextLabel>2023년 8월 1일</TextLabel>
                    <TextValue>이지나 · Data Engineering Team 변경</TextValue>
                  </li>
                  <li className="flex flex-col gap-1">
                    <TextLabel>2023년 7월 30일</TextLabel>
                    <TextValue>이지나 · Security Dev Team 변경</TextValue>
                  </li>
                </ul>
              </div>
              {/* 섹션 구분선 */}
              <div className="border-t border-border/40 my-lg" />
              {/* 지급 내역 섹션 */}
              <div>
                <div className="flex items-end justify-between mb-md">
                  <div>
                    <TextHeading>지급 내역</TextHeading>
                    <TextLabel className="mt-xs">2024. 12. 1 - 2024. 12. 31</TextLabel>
                  </div>
                  <TextValue size="xl" weight="semibold">
                    4,287,676원
                  </TextValue>
                </div>
                <div className="w-full">
                  <ul className="divide-y divide-border">
                    <li className="flex items-center justify-between py-sm">
                      <TextLabel>기본급</TextLabel>
                      <TextValue>4,000,000원</TextValue>
                    </li>
                    <li className="flex items-center justify-between py-sm">
                      <TextLabel>근무미달차감금</TextLabel>
                      <TextValue>-200,000원</TextValue>
                    </li>
                    <li className="flex items-center justify-between py-sm">
                      <TextLabel>초과근무수당</TextLabel>
                      <TextValue>1,326,270원</TextValue>
                    </li>
                    <li className="flex items-center justify-between py-sm">
                      <TextLabel>
                        초과근무수당 <Badge color="gray">고정</Badge>
                      </TextLabel>
                      <TextValue>456,780원</TextValue>
                    </li>
                    <li className="flex items-center justify-between py-sm">
                      <TextLabel>
                        식비 <Badge color="gray">비과세</Badge>
                      </TextLabel>
                      <TextValue>100,000원</TextValue>
                    </li>
                    <li className="flex items-center justify-between py-sm">
                      <TextLabel>
                        인재추천비 <Badge color="gray">1명 추천</Badge>
                      </TextLabel>
                      <TextValue>500,000원</TextValue>
                    </li>
                    <li className="flex items-center justify-between py-sm">
                      <TextLabel>
                        인재추천비 <Badge color="gray">비과세</Badge>
                      </TextLabel>
                      <TextValue>500,000원</TextValue>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
            {/* 중앙: 메인 섹션 */}
            <main className="col-span-2 flex flex-col gap-8 h-full">
              <Card className="mb-4">
                <div className="flex items-center gap-4 mb-lg">
                  <TextHeading size="2xl" weight="semibold">
                    2024년 1월 1일 조직도
                  </TextHeading>
                  <TextLabel>2024. 1. 1 · 김경훈 · 3분기 조직 확장으로 조직도로 변경함</TextLabel>
                </div>
                <div className="flex items-center justify-between mb-sm gap-4">
                  {/* 왼쪽: 전체(56) */}
                  <span className="text-sm text-gray-400">전체 (56)</span>
                  {/* 가운데: 검색 인풋 + 돋보기 */}
                  <div className="flex-1 flex justify-end">
                    <div className="relative w-full max-w-xs">
                      <input
                        className="w-full border border-[var(--color-border)] rounded px-3 py-1 text-sm bg-[var(--color-surface)] text-[var(--foreground)] placeholder-[var(--foreground)] focus:outline-none pr-8"
                        placeholder="검색"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                          <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M13 13l-2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  {/* 오른쪽: 구분선 + 전체화면 버튼 */}
                  <div className="flex items-center gap-2">
                    <span className="mx-2 text-gray-200 select-none">|</span>
                    <button type="button" className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition" aria-label="전체화면">
                      {/* 화살표 4개 아이콘 */}
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                        <path d="M3 8V3h5" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M17 8V3h-5" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M3 12v5h5" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M17 12v5h-5" stroke="#bdbdbd" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-md">{orgData.map((node, idx) => renderTree(node, `${idx}`))}</div>
              </Card>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
