import React from "react";
import type { PageInfo } from "../hooks/useTabBar";
/**
 * PageSelector Props
 */
export interface PageSelectorProps {
    /** 사용 가능한 모든 페이지 목록 */
    availablePages: PageInfo[];
    /** 이미 열린 탭들의 경로 목록 */
    openTabPaths: string[];
    /** 페이지 선택 시 호출되는 콜백 */
    onPageSelect: (pageInfo: PageInfo) => void;
    /** 선택창 열림/닫힘 상태 */
    isOpen: boolean;
    /** 선택창 닫기 콜백 */
    onClose: () => void;
    /** 트리거 요소 (+ 버튼) */
    children: React.ReactNode;
}
/**
 * 페이지 선택 컴포넌트 - + 버튼 클릭 시 사용 가능한 페이지 목록을 보여줌
 */
export declare function PageSelector({ availablePages, openTabPaths, onPageSelect, isOpen, onClose, children, }: PageSelectorProps): React.JSX.Element;
