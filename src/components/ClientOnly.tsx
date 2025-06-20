"use client";

import React, { useState, useEffect } from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 이 컴포넌트는 오직 클라이언트 측에서만 자식 컴포넌트를 렌더링합니다.
 * 서버사이드 렌더링(SSR)과 클라이언트 렌더링 간의 불일치로 인한
 * 하이드레이션 오류(hydration mismatch)를 방지하는 데 사용됩니다.
 *
 * @param {React.ReactNode} children - 클라이언트에서만 렌더링될 컴포넌트.
 * @param {React.ReactNode} [fallback=null] - 마운트되기 전에 보여줄 컴포넌트.
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return <>{children}</>;
}
