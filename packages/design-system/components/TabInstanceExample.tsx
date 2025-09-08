"use client";

import React from "react";
import {
  useTabInstance,
  useTabInstanceLocalStorage,
  useCurrentTabInfo,
} from "../hooks/useTabInstance";

/**
 * Tab Instance 기능을 보여주는 예시 컴포넌트
 * 각 탭 인스턴스가 독립적인 상태를 유지하는 것을 보여줍니다.
 */
export function TabInstanceExample() {
  // 현재 탭 정보 가져오기
  const { tabId, instanceKey, isUniqueTab, basePath, fullPath } =
    useCurrentTabInfo();

  // 탭 인스턴스별 메모리 상태 (페이지를 벗어나면 사라짐)
  const [counter, setCounter] = useTabInstance(0, "counter");
  const [inputValue, setInputValue] = useTabInstance("", "input");

  // 탭 인스턴스별 로컬 스토리지 상태 (브라우저를 닫아도 유지됨)
  const [notes, setNotes] = useTabInstanceLocalStorage("notes", "");
  const [favoriteColor, setFavoriteColor] = useTabInstanceLocalStorage(
    "favoriteColor",
    "#3b82f6"
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">탭 인스턴스 예시</h2>

        {/* 탭 정보 표시 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">현재 탭 정보</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>탭 ID:</strong>{" "}
              <code className="bg-gray-200 px-2 py-1 rounded">
                {tabId || "없음"}
              </code>
            </div>
            <div>
              <strong>인스턴스 키:</strong>{" "}
              <code className="bg-gray-200 px-2 py-1 rounded">
                {instanceKey}
              </code>
            </div>
            <div>
              <strong>고유 탭 여부:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-xs ${
                  isUniqueTab
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {isUniqueTab ? "고유 탭" : "일반 탭"}
              </span>
            </div>
            <div>
              <strong>기본 경로:</strong>{" "}
              <code className="bg-gray-200 px-2 py-1 rounded">{basePath}</code>
            </div>
            <div>
              <strong>전체 경로:</strong>{" "}
              <code className="bg-gray-200 px-2 py-1 rounded">{fullPath}</code>
            </div>
          </div>
        </div>

        {/* 메모리 상태 예시 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-3">
              메모리 상태 (페이지별 독립)
            </h3>

            {/* 카운터 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                카운터: {counter}
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCounter((prev) => prev + 1)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  +1
                </button>
                <button
                  onClick={() => setCounter((prev) => prev - 1)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  -1
                </button>
                <button
                  onClick={() => setCounter(0)}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  초기화
                </button>
              </div>
            </div>

            {/* 입력 필드 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                입력값 (탭별 독립)
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="각 탭마다 다른 값을 입력해보세요"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                현재 값: "{inputValue}"
              </p>
            </div>
          </div>

          {/* 로컬 스토리지 상태 예시 */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3">
              영구 저장 상태 (브라우저 재시작 후에도 유지)
            </h3>

            {/* 메모 */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                메모 ({notes.length}글자)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="이 탭만의 메모를 작성해보세요"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>

            {/* 색상 선택 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                선호 색상
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={favoriteColor}
                  onChange={(e) => setFavoriteColor(e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">{favoriteColor}</span>
              </div>
              <div
                className="w-full h-4 rounded mt-2"
                style={{ backgroundColor: favoriteColor }}
              />
            </div>
          </div>
        </div>

        {/* 사용 안내 */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 사용 방법</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • 사이드바에서 같은 페이지(예: 분석, 대시보드)를 여러 번 클릭하여
              중복 탭을 생성하세요
            </li>
            <li>• 각 탭에서 위의 값들을 변경하고 다른 탭으로 이동해보세요</li>
            <li>
              • 메모리 상태는 탭별로 독립적으로 유지되고, 영구 저장 상태는
              브라우저를 닫아도 유지됩니다
            </li>
            <li>• F5로 페이지를 새로고침하고 탭 간 이동해보세요</li>
          </ul>
        </div>

        {/* 개발자 정보 */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-600">
            개발자 정보
          </summary>
          <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
            <p>
              <strong>useTabInstance:</strong> 탭별 메모리 상태 관리
            </p>
            <p>
              <strong>useTabInstanceLocalStorage:</strong> 탭별 영구 저장
            </p>
            <p>
              <strong>useCurrentTabInfo:</strong> 현재 탭 메타데이터
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}

export default TabInstanceExample;
