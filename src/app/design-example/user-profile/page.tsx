"use client";

import React, { useState } from "react";
import { Card } from "@/packages/design-system/components/Card";
import TextLabel from "@/packages/design-system/components/TextLabel";
import TextValue from "@/packages/design-system/components/TextValue";
import TextHeading from "@/packages/design-system/components/TextHeading";
import Badge from "../../../../packages/design-system/components/Badge";
import { Button } from "@/packages/design-system/components/Button";

// 사용자 데이터
const userData = {
  id: 1,
  name: "김개발자",
  email: "kim.dev@company.com",
  role: "Senior Frontend Developer",
  department: "Product Development",
  avatar: "👨‍💻",
  joinDate: "2022-03-15",
  location: "서울시 강남구",
  phone: "010-1234-5678",
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"],
  bio: "5년차 프론트엔드 개발자로 사용자 경험을 중시하는 웹 애플리케이션 개발에 전문성을 가지고 있습니다.",
  status: "active",
};

// 활동 내역
const activities = [
  {
    id: 1,
    type: "project",
    title: "홈페이지 리뉴얼 프로젝트 완료",
    description: "메인 페이지와 서브 페이지들의 새로운 디자인 및 개발 작업을 완료했습니다.",
    date: "2024-01-15",
    time: "14:30",
  },
  {
    id: 2,
    type: "task",
    title: "API 문서 작성",
    description: "새로운 결제 API에 대한 상세 문서를 작성했습니다.",
    date: "2024-01-14",
    time: "16:45",
  },
  {
    id: 3,
    type: "meeting",
    title: "팀 스프린트 회고",
    description: "2주간의 스프린트 진행 상황을 점검하고 다음 스프린트 계획을 수립했습니다.",
    date: "2024-01-12",
    time: "10:00",
  },
  {
    id: 4,
    type: "code",
    title: "성능 최적화 작업",
    description: "웹사이트 로딩 속도 개선을 위한 코드 최적화를 진행했습니다.",
    date: "2024-01-10",
    time: "11:20",
  },
  {
    id: 5,
    type: "review",
    title: "코드 리뷰 완료",
    description: "팀원의 PR에 대한 코드 리뷰를 완료하고 승인했습니다.",
    date: "2024-01-08",
    time: "15:30",
  },
];

// 프로젝트 통계
const projectStats = {
  completed: 12,
  inProgress: 3,
  totalHours: 1240,
  thisMonth: 156,
};

// 최근 프로젝트
const recentProjects = [
  {
    id: 1,
    name: "홈페이지 리뉴얼",
    role: "Lead Developer",
    progress: 100,
    status: "completed",
    startDate: "2023-11-01",
    endDate: "2024-01-15",
  },
  {
    id: 2,
    name: "모바일 앱 개발",
    role: "Frontend Developer",
    progress: 75,
    status: "in_progress",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    id: 3,
    name: "관리자 대시보드",
    role: "Full Stack Developer",
    progress: 45,
    status: "in_progress",
    startDate: "2024-01-10",
    endDate: "2024-02-28",
  },
];

