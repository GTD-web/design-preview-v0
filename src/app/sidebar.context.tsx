"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface SidebarContextType {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  isSidebarHovered: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  setIsSidebarHovered: (hovered: boolean) => void;
  toggleSidebarCollapse: () => void;
  collapseSidebarForDetail: () => void;
  expandSidebarFromDetail: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const toggleSidebarCollapse = useCallback(() => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // 상세보기 시 사이드바 접기
  const collapseSidebarForDetail = useCallback(() => {
    setIsSidebarCollapsed(true);
  }, []);

  // 상세보기 닫기 시 사이드바 펼치기
  const expandSidebarFromDetail = useCallback(() => {
    setIsSidebarCollapsed(false);
  }, []);

  const value: SidebarContextType = {
    isSidebarOpen,
    isSidebarCollapsed,
    isSidebarHovered,
    setIsSidebarOpen,
    setIsSidebarCollapsed,
    setIsSidebarHovered,
    toggleSidebarCollapse,
    collapseSidebarForDetail,
    expandSidebarFromDetail,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
