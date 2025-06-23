import React, { useEffect, useState, useRef } from "react";
import { Button } from "./Button";
/**
 * 사용 가능한 폰트 옵션 정의
 */
export const fonts = [
    { key: "noto", label: "Noto Sans KR", className: "font-noto" },
    { key: "pretendard", label: "Pretendard", className: "font-pretendard" },
    { key: "system", label: "System Sans", className: "font-system" },
];
/**
 * 사용 가능한 테마 옵션 정의
 */
export const themes = [
    { key: "light", label: "라이트", className: "" },
    { key: "dark", label: "다크", className: "theme-dark" },
    { key: "dracula", label: "드라큘라", className: "theme-dracula" },
    { key: "pastel", label: "파스텔", className: "theme-pastel" },
    { key: "ci", label: "CI 테마", className: "theme-ci" },
    { key: "github", label: "GitHub", className: "theme-github" },
    { key: "midnight", label: "미드나잇", className: "theme-midnight" },
    { key: "ocean", label: "오션", className: "theme-ocean" },
    { key: "forest", label: "포레스트", className: "theme-forest" },
    { key: "sunset", label: "선셋", className: "theme-sunset" },
    { key: "aurora", label: "오로라", className: "theme-aurora" },
    { key: "cosmic", label: "코스믹", className: "theme-cosmic" },
];
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
export function DesignSettings({ onFontChange, onThemeChange, onRadiusChange, onFontSizeChange, onSpacingChange, onGapChange, onLayoutTypeChange, onMaxWidthChange, currentFont, currentTheme, currentRadius, currentFontSize, currentSpacing, currentGap, currentLayoutType, currentMaxWidth, }) {
    // 위젯 열림/닫힘 상태 관리 (클라이언트 전용)
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    // 위젯 DOM 요소 참조 (바깥 클릭 감지용)
    const widgetRef = useRef(null);
    // 클라이언트 사이드에서만 마운트 상태를 true로 설정
    useEffect(() => {
        setMounted(true);
    }, []);
    /**
     * 바깥 영역 클릭 시 위젯을 닫는 이벤트 핸들러
     * 위젯이 열려있을 때만 이벤트 리스너를 등록/해제합니다.
     */
    useEffect(() => {
        if (!mounted)
            return;
        function handleClickOutside(event) {
            // 클릭된 요소가 위젯 내부가 아닌 경우 위젯을 닫음
            if (widgetRef.current && !widgetRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        // 위젯이 열려있을 때만 이벤트 리스너 등록
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        // 컴포넌트 언마운트 시 이벤트 리스너 정리
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, mounted]);
    // 서버 사이드 렌더링 중에는 아무것도 렌더링하지 않음
    if (!mounted) {
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { className: "fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700 transition", style: {
                position: "fixed",
                bottom: "24px",
                right: "24px",
                zIndex: 9999,
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#2563eb",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }, "aria-label": "\uB514\uC790\uC778 \uC124\uC815 \uC5F4\uAE30", onClick: () => setOpen((v) => !v) }, "\u2699\uFE0F"),
        open && (React.createElement("div", { ref: widgetRef, className: "fixed bottom-24 right-6 z-[9999] w-[320px] max-w-[90vw] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6", style: {
                position: "fixed",
                bottom: "96px",
                right: "24px",
                zIndex: 9999,
                width: "320px",
                maxWidth: "90vw",
                transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                border: "1px solid #e5e7eb",
            }, role: "dialog", "aria-modal": "true" },
            React.createElement("div", { className: "flex justify-between items-center mb-6", style: { marginBottom: "24px" } },
                React.createElement("span", { className: "font-semibold text-base text-gray-900 dark:text-white", style: { fontSize: "16px", fontWeight: "600", color: "#111827" } }, "\uB514\uC790\uC778 \uD035 \uC124\uC815"),
                React.createElement(Button, { variant: "ghost", size: "sm", className: "text-lg p-1", "aria-label": "\uB2EB\uAE30", onClick: () => setOpen(false) }, "\u00D7")),
            React.createElement("div", { className: "mb-6", style: { marginBottom: "24px" } },
                React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white", style: { fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "12px" } }, "\uD14C\uB9C8"),
                React.createElement("div", { className: "flex gap-3 flex-wrap", style: { gap: "12px" } }, themes.map((t) => (React.createElement(Button, { key: t.key, variant: "toggle", size: "sm", selected: currentTheme === t.key, onClick: () => onThemeChange(t.key) }, t.label))))),
            React.createElement("div", { className: "mb-6", style: { marginBottom: "24px" } },
                React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white", style: { fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "12px" } }, "\uD3F0\uD2B8"),
                React.createElement("div", { className: "flex gap-3 flex-wrap", style: { gap: "12px" } }, fonts.map((f) => (React.createElement(Button, { key: f.key, variant: "toggle", size: "sm", selected: currentFont === f.key, onClick: () => onFontChange(f.key) }, f.label))))),
            React.createElement("div", { className: "mb-6", style: { marginBottom: "24px" } },
                React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white", style: { fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "12px" } }, "\uB808\uC774\uC544\uC6C3"),
                React.createElement("div", { className: "flex gap-3 flex-wrap", style: { gap: "12px" } },
                    React.createElement(Button, { variant: "toggle", size: "sm", selected: currentLayoutType === "full", onClick: () => onLayoutTypeChange("full") }, "\uC804\uCCB4"),
                    React.createElement(Button, { variant: "toggle", size: "sm", selected: currentLayoutType === "centered", onClick: () => onLayoutTypeChange("centered") }, "\uC911\uC559"))),
            currentLayoutType === "centered" && (React.createElement("div", { className: "mb-6", style: { marginBottom: "24px" } },
                React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white", style: { fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "12px" } }, "\uCD5C\uB300 \uB108\uBE44"),
                React.createElement("div", { className: "flex gap-3 flex-wrap", style: { gap: "12px" } },
                    React.createElement(Button, { variant: "toggle", size: "sm", selected: currentMaxWidth === "max-w-4xl", onClick: () => onMaxWidthChange("max-w-4xl") }, "4xl"),
                    React.createElement(Button, { variant: "toggle", size: "sm", selected: currentMaxWidth === "max-w-5xl", onClick: () => onMaxWidthChange("max-w-5xl") }, "5xl"),
                    React.createElement(Button, { variant: "toggle", size: "sm", selected: currentMaxWidth === "max-w-6xl", onClick: () => onMaxWidthChange("max-w-6xl") }, "6xl"),
                    React.createElement(Button, { variant: "toggle", size: "sm", selected: currentMaxWidth === "max-w-7xl", onClick: () => onMaxWidthChange("max-w-7xl") }, "7xl"),
                    React.createElement(Button, { variant: "toggle", size: "sm", selected: currentMaxWidth === "max-w-8xl", onClick: () => onMaxWidthChange("max-w-8xl") }, "8xl"),
                    React.createElement(Button, { variant: "toggle", size: "sm", selected: currentMaxWidth === "max-w-9xl", onClick: () => onMaxWidthChange("max-w-9xl") }, "9xl")))),
            React.createElement("div", { className: "mb-6 flex gap-6", style: { marginBottom: "24px", gap: "24px" } },
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white", style: { fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "12px" } }, "\uB77C\uC6B4\uB4DC"),
                    React.createElement("input", { type: "range", min: 0, max: 32, value: currentRadius, onChange: (e) => onRadiusChange(Number(e.target.value)), className: "w-20" }),
                    React.createElement("span", { className: "ml-2 text-xs text-gray-600 dark:text-gray-400", style: { marginLeft: "8px", fontSize: "12px", color: "#4b5563" } },
                        currentRadius,
                        "px")),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white", style: { fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "12px" } }, "\uD3F0\uD2B8\uD06C\uAE30"),
                    React.createElement("input", { type: "range", min: 12, max: 24, value: currentFontSize, onChange: (e) => onFontSizeChange(Number(e.target.value)), className: "w-20" }),
                    React.createElement("span", { className: "ml-2 text-xs text-gray-600 dark:text-gray-400", style: { marginLeft: "8px", fontSize: "12px", color: "#4b5563" } },
                        currentFontSize,
                        "px"))),
            React.createElement("div", { className: "mb-6", style: { marginBottom: "24px" } },
                React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white", style: { fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "12px" } }, "\uAE30\uBCF8 Spacing"),
                React.createElement("input", { type: "range", min: 2, max: 32, value: currentSpacing.md, onChange: (e) => onSpacingChange({ ...currentSpacing, md: Number(e.target.value) }), className: "w-32" }),
                React.createElement("span", { className: "ml-2 text-xs text-gray-600 dark:text-gray-400", style: { marginLeft: "8px", fontSize: "12px", color: "#4b5563" } },
                    currentSpacing.md,
                    "px")),
            React.createElement("div", { className: "mt-6", style: { marginTop: "24px" } },
                React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white", style: { fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "12px" } }, "Grid Gap (\uAC2D)"),
                React.createElement("input", { type: "range", min: 0, max: 64, value: currentGap, onChange: (e) => onGapChange(Number(e.target.value)), className: "w-32" }),
                React.createElement("span", { className: "ml-2 text-xs text-gray-600 dark:text-gray-400", style: { marginLeft: "8px", fontSize: "12px", color: "#4b5563" } },
                    currentGap,
                    "px")))),
        React.createElement("style", null, `
        @keyframes animate-widgetSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.98); 
          }
          to { 
            opacity: 1; 
            transform: none; 
          }
        }
      `)));
}
