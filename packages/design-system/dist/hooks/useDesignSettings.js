import { useEffect, useState } from "react";
import { fonts, themes } from "../components/DesignSettings";
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
export function useDesignSettings() {
    // 폰트 설정
    const [font, setFont] = useState("noto");
    useEffect(() => {
        // 기존 폰트 클래스들 제거
        document.body.classList.remove("font-noto", "font-pretendard", "font-system");
        // 새로운 폰트 클래스 추가
        const selectedFont = fonts.find((f) => f.key === font);
        document.body.classList.add(selectedFont?.className || "font-noto");
    }, [font]);
    // 테마 설정
    const [theme, setTheme] = useState("light");
    useEffect(() => {
        // 기존 테마 클래스들 제거
        document.body.classList.remove("theme-dark", "theme-dracula", "theme-pastel", "theme-ci");
        // 라이트 테마가 아닌 경우에만 테마 클래스 추가
        if (theme !== "light") {
            const selectedTheme = themes.find((t) => t.key === theme);
            document.body.classList.add(selectedTheme?.className || "");
        }
    }, [theme]);
    // 라운드 값 설정
    const [radius, setRadius] = useState(8);
    useEffect(() => {
        document.body.style.setProperty("--radius", `${radius}px`);
    }, [radius]);
    // 폰트 크기 설정
    const [fontSize, setFontSize] = useState(16);
    useEffect(() => {
        document.body.style.setProperty("--font-size-base", `${fontSize}px`);
    }, [fontSize]);
    // 스페이싱 설정
    const [spacing, setSpacing] = useState({
        xs: 4, // px
        sm: 8,
        md: 16,
        lg: 32,
        xl: 64,
    });
    useEffect(() => {
        // px를 rem으로 변환하여 CSS 변수 설정 (16px = 1rem 기준)
        document.body.style.setProperty("--spacing-xs", `${spacing.xs / 16}rem`);
        document.body.style.setProperty("--spacing-sm", `${spacing.sm / 16}rem`);
        document.body.style.setProperty("--spacing-md", `${spacing.md / 16}rem`);
        document.body.style.setProperty("--spacing-lg", `${spacing.lg / 16}rem`);
        document.body.style.setProperty("--spacing-xl", `${spacing.xl / 16}rem`);
    }, [spacing]);
    // 그리드 갭 설정
    const [gap, setGap] = useState(24); // px 단위, 기본값 24px(1.5rem)
    useEffect(() => {
        document.body.style.setProperty("--grid-gutter", `${gap / 16}rem`);
    }, [gap]);
    return {
        // 현재 상태값들
        font,
        theme,
        radius,
        fontSize,
        spacing,
        gap,
        // 상태 변경 함수들
        setFont,
        setTheme,
        setRadius,
        setFontSize,
        setSpacing,
        setGap,
    };
}
