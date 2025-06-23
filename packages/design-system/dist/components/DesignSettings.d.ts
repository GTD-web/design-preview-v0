import React from "react";
/**
 * 사용 가능한 폰트 옵션 정의
 */
export declare const fonts: {
    key: string;
    label: string;
    className: string;
}[];
/**
 * 사용 가능한 테마 옵션 정의
 */
export declare const themes: {
    key: string;
    label: string;
    className: string;
}[];
/**
 * DesignSettings 컴포넌트의 Props 인터페이스
 * 각 설정 변경 시 호출될 콜백 함수들과 현재 설정값들을 받습니다.
 */
interface DesignSettingsProps {
    /** 폰트 변경 시 호출되는 콜백 함수 */
    onFontChange: (font: string) => void;
    /** 테마 변경 시 호출되는 콜백 함수 */
    onThemeChange: (theme: string) => void;
    /** 라운드 값 변경 시 호출되는 콜백 함수 */
    onRadiusChange: (radius: number) => void;
    /** 폰트 크기 변경 시 호출되는 콜백 함수 */
    onFontSizeChange: (fontSize: number) => void;
    /** 스페이싱 변경 시 호출되는 콜백 함수 */
    onSpacingChange: (spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    }) => void;
    /** 그리드 갭 변경 시 호출되는 콜백 함수 */
    onGapChange: (gap: number) => void;
    /** 레이아웃 타입 변경 시 호출되는 콜백 함수 */
    onLayoutTypeChange: (layoutType: "full" | "centered") => void;
    /** 최대 너비 변경 시 호출되는 콜백 함수 */
    onMaxWidthChange: (maxWidth: string) => void;
    /** 현재 선택된 폰트 */
    currentFont: string;
    /** 현재 선택된 테마 */
    currentTheme: string;
    /** 현재 라운드 값 (px) */
    currentRadius: number;
    /** 현재 폰트 크기 (px) */
    currentFontSize: number;
    /** 현재 스페이싱 설정 (px 단위) */
    currentSpacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    /** 현재 그리드 갭 값 (px) */
    currentGap: number;
    /** 현재 레이아웃 타입 */
    currentLayoutType: "full" | "centered";
    /** 현재 최대 너비 */
    currentMaxWidth: string;
}
/**
 * 디자인 설정을 실시간으로 변경할 수 있는 플로팅 위젯 컴포넌트
 *
 * 기능:
 * - 테마 변경 (라이트, 다크, 드라큘라, 파스텔, CI 테마)
 * - 폰트 변경 (Noto Sans KR, Pretendard, System Sans)
 * - 레이아웃 타입 변경
 *
 * UI 특징:
 * - 우측 하단에 고정된 플로팅 버튼
 * - 클릭 시 설정 패널이 슬라이드 애니메이션과 함께 나타남
 * - 바깥 영역 클릭 시 자동으로 닫힘
 * - 반응형 디자인 (모바일에서 최대 90vw)
 */
export declare function DesignSettings({ onFontChange, onThemeChange, onRadiusChange, onFontSizeChange, onSpacingChange, onGapChange, onLayoutTypeChange, onMaxWidthChange, currentFont, currentTheme, currentRadius, currentFontSize, currentSpacing, currentGap, currentLayoutType, currentMaxWidth, }: DesignSettingsProps): React.JSX.Element;
export {};
