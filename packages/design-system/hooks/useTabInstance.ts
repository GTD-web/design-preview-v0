/**
 * Tab Instance Hook
 *
 * 동일한 페이지의 여러 탭 인스턴스가 독립적인 상태를 유지할 수 있게 해주는 Hook
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { extractTabIdFromPath, generateTabInstanceKey } from "./tabIdUtils";

interface TabInstanceState {
  [key: string]: any;
}

// 전역 상태 저장소 (각 탭 인스턴스별로 독립적인 상태 유지)
const tabInstanceStates: Map<string, TabInstanceState> = new Map();

/**
 * 탭 인스턴스별 독립적인 상태를 관리하는 Hook
 *
 * @param initialState 초기 상태값
 * @param stateKey 상태를 구분하는 키 (선택적, 기본값: 'default')
 * @returns [state, setState, tabId, instanceKey]
 */
export function useTabInstance<T = any>(
  initialState: T,
  stateKey: string = "default"
): [T, (newState: T | ((prevState: T) => T)) => void, string | null, string] {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 현재 경로에서 tab-id 추출
  const currentPath = `${pathname}${
    searchParams ? `?${searchParams.toString()}` : ""
  }`;
  const tabId = extractTabIdFromPath(currentPath);

  // 탭 인스턴스 키 생성
  const instanceKey = generateTabInstanceKey(pathname, tabId);
  const fullStateKey = `${instanceKey}_${stateKey}`;

  // 현재 인스턴스의 상태 가져오기 또는 초기화
  const getCurrentState = useCallback((): T => {
    const storedStates = tabInstanceStates.get(fullStateKey);
    return storedStates !== undefined ? (storedStates as T) : initialState;
  }, [fullStateKey, initialState]);

  const [state, setState] = useState<T>(getCurrentState);

  // 상태 업데이트 함수
  const updateState = useCallback(
    (newState: T | ((prevState: T) => T)) => {
      setState((prevState) => {
        const nextState =
          typeof newState === "function"
            ? (newState as (prevState: T) => T)(prevState)
            : newState;

        // 전역 저장소에도 업데이트
        tabInstanceStates.set(fullStateKey, nextState);
        return nextState;
      });
    },
    [fullStateKey]
  );

  // tab-id가 변경될 때 상태 동기화
  useEffect(() => {
    const newState = getCurrentState();
    setState(newState);
  }, [getCurrentState]);

  // 컴포넌트 언마운트 시 정리 (옵션)
  useEffect(() => {
    return () => {
      // 필요에 따라 상태 정리 로직 추가 가능
      // tabInstanceStates.delete(fullStateKey);
    };
  }, [fullStateKey]);

  return [state, updateState, tabId, instanceKey];
}

/**
 * 탭 인스턴스별 로컬 스토리지를 관리하는 Hook
 *
 * @param key 로컬 스토리지 키
 * @param initialValue 초기값
 * @returns [value, setValue, tabId, instanceKey]
 */
export function useTabInstanceLocalStorage<T = any>(
  key: string,
  initialValue: T
): [T, (value: T) => void, string | null, string] {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPath = `${pathname}${
    searchParams ? `?${searchParams.toString()}` : ""
  }`;
  const tabId = extractTabIdFromPath(currentPath);
  const instanceKey = generateTabInstanceKey(pathname, tabId);
  const storageKey = `${key}_${instanceKey}`;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(storageKey);
        return item ? JSON.parse(item) : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.warn(
        `Error loading from localStorage for key ${storageKey}:`,
        error
      );
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(storageKey, JSON.stringify(value));
        }
      } catch (error) {
        console.warn(
          `Error saving to localStorage for key ${storageKey}:`,
          error
        );
      }
    },
    [storageKey]
  );

  // tab-id가 변경될 때 로컬 스토리지에서 값 다시 로드
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(storageKey);
        const loadedValue = item ? JSON.parse(item) : initialValue;
        setStoredValue(loadedValue);
      }
    } catch (error) {
      console.warn(
        `Error loading from localStorage for key ${storageKey}:`,
        error
      );
      setStoredValue(initialValue);
    }
  }, [storageKey, initialValue]);

  return [storedValue, setValue, tabId, instanceKey];
}

/**
 * 현재 탭의 정보를 가져오는 Hook
 *
 * @returns { tabId, instanceKey, isUniqueTab, basePath }
 */
export function useCurrentTabInfo() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPath = `${pathname}${
    searchParams ? `?${searchParams.toString()}` : ""
  }`;
  const tabId = extractTabIdFromPath(currentPath);
  const instanceKey = generateTabInstanceKey(pathname, tabId);
  const isUniqueTab = tabId !== null;

  return {
    tabId,
    instanceKey,
    isUniqueTab,
    basePath: pathname,
    fullPath: currentPath,
  };
}
