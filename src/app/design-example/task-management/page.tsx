"use client";

import React, { useState } from "react";
import { Card } from "@/packages/design-system/components/Card";
import TextLabel from "@/packages/design-system/components/TextLabel";
import TextValue from "@/packages/design-system/components/TextValue";
import TextHeading from "@/packages/design-system/components/TextHeading";
import Badge from "../../../../packages/design-system/components/Badge";
import { Button } from "@/packages/design-system/components/Button";

// 태스크 데이터
const tasks = [
  {
    id: 1,
    title: "홈페이지 리뉴얼 디자인",
    description: "메인 페이지와 서브 페이지들의 새로운 디자인 작업",
    status: "todo",
    priority: "high",
    assignee: "김디자이너",
    dueDate: "2024-01-20",
    tags: ["디자인", "웹"],
  },
  {
    id: 2,
    title: "API 문서 작성",
    description: "새로운 결제 API에 대한 상세 문서 작성",
    status: "in_progress",
    priority: "medium",
    assignee: "박개발자",
    dueDate: "2024-01-25",
    tags: ["개발", "문서"],
  },
  {
    id: 3,
    title: "사용자 피드백 분석",
    description: "최근 수집된 사용자 피드백 데이터 분석 및 리포트 작성",
    status: "review",
    priority: "low",
    assignee: "이기획자",
    dueDate: "2024-01-30",
    tags: ["분석", "리포트"],
  },
  {
    id: 4,
    title: "데이터베이스 최적화",
    description: "성능 개선을 위한 쿼리 최적화 및 인덱스 재구성",
    status: "done",
    priority: "high",
    assignee: "최DBA",
    dueDate: "2024-01-15",
    tags: ["개발", "DB"],
  },
  {
    id: 5,
    title: "모바일 앱 테스트",
    description: "iOS/Android 앱의 종합 테스트 및 버그 리포트 작성",
    status: "todo",
    priority: "medium",
    assignee: "정QA",
    dueDate: "2024-01-28",
    tags: ["테스트", "모바일"],
  },
  {
    id: 6,
    title: "마케팅 캠페인 기획",
    description: "Q1 마케팅 캠페인 전략 수립 및 예산 계획",
    status: "in_progress",
    priority: "high",
    assignee: "한마케터",
    dueDate: "2024-01-22",
    tags: ["마케팅", "기획"],
  },
];

const statusConfig = {
  todo: { label: "할 일", color: "gray", icon: "📋" },
  in_progress: { label: "진행중", color: "primary", icon: "🔄" },
  review: { label: "검토", color: "warning", icon: "👀" },
  done: { label: "완료", color: "success", icon: "✅" },
};

const priorityConfig = {
  high: { label: "높음", color: "danger" },
  medium: { label: "보통", color: "warning" },
  low: { label: "낮음", color: "info" },
};

export default function TaskManagementPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  const getStatusCount = (status: string) => {
    return tasks.filter((task) => task.status === status).length;
  };

  const getTotalTasks = () => tasks.length;

  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <TextHeading size="2xl" weight="semibold">
              작업 관리
            </TextHeading>
            <TextLabel className="mt-xs">프로젝트 작업 현황 및 관리</TextLabel>
          </div>
          <Button className="w-fit">+ 새 작업 추가</Button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(statusConfig).map(([status, config]) => (
            <Card key={status} className="p-lg">
              <div className="flex items-center justify-between">
                <div>
                  <TextLabel className="text-gray-600">{config.label}</TextLabel>
                  <TextValue weight="semibold" className="text-2xl">
                    {getStatusCount(status)}
                  </TextValue>
                </div>
                <div className="text-3xl">{config.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* 필터 및 검색 */}
        <Card className="p-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="작업 제목 또는 설명으로 검색..."
                className="w-full border border-border rounded-lg px-4 py-2 pl-10 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              className="border border-border rounded-lg px-4 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">모든 상태</option>
              {Object.entries(statusConfig).map(([status, config]) => (
                <option key={status} value={status}>
                  {config.label}
                </option>
              ))}
            </select>
            <select
              className="border border-border rounded-lg px-4 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="all">모든 우선순위</option>
              {Object.entries(priorityConfig).map(([priority, config]) => (
                <option key={priority} value={priority}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* 칸반 보드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <TextValue weight="semibold">{config.label}</TextValue>
                    <TextLabel className="text-gray-500">{groupedTasks[status]?.length || 0}개 작업</TextLabel>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {groupedTasks[status]?.map((task) => (
                  <Card key={task.id} className="p-md hover:shadow-md transition-shadow cursor-pointer">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <TextValue weight="semibold" className="flex-1 line-clamp-2">
                          {task.title}
                        </TextValue>
                        <Badge color={priorityConfig[task.priority as keyof typeof priorityConfig]?.color as any}>
                          {priorityConfig[task.priority as keyof typeof priorityConfig]?.label}
                        </Badge>
                      </div>

                      <TextLabel className="text-gray-600 line-clamp-2">{task.description}</TextLabel>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">{task.assignee.charAt(0)}</div>
                          <span className="text-gray-600">{task.assignee}</span>
                        </div>
                        <span className="text-gray-500">{task.dueDate}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}

                {(!groupedTasks[status] || groupedTasks[status].length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-2xl mb-2">📭</div>
                    <TextLabel>작업이 없습니다</TextLabel>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 진행 상황 요약 */}
        <Card className="p-lg">
          <TextHeading size="lg" className="mb-lg">
            진행 상황 요약
          </TextHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <TextLabel className="text-gray-600">전체 진행률</TextLabel>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(getStatusCount("done") / getTotalTasks()) * 100}%` }}
                  />
                </div>
                <TextValue weight="semibold">{Math.round((getStatusCount("done") / getTotalTasks()) * 100)}%</TextValue>
              </div>
            </div>

            <div>
              <TextLabel className="text-gray-600">이번 주 완료</TextLabel>
              <TextValue weight="semibold" className="text-2xl text-success">
                {getStatusCount("done")}
              </TextValue>
            </div>

            <div>
              <TextLabel className="text-gray-600">마감 임박</TextLabel>
              <TextValue weight="semibold" className="text-2xl text-warning">
                {
                  tasks.filter((task) => {
                    const dueDate = new Date(task.dueDate);
                    const today = new Date();
                    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return diffDays <= 3 && task.status !== "done";
                  }).length
                }
              </TextValue>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
