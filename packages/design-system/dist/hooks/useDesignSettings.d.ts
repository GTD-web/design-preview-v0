import React, { ReactNode } from "react";
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
 * 디자인 설정 상태 타입 정의
 */
interface DesignSettingsState {
    font: string;
    theme: string;
    radius: number;
    fontSize: number;
    spacing: SpacingConfig;
    gap: number;
    layoutType: "full" | "centered";
    maxWidth: string;
}
/**
 * 디자인 설정 컨텍스트 타입 정의
 */
interface DesignSettingsContextType extends DesignSettingsState {
    setFont: (font: string) => void;
    setTheme: (theme: string) => void;
    setRadius: (radius: number) => void;
    setFontSize: (fontSize: number) => void;
    setSpacing: (spacing: SpacingConfig) => void;
    setGap: (gap: number) => void;
    setLayoutType: (layoutType: "full" | "centered") => void;
    setMaxWidth: (maxWidth: string) => void;
}
/**
 * 디자인 설정 프로바이더 Props 타입 정의
 */
interface DesignSettingsProviderProps {
    children: ReactNode;
}
/**
 * 디자인 설정 프로바이더 컴포넌트
 *
 * 기능:
 * - 폰트 변경 및 CSS 클래스 적용
 * - 테마 변경 및 CSS 클래스 적용
 * - 라운드 값 변경 및 CSS 변수 설정
 * - 폰트 크기 변경 및 CSS 변수 설정
 * - 스페이싱 변경 및 CSS 변수 설정
 * - 그리드 갭 변경 및 CSS 변수 설정
 */
export declare function DesignSettingsProvider({ children }: DesignSettingsProviderProps): React.JSX.Element;
/**
 * 디자인 설정 컨텍스트 사용을 위한 커스텀 훅
 *
 * @returns 디자인 설정 상태와 변경 함수들
 * @throws Error 컨텍스트가 제공되지 않은 경우
 */
export declare function useDesignSettings(): DesignSettingsContextType;
export {};
