import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fonts, themes } from "../components/DesignSettings";

/**
 * 폰트 옵션 타입 정의
 */
interface FontOption {
  key: string;
  label: string;
  className: string;
}

/**
 * 테마 옵션 타입 정의
 */
interface ThemeOption {
  key: string;
  label: string;
  className: string;
}

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
}

/**
 * 디자인 설정 컨텍스트 생성
 */
const DesignSettingsContext = createContext<DesignSettingsContextType | undefined>(undefined);

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
export function DesignSettingsProvider({ children }: DesignSettingsProviderProps) {
  // 폰트 설정
  const [font, setFont] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("design-font") || "noto";
    }
    return "noto";
  });
  useEffect(() => {
    // 기존 폰트 클래스들 제거
    document.body.classList.remove("font-noto", "font-pretendard", "font-system");
    // 새로운 폰트 클래스 추가
    const selectedFont = fonts.find((f: FontOption) => f.key === font);
    document.body.classList.add(selectedFont?.className || "font-noto");
    // localStorage에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("design-font", font);
    }
  }, [font]);

  // 테마 설정
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("design-theme") || "light";
    }
    return "light";
  });
  useEffect(() => {
    // 기존 테마 클래스들 제거
    document.body.classList.remove(
      "theme-dark",
      "theme-dracula",
      "theme-pastel",
      "theme-ci",
      "theme-github",
      "theme-midnight",
      "theme-ocean",
      "theme-forest",
      "theme-sunset",
      "theme-aurora",
      "theme-cosmic"
    );
    // 라이트 테마가 아닌 경우에만 테마 클래스 추가
    if (theme !== "light") {
      const selectedTheme = themes.find((t: ThemeOption) => t.key === theme);
      document.body.classList.add(selectedTheme?.className || "");
    }
    // localStorage에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("design-theme", theme);
    }
  }, [theme]);

  // 라운드 값 설정
  const [radius, setRadius] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("design-radius") || "8", 10);
    }
    return 8;
  });
  useEffect(() => {
    document.body.style.setProperty("--radius", `${radius}px`);
    // localStorage에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("design-radius", radius.toString());
    }
  }, [radius]);

  // 폰트 크기 설정
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("design-fontSize") || "16", 10);
    }
    return 16;
  });
  useEffect(() => {
    document.body.style.setProperty("--font-size-base", `${fontSize}px`);
    // localStorage에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("design-fontSize", fontSize.toString());
    }
  }, [fontSize]);

  // 스페이싱 설정
  const [spacing, setSpacing] = useState<SpacingConfig>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("design-spacing");
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      xs: 4, // px
      sm: 8,
      md: 16,
      lg: 32,
      xl: 64,
    };
  });
  useEffect(() => {
    // px를 rem으로 변환하여 CSS 변수 설정 (16px = 1rem 기준)
    document.body.style.setProperty("--spacing-xs", `${spacing.xs / 16}rem`);
    document.body.style.setProperty("--spacing-sm", `${spacing.sm / 16}rem`);
    document.body.style.setProperty("--spacing-md", `${spacing.md / 16}rem`);
    document.body.style.setProperty("--spacing-lg", `${spacing.lg / 16}rem`);
    document.body.style.setProperty("--spacing-xl", `${spacing.xl / 16}rem`);
    // localStorage에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("design-spacing", JSON.stringify(spacing));
    }
  }, [spacing]);

  // 그리드 갭 설정
  const [gap, setGap] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("design-gap") || "24", 10);
    }
    return 24; // px 단위, 기본값 24px(1.5rem)
  });
  useEffect(() => {
    document.body.style.setProperty("--grid-gutter", `${gap / 16}rem`);
    document.body.style.setProperty("--flex-gap", `${gap / 16}rem`);
    // 갭 변경 시 spacing-lg도 함께 업데이트 (사이드바 카드 간격용)
    document.body.style.setProperty("--spacing-lg", `${gap / 16}rem`);
    // localStorage에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("design-gap", gap.toString());
    }
  }, [gap]);

  // 레이아웃 타입 설정
  const [layoutType, setLayoutType] = useState<"full" | "centered">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("design-layoutType") as "full" | "centered") || "centered";
    }
    return "centered";
  });
  useEffect(() => {
    // localStorage에 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("design-layoutType", layoutType);
    }
  }, [layoutType]);

  const value: DesignSettingsContextType = {
    // 현재 상태값들
    font,
    theme,
    radius,
    fontSize,
    spacing,
    gap,
    layoutType,

    // 상태 변경 함수들
    setFont,
    setTheme,
    setRadius,
    setFontSize,
    setSpacing,
    setGap,
    setLayoutType,
  };

  return <DesignSettingsContext.Provider value={value}>{children}</DesignSettingsContext.Provider>;
}

/**
 * 디자인 설정 컨텍스트 사용을 위한 커스텀 훅
 *
 * @returns 디자인 설정 상태와 변경 함수들
 * @throws Error 컨텍스트가 제공되지 않은 경우
 */
export function useDesignSettings(): DesignSettingsContextType {
  const context = useContext(DesignSettingsContext);
  if (context === undefined) {
    throw new Error("useDesignSettings must be used within a DesignSettingsProvider");
  }
  return context;
}
