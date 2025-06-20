import { DesignTokensPreview } from "../components/DesignTokensPreview";
import TextHeading from "@/packages/design-system/components/TextHeading";
import TextValue from "@/packages/design-system/components/TextValue";
import TextLabel from "@/packages/design-system/components/TextLabel";

export default function Home() {
  return (
    <div className="min-h-screen p-6">
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <TextHeading size="3xl" weight="bold" className="mb-4">
            디자인 시스템 예제
          </TextHeading>
          <TextValue className="text-gray-600">
            다양한 디자인 시안을 통해 디자인 시스템의 활용법을 확인해보세요. 각 예제는 실제 비즈니스 시나리오를 기반으로 구성되어 있습니다.
          </TextValue>
        </div>

        {/* 디자인 토큰 프리뷰 */}
        <div>
          <TextHeading size="xl" weight="semibold" className="mb-lg">
            디자인 토큰 프리뷰
          </TextHeading>
          <DesignTokensPreview />
        </div>
      </div>
    </div>
  );
}
