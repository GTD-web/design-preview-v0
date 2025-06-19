/**
 * 스페이싱 설정 타입 정의
 */
interface SpacingConfig {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}
/**
 * 디자인 설정 상태 관리 커스텀 훅
 *
 * 기능:
 * - 폰트 변경 및 CSS 클래스 적용
 * - 테마 변경 및 CSS 클래스 적용
 * - 라운드 값 변경 및 CSS 변수 설정
 * - 폰트 크기 변경 및 CSS 변수 설정
 * - 스페이싱 변경 및 CSS 변수 설정
 * - 그리드 갭 변경 및 CSS 변수 설정
 *
 * @returns 디자인 설정 상태와 변경 함수들
 */
export declare function useDesignSettings(): {
    font: string;
    theme: string;
    radius: number;
    fontSize: number;
    spacing: SpacingConfig;
    gap: number;
    setFont: import("react").Dispatch<import("react").SetStateAction<string>>;
    setTheme: import("react").Dispatch<import("react").SetStateAction<string>>;
    setRadius: import("react").Dispatch<import("react").SetStateAction<number>>;
    setFontSize: import("react").Dispatch<import("react").SetStateAction<number>>;
    setSpacing: import("react").Dispatch<import("react").SetStateAction<SpacingConfig>>;
    setGap: import("react").Dispatch<import("react").SetStateAction<number>>;
};
export {};
