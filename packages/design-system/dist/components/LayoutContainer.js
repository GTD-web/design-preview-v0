import React from "react";
/**
 * 페이지 레이아웃을 컨트롤하는 컴포넌트
 *
 * 레이아웃 타입:
 * - full: 화면 전체를 채움
 * - centered: 중앙 정렬 (기본값)
 */
export function LayoutContainer({ type = "centered", maxWidth = "max-w-6xl", padding = "p-6", hasSidebar = false, sidebarCollapsed = false, children, className = "", }) {
    const getLayoutClasses = () => {
        const baseClasses = `min-h-screen ${padding} bg-[var(--color-background)]`;
        const sidebarMargin = hasSidebar
            ? `transition-all duration-100 ease-out ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`
            : "";
        // 패딩 값에서 숫자 추출 (예: "p-6" -> 6, "px-4 py-8" -> 4)
        const paddingValue = padding.includes("p-")
            ? padding.match(/p-(\d+)/)?.[1] || "6"
            : "6";
        const paddingRem = `${parseInt(paddingValue) * 0.25 * 2}rem`; // 양쪽 패딩 (Tailwind: p-6 = 1.5rem * 2 = 3rem)
        switch (type) {
            case "full":
                // 전체 레이아웃: 사이드바와 패딩을 모두 고려한 너비
                const fullWidthClass = hasSidebar
                    ? sidebarCollapsed
                        ? `w-[calc(100vw-5rem-${paddingRem})]`
                        : `w-[calc(100vw-16rem-${paddingRem})]`
                    : `w-[calc(100vw-${paddingRem})]`;
                return `${baseClasses} ${sidebarMargin} ${fullWidthClass}`;
            case "centered":
                // 중앙 정렬: 사이드바를 고려한 중앙 정렬
                if (hasSidebar) {
                    const centeredWidthClass = sidebarCollapsed
                        ? `w-full max-w-6xl lg:mr-10` // 사이드바 접힌 상태: 오른쪽 여백으로 중앙 보정
                        : `w-full max-w-6xl lg:mr-32`; // 사이드바 펼쳐진 상태: 더 큰 오른쪽 여백
                    return `${baseClasses} mx-auto ${centeredWidthClass} ${sidebarMargin}`;
                }
                else {
                    return `${baseClasses} mx-auto w-full ${maxWidth}`;
                }
            default:
                return `${baseClasses} mx-auto w-full ${maxWidth} ${sidebarMargin}`;
        }
    };
    return React.createElement("div", { className: `${getLayoutClasses()} ${className}` }, children);
}
