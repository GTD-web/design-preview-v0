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
    { key: "shadcn-v0-light", label: "Shadcn V0 Light", className: "theme-shadcn-v0-light" },
    { key: "shadcn-v0-dark", label: "Shadcn V0 Dark", className: "theme-shadcn-v0-dark" },
    { key: "shadcn", label: "Shadcn", className: "theme-shadcn" },
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
 */
export function DesignSettings({ onFontChange, onThemeChange, onRadiusChange, onFontSizeChange, onSpacingChange, onGapChange, onLayoutTypeChange, onMaxWidthChange, currentFont, currentTheme, currentRadius, currentFontSize, currentSpacing, currentGap, currentLayoutType, currentMaxWidth, }) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const widgetRef = useRef(null);
    useEffect(() => {
        setMounted(true);
    }, []);
    useEffect(() => {
        if (!mounted)
            return;
        function handleClickOutside(event) {
            if (widgetRef.current && !widgetRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, mounted]);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { className: "fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700 transition", "aria-label": "\uB514\uC790\uC778 \uC124\uC815 \uC5F4\uAE30", onClick: () => setOpen((v) => !v) }, "\u2699\uFE0F"),
        open && (React.createElement("div", { ref: widgetRef, className: "fixed bottom-20 right-3 md:right-6 md:bottom-24 z-[9999] w-[320px] max-w-[90vw] max-h-[75vh] md:max-h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col", role: "dialog", "aria-modal": "true" },
            React.createElement("div", { className: "flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0" },
                React.createElement("span", { className: "font-semibold text-base text-gray-900 dark:text-white" }, "\uB514\uC790\uC778 \uD035 \uC124\uC815"),
                React.createElement(Button, { variant: "ghost", size: "sm", className: "text-lg p-1", "aria-label": "\uB2EB\uAE30", onClick: () => setOpen(false) }, "\u00D7")),
            React.createElement("div", { className: "flex-1 overflow-y-auto p-6 pt-4" },
                React.createElement("div", { className: "mb-6" },
                    React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white" }, "\uD14C\uB9C8"),
                    React.createElement("div", { className: "flex gap-3 flex-wrap" }, themes.map((t) => (React.createElement(Button, { key: t.key, variant: "toggle", size: "sm", selected: currentTheme === t.key, onClick: () => onThemeChange(t.key) }, t.label))))),
                React.createElement("div", { className: "mb-6" },
                    React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white" }, "\uD3F0\uD2B8"),
                    React.createElement("div", { className: "flex gap-3 flex-wrap" }, fonts.map((f) => (React.createElement(Button, { key: f.key, variant: "toggle", size: "sm", selected: currentFont === f.key, onClick: () => onFontChange(f.key) }, f.label))))),
                React.createElement("div", { className: "mb-6" },
                    React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white" }, "\uB808\uC774\uC544\uC6C3"),
                    React.createElement("div", { className: "flex gap-3 flex-wrap" },
                        React.createElement(Button, { variant: "toggle", size: "sm", selected: currentLayoutType === "full", onClick: () => onLayoutTypeChange("full") }, "\uC804\uCCB4"),
                        React.createElement(Button, { variant: "toggle", size: "sm", selected: currentLayoutType === "centered", onClick: () => onLayoutTypeChange("centered") }, "\uC911\uC559"))),
                currentLayoutType === "centered" && (React.createElement("div", { className: "mb-6" },
                    React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white" }, "\uCD5C\uB300 \uB108\uBE44"),
                    React.createElement("div", { className: "flex gap-3 flex-wrap" },
                        React.createElement(Button, { variant: "toggle", size: "sm", selected: currentMaxWidth === "max-w-4xl", onClick: () => onMaxWidthChange("max-w-4xl") }, "4xl"),
                        React.createElement(Button, { variant: "toggle", size: "sm", selected: currentMaxWidth === "max-w-5xl", onClick: () => onMaxWidthChange("max-w-5xl") }, "5xl"),
                        React.createElement(Button, { variant: "toggle", size: "sm", selected: currentMaxWidth === "max-w-6xl", onClick: () => onMaxWidthChange("max-w-6xl") }, "6xl"),
                        React.createElement(Button, { variant: "toggle", size: "sm", selected: currentMaxWidth === "max-w-7xl", onClick: () => onMaxWidthChange("max-w-7xl") }, "7xl")))),
                React.createElement("div", { className: "mb-6 flex gap-6" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white" }, "\uB77C\uC6B4\uB4DC"),
                        React.createElement("input", { type: "range", min: 0, max: 32, value: currentRadius, onChange: (e) => onRadiusChange(Number(e.target.value)), className: "w-20", "aria-label": "\uB77C\uC6B4\uB4DC \uAC12 \uC870\uC815", title: `라운드 값: ${currentRadius}px` }),
                        React.createElement("span", { className: "ml-2 text-xs text-gray-600 dark:text-gray-400" },
                            currentRadius,
                            "px")),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white" }, "\uD3F0\uD2B8\uD06C\uAE30"),
                        React.createElement("input", { type: "range", min: 12, max: 24, value: currentFontSize, onChange: (e) => onFontSizeChange(Number(e.target.value)), className: "w-20", "aria-label": "\uD3F0\uD2B8 \uD06C\uAE30 \uC870\uC815", title: `폰트 크기: ${currentFontSize}px` }),
                        React.createElement("span", { className: "ml-2 text-xs text-gray-600 dark:text-gray-400" },
                            currentFontSize,
                            "px"))),
                React.createElement("div", { className: "mb-6" },
                    React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white" }, "\uAE30\uBCF8 Spacing"),
                    React.createElement("input", { type: "range", min: 2, max: 32, value: currentSpacing.md, onChange: (e) => onSpacingChange({ ...currentSpacing, md: Number(e.target.value) }), className: "w-32", "aria-label": "\uAE30\uBCF8 \uC2A4\uD398\uC774\uC2F1 \uC870\uC815", title: `기본 스페이싱: ${currentSpacing.md}px` }),
                    React.createElement("span", { className: "ml-2 text-xs text-gray-600 dark:text-gray-400" },
                        currentSpacing.md,
                        "px")),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-3 text-gray-900 dark:text-white" }, "Grid Gap (\uAC2D)"),
                    React.createElement("input", { type: "range", min: 0, max: 64, value: currentGap, onChange: (e) => onGapChange(Number(e.target.value)), className: "w-32", "aria-label": "\uADF8\uB9AC\uB4DC \uAC2D \uC870\uC815", title: `그리드 갭: ${currentGap}px` }),
                    React.createElement("span", { className: "ml-2 text-xs text-gray-600 dark:text-gray-400" },
                        currentGap,
                        "px")))))));
}
