import { DesignTokensPreview } from "../components/DesignTokensPreview";
import { Card } from "@/packages/design-system/components/Card";
import TextHeading from "@/packages/design-system/components/TextHeading";
import TextValue from "@/packages/design-system/components/TextValue";
import TextLabel from "@/packages/design-system/components/TextLabel";
import Link from "next/link";

const designExamples = [
  {
    title: "대시보드",
    description: "조직도 및 지급 내역을 포함한 사내 포털 대시보드",
    path: "/design-example/dashboard",
    icon: "📊",
    features: ["조직도 트리 뷰", "변경 내역", "지급 내역", "검색 기능"],
  },
  {
    title: "E-commerce",
    description: "상품 관리 및 판매 현황을 위한 전자상거래 관리 시스템",
    path: "/design-example/ecommerce",
    icon: "🛒",
    features: ["상품 목록", "카테고리 필터", "재고 관리", "매출 통계"],
  },
  {
    title: "Analytics",
    description: "데이터 시각화 및 실시간 분석 대시보드",
    path: "/design-example/analytics",
    icon: "📈",
    features: ["매출 차트", "실시간 활동", "인기 상품", "통계 카드"],
  },
  {
    title: "Task Management",
    description: "칸반 보드와 작업 관리를 위한 프로젝트 관리 시스템",
    path: "/design-example/task-management",
    icon: "✅",
    features: ["칸반 보드", "우선순위 관리", "진행률 추적", "태스크 필터"],
  },
  {
    title: "User Profile",
    description: "사용자 프로필 및 활동 내역을 보여주는 개인 페이지",
    path: "/design-example/user-profile",
    icon: "👤",
    features: ["프로필 정보", "활동 내역", "프로젝트 통계", "설정 관리"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <TextHeading size="3xl" weight="bold" className="mb-4">
            디자인 시스템 예제
          </TextHeading>
          <TextValue className="text-gray-600 max-w-2xl mx-auto">
            다양한 디자인 시안을 통해 디자인 시스템의 활용법을 확인해보세요. 각 예제는 실제 비즈니스 시나리오를 기반으로 구성되어 있습니다.
          </TextValue>
        </div>

        {/* 디자인 예제 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designExamples.map((example, index) => (
            <Link key={index} href={example.path}>
              <Card className="p-lg hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{example.icon}</div>
                    <div>
                      <TextHeading size="lg" weight="semibold" className="group-hover:text-primary transition-colors">
                        {example.title}
                      </TextHeading>
                      <TextLabel className="text-gray-600">{example.description}</TextLabel>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <TextLabel className="text-gray-500 text-sm">주요 기능:</TextLabel>
                    <div className="flex flex-wrap gap-1">
                      {example.features.map((feature, featureIndex) => (
                        <span key={featureIndex} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <TextValue className="text-sm text-gray-500">클릭하여 보기</TextValue>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* 디자인 토큰 프리뷰 */}
        <Card className="p-lg">
          <TextHeading size="xl" weight="semibold" className="mb-lg">
            디자인 토큰 프리뷰
          </TextHeading>
          <DesignTokensPreview />
        </Card>
      </div>
    </div>
  );
}
