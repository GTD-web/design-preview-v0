import React from "react";
/**
 * 페이지 레이아웃을 컨트롤하는 컴포넌트
 *
 * 레이아웃 타입:
 * - full: 화면 전체를 채움
 * - centered: 중앙 정렬 (기본값)
 */
export function LayoutContainer({ type = "centered", maxWidth = "max-w-6xl", padding = "p-6", hasSidebar = false, children, className = "", }) {
    const getLayoutClasses = () => {
        switch (type) {
            case "full":
                return `w-full min-h-screen ${padding} bg-[var(--color-background)]`;
            case "centered":
                return `w-full min-h-screen ${padding} mx-auto ${maxWidth} bg-[var(--color-background)]`;
            default:
                return `w-full min-h-screen ${padding} mx-auto ${maxWidth} bg-[var(--color-background)]`;
        }
    };
    return React.createElement("div", { className: `${getLayoutClasses()} ${className}` }, children);
}