const activityIcons = {
  project: "📁",
  task: "✅",
  meeting: "🤝",
  code: "💻",
  review: "👀",
};

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "개요", icon: "📊" },
    { id: "projects", label: "프로젝트", icon: "📁" },
    { id: "activity", label: "활동", icon: "📈" },
    { id: "settings", label: "설정", icon: "⚙️" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 프로필 헤더 */}
        <Card className="p-lg">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{userData.avatar}</div>
              <div>
                <TextHeading size="2xl" weight="semibold">
                  {userData.name}
                </TextHeading>
                <TextValue className="text-gray-600">{userData.role}</TextValue>
                <TextLabel className="text-gray-500">{userData.department}</TextLabel>
                <div className="flex items-center gap-2 mt-2">
                  <Badge color="success">활성</Badge>
                  <TextLabel className="text-gray-500">가입일: {formatDate(userData.joinDate)}</TextLabel>
                </div>
              </div>
            </div>
            <div className="md:ml-auto flex flex-col gap-2">
              <Button variant="secondary">프로필 편집</Button>
              <Button variant="secondary">메시지 보내기</Button>
            </div>
          </div>
        </Card>

        {/* 탭 네비게이션 */}
        <Card className="p-lg">
          <div className="flex flex-wrap gap-2 border-b border-border">
            {tabs.map((tab) => (
              <Button key={tab.id} variant="nav" selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className="flex items-center gap-2">
                <span>{tab.icon}</span>
                <TextValue className={activeTab === tab.id ? "text-white" : ""}>{tab.label}</TextValue>
              </Button>
            ))}
          </div>
        </Card>

        {/* 탭 콘텐츠 */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 기본 정보 */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-lg">
                <TextHeading size="lg" className="mb-lg">
                  기본 정보
                </TextHeading>
                <div className="space-y-3">
                  <div className="">
                    <TextLabel className="text-gray-600 text-sm font-medium mb-1 block">이메일</TextLabel>
                    <TextValue className="text-gray-900">{userData.email}</TextValue>
                  </div>
                  <div className="">
                    <TextLabel className="text-gray-600 text-sm font-medium mb-1 block">전화번호</TextLabel>
                    <TextValue className="text-gray-900">{userData.phone}</TextValue>
                  </div>
                  <div className="">
                    <TextLabel className="text-gray-600 text-sm font-medium mb-1 block">위치</TextLabel>
                    <TextValue className="text-gray-900">{userData.location}</TextValue>
                  </div>
                  <div className="">
                    <TextLabel className="text-gray-600 text-sm font-medium mb-1 block">소개</TextLabel>
                    <TextValue className="text-gray-700 leading-relaxed">{userData.bio}</TextValue>
                  </div>
                </div>
              </Card>

              <Card className="p-lg">
                <TextHeading size="lg" className="mb-lg">
                  기술 스택
                </TextHeading>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            {/* 통계 및 프로젝트 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 통계 카드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-md text-center">
                  <div className="space-y-2">
                    <TextValue weight="semibold" className="text-2xl text-primary block">
                      {projectStats.completed}
                    </TextValue>
                    <TextLabel className="text-gray-600 text-sm font-medium block">완료 프로젝트</TextLabel>
                  </div>
                </Card>
                <Card className="p-md text-center">
                  <div className="space-y-2">
                    <TextValue weight="semibold" className="text-2xl text-warning block">
                      {projectStats.inProgress}
                    </TextValue>
                    <TextLabel className="text-gray-600 text-sm font-medium block">진행중</TextLabel>
                  </div>
                </Card>
                <Card className="p-md text-center">
                  <div className="space-y-2">
                    <TextValue weight="semibold" className="text-2xl text-success block">
                      {projectStats.totalHours}
                    </TextValue>
                    <TextLabel className="text-gray-600 text-sm font-medium block">총 작업시간</TextLabel>
                  </div>
                </Card>
                <Card className="p-md text-center">
                  <div className="space-y-2">
                    <TextValue weight="semibold" className="text-2xl text-info block">
                      {projectStats.thisMonth}
                    </TextValue>
                    <TextLabel className="text-gray-600 text-sm font-medium block">이번 달</TextLabel>
                  </div>
                </Card>
              </div>

              {/* 최근 프로젝트 */}
              <Card className="p-lg">
                <TextHeading size="lg" className="mb-lg">
                  최근 프로젝트
                </TextHeading>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <TextValue weight="semibold">{project.name}</TextValue>
                          <Badge color={project.status === "completed" ? "success" : "primary"}>{project.status === "completed" ? "완료" : "진행중"}</Badge>
                        </div>
                        <TextLabel className="text-gray-600">{project.role}</TextLabel>
                        <TextLabel className="text-gray-500 text-sm">
                          {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </TextLabel>
                      </div>
                      <div className="text-right">
                        <TextValue weight="semibold" className="text-primary">
                          {project.progress}%
                        </TextValue>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${project.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <Card className="p-lg">
            <TextHeading size="lg" className="mb-lg">
              최근 활동
            </TextHeading>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-surface/50 transition-colors">
                  <div className="text-2xl">{activityIcons[activity.type as keyof typeof activityIcons]}</div>
                  <div className="flex-1">
                    <TextValue weight="semibold">{activity.title}</TextValue>
                    <TextLabel className="text-gray-600">{activity.description}</TextLabel>
                    <TextLabel className="text-gray-500 text-sm">
                      {formatDate(activity.date)} {activity.time}
                    </TextLabel>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === "settings" && (
          <Card className="p-lg">
            <TextHeading size="lg" className="mb-lg">
              계정 설정
            </TextHeading>
            <div className="space-y-6">
              <div>
                <TextHeading size="md" className="mb-md">
                  개인 정보
                </TextHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <TextLabel className="text-gray-600">이름</TextLabel>
                    <input
                      type="text"
                      defaultValue={userData.name}
                      className="w-full border border-border rounded-lg px-4 py-2 mt-1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <TextLabel className="text-gray-600">이메일</TextLabel>
                    <input
                      type="email"
                      defaultValue={userData.email}
                      className="w-full border border-border rounded-lg px-4 py-2 mt-1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <TextLabel className="text-gray-600">전화번호</TextLabel>
                    <input
                      type="tel"
                      defaultValue={userData.phone}
                      className="w-full border border-border rounded-lg px-4 py-2 mt-1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <TextLabel className="text-gray-600">위치</TextLabel>
                    <input
                      type="text"
                      defaultValue={userData.location}
                      className="w-full border border-border rounded-lg px-4 py-2 mt-1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <TextHeading size="md" className="mb-md">
                  알림 설정
                </TextHeading>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <TextValue>이메일 알림</TextValue>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <TextValue>푸시 알림</TextValue>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <TextValue>주간 리포트</TextValue>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button>변경사항 저장</Button>
                <Button variant="secondary">취소</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
