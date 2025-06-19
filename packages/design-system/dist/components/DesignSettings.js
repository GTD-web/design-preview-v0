"use client";
import React, { useEffect, useState, useRef } from "react";
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
];
/**
 * 디자인 설정을 실시간으로 변경할 수 있는 플로팅 위젯 컴포넌트
 *
 * 기능:
 * - 테마 변경 (라이트, 다크, 드라큘라, 파스텔, CI 테마)
 * - 폰트 변경 (Noto Sans KR, Pretendard, System Sans)
 * - 라운드 값 조정 (0-32px)
 * - 폰트 크기 조정 (12-24px)
 * - 기본 스페이싱 조정 (2-32px)
 * - 그리드 갭 조정 (0-64px)
 *
 * UI 특징:
 * - 우측 하단에 고정된 플로팅 버튼
 * - 클릭 시 설정 패널이 슬라이드 애니메이션과 함께 나타남
 * - 바깥 영역 클릭 시 자동으로 닫힘
 * - 반응형 디자인 (모바일에서 최대 90vw)
 */
export function DesignSettings({ onFontChange, onThemeChange, onRadiusChange, onFontSizeChange, onSpacingChange, onGapChange, currentFont, currentTheme, currentRadius, currentFontSize, currentSpacing, currentGap, }) {
    // 위젯 열림/닫힘 상태 관리
    const [open, setOpen] = useState(false);
    // 위젯 DOM 요소 참조 (바깥 클릭 감지용)
    const widgetRef = useRef(null);
    /**
     * 바깥 영역 클릭 시 위젯을 닫는 이벤트 핸들러
     * 위젯이 열려있을 때만 이벤트 리스너를 등록/해제합니다.
     */
    useEffect(() => {
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
    }, [open]);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { className: "fixed bottom-6 right-6 z-[1200] w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center text-3xl hover:bg-primary/90 transition", "aria-label": "\uB514\uC790\uC778 \uC124\uC815 \uC5F4\uAE30", onClick: () => setOpen((v) => !v) }, "\u2699\uFE0F"),
        open && (React.createElement("div", { ref: widgetRef, className: "fixed bottom-24 right-6 z-[1201] w-[320px] max-w-[90vw] bg-surface rounded-2xl shadow-2xl border border-border p-lg animate-widgetSlideIn", style: { transition: "all 0.2s cubic-bezier(.4,2,.6,1)" }, role: "dialog", "aria-modal": "true" },
            React.createElement("div", { className: "flex justify-between items-center mb-md" },
                React.createElement("span", { className: "font-heading text-base text-primary" }, "\uB514\uC790\uC778 \uD035 \uC124\uC815"),
                React.createElement("button", { className: "text-lg text-body hover:text-danger transition", "aria-label": "\uB2EB\uAE30", onClick: () => setOpen(false) }, "\u00D7")),
            React.createElement("div", { className: "mb-md" },
                React.createElement("label", { className: "block text-sm font-medium mb-xs" }, "\uD14C\uB9C8"),
                React.createElement("div", { className: "flex gap-xs flex-wrap" }, themes.map((t) => (React.createElement("button", { key: t.key, className: `px-sm py-xs rounded border text-sm font-medium transition ${currentTheme === t.key ? "bg-primary text-white border-primary" : "bg-surface border-border hover:bg-primary/10"}`, onClick: () => onThemeChange(t.key) }, t.label))))),
            React.createElement("div", { className: "mb-md" },
                React.createElement("label", { className: "block text-sm font-medium mb-xs" }, "\uD3F0\uD2B8"),
                React.createElement("div", { className: "flex gap-xs flex-wrap" }, fonts.map((f) => (React.createElement("button", { key: f.key, className: `px-sm py-xs rounded border text-sm font-medium transition ${currentFont === f.key ? "bg-primary text-white border-primary" : "bg-surface border-border hover:bg-primary/10"}`, onClick: () => onFontChange(f.key) }, f.label))))),
            React.createElement("div", { className: "mb-md flex gap-md" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-xs" }, "\uB77C\uC6B4\uB4DC"),
                    React.createElement("input", { type: "range", min: 0, max: 32, value: currentRadius, onChange: (e) => onRadiusChange(Number(e.target.value)), className: "w-20" }),
                    React.createElement("span", { className: "ml-xs text-xs" },
                        currentRadius,
                        "px")),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium mb-xs" }, "\uD3F0\uD2B8\uD06C\uAE30"),
                    React.createElement("input", { type: "range", min: 12, max: 24, value: currentFontSize, onChange: (e) => onFontSizeChange(Number(e.target.value)), className: "w-20" }),
                    React.createElement("span", { className: "ml-xs text-xs" },
                        currentFontSize,
                        "px"))),
            React.createElement("div", null,
                React.createElement("label", { className: "block text-sm font-medium mb-xs" }, "\uAE30\uBCF8 Spacing"),
                React.createElement("input", { type: "range", min: 2, max: 32, value: currentSpacing.md, onChange: (e) => onSpacingChange({ ...currentSpacing, md: Number(e.target.value) }), className: "w-32" }),
                React.createElement("span", { className: "ml-xs text-xs" },
                    currentSpacing.md,
                    "px")),
            React.createElement("div", { className: "mt-md" },
                React.createElement("label", { className: "block text-sm font-medium mb-xs" }, "Grid Gap (\uAC2D)"),
                React.createElement("input", { type: "range", min: 0, max: 64, value: currentGap, onChange: (e) => onGapChange(Number(e.target.value)), className: "w-32" }),
                React.createElement("span", { className: "ml-xs text-xs" },
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
